<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ChecklistController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\IntakeController;
use App\Http\Controllers\ProfileController;
use App\Models\Intake;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use SimpleSoftwareIO\QrCode\Facades\QrCode;
use Inertia\Inertia;

// ==========================================
// INTAKE SUCCESS & RECEIPT ROUTES (PUBLIC)
// ==========================================

// 1. Staff Success Screen (Displays the massive QR Code for the customer to scan)
Route::get('/success/{reference_number}', function ($reference_number) {
    $intake = Intake::where('reference_number', $reference_number)->firstOrFail();

    // Generate the FULL URL so the customer's phone knows to open a browser
    $receiptUrl = url('/receipt/' . $reference_number);

    // Generate a large QR code containing the receipt URL
    $qrCodeSvg = (string) QrCode::size(250)->margin(1)->generate($receiptUrl);

    return Inertia::render('Success', [
        'intake'     => $intake,
        'qrCode'     => $qrCodeSvg,
        'receiptUrl' => $receiptUrl,
    ]);
});

// 2. Customer Digital Receipt Screen (The actual Job Order they see on their phone)
Route::get('/receipt/{reference_number}', function ($reference_number) {
    $intake = Intake::where('reference_number', $reference_number)->firstOrFail();

    return Inertia::render('Receipt', [
        'intake' => $intake,
    ]);
});

// 3. PDF Download Route
Route::get('/receipt/{reference_number}/pdf', function ($reference_number) {
    $intake = Intake::where('reference_number', $reference_number)->firstOrFail();

    $pdf = PDF::loadView('pdf.checklist', compact('intake'))
              ->setPaper('legal', 'portrait');

    return $pdf->download('MMG-Checklist-' . $intake->reference_number . '.pdf');
});


// ==========================================
// TEMPORARY ADMIN ROUTE FOR MIGRATION
// ==========================================
Route::get('/run-migration', function () {
    \Illuminate\Support\Facades\Artisan::call('migrate', ['--force' => true]);
    return 'Migration run successfully!';
});

Route::get('/run-seeder', function () {
    \Illuminate\Support\Facades\Artisan::call('db:seed', ['--force' => true]);
    return 'Database seeded successfully! You can now log in.';
});

Route::get('/recover-file', function () {
    $handle = fopen(public_path('recovered_dump.txt'), "r");
    $output = "";
    $recording = false;
    while (($line = fgets($handle)) !== false) {
        if (strpos($line, 'Showing lines 1 to 458') !== false) {
            $recording = true;
            fgets($handle);
            continue;
        }
        if ($recording) {
            if (strpos($line, 'The above content does NOT show') !== false || trim($line) === '=== TOOL CALL ===') {
                break;
            }
            $output .= preg_replace('/^\d+:\s/', '', $line);
        }
    }
    fclose($handle);
    try {
        file_put_contents(resource_path('js/Pages/IntakeForm.jsx'), $output);
    } catch (\Exception $e) {}
    
    return "<pre>" . htmlspecialchars($output) . "</pre>";
});
    
// ==========================================
// PORTAL SELECTION (root)
// ==========================================

// Root '/' → redirect to customer home
Route::get('/', function () {
    return redirect('/home');
});


// ==========================================
// CUSTOMER AUTH ROUTES (guard: web)
// ==========================================

Route::get('/customer/login', function () {
    if (Auth::guard('web')->check()) return redirect('/home');
    return Inertia::render('Auth/CustomerLogin');
})->name('customer.login');

Route::get('/customer/register', function () {
    if (Auth::guard('web')->check()) return redirect('/home');
    return Inertia::render('Auth/CustomerRegister');
})->name('customer.register');

Route::post('/customer/login',    [AuthController::class, 'customerLogin']);
Route::post('/customer/register', [AuthController::class, 'customerRegister']);


// ==========================================
// STAFF AUTH ROUTES (guard: staff)
// ==========================================

Route::get('/staff/login', function () {
    if (Auth::guard('staff')->check() && Auth::guard('staff')->user()->role === 'staff') {
        return redirect('/intake');
    }
    return Inertia::render('Auth/StaffLogin');
})->name('staff.login');

Route::post('/staff-login', [AuthController::class, 'staffLogin']);


// ==========================================
// ADMIN AUTH ROUTES (guard: admin)
// ==========================================

