<?php

namespace App\Http\Controllers;

use App\Models\InventoryItem;
use App\Models\Service;
use App\Models\Transaction;
use App\Models\TransactionItem;
use App\Services\ActivityLogger;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class POSController extends Controller
{
    public function index()
    {
        $transactions = Transaction::with('items')->orderBy('created_at', 'desc')->get();
        $estimates = \App\Models\RepairEstimate::with('intake')->orderBy('created_at', 'desc')->get();

        return Inertia::render('POS/Checkout', [
            'transactions' => $transactions,
            'estimates' => $estimates,
            // Assuming we might want to attach a customer
            'customers' => \App\Models\User::where('role', 'customer')->get(['id', 'name', 'email'])
        ]);
    }

    public function checkout(Request $request)
    {
        $request->validate([
            'items' => 'required|array|min:1',
            'items.*.id' => 'required|integer',
            'items.*.type' => 'required|in:estimate',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.price' => 'required|numeric|min:0',
            'total_amount' => 'required|numeric|min:0',
            'payment_method' => 'required|string',
            'customer_id' => 'nullable|exists:users,id',
            'vehicle_model' => 'nullable|string'
        ]);

        DB::beginTransaction();

        try {
            $transaction = Transaction::create([
                'user_id' => $request->customer_id,
                'vehicle_model' => $request->vehicle_model,
                'total_amount' => $request->total_amount,
                'payment_method' => $request->payment_method,
                'status' => 'paid',
            ]);

            foreach ($request->items as $item) {
                $subtotal = $item['price'] * $item['quantity'];
                
                if ($item['type'] === 'estimate') {
                    $estimate = \App\Models\RepairEstimate::findOrFail($item['id']);
                    $itemName = "Repair Quote: " . $estimate->estimate_no;
                    
                    if ($estimate->intake_id) {
                        $intake = \App\Models\Intake::find($estimate->intake_id);
                        if ($intake) {
                            $intake->status = 'Completed';
                            $intake->amount_to_pay = $subtotal + (isset($item['additionalChargeAmount']) ? $item['additionalChargeAmount'] : 0);
                            $intake->save();
                        }
                    }
                } else {
                    $itemName = "Product/Material"; // default fallback, though frontend sends correct names usually
                }

                TransactionItem::create([
                    'transaction_id' => $transaction->id,
                    'item_type' => $item['type'],
                    'item_id' => $item['id'],
                    // If we have an item name passed from front end, use it instead of generating
                    // Wait, frontend doesn't send item name inside items array right now, it sends id, type, quantity, price, additionalChargeDesc, additionalChargeAmount
                    // So we must rely on $itemName for intake. For products, we don't have the name here unless passed.
                    // Oh wait, looking at the previous POSController code, it was already doing this:
                    'item_name' => $itemName ?? 'Item',
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['price'],
                    'subtotal' => $subtotal,
                ]);

                // Check for additional charges and create a separate transaction item
                if (isset($item['additionalChargeAmount']) && $item['additionalChargeAmount'] > 0) {
                    TransactionItem::create([
                        'transaction_id' => $transaction->id,
                        'item_type' => 'additional_charge',
                        'item_id' => $item['id'],
                        'item_name' => "Add-on: " . ($item['additionalChargeDesc'] ?: 'Additional Charges'),
                        'quantity' => 1,
                        'unit_price' => $item['additionalChargeAmount'],
                        'subtotal' => $item['additionalChargeAmount'],
                    ]);
                }
            }

            ActivityLogger::log('pos_checkout', 'Processed POS transaction #'.$transaction->id, [
                'transaction_id' => $transaction->id,
                'total_amount' => $transaction->total_amount
            ]);

            DB::commit();

            $route = \Illuminate\Support\Facades\Auth::user()->role === 'admin' 
                ? 'admin.pos.success' 
                : 'staff.pos.success';

            return redirect()->route($route, $transaction->id);

        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->withErrors(['error' => $e->getMessage()]);
        }
    }
}
