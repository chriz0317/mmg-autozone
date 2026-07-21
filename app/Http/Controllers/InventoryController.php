<?php

namespace App\Http\Controllers;

use App\Models\InventoryItem;
use App\Services\ActivityLogger;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InventoryController extends Controller
{
    public function index()
    {
        $items = InventoryItem::orderBy('name')->get();
        return Inertia::render('Admin/Inventory', [
            'items' => $items
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:product,material',
            'stock_quantity' => 'required|integer|min:0',
            'price' => 'required|numeric|min:0',
            'cost' => 'required|numeric|min:0',
        ]);

        $item = InventoryItem::create($request->all());

        ActivityLogger::log('created_inventory_item', "Added new inventory item: {$item->name}");

        return redirect()->back()->with('success', 'Item created successfully.');
    }

    public function update(Request $request, InventoryItem $inventoryItem)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:product,material',
            'stock_quantity' => 'required|integer|min:0',
            'price' => 'required|numeric|min:0',
            'cost' => 'required|numeric|min:0',
        ]);

        $inventoryItem->update($request->all());

        ActivityLogger::log('updated_inventory_item', "Updated inventory item: {$inventoryItem->name}");

        return redirect()->back()->with('success', 'Item updated successfully.');
    }

    public function destroy(InventoryItem $inventoryItem)
    {
        $name = $inventoryItem->name;
        $inventoryItem->delete();

        ActivityLogger::log('deleted_inventory_item', "Deleted inventory item: {$name}");

        return redirect()->back()->with('success', 'Item deleted successfully.');
    }
}