Route::get('/admin/login', function () {
    if (Auth::guard('admin')->check() && Auth::guard('admin')->user()->role === 'admin') {
        return redirect('/admin');
    }
    return Inertia::render('Auth/AdminLogin');
})->name('admin.login');

Route::post('/admin-login', [AuthController::class, 'adminLogin']);


// ==========================================
// SHARED LOGOUT
// ==========================================

Route::post('/logout', [AuthController::class, 'logout'])->name('logout');


// ==========================================
// API ROUTES
// ==========================================

Route::post('/api/save-intake', [IntakeController::class, 'store']);
Route::post('/api/intake', [ChecklistController::class, 'store']);
Route::get('/api/service-requests', [\App\Http\Controllers\ServiceRequestController::class, 'apiIndex']);


// ==========================================
// CUSTOMER PROTECTED ROUTES (guard: web, role: customer)
// ==========================================

Route::middleware(['role:web,customer'])->group(function () {
    Route::get('/home', [CustomerController::class, 'home'])->name('customer.home');
    Route::get('/customer/dashboard', [CustomerController::class, 'dashboard'])->name('customer.dashboard');
    
    // Service Requests
    Route::post('/service-requests', [\App\Http\Controllers\ServiceRequestController::class, 'store'])->name('service_requests.store');
    Route::get('/service-requests/{id}', [\App\Http\Controllers\ServiceRequestController::class, 'show'])->name('service_requests.show');
});


// ==========================================
// STAFF PROTECTED ROUTES (guard: staff, role: staff)
// ==========================================

Route::middleware(['role:staff,staff'])->group(function () {
    Route::get('/intake', function (Request $request) {
        return Inertia::render('IntakeForm', [
            'auth' => ['user' => Auth::guard('staff')->user()],
        ]);
    })->name('intake.form');

    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');

    // Profile Management
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // POS
    Route::get('/pos', [\App\Http\Controllers\POSController::class, 'index'])->name('staff.pos');
    Route::post('/pos/checkout', [\App\Http\Controllers\POSController::class, 'checkout'])->name('staff.pos.checkout');
    Route::get('/pos/success/{transaction}', [\App\Http\Controllers\TransactionController::class, 'success'])->name('staff.pos.success');
});


// ==========================================
// ADMIN PROTECTED ROUTES (guard: admin, role: admin)
// ==========================================

Route::middleware(['role:admin,admin'])->group(function () {
    Route::get('/admin', [AdminController::class, 'index'])->name('admin.dashboard');
    Route::get('/admin/analytics', [AdminController::class, 'analytics'])->name('admin.analytics');
    
    // Admin Service Requests
    Route::get('/admin/services', [\App\Http\Controllers\ServiceRequestController::class, 'index'])->name('admin.services.index');
    Route::patch('/admin/services/{id}', [\App\Http\Controllers\ServiceRequestController::class, 'update'])->name('admin.services.update');

    Route::post('/admin/intakes/{intake}/assign', [\App\Http\Controllers\AdminController::class, 'assignMechanic'])->name('admin.intakes.assign');
    Route::post('/admin/intakes/{intake}/ready', [\App\Http\Controllers\AdminController::class, 'markReady'])->name('admin.intakes.ready');
    Route::post('/admin/intakes/{intake}/progress-photos', [\App\Http\Controllers\AdminController::class, 'uploadProgressPhotos'])->name('admin.intakes.progress-photos');

    // Admin POS
    Route::get('/admin/pos', [\App\Http\Controllers\POSController::class, 'index'])->name('admin.pos');
    Route::post('/admin/pos/checkout', [\App\Http\Controllers\POSController::class, 'checkout'])->name('admin.pos.checkout');
    Route::get('/admin/pos/success/{transaction}', [\App\Http\Controllers\TransactionController::class, 'success'])->name('admin.pos.success');

    // Inventory Management
    Route::get('/admin/inventory', [\App\Http\Controllers\InventoryController::class, 'index'])->name('admin.inventory');
    Route::post('/admin/inventory', [\App\Http\Controllers\InventoryController::class, 'store']);
    Route::put('/admin/inventory/{inventoryItem}', [\App\Http\Controllers\InventoryController::class, 'update']);
    Route::delete('/admin/inventory/{inventoryItem}', [\App\Http\Controllers\InventoryController::class, 'destroy']);
});


require __DIR__.'/auth.php';

// Public Digital OR Route
Route::get('/or/{transaction}', [\App\Http\Controllers\TransactionController::class, 'digitalOr'])->name('transaction.or');