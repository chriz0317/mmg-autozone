<?php

namespace App\Http\Controllers;

use App\Models\Estimate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class EstimateController extends Controller
{
    // -----------------------------------------------------
    // CUSTOMER ROUTES
    // -----------------------------------------------------

    /**
     * Show the form to request an estimate
     */
    public function create()
    {
        return Inertia::render('Customer/EstimateForm');
    }

    /**
     * Store a new estimate request
     */
    public function store(Request $request)
    {
        $request->validate([
            'vehicle_model' => 'required|string|max:255',
            'plate_no' => 'required|string|max:255',
            'issue_description' => 'required|string',
            'photos' => 'nullable|array',
            'photos.*' => 'image|mimes:jpeg,png,jpg,gif|max:5120', // 5MB max per image
        ]);

        $photoPaths = [];

        if ($request->hasFile('photos')) {
            foreach ($request->file('photos') as $photo) {
                $path = $photo->store('estimates', 'cloudinary');
                $photoPaths[] = \Illuminate\Support\Facades\Storage::disk('cloudinary')->url($path);
            }
        }

        $estimate = Estimate::create([
            'user_id' => Auth::id(),
            'vehicle_model' => $request->vehicle_model,
            'plate_no' => $request->plate_no,
            'issue_description' => $request->issue_description,
            'photos' => $photoPaths,
            'status' => 'Pending',
        ]);

        return redirect()->route('customer.home')->with('success', 'Estimate request submitted successfully.');
    }

    /**
     * View a specific estimate details (Customer)
     */
    public function show(Estimate $estimate)
    {
        // Ensure customer owns it
        if ($estimate->user_id !== Auth::id()) {
            abort(403);
        }

        return Inertia::render('Customer/EstimateDetails', [
            'estimate' => $estimate
        ]);
    }

    // -----------------------------------------------------
    // ADMIN / STAFF ROUTES
    // -----------------------------------------------------

    /**
     * List all estimates for Admin
     */
    public function index()
    {
        $estimates = Estimate::with('user')->orderBy('created_at', 'desc')->get();
        return Inertia::render('Admin/EstimatesList', [
            'estimates' => $estimates
        ]);
    }

    /**
     * Update estimate status/cost (Admin)
     */
    public function update(Request $request, Estimate $estimate)
    {
        $request->validate([
            'status' => 'required|in:Pending,Reviewed,Approved,Rejected',
            'estimated_cost' => 'nullable|numeric|min:0',
            'admin_remarks' => 'nullable|string',
        ]);

        $estimate->update([
            'status' => $request->status,
            'estimated_cost' => $request->estimated_cost,
            'admin_remarks' => $request->admin_remarks,
        ]);

        return redirect()->back()->with('success', 'Estimate updated successfully.');
    }

    /**
     * API to fetch estimates for Intake Form (Staff)
     */
    public function apiIndex()
    {
        // Return Approved and Pending estimates
        $estimates = Estimate::with('user')
            ->whereIn('status', ['Approved', 'Pending'])
            ->orderBy('created_at', 'desc')
            ->get();
            
        return response()->json($estimates);
    }
}
