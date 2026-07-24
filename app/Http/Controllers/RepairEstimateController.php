<?php

namespace App\Http\Controllers;

use App\Models\RepairEstimate;
use App\Models\RepairEstimateItem;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Str;

class RepairEstimateController extends Controller
{
    public function index()
    {
        $estimates = RepairEstimate::with('items')->orderBy('created_at', 'desc')->get();
        return Inertia::render('Admin/RepairEstimates/Index', [
            'estimates' => $estimates
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/RepairEstimates/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'customer_name' => 'required|string|max:255',
            'items' => 'required|array',
            // Allow other fields as nullable based on schema
        ]);

        // Generate unique Estimate No
        $estimateNo = date('ymd') . strtoupper(Str::random(3));

        $estimate = RepairEstimate::create([
            'estimate_no' => $estimateNo,
            'customer_name' => $request->customer_name,
            'address' => $request->address,
            'contact_no' => $request->contact_no,
            'insurance' => $request->insurance,
            'reference_no' => $request->reference_no,
            'days_of_repair' => $request->days_of_repair,
            'prepared_by' => $request->prepared_by,
            'vehicle_model' => $request->vehicle_model,
            'plate_no' => $request->plate_no,
            'color' => $request->color,
            'frame_no' => $request->frame_no,
            'date' => $request->date ?: now(),
            
            'subtotal_parts' => $request->subtotal_parts ?? 0,
            'subtotal_labor' => $request->subtotal_labor ?? 0,
            
            'vat_percentage' => $request->vat_percentage ?? 0,
            'vat_amount' => $request->vat_amount ?? 0,
            
            'deductible' => $request->deductible ?? 0,
            'depreciation' => $request->depreciation ?? 0,
            
            'discount_amount' => $request->discount_amount ?? 0,
            'discount_notes' => $request->discount_notes,
            
            'net_due' => $request->net_due ?? 0,
            'status' => 'Pending Approval',
        ]);

        // Save line items
        if ($request->has('items') && is_array($request->items)) {
            foreach ($request->items as $item) {
                RepairEstimateItem::create([
                    'repair_estimate_id' => $estimate->id,
                    'category' => $item['category'] ?? 'Parts',
                    'description' => $item['description'] ?? '',
                    'sub_text' => $item['sub_text'] ?? null,
                    'parts_cost' => $item['parts_cost'] ?? 0,
                    'labor_cost' => $item['labor_cost'] ?? 0,
                ]);
            }
        }

        return redirect()->route('admin.estimates.index')->with('success', 'Repair Estimate created successfully!');
    }

    public function generatePdf($id)
    {
        $estimate = RepairEstimate::with('items')->findOrFail($id);

        $pdf = Pdf::loadView('pdf.repair_estimate', [
            'estimate' => $estimate
        ])->setPaper('legal', 'portrait');

        return $pdf->stream('Repair_Estimate_' . $estimate->estimate_no . '.pdf');
    }
}
