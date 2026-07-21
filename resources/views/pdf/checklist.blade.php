<!DOCTYPE html>
<html>
<head>
    <title>MMG Autozone - Full Checklist</title>
    <style>
        body { font-family: sans-serif; font-size: 12px; color: #333; margin: 10px 0; } 
        .header-table { width: 100%; margin-bottom: 20px; }
        .header-table td { border: none; padding: 0; }
        .title { font-size: 24px; font-weight: normal; letter-spacing: 1px; }
        .company-info { font-size: 11px; line-height: 1.4; }
        
        table { width: 100%; border-collapse: collapse; margin-bottom: 10px; }
        th, td { border: 1px solid #000; padding: 6px; text-align: left; vertical-align: top; }
        
        .main-form td { width: 50%; }
        .label { display: inline-block; width: 100px; }
        
        .scope-box { border: 1px solid #000; min-height: 100px; margin-bottom: 10px; }
        .scope-title { font-weight: bold; font-size: 14px; border-bottom: 1px solid #000; padding: 4px; }
        .scope-content { padding: 4px; }
        
        .section-title { font-weight: bold; font-size: 14px; margin-bottom: 5px; margin-top: 15px; background: #e5e7eb; padding: 6px; }
        .no-border td { border: none; padding: 3px; }
        .signature-container { margin-top: 30px; page-break-inside: avoid; }
    </style>
</head>
<body>

    <table class="header-table">
        <tr>
            <td width="35%" class="title">VEHICLE CHECKLIST</td>
            <td width="45%" class="company-info">
                <strong>MMG AUTOZONE CORP.</strong><br>
                Blk 14 Lot 14, Road 7, Silcas Village, Binan, Laguna<br>
                0917 167 6663; 0917 178 6664<br>
                <span style="color: blue;">autozonemmg@gmail.com</span>
            </td>
            <td width="20%" style="text-align: right; vertical-align: middle;">
                <img src="data:image/svg+xml;base64,{!! base64_encode(QrCode::size(70)->generate($intake->reference_number)) !!}" alt="QR Code">
            </td>
        </tr>
    </table>>

    <table class="main-form">
        <tr>
            <td><span class="label">Customer:</span> {{ $intake->customer }}</td>
            <td><span class="label">Date Received:</span> {{ $intake->created_at->format('M d, Y') }}</td>
        </tr>
        <tr>
            <td><span class="label">Address:</span> {{ $intake->address }}</td>
            <td><span class="label">Due Date:</span> {{ $intake->due_date ? \Carbon\Carbon::parse($intake->due_date)->format('M d, Y') : '' }}</td>
        </tr>
        <tr>
            <td><span class="label">Contact No.:</span> {{ $intake->contact_no }}</td>
            <td><span class="label">Vehicle:</span> {{ $intake->vehicle }}</td>
        </tr>
        <tr>
            <td><span class="label">Reference No.:</span> {{ $intake->reference_number }}</td>
            <td><span class="label">Plate no.:</span> {{ $intake->plate_no }}</td>
        </tr>
        <tr>
            <td><span class="label">Received By:</span> {{ $intake->received_by }}</td>
            <td><span class="label">Color:</span> {{ $intake->color }}</td>
        </tr>
    </table>

    <div class="scope-box">
        <div class="scope-title">Scope of Works:</div>
        <div class="scope-content">{!! nl2br(e($intake->scope_of_works)) !!}</div>
    </div>

    <table style="width: 100%; border: none; margin-bottom: 10px; padding: 0;">
        <tr>
            <td style="width: 48%; padding: 5px; text-align: center; border: none; vertical-align: middle;">
                @php
                    $type = $intake->vehicle_type ?? 'sedan';
                    $imgNames = [
                        'sedan' => ['Picture1.png', 'Picture2.png'],
                        'pickup' => ['PickUpPicture1.png', 'PickUpPicture2.png'],
                        'van' => ['VanPicture1.png', 'VanPicture2.png'],
                        'suv-hatchback' => ['SuvPicture1.png', 'SuvPicture2.png'],
                        'truck' => ['TruckPicture1.png', 'TruckPicture2.png']
                    ];
                    
                    $frontImg = $imgNames[$type][0] ?? 'Picture1.png';
                    $img1Path = public_path('images/' . $frontImg);
                    $base64_1 = file_exists($img1Path) ? 'data:image/png;base64,' . base64_encode(file_get_contents($img1Path)) : '';
                    
                    $maxWidth = 340;
                    $maxHeight = 170;
                    $targetWidth1 = $maxWidth;
                    $targetHeight1 = $maxHeight;
                    
                    if (file_exists($img1Path)) {
                        $size1 = getimagesize($img1Path);
                        if ($size1 && $size1[0] > 0 && $size1[1] > 0) {
                            $ratio = $size1[0] / $size1[1];
                            $maxRatio = $maxWidth / $maxHeight;
                            
                            if ($ratio > $maxRatio) {
                                $targetWidth1 = $maxWidth;
                                $targetHeight1 = $maxWidth / $ratio;
                            } else {
                                $targetHeight1 = $maxHeight;
                                $targetWidth1 = $maxHeight * $ratio;
                            }
                        }
                    }
                @endphp
                
                <div style="width: 360px; height: 190px; margin: 0 auto; border: 1px solid #ccc; background-color: #fff; overflow: hidden; text-align: center; display: table;">
                    @if($base64_1)
                        <div style="display: table-cell; vertical-align: middle;">
                            <div style="position: relative; width: {{ $targetWidth1 }}px; height: {{ $targetHeight1 }}px; margin: 0 auto; overflow: hidden;">
                                <img src="{{ $base64_1 }}" style="width: 100%; height: 100%; display: block; position: absolute; top: 0; left: 0;">
                                @if(is_array($intake->damage_markers))
                                    @foreach($intake->damage_markers as $marker)
                                        @php $showOnImageOne = isset($marker['view']) ? $marker['view'] === 'front-left' : (isset($marker['imageIndex']) && $marker['imageIndex'] == 0); @endphp
                                        @if($showOnImageOne)
                                            @php
                                                $markerX = ($marker['x'] / 100) * $targetWidth1;
                                                $markerY = ($marker['y'] / 100) * $targetHeight1;
                                            @endphp
                                            <div style="position: absolute; left: {{ $markerX }}px; top: {{ $markerY }}px; font-weight: bold; font-size: 16px; color: {{ $marker['type'] == 'S' ? '#ef4444' : ($marker['type'] == 'D' ? '#f59e0b' : '#a855f7') }}; margin-left: -5px; margin-top: -8px; z-index: 10; line-height: 1;">
                                                {{ $marker['type'] }}
                                            </div>
                                        @endif
                                    @endforeach
                                @endif
                            </div>
                        </div>
                    @else
                        <div style="height: 190px; line-height: 190px; text-align: center;">Image Missing</div>
                    @endif
                </div>
            </td>

            <td style="width: 48%; padding: 5px; text-align: center; border: none; vertical-align: middle;">
                @php
                    $rearImg = $imgNames[$type][1] ?? 'Picture2.png';
                    $img2Path = public_path('images/' . $rearImg);
                    $base64_2 = file_exists($img2Path) ? 'data:image/png;base64,' . base64_encode(file_get_contents($img2Path)) : '';
                    
                    $targetWidth2 = $maxWidth;
                    $targetHeight2 = $maxHeight;
                    
                    if (file_exists($img2Path)) {
                        $size2 = getimagesize($img2Path);
                        if ($size2 && $size2[0] > 0 && $size2[1] > 0) {
                            $ratio = $size2[0] / $size2[1];
                            
                            if ($ratio > $maxRatio) {
                                $targetWidth2 = $maxWidth;
                                $targetHeight2 = $maxWidth / $ratio;
                            } else {
                                $targetHeight2 = $maxHeight;
                                $targetWidth2 = $maxHeight * $ratio;
                            }
                        }
                    }
                @endphp
                
                <div style="width: 360px; height: 190px; margin: 0 auto; border: 1px solid #ccc; background-color: #fff; overflow: hidden; text-align: center; display: table;">
                    @if($base64_2)
                        <div style="display: table-cell; vertical-align: middle;">
                            <div style="position: relative; width: {{ $targetWidth2 }}px; height: {{ $targetHeight2 }}px; margin: 0 auto; overflow: hidden;">
                                <img src="{{ $base64_2 }}" style="width: 100%; height: 100%; display: block; position: absolute; top: 0; left: 0;">
                                @if(is_array($intake->damage_markers))
                                    @foreach($intake->damage_markers as $marker)
                                        @php $showOnImageTwo = isset($marker['view']) ? $marker['view'] === 'rear-right' : (isset($marker['imageIndex']) && $marker['imageIndex'] == 1); @endphp
                                        @if($showOnImageTwo)
                                            @php
                                                $markerX = ($marker['x'] / 100) * $targetWidth2;
                                                $markerY = ($marker['y'] / 100) * $targetHeight2;
                                            @endphp
                                            <div style="position: absolute; left: {{ $markerX }}px; top: {{ $markerY }}px; font-weight: bold; font-size: 16px; color: {{ $marker['type'] == 'S' ? '#ef4444' : ($marker['type'] == 'D' ? '#f59e0b' : '#a855f7') }}; margin-left: -5px; margin-top: -8px; z-index: 10; line-height: 1;">
                                                {{ $marker['type'] }}
                                            </div>
                                        @endif
                                    @endforeach
                                @endif
                            </div>
                        </div>
                    @else
                        <div style="height: 190px; line-height: 190px; text-align: center;">Image Missing</div>
                    @endif
                </div>
            </td>
        </tr>
    </table>

    <div class="section-title">Vehicle Condition</div>
    <table>
        <tr>
            <th width="20%">Fuel Level:</th>
            <td>{{ $intake->fuel_level }}/16 Tank</td> 
        </tr>
    </table>

    <div class="section-title">Inspection Checklist</div>
    <table>
        <tr>
            <td width="50%" style="vertical-align: top; padding: 0;">
                <table class="no-border">
                    <tr><td width="65%">Exterior Lights:</td><td>{{ $intake->checklist['exterior_lights'] ?? '________' }}</td></tr>
                    <tr><td>Interior Lights:</td><td>{{ $intake->checklist['interior_lights'] ?? '________' }}</td></tr>
                    <tr><td>Radio Off:</td><td>{{ $intake->checklist['radio_off'] ?? '________' }}</td></tr>
                    <tr><td>Upholstery Clean:</td><td>{{ $intake->checklist['upholstery_clean'] ?? '________' }}</td></tr>
                    <tr><td>Headlining Check:</td><td>{{ $intake->checklist['headlining_check'] ?? '________' }}</td></tr>
                    <tr><td>Indicator Lamp:</td><td>{{ $intake->checklist['indicator_lamp'] ?? '________' }}</td></tr>
                    <tr><td>Power Windows:</td><td>{{ $intake->checklist['power_windows'] ?? '________' }}</td></tr>
                    <tr><td>Central Lock:</td><td>{{ $intake->checklist['central_lock'] ?? '________' }}</td></tr>
                    <tr><td>Horn:</td><td>{{ $intake->checklist['horn'] ?? '________' }}</td></tr>
                    <tr><td>Windshield Crack:</td><td>{{ $intake->checklist['windshield_crack'] ?? '________' }}</td></tr>
                    <tr><td>Wipers:</td><td>{{ $intake->checklist['wipers'] ?? '________' }}</td></tr>
                </table>
            </td>
            <td width="50%" style="vertical-align: top; padding: 0;">
                <table class="no-border">
                    <tr><td width="65%">Window Tints:</td><td>{{ $intake->checklist['window_tints'] ?? '________' }}</td></tr>
                    <tr><td>Side Mirrors:</td><td>{{ $intake->checklist['side_mirrors'] ?? '________' }}</td></tr>
                    <tr><td>Front Bumper Sensor:</td><td>{{ $intake->checklist['front_bumper_sensor'] ?? '________' }}</td></tr>
                    <tr><td>Rear Bumper Sensor:</td><td>{{ $intake->checklist['rear_bumper_sensor'] ?? '________' }}</td></tr>
                    <tr><td>Hood/Trunk Backdoor:</td><td>{{ $intake->checklist['hood_trunk_backdoor'] ?? '________' }}</td></tr>
                    <tr><td>Spare Tire/Brand:</td><td>{{ $intake->checklist['spare_tire_brand'] ?? '________' }}</td></tr>
                    <tr><td>Jack & Tools:</td><td>{{ $intake->checklist['jack_tools'] ?? '________' }}</td></tr>
                    <tr><td>Matting:</td><td>{{ $intake->checklist['matting'] ?? '________' }}</td></tr>
                    <tr><td>Hub Caps / Center Caps:</td><td>{{ $intake->checklist['hub_caps'] ?? '________' }}</td></tr>
                    <tr><td>EWD:</td><td>{{ $intake->checklist['ewd'] ?? '________' }}</td></tr>
                    <tr><td>Oil / Water Level:</td><td>{{ $intake->checklist['oil_water_level'] ?? '________' }}</td></tr>
                </table>
            </td>
        </tr>
    </table>

    <div class="section-title">Accessories & Loose Items</div>
    <table class="no-border" style="border: 1px solid #ccc;">
        <tr>
            <td width="33%">[{{ in_array('Door Visor', $intake->accessories ?? []) ? 'X' : ' ' }}] Door Visor</td>
            <td width="33%">[{{ in_array('Dash Cam', $intake->accessories ?? []) ? 'X' : ' ' }}] Dash Cam</td>
            <td width="33%">[{{ in_array('Mags', $intake->accessories ?? []) ? 'X' : ' ' }}] Mags</td>
        </tr>
        <tr>
            <td>[{{ in_array('Fog Lamps', $intake->accessories ?? []) ? 'X' : ' ' }}] Fog Lamps</td>
            <td>[{{ in_array('Reverse Camera', $intake->accessories ?? []) ? 'X' : ' ' }}] Reverse Camera</td>
            <td>[{{ in_array('Seat Cover', $intake->accessories ?? []) ? 'X' : ' ' }}] Seat Cover</td>
        </tr>
        <tr>
            <td><hr style="border: 0; border-top: 1px dashed #ccc;"></td>
            <td><hr style="border: 0; border-top: 1px dashed #ccc;"></td>
            <td><hr style="border: 0; border-top: 1px dashed #ccc;"></td>
        </tr>
        <tr>
            <td>[{{ in_array('Car Freshener', $intake->loose_items ?? []) ? 'X' : ' ' }}] Car Freshener</td>
            <td>[{{ in_array('Pillows / Rosary', $intake->loose_items ?? []) ? 'X' : ' ' }}] Pillows / Rosary</td>
            <td>[{{ in_array('Umbrella / Coins', $intake->loose_items ?? []) ? 'X' : ' ' }}] Umbrella / Coins</td>
        </tr>
        <tr>
            <td>[{{ in_array('Sun Shade', $intake->loose_items ?? []) ? 'X' : ' ' }}] Sun Shade</td>
            <td>[{{ in_array('Documents', $intake->loose_items ?? []) ? 'X' : ' ' }}] Documents</td>
            <td></td>
        </tr>
    </table>

    <div class="signature-container">
        <p style="font-size: 10px; margin-bottom: 25px; color: #555;">
            I hereby acknowledge that the above information about the vehicle is correct and MMG AUTOZONE CORP. will not be liable for any loss or damages that was not declared and/or turned over during inspection.
        </p>

        <table style="width: 100%; border: none;">
            <tr>
                <td style="width: 50%; border: none;"></td>
                <td style="width: 50%; border: none; text-align: right;">
                    <div style="float: right; text-align: center; width: 200px;">
                        @if(!empty($intake->customer_signature))
                            <img src="{{ $intake->customer_signature }}" style="width: 150px; height: 75px; margin-bottom: 5px; display: block; margin-left: auto; margin-right: auto;" />
                        @else
                            <div style="height: 50px;"></div>
                        @endif
                        <div style="border-top: 1px solid #000; padding-top: 2px; font-size: 10px; font-weight: bold;">
                            {{ strtoupper($intake->customer ?: 'VEHICLE OWNER / REPRESENTATIVE') }}<br>
                            <span style="font-weight: normal; color: #555;">(Signature over Printed Name)</span>
                        </div>
                    </div>
                </td>
            </tr>
        </table>
    </div>

</body>
</html>