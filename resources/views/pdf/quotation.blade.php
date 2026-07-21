<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>MMG Autozone - Quotation</title>
    <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333; line-height: 1.5; }
        .header { text-align: center; border-bottom: 2px solid #f97316; padding-bottom: 20px; margin-bottom: 30px; }
        .logo { max-width: 150px; margin-bottom: 10px; }
        .title { font-size: 24px; font-weight: bold; color: #111; text-transform: uppercase; letter-spacing: 2px; }
        .subtitle { font-size: 14px; color: #666; }
        .details-table { width: 100%; margin-bottom: 30px; border-collapse: collapse; }
        .details-table th, .details-table td { padding: 10px; text-align: left; border-bottom: 1px solid #eee; }
        .details-table th { width: 40%; color: #666; text-transform: uppercase; font-size: 12px; }
        .cost-section { background-color: #f9f9f9; padding: 20px; border-radius: 8px; text-align: center; border: 1px solid #eee; }
        .cost-label { font-size: 14px; color: #666; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px; }
        .cost-value { font-size: 32px; font-weight: bold; color: #10b981; margin: 0; }
        .footer { margin-top: 50px; font-size: 12px; color: #999; text-align: center; border-top: 1px solid #eee; padding-top: 20px; }
    </style>
</head>
<body>
    <div class="header">
        <div class="title">MMG AUTOZONE</div>
        <div class="subtitle">Auto Body and Paint Shop</div>
        <div class="subtitle">B14 L14, Road 7, Silcas Village, Binan, Laguna</div>
        <div class="subtitle">0917-302-9296</div>
    </div>

    <h2 style="text-align: center; text-transform: capitalize;">{{ str_replace('_', ' ', $serviceRequest->service_type) }} Quotation #{{ $serviceRequest->id }}</h2>
    
    <table class="details-table">
        <tr>
            <th>Date</th>
            <td>{{ now()->format('F j, Y') }}</td>
        </tr>
        <tr>
            <th>Customer Name</th>
            <td>{{ $serviceRequest->name ?? $serviceRequest->user?->name ?? 'Guest' }}</td>
        </tr>
        <tr>
            <th>Vehicle</th>
            <td>{{ $serviceRequest->vehicle_model }} {{ $serviceRequest->plate_no ? '('.$serviceRequest->plate_no.')' : '' }}</td>
        </tr>
        @if($serviceRequest->service_type === 'repaint' && $serviceRequest->areas)
        <tr>
            <th>Areas to Repaint</th>
            <td>{{ implode(', ', $serviceRequest->areas) }}</td>
        </tr>
        @endif
        @if($serviceRequest->admin_remarks)
        <tr>
            <th>Shop Remarks</th>
            <td>{{ $serviceRequest->admin_remarks }}</td>
        </tr>
        @endif
    </table>

    <div class="cost-section">
        <p class="cost-label">Estimated Baseline Cost</p>
        <p class="cost-value">PHP {{ number_format($serviceRequest->estimated_cost, 2) }}</p>
        <p style="font-size: 11px; color: #999; margin-top: 10px;">* This is a non-binding estimate based on provided details. Final costs will be determined upon physical inspection.</p>
    </div>

    <div class="footer">
        Thank you for choosing MMG Autozone!<br>
        This is a system-generated document.
    </div>
</body>
</html>
