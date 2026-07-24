<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

class TransactionController extends Controller
{
    /**
     * Show the POS transaction success page with the End-of-Service QR Code.
     */
    public function success(Transaction $transaction)
    {
        // Generate QR code linking to the digital OR
        $orUrl = url('/or/' . $transaction->id);
        $qrCode = QrCode::size(250)->generate($orUrl);

        return Inertia::render('POS/TransactionSuccess', [
            'transaction' => $transaction->load('items'),
            'qrCode' => (string) $qrCode,
            'orUrl' => $orUrl,
        ]);
    }

    /**
     * Public page to view the highly detailed Digital Official Receipt (OR)
     */
    public function digitalOr(Transaction $transaction)
    {
        // Load items, user (customer), and for intakes, the mechanic and staff
        $transaction->load(['items', 'user']);

        // Since transaction items hold item_id which might correspond to an Intake,
        // let's manually fetch intakes to get the assigned mechanic and confirmed_by details.
        $intakeDetails = [];
        foreach ($transaction->items as $item) {
            if ($item->item_type === 'intake') {
                $intake = \App\Models\Intake::with(['mechanic', 'confirmedBy'])->find($item->item_id);
                if ($intake) {
                    $intakeDetails[$item->id] = $intake;
                }
            }
        }

        return Inertia::render('DigitalOR', [
            'transaction' => $transaction,
            'intakeDetails' => $intakeDetails,
        ]);
    }

    public function downloadOrPdf(Transaction $transaction)
    {
        $transaction->load(['items', 'user']);

        $intakeDetails = [];
        foreach ($transaction->items as $item) {
            if ($item->item_type === 'intake') {
                $intake = \App\Models\Intake::with(['mechanic', 'confirmedBy'])->find($item->item_id);
                if ($intake) {
                    $intakeDetails[$item->id] = $intake;
                }
            }
        }

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('pdf.official_receipt', [
            'transaction' => $transaction,
            'intakeDetails' => $intakeDetails
        ]);

        return $pdf->download('Official_Receipt_' . str_pad($transaction->id, 6, '0', STR_PAD_LEFT) . '.pdf');
    }
}
