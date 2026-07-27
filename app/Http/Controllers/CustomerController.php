<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CustomerController extends Controller
{
    public function home(Request $request)
    {
        $user = Auth::guard('web')->user();

        return Inertia::render('Home', [
            'auth' => ['user' => $user],
        ]);
    }

    public function dashboard(Request $request)
    {
        $user = Auth::guard('web')->user();
        
        $estimates = \App\Models\ServiceRequest::where('user_id', $user->id)
            ->with('intake')
            ->orderBy('created_at', 'desc')
            ->get();

        $estimateIds = $estimates->pluck('id')->toArray();
        $unlinkedIntakes = \App\Models\Intake::where('email', $user->email)
            ->where(function($query) use ($estimateIds) {
                $query->whereNull('estimate_id')
                      ->orWhereNotIn('estimate_id', $estimateIds);
            })
            ->orderBy('created_at', 'desc')
            ->get();

        $estimatesArr = $estimates->toArray();
        
        $fakeEstimatesArr = $unlinkedIntakes->map(function($intake) {
            return [
                'id' => str_replace('MMG-', '', $intake->reference_number), // Make it shorter for display
                'service_type' => 'Walk-in Job Order',
                'vehicle_model' => $intake->vehicle,
                'created_at' => $intake->created_at,
                'status' => $intake->status,
                'estimated_cost' => null,
                'admin_remarks' => null,
                'intake' => $intake->toArray()
            ];
        })->toArray();

        $all = array_merge($estimatesArr, $fakeEstimatesArr);
        
        usort($all, function($a, $b) {
            return strtotime($b['created_at']) - strtotime($a['created_at']);
        });

        return Inertia::render('Customer/Dashboard', [
            'auth' => ['user' => $user],
            'estimates' => $all,
        ]);
    }
}
