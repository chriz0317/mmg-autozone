<?php
require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$kernel->handle(Illuminate\Http\Request::capture());

echo "Total Estimates: " . \App\Models\Estimate::count() . "\n";
echo "Approved/Pending Estimates: " . \App\Models\Estimate::whereIn('status', ['Approved', 'Pending'])->count() . "\n";
