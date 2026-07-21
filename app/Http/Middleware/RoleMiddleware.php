<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

/**
 * RoleMiddleware
 *
 * Checks that the authenticated user on the specified guard has the expected role.
 * Usage in routes:  ->middleware('role:staff,staff')   (guard:role)
 *                   ->middleware('role:admin,admin')
 *                   ->middleware('role:web,customer')
 */
class RoleMiddleware
{
    public function handle(Request $request, Closure $next, string $guard, string $role): Response
    {
        // Check the named guard
        if (!Auth::guard($guard)->check()) {
            // Not authenticated on this guard — send to the appropriate login
            return match ($guard) {
                'staff' => redirect('/staff/login'),
                'admin' => redirect('/admin/login'),
                default => redirect('/'),
            };
        }

        $user = Auth::guard($guard)->user();

        // Role mismatch — log them out of this guard and redirect
        if ($user->role !== $role) {
            Auth::guard($guard)->logout();
            return match ($guard) {
                'staff' => redirect('/staff/login')->withErrors(['email' => 'Access denied.']),
                'admin' => redirect('/admin/login')->withErrors(['email' => 'Access denied.']),
                default => redirect('/')->withErrors(['email' => 'Access denied.']),
            };
        }

        return $next($request);
    }
}
