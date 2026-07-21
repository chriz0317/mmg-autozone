<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class AuthController extends Controller
{
    // ==========================================
    // STAFF AUTH (guard: staff)
    // ==========================================

    public function staffLogin(Request $request)
    {
        $credentials = $request->validate([
            'email'    => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (Auth::guard('staff')->attempt($credentials, $request->boolean('remember'))) {
            // Strict Gatekeeper: Reject if they are not staff
            if (Auth::guard('staff')->user()->role !== 'staff') {
                Auth::guard('staff')->logout();
                return back()->withErrors(['email' => 'Access denied. This portal is for Staff only.'])->onlyInput('email');
            }

            $request->session()->regenerate();
            return redirect('/intake');
        }

        return back()->withErrors(['email' => 'The provided credentials do not match our records.'])->onlyInput('email');
    }

    // ==========================================
    // ADMIN AUTH (guard: admin)
    // ==========================================

    public function adminLogin(Request $request)
    {
        $credentials = $request->validate([
            'email'    => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (Auth::guard('admin')->attempt($credentials, $request->boolean('remember'))) {
            // Strict Gatekeeper: Reject if they are not an admin
            if (Auth::guard('admin')->user()->role !== 'admin') {
                Auth::guard('admin')->logout();
                return back()->withErrors(['email' => 'Access denied. Admins only.'])->onlyInput('email');
            }

            $request->session()->regenerate();
            return redirect('/admin');
        }

        return back()->withErrors(['email' => 'The provided credentials do not match our records.'])->onlyInput('email');
    }

    // ==========================================
    // CUSTOMER AUTH (guard: web)
    // ==========================================

    public function customerLogin(Request $request)
    {
        $credentials = $request->validate([
            'email'    => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (Auth::guard('web')->attempt($credentials, $request->boolean('remember'))) {
            if (Auth::guard('web')->user()->role !== 'customer') {
                Auth::guard('web')->logout();
                return back()->withErrors(['email' => 'Access denied. This portal is for customers only.'])->onlyInput('email');
            }

            $request->session()->regenerate();
            return redirect('/home');
        }

        return back()->withErrors(['email' => 'The provided credentials do not match our records.'])->onlyInput('email');
    }

    public function customerRegister(Request $request)
    {
        $validated = $request->validate([
            'name'                  => ['required', 'string', 'max:255'],
            'email'                 => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'contact_no'            => ['required', 'string', 'max:20'],
            'password'              => ['required', 'confirmed', Password::defaults()],
        ]);

        $user = User::create([
            'name'       => $validated['name'],
            'email'      => $validated['email'],
            'contact_no' => $validated['contact_no'],
            'password'   => Hash::make($validated['password']),
            'role'       => 'customer',
        ]);

        Auth::guard('web')->login($user);
        $request->session()->regenerate();

        return redirect('/home');
    }

    // ==========================================
    // SMART LOGOUT (detects which guard is active)
    // ==========================================

    public function logout(Request $request)
    {
        // Determine which guard the current user is on and log out only that guard
        if (Auth::guard('admin')->check()) {
            Auth::guard('admin')->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();
            return redirect('/admin/login');
        }

        if (Auth::guard('staff')->check()) {
            Auth::guard('staff')->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();
            return redirect('/staff/login');
        }

        // Default: customer (web guard)
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect('/customer/login');
    }
}