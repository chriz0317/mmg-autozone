<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>MMG Autozone - Repair Order</title>
    <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333; line-height: 1.5; }
        .header { text-align: center; border-bottom: 2px solid #3b82f6; padding-bottom: 20px; margin-bottom: 30px; }
        .title { font-size: 24px; font-weight: bold; color: #111; text-transform: uppercase; letter-spacing: 2px; }
        .subtitle { font-size: 14px; color: #666; }
        .badge { display: inline-block; padding: 5px 15px; border-radius: 20px; background: #eff6ff; color: #2563eb; font-weight: bold; font-size: 14px; margin-top: 10px; border: 1px solid #bfdbfe; }
        .details-table { width: 100%; margin-bottom: 30px; border-collapse: collapse; }
        .details-table th, .details-table td { padding: 10px; text-align: left; border-bottom: 1px solid #eee; }
        .details-table th { width: 40%; color: #666; text-transform: uppercase; font-size: 12px; }
        .section-title { font-size: 14px; font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #eee; padding-bottom: 5px; margin-bottom: 10px; margin-top: 20px; color: #3b82f6; }
        .footer { margin-top: 50px; font-size: 12px; color: #999; text-align: center; border-top: 1px solid #eee; padding-top: 20px; }
    </style>
</head>
<body>
    <div class="header">
        <div class="title">MMG AUTOZONE</div>
        <div class="subtitle">Auto Body and Paint Shop</div>
        <div class="subtitle">B14 L14, Road 7, Silcas Village, Binan, Laguna</div>
        <div class="badge">REPAIR ORDER</div>
    </div>
    
    <table class="details-table">
        <tr>
            <th>Reference Number</th>
            <td style="font-weight: bold;">{{ $intake->reference_number }}</td>
        </tr>
        <tr>
            <th>Date Created</th>
            <td>{{ $intake->created_at->format('F j, Y h:i A') }}</td>
        </tr>
        <tr>
            <th>Customer Name</th>
            <td>{{ $intake->customer ?? 'Walk-in' }}</td>
        </tr>
        <tr>
            <th>Vehicle Model</th>
            <td>{{ $intake->vehicle }} {{ $intake->plate_no ? '('.$intake->plate_no.')' : '' }}</td>
        </tr>
        <tr>
            <th>Assigned Mechanic</th>
            <td>{{ optional($intake->mechanic)->name ?? 'Unassigned' }}</td>
        </tr>
    </table>

    <div class="section-title">Scope of Work / Instructions</div>
    <p>{{ $intake->scope_of_works ?: ($intake->complaints ?: 'None specified.') }}</p>

    <div class="section-title">Mechanic Recommendations</div>
    @if(is_array($intake->mechanic_recommendations) && count($intake->mechanic_recommendations) > 0)
        <ul>
            @foreach($intake->mechanic_recommendations as $rec)
                <li>{{ $rec }}</li>
            @endforeach
        </ul>
    @else
        <p>No recorded recommendations.</p>
    @endif

    <div class="footer">
        Internal Document - Do Not Distribute to Customer<br>
        (Prices and Estimates explicitly hidden for internal use)
    </div>
</body>
</html>
