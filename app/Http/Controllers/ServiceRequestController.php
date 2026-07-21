<?php

namespace App\Http\Controllers;

use App\Models\ServiceRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ServiceRequestController extends Controller
{
    // -----------------------------------------------------
    // CUSTOMER ROUTES
    // -----------------------------------------------------

    /**
     * Store a new service request
     */
    public function store(Request $request)
    {
        $request->validate([
            'service_type' => 'required|in:photo_estimate,repair,repaint',
            'name' => 'nullable|string|max:255',
            'contact_no' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'vehicle_model' => 'required|string|max:255',
            'plate_no' => 'nullable|string|max:255',
            'issue_description' => 'nullable|string',
            'photos' => 'nullable|array',
            'photos.*' => 'image|mimes:jpeg,png,jpg,gif|max:5120',
            'areas' => 'nullable|array',
            'color_preference' => 'nullable|string|max:255',
            'additional_notes' => 'nullable|string',
            'preferred_date' => 'nullable|date',
        ]);

        $photoPaths = [];

        if ($request->hasFile('photos')) {
            foreach ($request->file('photos') as $photo) {
                $path = $photo->store('service_requests', 'public');
                $photoPaths[] = '/storage/' . $path;
            }
        }

        $serviceRequest = ServiceRequest::create([
            'user_id' => Auth::id(), // Will be null for guests if allowed
            'service_type' => $request->service_type,
            'name' => $request->name,
            'contact_no' => $request->contact_no,
            'email' => $request->email,
            'vehicle_model' => $request->vehicle_model,
            'plate_no' => $request->plate_no,
            'issue_description' => $request->issue_description ?? 'Auto Repaint / Customization',
            'photos' => empty($photoPaths) ? null : $photoPaths,
            'areas' => $request->areas,
            'color_preference' => $request->color_preference,
            'additional_notes' => $request->additional_notes,
            'preferred_date' => $request->preferred_date,
            'status' => 'Pending',
        ]);

        return redirect()->back()->with('success', 'Request submitted successfully.');
    }

    /**
     * View a specific service request details (Customer)
     */
    public function show($id)
    {
        $serviceRequest = ServiceRequest::findOrFail($id);
        
        // Ensure customer owns it
        if ($serviceRequest->user_id !== Auth::id()) {
            abort(403);
        }

        return Inertia::render('Customer/ServiceRequestDetails', [
            'serviceRequest' => $serviceRequest
        ]);
    }

    // -----------------------------------------------------
    // ADMIN / STAFF ROUTES
    // -----------------------------------------------------

    /**
     * List all service requests for Admin
     */
    public function index()
    {
        $requests = ServiceRequest::with('user')->orderBy('created_at', 'desc')->get();
        return Inertia::render('Admin/ServicesList', [
            'serviceRequests' => $requests
        ]);
    }

    /**
     * Update status/cost (Admin)
     */
    public function update(Request $request, $id)
    {
        $serviceRequest = ServiceRequest::findOrFail($id);

        $request->validate([
            'status' => 'required|in:Pending,Reviewed,Approved,Rejected',
            'estimated_cost' => 'nullable|numeric|min:0',
            'admin_remarks' => 'nullable|string',
        ]);

        $serviceRequest->update([
            'status' => $request->status,
            'estimated_cost' => $request->estimated_cost,
            'admin_remarks' => $request->admin_remarks,
        ]);

        $email = $serviceRequest->email ?? $serviceRequest->user?->email;

        // Dispatch notification if email exists and status is updated
        if ($email) {
            $pdfData = null;
            if ($request->status === 'Approved' || $request->estimated_cost) {
                // Generate Quotation PDF
                $pdfData = \Barryvdh\DomPDF\Facade\Pdf::loadView('pdf.quotation', [
                    'serviceRequest' => $serviceRequest
                ])->output();
            }

            // We use Notification::route to send to a specific email if the user is a guest
            $notifiable = $serviceRequest->user ?? (object) ['name' => $serviceRequest->name ?? 'Customer', 'email' => $email];
            
            \Illuminate\Support\Facades\Notification::route('mail', $email)
                ->notify(new \App\Notifications\ServiceRequestReviewed($serviceRequest, $pdfData));
        }

        return redirect()->back()->with('success', 'Service request updated successfully.');
    }

    /**
     * API to fetch service requests for Intake Form (Staff)
     */
    public function apiIndex()
    {
        // Return Approved and Pending requests
        $requests = ServiceRequest::with('user')
            ->whereIn('status', ['Approved', 'Pending'])
            ->orderBy('created_at', 'desc')
            ->get();
            
        return response()->json($requests);
    }
}
