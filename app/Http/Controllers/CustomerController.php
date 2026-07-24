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

        return Inertia::render('Customer/Dashboard', [
            'auth' => ['user' => $user],
            'estimates' => $estimates,
        ]);
    }
}
