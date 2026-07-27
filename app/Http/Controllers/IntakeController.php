<?php

namespace App\Http\Controllers;

use App\Models\Intake;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class IntakeController extends Controller
{
    public function store(Request $request)
    {
        // 1. Generate the unique Reference Number
        $referenceNumber = 'MMG-' . date('Ymd') . '-' . strtoupper(Str::random(4));

        // Generate Automated Mechanic Recommendations
        $recommendations = [];
        $complaints = strtolower($request->complaints ?? '');
        $carYear = intval($request->car_year ?? date('Y'));

        // Basic Rules Engine
        if ($carYear > 0 && (intval(date('Y')) - $carYear) > 5) {
            $recommendations[] = 'Check suspension components (bushings, shocks) due to vehicle age.';
            $recommendations[] = 'Check drive belts and hoses for wear/cracks.';
        }
        
        if (str_contains($complaints, 'bearing') || str_contains($complaints, 'noise') || str_contains($complaints, 'maingay')) {
            $recommendations[] = 'Check wheel bearings and hubs for abnormal noise/play.';
        }
        if (str_contains($complaints, 'overheat') || str_contains($complaints, 'temp')) {
            $recommendations[] = 'Check radiator, coolant level, and cooling fans.';
        }
        if (str_contains($complaints, 'brake') || str_contains($complaints, 'squeak') || str_contains($complaints, 'preno')) {
            $recommendations[] = 'Check brake pads thickness and brake rotors for scoring.';
        }
        if (str_contains($complaints, 'aircon') || str_contains($complaints, 'ac') || str_contains($complaints, 'mainit')) {
            $recommendations[] = 'Check AC compressor, freon levels, and cabin filter.';
        }
        
        if (empty($recommendations)) {
            $recommendations[] = 'Perform standard 21-point vehicle inspection.';
        }

        // 2. Catch all the new frontend fields and save them to the database
        $intake = Intake::create([
            'reference_number' => $referenceNumber,
            'estimate_id'      => $request->estimate_id,
            'customer'         => $request->customer,
            'email'            => $request->email,
            'address'          => $request->address,
            'contact_no'       => $request->contact_no,
            'received_by'      => $request->received_by,
            'due_date'         => $request->due_date,
            'vehicle'          => $request->vehicle,
            'car_year'         => $request->car_year,
            'plate_no'         => $request->plate_no,
            'color'            => $request->color,
            'mileage'          => $request->mileage,
            'fuel_level'       => $request->fuel_level,
            'scope_of_works'   => $request->scope_of_works,
            'complaints'       => $request->complaints,
            'mechanic_recommendations' => $recommendations,
            'checklist'        => $request->checklist,
            'accessories'      => $request->accessories,
            'loose_items'      => $request->loose_items,
            'damage_markers'   => $request->damage_markers,
            'customer_signature'=> $request->customer_signature,
            'vehicle_type'     => $request->vehicle_type,
            'source'           => $request->source ?? 'Walk-In',
            'status'           => 'Pending',
        ]);

        // Email notification logic has been moved to web.php to trigger on QR code scan
        
        // 3. Send the user straight to the receipt/PDF generation page
        return redirect('/success/' . $intake->reference_number);
    }

    public function repairOrderPdf(Intake $intake)
    {
        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('pdf.repair_order', [
            'intake' => $intake
        ]);

        return $pdf->stream('Repair_Order_' . $intake->reference_number . '.pdf');
    }
}