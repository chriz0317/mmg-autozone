<?php

namespace App\Http\Controllers;

use App\Models\Service;
use App\Models\InventoryItem;
use App\Services\ActivityLogger;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class ServiceController extends Controller
{
    public function index()
    {
        $services = Service::with('materials.inventoryItem')->get();
        $materials = InventoryItem::where('type', 'material')->get();

        return Inertia::render('Admin/Services', [
            'services' => $services,
            'materials' => $materials
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'materials' => 'nullable|array',
            'materials.*.inventory_item_id' => 'required|exists:inventory_items,id',
            'materials.*.quantity_required' => 'required|integer|min:1',
        ]);

        DB::transaction(function () use ($request) {
            $service = Service::create($request->only('name', 'description', 'price'));

            if ($request->has('materials')) {
                foreach ($request->materials as $mat) {
                    $service->materials()->create($mat);
                }
            }

            ActivityLogger::log('created_service', "Added new service: {$service->name}");
        });

        return redirect()->back()->with('success', 'Service created successfully.');
    }

    public function update(Request $request, Service $service)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'materials' => 'nullable|array',
            'materials.*.inventory_item_id' => 'required|exists:inventory_items,id',
            'materials.*.quantity_required' => 'required|integer|min:1',
        ]);

        DB::transaction(function () use ($request, $service) {
            $service->update($request->only('name', 'description', 'price'));

            // Sync materials
            $service->materials()->delete();
            if ($request->has('materials')) {
                foreach ($request->materials as $mat) {
                    $service->materials()->create($mat);
                }
            }

            ActivityLogger::log('updated_service', "Updated service: {$service->name}");
        });

        return redirect()->back()->with('success', 'Service updated successfully.');
    }

    public function destroy(Service $service)
    {
        $name = $service->name;
        $service->delete();

        ActivityLogger::log('deleted_service', "Deleted service: {$name}");

        return redirect()->back()->with('success', 'Service deleted successfully.');
    }
}
