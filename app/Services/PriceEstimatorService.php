<?php

namespace App\Services;

class PriceEstimatorService
{
    /**
     * MMG Autozone Standard Price List
     * Each area has 3 severity tiers: light_scratch, dent, severe
     * Each tier has parts and labor price ranges [min, max] in PHP Pesos
     *
     * Shop owners: edit this table to match your current pricing.
     */
    const PRICE_TABLE = [
        'front_bumper' => [
            'label' => 'Front Bumper',
            'light_scratch' => ['parts' => [300,  1000],  'labor' => [500,  1500]],
            'dent'          => ['parts' => [1000, 3500],  'labor' => [1500, 3500]],
            'severe'        => ['parts' => [3500, 10000], 'labor' => [3000, 7000]],
        ],
        'hood' => [
            'label' => 'Hood',
            'light_scratch' => ['parts' => [400,  1200],  'labor' => [800,  1800]],
            'dent'          => ['parts' => [2000, 6000],  'labor' => [1500, 3500]],
            'severe'        => ['parts' => [6000, 18000], 'labor' => [3000, 8000]],
        ],
        'left_fender' => [
            'label' => 'Left Front Fender',
            'light_scratch' => ['parts' => [300,  1000],  'labor' => [600,  1500]],
            'dent'          => ['parts' => [1500, 4500],  'labor' => [1200, 3000]],
            'severe'        => ['parts' => [4500, 14000], 'labor' => [2000, 6000]],
        ],
        'right_fender' => [
            'label' => 'Right Front Fender',
            'light_scratch' => ['parts' => [300,  1000],  'labor' => [600,  1500]],
            'dent'          => ['parts' => [1500, 4500],  'labor' => [1200, 3000]],
            'severe'        => ['parts' => [4500, 14000], 'labor' => [2000, 6000]],
        ],
        'windshield' => [
            'label' => 'Front Windshield',
            'light_scratch' => ['parts' => [2000, 5000],  'labor' => [300,  500]],
            'dent'          => ['parts' => [5000, 12000], 'labor' => [300,  800]],
            'severe'        => ['parts' => [8000, 25000], 'labor' => [500,  1500]],
        ],
        'left_front_door' => [
            'label' => 'Left Front Door',
            'light_scratch' => ['parts' => [400,  1200],  'labor' => [700,  1500]],
            'dent'          => ['parts' => [1800, 5500],  'labor' => [1500, 3500]],
            'severe'        => ['parts' => [5000, 16000], 'labor' => [2500, 7000]],
        ],
        'right_front_door' => [
            'label' => 'Right Front Door',
            'light_scratch' => ['parts' => [400,  1200],  'labor' => [700,  1500]],
            'dent'          => ['parts' => [1800, 5500],  'labor' => [1500, 3500]],
            'severe'        => ['parts' => [5000, 16000], 'labor' => [2500, 7000]],
        ],
        'roof' => [
            'label' => 'Roof',
            'light_scratch' => ['parts' => [500,  1500],  'labor' => [800,  2000]],
            'dent'          => ['parts' => [2500, 7000],  'labor' => [2000, 4500]],
            'severe'        => ['parts' => [7000, 22000], 'labor' => [4000, 12000]],
        ],
        'left_rear_door' => [
            'label' => 'Left Rear Door',
            'light_scratch' => ['parts' => [400,  1200],  'labor' => [700,  1500]],
            'dent'          => ['parts' => [1800, 5500],  'labor' => [1500, 3500]],
            'severe'        => ['parts' => [5000, 15000], 'labor' => [2500, 7000]],
        ],
        'right_rear_door' => [
            'label' => 'Right Rear Door',
            'light_scratch' => ['parts' => [400,  1200],  'labor' => [700,  1500]],
            'dent'          => ['parts' => [1800, 5500],  'labor' => [1500, 3500]],
            'severe'        => ['parts' => [5000, 15000], 'labor' => [2500, 7000]],
        ],
        'rear_windshield' => [
            'label' => 'Rear Windshield',
            'light_scratch' => ['parts' => [1500, 4000],  'labor' => [300,  500]],
            'dent'          => ['parts' => [4000, 10000], 'labor' => [300,  800]],
            'severe'        => ['parts' => [6000, 20000], 'labor' => [500,  1500]],
        ],
        'left_rear_fender' => [
            'label' => 'Left Rear Fender',
            'light_scratch' => ['parts' => [300,  1000],  'labor' => [600,  1500]],
            'dent'          => ['parts' => [1500, 4500],  'labor' => [1200, 3000]],
            'severe'        => ['parts' => [4500, 12000], 'labor' => [2000, 5500]],
        ],
        'right_rear_fender' => [
            'label' => 'Right Rear Fender',
            'light_scratch' => ['parts' => [300,  1000],  'labor' => [600,  1500]],
            'dent'          => ['parts' => [1500, 4500],  'labor' => [1200, 3000]],
            'severe'        => ['parts' => [4500, 12000], 'labor' => [2000, 5500]],
        ],
        'trunk' => [
            'label' => 'Trunk / Boot',
            'light_scratch' => ['parts' => [400,  1200],  'labor' => [700,  1500]],
            'dent'          => ['parts' => [1500, 5000],  'labor' => [1200, 3000]],
            'severe'        => ['parts' => [4500, 14000], 'labor' => [2000, 6000]],
        ],
        'rear_bumper' => [
            'label' => 'Rear Bumper',
            'light_scratch' => ['parts' => [300,  1000],  'labor' => [500,  1500]],
            'dent'          => ['parts' => [1000, 3500],  'labor' => [1200, 3000]],
            'severe'        => ['parts' => [3500, 10000], 'labor' => [2500, 6000]],
        ],
    ];

