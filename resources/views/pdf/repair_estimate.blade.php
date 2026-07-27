<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Repair Estimate</title>
    <style>
        body { font-family: 'Helvetica', 'Arial', sans-serif; font-size: 11px; margin: 0; padding: 0; }
        
        .header-title { font-size: 20px; font-weight: normal; margin: 0; padding: 0; letter-spacing: 1px; }
        .quotation-no { font-size: 12px; margin-top: 5px; }
        .company-name { font-size: 14px; font-weight: bold; margin-bottom: 3px; }
        .company-info { font-size: 10px; line-height: 1.4; }

        .customer-info { width: 100%; border-collapse: collapse; margin-bottom: 15px; font-size: 11px; }
        .customer-info td { padding: 4px 2px; border-bottom: 1px solid #000; }
        .customer-info .label { width: 15%; border-bottom: none; }
        .customer-info .value { font-weight: bold; width: 35%; }

        .items-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 11px; }
        .items-table th { background-color: #a3a3a3; color: #000; border-top: 1px solid #000; border-bottom: 1px solid #000; padding: 5px; text-align: left; }
        .items-table td { padding: 4px 5px; vertical-align: top; border: none; }
        .items-table .amount { text-align: right; width: 15%; }
        .items-table .sub-text { font-style: italic; font-size: 9px; color: #555; }

        .totals-table { width: 100%; border-collapse: collapse; font-size: 11px; }
        .totals-table td { padding: 4px 5px; border: 1px solid #000; }
        .yellow-highlight { background-color: #ffff00; font-weight: bold; }

        .notes ul { margin: 0; padding-left: 20px; list-style-type: none; }
        .notes li:before { content: "- "; }

        .flow-box { border: 2px solid #000; padding: 5px 2px; text-align: center; font-weight: bold; border-radius: 4px; vertical-align: middle; width: 100%; box-sizing: border-box; }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <table style="width: 100%; margin-bottom: 20px;">
            <tr>
                <td style="width: 30%; vertical-align: top;">
                    <h1 class="header-title">REPAIR ESTIMATE</h1>
                    <div class="quotation-no">Quotation No: &nbsp;&nbsp;&nbsp;<strong>{{ $estimate->estimate_no }}</strong></div>
                </td>
                <td style="width: 40%; text-align: left; vertical-align: top;">
                    <div class="company-name">MMG AUTOZONE CORP.</div>
                    <div class="company-info">
                        Blk 14 Lot 14, Road 7, Silcas Village, Binan, Laguna<br>
                        0917 167 6663; 0917 178 6664<br>
                        info@mmgautozone.com
                    </div>
                </td>
                <td style="width: 30%;"></td>
            </tr>
        </table>

        <!-- Customer & Vehicle Info -->
        <table class="customer-info">
            <tr>
                <td class="label">Customer:</td>
                <td class="value">{{ strtoupper($estimate->customer_name) }}</td>
                <td class="label">Date:</td>
                <td class="value">{{ $estimate->date ? $estimate->date->format('m/d/Y') : '' }}</td>
            </tr>
            <tr>
                <td class="label">Address:</td>
                <td class="value">{{ strtoupper($estimate->address) }}</td>
                <td class="label">Prepared by:</td>
                <td class="value">{{ strtoupper($estimate->prepared_by) }}</td>
            </tr>
            <tr>
                <td class="label">Contact No.:</td>
                <td class="value">{{ $estimate->contact_no }}</td>
                <td class="label">Vehicle:</td>
                <td class="value">{{ strtoupper($estimate->vehicle_model) }}</td>
            </tr>
            <tr>
                <td class="label">Insurance:</td>
                <td class="value">{{ strtoupper($estimate->insurance ?: '-') }}</td>
                <td class="label">Plate no.:</td>
                <td class="value">{{ strtoupper($estimate->plate_no) }}</td>
            </tr>
            <tr>
                <td class="label">Reference No.:</td>
                <td class="value">{{ strtoupper($estimate->reference_no ?: '-') }}</td>
                <td class="label">Color:</td>
                <td class="value">{{ strtoupper($estimate->color) }}</td>
            </tr>
            <tr>
                <td class="label">Days of Repair:</td>
                <td class="value">{{ strtoupper($estimate->days_of_repair) }}</td>
                <td class="label">Frame:</td>
                <td class="value">{{ strtoupper($estimate->frame_no) }}</td>
            </tr>
        </table>

        <!-- Line Items -->
        <table class="items-table" cellspacing="0">
            <thead>
                <tr>
                    <th style="width: 70%;">DESCRIPTION</th>
                    <th class="amount">PARTS</th>
                    <th class="amount">LABOR</th>
                </tr>
            </thead>
            <tbody>
                @foreach($estimate->items as $item)
                    <tr>
                        <td>
                            {{ strtoupper($item->description) }}
                            @if($item->qty > 1)
                                <span class="sub-text">&nbsp;&nbsp;({{ $item->qty }} {{ $item->unit }})</span>
                            @endif
                        </td>
                        <td class="amount">{{ $item->parts_cost > 0 ? number_format($item->parts_cost, 2) : '' }}</td>
                        <td class="amount">{{ $item->labor_cost > 0 ? number_format($item->labor_cost, 2) : '' }}</td>
                    </tr>
                @endforeach
                <tr>
                    <td colspan="3" style="text-align: center; padding: 20px 0;">**Nothing Follows**</td>
                </tr>
                <tr>
                    <td style="text-align: right; border-top: 1px solid #000; border-bottom: 1px solid #000;">Subtotals</td>
                    <td class="amount" style="border-top: 1px solid #000; border-bottom: 1px solid #000;">{{ number_format($estimate->subtotal_parts, 2) }}</td>
                    <td class="amount" style="border-top: 1px solid #000; border-bottom: 1px solid #000;">{{ number_format($estimate->subtotal_labor, 2) }}</td>
                </tr>
            </tbody>
        </table>

        <!-- Totals & Diagram -->
        <table style="width: 100%;">
            <tr>
                <!-- Left Side: Diagram & Notes -->
                <td style="width: 55%; vertical-align: top; padding-right: 15px;">
                    <!-- Car Diagram -->
                    <div style="text-align: center; margin-bottom: 20px;">
                        @if(file_exists(public_path('images/car-diagram.png')))
                            <img src="{{ public_path('images/car-diagram.png') }}" style="max-width: 100%; height: 200px;" alt="Car Diagram">
                        @else
                            <div style="border: 1px dashed #ccc; height: 180px; line-height: 180px; text-align: center; color: #999;">
                                [Upload 'car-diagram.png' to public/images]
                            </div>
                        @endif
                    </div>

                    <!-- Notes -->
                    <div class="notes" style="font-size: 10px;">
                        <table style="width: 100%;">
                            <tr>
                                <td style="width: 15%; vertical-align: top;"><strong>Notes:</strong></td>
                                <td style="width: 85%; vertical-align: top;">
                                    <ul>
                                        <li>6 months warranty against paint application defects.</li>
                                        <li>Prices are subject to change without prior notice.</li>
                                        <li>Hidden damages are not included.</li>
                                        <li>This estimate is not valid in court.</li>
                                    </ul>
                                </td>
                            </tr>
                        </table>
                    </div>
                </td>
                
                <!-- Right Side: Totals -->
                <td style="width: 45%; vertical-align: top;">
                    <table class="totals-table">
                        <tr>
                            <td colspan="2" style="font-weight: bold;">ESTIMATE TOTALS</td>
                        </tr>
                        <tr>
                            <td>TOTAL PARTS</td>
                            <td style="text-align: right;">{{ number_format($estimate->subtotal_parts, 2) }}</td>
                        </tr>
                        <tr>
                            <td>LABOR/SHOP MATERIALS</td>
                            <td style="text-align: right;">{{ number_format($estimate->subtotal_labor, 2) }}</td>
                        </tr>
                        <tr>
                            <td>{{ number_format($estimate->vat_percentage, 0) }}% VAT</td>
                            <td style="text-align: right;">{{ $estimate->vat_amount > 0 ? number_format($estimate->vat_amount, 2) : '-' }}</td>
                        </tr>
                        <tr>
                            <td>TOTAL</td>
                            <td style="text-align: right;">{{ number_format($estimate->subtotal_parts + $estimate->subtotal_labor + $estimate->vat_amount, 2) }}</td>
                        </tr>
                        <tr>
                            <td>LESS: &nbsp;&nbsp;&nbsp;&nbsp;DEDUCTIBLE</td>
                            <td style="text-align: right;">{{ $estimate->deductible > 0 ? number_format($estimate->deductible, 2) : '-' }}</td>
                        </tr>
                        <tr>
                            <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;DEPRECIATION</td>
                            <td style="text-align: right;">{{ $estimate->depreciation > 0 ? number_format($estimate->depreciation, 2) : '-' }}</td>
                        </tr>
                        <tr>
                            <td class="yellow-highlight">DISCOUNT <span style="font-weight: normal; font-size: 9px;">{{ $estimate->discount_notes }}</span></td>
                            <td class="yellow-highlight" style="text-align: right;">{{ $estimate->discount_amount > 0 ? '('.number_format($estimate->discount_amount, 2).')' : '-' }}</td>
                        </tr>
                        <tr>
                            <td class="yellow-highlight" style="font-size: 13px;">NET DUE</td>
                            <td class="yellow-highlight" style="text-align: right; font-size: 13px;">{{ number_format($estimate->net_due, 2) }}</td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>

        <!-- Repair Process Flowchart -->
        <div style="margin-top: 30px;">
            <table style="width: 100%; border-collapse: collapse; text-align: center; font-size: 8px;">
                <!-- Top Row -->
                <tr>
                    <td style="vertical-align: middle; font-weight: bold; font-size: 10px; width: 10%; text-align: left;">Repair<br>Process:</td>
                    
                    <td style="width: 12%;"><div class="flow-box">DISMANTLING</div></td>
                    <td style="width: 3%;">&#10145;</td>
                    
                    <td style="width: 12%;"><div class="flow-box">TINSMITH</div></td>
                    <td style="width: 3%;">&#10145;</td>
                    
                    <td style="width: 12%;"><div class="flow-box">RUST<br>PROOFING</div></td>
                    <td style="width: 3%;">&#10145;</td>
                    
                    <td style="width: 12%;"><div class="flow-box">BODY FILLER<br>APPLICATION</div></td>
                    <td style="width: 3%;">&#10145;</td>
                    
                    <td style="width: 12%;"><div class="flow-box">PRIMER<br>SURFACER</div></td>
                    <td style="width: 3%;">&#10145;</td>
                    
                    <td style="width: 12%;"><div class="flow-box">BASE/CLEAR<br>COAT</div></td>
                </tr>
                <!-- Percentages for Top Row -->
                <tr>
                    <td></td>
                    <td>5%</td>
                    <td></td>
                    <td>35%</td>
                    <td></td>
                    <td>5%</td>
                    <td></td>
                    <td>10%</td>
                    <td></td>
                    <td>5%</td>
                    <td></td>
                    <td>10%</td>
                </tr>
                
                <!-- Spacing row with down arrow -->
                <tr>
                    <td colspan="11"></td>
                    <td style="font-size: 16px;">&#11015;</td>
                </tr>

                <!-- Bottom Row -->
                <tr>
                    <td></td>
                    <td><div class="flow-box">RELEASING</div></td>
                    <td>&#11013;</td>
                    
                    <td><div class="flow-box">FINAL<br>INSPECTION</div></td>
                    <td>&#11013;</td>
                    
                    <td><div class="flow-box">GLAZING</div></td>
                    <td>&#11013;</td>
                    
                    <td><div class="flow-box">POLISHING</div></td>
                    <td>&#11013;</td>
                    
                    <td><div class="flow-box">CAR WASH</div></td>
                    <td>&#11013;</td>
                    
                    <td><div class="flow-box">COMPOUNDING<br>(BUFFING)</div></td>
                </tr>
                <!-- Percentages for Bottom Row -->
                <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>5%</td>
                    <td></td>
                    <td>5%</td>
                    <td></td>
                    <td>5%</td>
                    <td></td>
                    <td>10%</td>
                    <td></td>
                    <td>5%</td>
                </tr>
            </table>
        </div>
    </div>
</body>
</html>
