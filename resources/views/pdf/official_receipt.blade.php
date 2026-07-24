<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>MMG Autozone - Official Receipt</title>
    <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333; line-height: 1.5; font-size: 14px; }
        .header { border-bottom: 2px solid #1e3a8a; padding-bottom: 20px; margin-bottom: 30px; }
        .header table { width: 100%; }
        .title { font-size: 28px; font-weight: bold; color: #111; text-transform: uppercase; letter-spacing: 1px; }
        .or-number { font-size: 16px; color: #666; font-weight: bold; }
        .company-info { text-align: right; font-size: 12px; color: #666; }
        .company-name { font-weight: bold; font-size: 16px; color: #1e3a8a; text-transform: uppercase; }
        
        .info-grid { width: 100%; margin-bottom: 30px; }
        .info-grid td { vertical-align: top; width: 50%; padding-bottom: 10px; }
        .label { font-size: 10px; color: #999; text-transform: uppercase; letter-spacing: 1px; font-weight: bold; display: block; margin-bottom: 3px; }
        
        .items-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
        .items-table th { background: #f8fafc; border-bottom: 2px solid #e2e8f0; padding: 12px; text-align: left; font-size: 12px; color: #475569; text-transform: uppercase; }
        .items-table td { padding: 12px; border-bottom: 1px solid #f1f5f9; }
        .text-right { text-align: right !important; }
        .text-center { text-align: center !important; }
        
        .mechanic-info { font-size: 11px; color: #64748b; margin-top: 4px; }
        
        .totals { width: 100%; border-top: 2px solid #e2e8f0; padding-top: 20px; }
        .totals table { width: 40%; float: right; }
        .totals td { padding: 8px 0; }
        .grand-total { font-size: 20px; font-weight: bold; color: #1e3a8a; }
        
        .footer { clear: both; margin-top: 80px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; font-size: 12px; color: #94a3b8; }
    </style>
</head>
<body>
    <div class="header">
        <table>
            <tr>
                <td>
                    <div class="title">OFFICIAL RECEIPT</div>
                    <div class="or-number">O.R. No: #{{ str_pad($transaction->id, 6, '0', STR_PAD_LEFT) }}</div>
                    <div style="font-size: 12px; color: #999; margin-top: 5px;">{{ $transaction->created_at->format('M d, Y h:i A') }}</div>
                </td>
                <td class="company-info">
                    <div class="company-name">MMG Autozone Corp.</div>
                    Blk 14 Lot 14, Road 7, Silcas Village<br>
                    Binan, Laguna<br>
                    0917 167 6663 | 0917 178 6664
                </td>
            </tr>
        </table>
    </div>

    <table class="info-grid">
        <tr>
            <td>
                <span class="label">Billed To</span>
                <strong style="font-size: 16px;">{{ optional($transaction->user)->name ?? 'Walk-in Customer' }}</strong><br>
                @if($transaction->vehicle_model)
                    <span style="color: #666; font-size: 13px;">Vehicle: {{ $transaction->vehicle_model }}</span>
                @endif
            </td>
            <td>
                <span class="label">Payment Details</span>
                Method: <strong style="text-transform: uppercase;">{{ $transaction->payment_method }}</strong><br>
                Status: <strong style="color: #059669; text-transform: uppercase;">Paid</strong>
            </td>
        </tr>
    </table>

    <table class="items-table">
        <thead>
            <tr>
                <th>Description</th>
                <th class="text-center">Qty</th>
                <th class="text-right">Unit Price</th>
                <th class="text-right">Amount</th>
            </tr>
        </thead>
        <tbody>
            @foreach($transaction->items as $item)
                <tr>
                    <td>
                        <strong>{{ $item->item_name }}</strong>
                        @if($item->item_type === 'intake' && isset($intakeDetails[$item->id]))
                            <div class="mechanic-info">
                                Assigned: {{ optional($intakeDetails[$item->id]->mechanic)->name ?? 'N/A' }}<br>
                                Confirmed: {{ optional($intakeDetails[$item->id]->confirmedBy)->name ?? 'N/A' }}
                            </div>
                        @endif
                    </td>
                    <td class="text-center">{{ $item->quantity }}</td>
                    <td class="text-right">&#8369;{{ number_format($item->unit_price, 2) }}</td>
                    <td class="text-right" style="font-weight: bold;">&#8369;{{ number_format($item->subtotal, 2) }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <div class="totals">
        <table>
            <tr>
                <td style="color: #64748b;">Subtotal</td>
                <td class="text-right"><strong>&#8369;{{ number_format($transaction->total_amount, 2) }}</strong></td>
            </tr>
            <tr>
                <td style="font-weight: bold; text-transform: uppercase; padding-top: 15px;">Total Paid</td>
                <td class="text-right grand-total" style="padding-top: 15px;">&#8369;{{ number_format($transaction->total_amount, 2) }}</td>
            </tr>
        </table>
    </div>

    <div class="footer">
        Thank you for trusting MMG Autozone.<br>
        For questions or concerns, contact us at autozonemmg@gmail.com
    </div>
</body>
</html>
