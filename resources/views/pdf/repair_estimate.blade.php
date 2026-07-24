<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Repair Estimate</title>
    <style>
        body { font-family: 'Helvetica', 'Arial', sans-serif; font-size: 11px; margin: 0; padding: 0; }
        .container { width: 100%; margin: 0 auto; }
        
        .header-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        .header-table td { vertical-align: top; }
        .title { font-size: 24px; font-weight: normal; letter-spacing: 2px; margin: 0; padding-bottom: 5px; }
        .company-name { font-size: 14px; font-weight: bold; }
        .company-address { font-size: 11px; }
        
        .info-table { width: 100%; border-collapse: collapse; margin-bottom: 10px; font-size: 11px; }
        .info-table td { padding: 3px 0; border-bottom: 1px solid #ccc; }
        .info-label { width: 15%; color: #333; }
        .info-value { width: 35%; font-weight: bold; }
        
        .items-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 11px; }
        .items-table th { background-color: #888; color: white; border: 1px solid #000; padding: 5px; text-align: left; }
        .items-table td { border-left: 1px solid #ccc; border-right: 1px solid #ccc; padding: 3px 5px; }
        .items-table .cost-col { width: 15%; text-align: right; }
        .items-table .bottom-border td { border-bottom: 1px solid #000; }
        
        .category-title { font-weight: bold; text-decoration: underline; padding-top: 10px !important; }
        .sub-text { font-style: italic; color: #555; font-size: 10px; }
        
        .totals-container { width: 100%; }
        .totals-table { width: 45%; float: right; border-collapse: collapse; font-size: 11px; }
        .totals-table td { border: 1px solid #ccc; padding: 4px 5px; }
        .totals-label { font-weight: bold; }
        .totals-value { text-align: right; }
        .highlight { background-color: #ffff00; font-weight: bold; }
        
        .notes { font-size: 10px; margin-top: 30px; clear: both; }
        .notes ul { margin: 0; padding-left: 20px; list-style-type: none; }
        .notes li:before { content: "- "; }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <table class="header-table">
            <tr>
                <td style="width: 50%;">
                    <h1 class="title">REPAIR ESTIMATE</h1>
                    <div>Quotation No: <strong>{{ $estimate->estimate_no }}</strong></div>
                </td>
                <td style="width: 50%; text-align: right;">
                    <div class="company-name">MMG AUTOZONE CORP.</div>
                    <div class="company-address">Blk 14 Lot 14, Road 7, Silcas Village, Binan, Laguna</div>
                    <div class="company-address">0917 167 6663; 0917 178 6664</div>
                    <div class="company-address">info@mmgautozone.com</div>
                </td>
            </tr>
        </table>

        <!-- Customer & Vehicle Info -->
        <table class="info-table">
            <tr>
                <td class="info-label">Customer:</td>
                <td class="info-value">{{ strtoupper($estimate->customer_name) }}</td>
                <td class="info-label">Date:</td>
                <td class="info-value">{{ $estimate->date ? $estimate->date->format('m/d/Y') : '' }}</td>
            </tr>
            <tr>
                <td class="info-label">Address:</td>
                <td class="info-value">{{ strtoupper($estimate->address) }}</td>
                <td class="info-label">Prepared by:</td>
                <td class="info-value">{{ strtoupper($estimate->prepared_by) }}</td>
            </tr>
            <tr>
                <td class="info-label">Contact No.:</td>
                <td class="info-value">{{ $estimate->contact_no }}</td>
                <td class="info-label">Vehicle:</td>
                <td class="info-value">{{ strtoupper($estimate->vehicle_model) }}</td>
            </tr>
            <tr>
                <td class="info-label">Insurance:</td>
                <td class="info-value">{{ strtoupper($estimate->insurance ?: '-') }}</td>
                <td class="info-label">Plate no.:</td>
                <td class="info-value">{{ strtoupper($estimate->plate_no) }}</td>
            </tr>
            <tr>
                <td class="info-label">Reference No.:</td>
                <td class="info-value">{{ strtoupper($estimate->reference_no ?: '-') }}</td>
                <td class="info-label">Color:</td>
                <td class="info-value">{{ strtoupper($estimate->color) }}</td>
            </tr>
            <tr>
                <td class="info-label">Days of Repair:</td>
                <td class="info-value">{{ strtoupper($estimate->days_of_repair) }}</td>
                <td class="info-label">Frame:</td>
                <td class="info-value">{{ strtoupper($estimate->frame_no) }}</td>
            </tr>
        </table>

        <!-- Line Items -->
        <table class="items-table" cellspacing="0">
            <thead>
                <tr>
                    <th style="width: 70%;">DESCRIPTION</th>
                    <th class="cost-col">PARTS</th>
                    <th class="cost-col">LABOR</th>
                </tr>
            </thead>
            <tbody>
                @php
                    $groupedItems = $estimate->items->groupBy('category');
                @endphp

                <!-- PARTS SECTION -->
                @if($groupedItems->has('PARTS') || $groupedItems->has('Parts'))
                    <tr>
                        <td class="category-title" colspan="3">PARTS:</td>
                    </tr>
                    @foreach($groupedItems->get('PARTS') ?? $groupedItems->get('Parts') as $item)
                        <tr>
                            <td>
                                {{ strtoupper($item->description) }}
                                @if($item->sub_text)
                                    <span style="display:inline-block; margin-left: 20px;" class="sub-text">{{ strtoupper($item->sub_text) }}</span>
                                @endif
                            </td>
                            <td class="cost-col">{{ $item->parts_cost > 0 ? number_format($item->parts_cost, 2) : '' }}</td>
                            <td class="cost-col">{{ $item->labor_cost > 0 ? number_format($item->labor_cost, 2) : '' }}</td>
                        </tr>
                    @endforeach
                @endif

                <!-- SCOPE OF WORK -->
                <tr>
                    <td class="category-title" colspan="3">SCOPE OF WORK:</td>
                </tr>
                @foreach($groupedItems as $category => $items)
                    @if(strtoupper($category) !== 'PARTS')
                        <tr>
                            <td style="padding-top: 8px;"><u>{{ strtoupper($category) }}:</u></td>
                            <td class="cost-col"></td>
                            <td class="cost-col" style="vertical-align: top;">
                                @php
                                    $catLabor = $items->sum('labor_cost');
                                @endphp
                                {{ $catLabor > 0 ? number_format($catLabor, 2) : '' }}
                            </td>
                        </tr>
                        @foreach($items as $item)
                            <tr>
                                <td>
                                    {{ strtoupper($item->description) }}
                                    @if($item->sub_text)
                                        <br><span class="sub-text">{{ nl2br(e(strtoupper($item->sub_text))) }}</span>
                                    @endif
                                </td>
                                <td></td>
                                <td></td>
                            </tr>
                        @endforeach
                    @endif
                @endforeach
                
                <tr><td colspan="3" style="text-align: center; padding: 20px 0;">**Nothing Follows**</td></tr>
                <tr class="bottom-border">
                    <td style="text-align: right; padding-right: 20px;">Subtotals</td>
                    <td class="cost-col">{{ number_format($estimate->subtotal_parts, 2) }}</td>
                    <td class="cost-col">{{ number_format($estimate->subtotal_labor, 2) }}</td>
                </tr>
            </tbody>
        </table>

        <!-- Totals -->
        <div class="totals-container">
            <table class="totals-table">
                <tr>
                    <td class="totals-label" colspan="2" style="border-bottom: 1px solid #000;">ESTIMATE TOTALS</td>
                </tr>
                <tr>
                    <td class="totals-label">TOTAL PARTS</td>
                    <td class="totals-value">{{ number_format($estimate->subtotal_parts, 2) }}</td>
                </tr>
                <tr>
                    <td class="totals-label">LABOR/SHOP MATERIALS</td>
                    <td class="totals-value">{{ number_format($estimate->subtotal_labor, 2) }}</td>
                </tr>
                <tr>
                    <td class="totals-label">{{ number_format($estimate->vat_percentage, 0) }}% VAT</td>
                    <td class="totals-value">{{ $estimate->vat_amount > 0 ? number_format($estimate->vat_amount, 2) : '-' }}</td>
                </tr>
                <tr>
                    <td class="totals-label">TOTAL</td>
                    <td class="totals-value">{{ number_format($estimate->subtotal_parts + $estimate->subtotal_labor + $estimate->vat_amount, 2) }}</td>
                </tr>
                <tr>
                    <td class="totals-label">LESS: &nbsp;&nbsp;&nbsp;&nbsp;DEDUCTIBLE</td>
                    <td class="totals-value">{{ $estimate->deductible > 0 ? number_format($estimate->deductible, 2) : '-' }}</td>
                </tr>
                <tr>
                    <td class="totals-label">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;DEPRECIATION</td>
                    <td class="totals-value">{{ $estimate->depreciation > 0 ? number_format($estimate->depreciation, 2) : '-' }}</td>
                </tr>
                <tr>
                    <td class="totals-label highlight">DISCOUNT &nbsp;&nbsp;&nbsp;&nbsp;{{ $estimate->discount_notes }}</td>
                    <td class="totals-value highlight">{{ $estimate->discount_amount > 0 ? '('.number_format($estimate->discount_amount, 2).')' : '-' }}</td>
                </tr>
                <tr>
                    <td class="totals-label highlight" style="font-size: 13px;">NET DUE</td>
                    <td class="totals-value highlight" style="font-size: 13px;">{{ number_format($estimate->net_due, 2) }}</td>
                </tr>
            </table>
        </div>

        <div class="notes">
            <table style="width: 100%;">
                <tr>
                    <td style="width: 50%; vertical-align: top;">
                        <strong>Notes:</strong>
                        <ul>
                            <li>6 months warranty against paint application defects.</li>
                            <li>Prices are subject to change without prior notice.</li>
                        </ul>
                    </td>
                    <td style="width: 50%; vertical-align: top;">
                        <br>
                        <ul>
                            <li>Hidden damages are not included.</li>
                            <li>This estimate is not valid in court.</li>
                        </ul>
                    </td>
                </tr>
            </table>
        </div>
    </div>
</body>
</html>