    /**
     * Auto-approve if total_min is below this threshold AND no severe damage
     * Edit this value to change the shop's auto-approval limit.
     */
    const AUTO_APPROVAL_THRESHOLD = 5000;

    /**
     * Calculate a price estimate from an array of damage markers.
     *
     * @param  array  $damageMarkers  e.g. [['area_id' => 'front_bumper', 'severity' => 'dent'], ...]
     * @return array  {items, total_min, total_max}
     */
    public static function calculate(array $damageMarkers): array
    {
        $items     = [];
        $totalMin  = 0;
        $totalMax  = 0;

        foreach ($damageMarkers as $marker) {
            $areaId   = $marker['area_id']  ?? null;
            $severity = $marker['severity'] ?? null;

            if (!$areaId || !$severity) continue;
            if (!isset(self::PRICE_TABLE[$areaId])) continue;
            if (!isset(self::PRICE_TABLE[$areaId][$severity])) continue;

            $area   = self::PRICE_TABLE[$areaId];
            $prices = $area[$severity];

            $partsMin  = $prices['parts'][0];
            $partsMax  = $prices['parts'][1];
            $laborMin  = $prices['labor'][0];
            $laborMax  = $prices['labor'][1];
            $subMin    = $partsMin + $laborMin;
            $subMax    = $partsMax + $laborMax;

            $items[] = [
                'area_id'      => $areaId,
                'area_label'   => $area['label'],
                'severity'     => $severity,
                'parts_min'    => $partsMin,
                'parts_max'    => $partsMax,
                'labor_min'    => $laborMin,
                'labor_max'    => $laborMax,
                'subtotal_min' => $subMin,
                'subtotal_max' => $subMax,
            ];

            $totalMin += $subMin;
            $totalMax += $subMax;
        }

        return [
            'items'     => $items,
            'total_min' => $totalMin,
            'total_max' => $totalMax,
        ];
    }

    /**
     * Determine if a request should be auto-approved.
     *
     * Rules:
     *  - No "severe" damage markers
     *  - total_min is below AUTO_APPROVAL_THRESHOLD
     *
     * @param  array  $damageMarkers
     * @param  array  $breakdown
     * @return bool
     */
    public static function shouldAutoApprove(array $damageMarkers, array $breakdown): bool
    {
        $hasSevere = collect($damageMarkers)->contains('severity', 'severe');
        if ($hasSevere) return false;
        if (($breakdown['total_min'] ?? 0) >= self::AUTO_APPROVAL_THRESHOLD) return false;
        return true;
    }
}
