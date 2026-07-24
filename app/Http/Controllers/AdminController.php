<?php

namespace App\Http\Controllers;

use App\Models\Intake;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AdminController extends Controller
{
    public function index(Request $request)
    {
        $intakes = Intake::with(['mechanic', 'confirmedBy'])->orderBy('created_at', 'desc')->get();
        $transactions = \App\Models\Transaction::with('items')->orderBy('created_at', 'desc')->get();
        $logs = \App\Models\ActivityLog::with('user')->orderBy('created_at', 'desc')->take(50)->get();

        $stats = [
            'total'     => $intakes->count(),
            'pending'   => $intakes->where('status', '!=', 'Completed')->count(),
            'completed' => $intakes->where('status', 'Completed')->count(),
            'revenue'   => $transactions->sum('total_amount'),
        ];

        return Inertia::render('AdminDashboard', [
            'auth'         => ['user' => Auth::guard('admin')->user() ?? Auth::user()],
            'mechanics'    => \App\Models\User::whereIn('role', ['staff', 'admin'])->get(),
            'intakes'      => $intakes,
            'transactions' => $transactions,
            'logs'         => $logs,
            'stats'        => $stats,
        ]);
    }

    public function assignMechanic(Request $request, Intake $intake)
    {
        $request->validate([
            'mechanic_id' => 'required|exists:users,id',
        ]);

        $intake->update([
            'mechanic_id' => $request->mechanic_id,
            'confirmed_by_id' => Auth::id() ?? Auth::guard('admin')->id(),
            'status' => 'In Progress',
        ]);

        \App\Models\ActivityLog::create([
            'user_id' => Auth::id() ?? Auth::guard('admin')->id(),
            'action' => 'Job Assigned',
            'description' => "Assigned Intake {$intake->reference_number} to mechanic ID {$request->mechanic_id}",
        ]);

        return redirect()->back()->with('success', 'Mechanic assigned successfully.');
    }

    public function markReady(Request $request, Intake $intake)
    {
        $intake->update([
            'status' => 'Ready for Pickup',
        ]);

        \App\Models\ActivityLog::create([
            'user_id' => Auth::id() ?? Auth::guard('admin')->id(),
            'action' => 'Job Completed',
            'description' => "Marked Intake {$intake->reference_number} as Ready for Pickup",
        ]);

        // Dispatch Email Notification
        if ($intake->email) {
            $notifiable = (object) ['name' => $intake->customer ?? 'Customer', 'email' => $intake->email];
            \Illuminate\Support\Facades\Notification::route('mail', $intake->email)
                ->notify(new \App\Notifications\JobCompleted($intake));
        }

        return redirect()->back()->with('success', 'Vehicle marked as ready for pickup and customer notified.');
    }

    public function analytics()
    {
        // 1. KPIs
        $totalRevenue = \App\Models\Transaction::sum('total_amount');
        $totalTransactions = \App\Models\Transaction::count();
        $avgTicket = $totalTransactions > 0 ? $totalRevenue / $totalTransactions : 0;
        
        $totalJobs = Intake::count();
        $completedJobs = Intake::where('status', 'Completed')->count();

        // 2. Daily Revenue (Last 30 Days)
        $thirtyDaysAgo = now()->subDays(30)->startOfDay();
        $dailyRevenue = \App\Models\Transaction::where('created_at', '>=', $thirtyDaysAgo)
            ->selectRaw('DATE(created_at) as date, SUM(total_amount) as revenue')
            ->groupBy('date')
            ->orderBy('date', 'asc')
            ->get();

        // 3. Payment Method Distribution
        $paymentMethods = \App\Models\Transaction::selectRaw('payment_method, SUM(total_amount) as value')
            ->groupBy('payment_method')
            ->get();

        // 4. Top Selling Items/Services
        $topItems = \App\Models\TransactionItem::selectRaw('item_name as name, SUM(quantity) as count')
            ->groupBy('item_name')
            ->orderBy('count', 'desc')
            ->take(10)
            ->get();

        return Inertia::render('AdminAnalytics', [
            'kpis' => [
                'totalRevenue' => $totalRevenue,
                'avgTicket' => $avgTicket,
                'totalJobs' => $totalJobs,
                'completedJobs' => $completedJobs,
            ],
            'dailyRevenue' => $dailyRevenue,
            'paymentMethods' => $paymentMethods,
            'topItems' => $topItems,
        ]);
    }

    public function uploadProgressPhotos(Request $request, Intake $intake)
    {
        $request->validate([
            'photos'   => 'required|array',
            'photos.*' => 'image|mimes:jpeg,png,jpg,gif|max:5120',
        ]);

        $existing = $intake->progress_photos ?? [];

        foreach ($request->file('photos') as $photo) {
            $uploadedFileUrl = $photo->storeOnCloudinary('progress_photos')->getSecurePath();
            $existing[] = $uploadedFileUrl;
        }

        $intake->update(['progress_photos' => $existing]);

        \App\Models\ActivityLog::create([
            'user_id'     => Auth::id() ?? Auth::guard('admin')->id(),
            'action'      => 'Progress Photos Uploaded',
            'description' => "Uploaded " . count($request->file('photos')) . " progress photo(s) for Intake {$intake->reference_number}",
        ]);

        return redirect()->back()->with('success', 'Progress photos uploaded successfully.');
    }

    public function releaseVehicle(Intake $intake)
    {
        $intake->update(['status' => 'Released']);

        \App\Models\ActivityLog::create([
            'user_id'     => Auth::id() ?? Auth::guard('admin')->id(),
            'action'      => 'Vehicle Released',
            'description' => "Released vehicle for Intake {$intake->reference_number} — {$intake->customer} ({$intake->vehicle})",
        ]);

        return redirect()->back()->with('success', "Vehicle {$intake->reference_number} has been released.");
    }
}