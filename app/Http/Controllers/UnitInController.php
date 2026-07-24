<?php

namespace App\Http\Controllers;

use App\Models\Intake;
use Inertia\Inertia;

class UnitInController extends Controller
{
    /**
     * Show all vehicles currently in the workshop (not yet released).
     */
    public function index()
    {
        $intakes = Intake::where('status', '!=', 'Released')
            ->orderBy('created_at', 'asc') // oldest first = most urgent
            ->get();

        return Inertia::render('Admin/UnitIn', [
            'intakes' => $intakes,
        ]);
    }
}
