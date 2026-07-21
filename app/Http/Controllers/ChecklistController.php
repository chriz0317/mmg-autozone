<?php

namespace App\Http\Controllers;

use App\Models\Checklist;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ChecklistController extends Controller
{
    public function store(Request $request)
    {
        // 1. Generate a unique Reference Number (e.g., MMG-20260630-A1B2)
        $datePrefix = now()->format('Ymd');
        $randomString = strtoupper(Str::random(4));
        $referenceNumber = "MMG-{$datePrefix}-{$randomString}";

        // 2. Calculate the Cost Estimate
        $estimatedCost = $this->calculateEstimate(
            $request->input('vehicle_type', 'sedan'), 
            $request->input('damage_markers', [])
        );

        // 3. Save to PostgreSQL Database
        $checklist = Checklist::create(array_merge(
            $request->all(),
            [
                'reference_number' => $referenceNumber,
                'estimated_cost' => $estimatedCost,
                'date_received' => now(),
            ]
        ));

        // 4. Return success response back to React
        return response()->json([
            'message' => 'Vehicle intake saved successfully!',
            'reference_number' => $checklist->reference_number,
            'estimated_cost' => $estimatedCost,
            'checklist_id' => $checklist->id
        ], 201);
    }

    /**
     * Internal function to calculate repair/repaint estimate
     */
    private function calculateEstimate(string $vehicleType, array $damageMarkers): int
    {
        $estimate = 0;

        // Base prep/paint costs by vehicle size (in PHP)
        $baseCosts = [
            'sedan' => 15000,
            'pickup' => 20000,
            'van' => 25000,
            'suv' => 22000,
            'truck' => 35000,
        ];

        // Apply base cost, default to sedan if not found
        $estimate += $baseCosts[$vehicleType] ?? 15000;

        // Calculate costs per damage marker from the 2D map
        $markerCosts = [
            'S' => 1500,  // Scratch repair
            'D' => 3000,  // Dent repair (Body filler/pulling)
            'C' => 4500,  // Crack repair (Fiberglass/welding)
        ];

        if (is_array($damageMarkers)) {
            foreach ($damageMarkers as $marker) {
                $type = $marker['type'] ?? '';
                $estimate += $markerCosts[$type] ?? 0;
            }
        }

        return $estimate;
    }
}