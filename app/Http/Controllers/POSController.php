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
        $intakes = \App\Models\Intake::where('status', '!=', 'Completed')->orWhereNull('status')->get();

        return Inertia::render('POS/Checkout', [
            'transactions' => $transactions,
            'intakes' => $intakes,
            // Assuming we might want to attach a customer
            'customers' => \App\Models\User::where('role', 'customer')->get(['id', 'name', 'email'])
        ]);
    }

    public function checkout(Request $request)
    {
        $request->validate([
            'items' => 'required|array|min:1',
            'items.*.id' => 'required|integer',
            'items.*.type' => 'required|in:intake',
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
                
                if ($item['type'] === 'intake') {
                    $intake = \App\Models\Intake::findOrFail($item['id']);
                    $itemName = "Repair Job: " . $intake->reference_number;
                    
                    // Mark the intake as completed
                    $intake->status = 'Completed';
                    $intake->save();
                }

                TransactionItem::create([
                    'transaction_id' => $transaction->id,
                    'item_type' => $item['type'],
                    'item_id' => $item['id'],
                    'item_name' => $itemName,
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['price'],
                    'subtotal' => $subtotal,
                ]);
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
