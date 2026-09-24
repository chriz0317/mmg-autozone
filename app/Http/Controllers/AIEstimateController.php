<?php

namespace App\Http\Controllers;

use App\Models\ServiceRequest;
use App\Models\RepairEstimateItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AIEstimateController extends Controller
{
    /**
     * Run RAG-powered AI analysis on a photo estimate service request.
     * Called automatically from ServiceRequestController::store() after saving.
     * Can also be called manually from admin panel to re-run.
     */
    public function analyze(ServiceRequest $serviceRequest)
    {
        try {
            $result = $this->runAnalysis($serviceRequest);

            $serviceRequest->update([
                'ai_estimate'    => $result,
                'ai_analyzed_at' => now(),
            ]);

            return response()->json(['success' => true, 'ai_estimate' => $result]);
        } catch (\Throwable $e) {
            Log::error('AI Estimate failed: ' . $e->getMessage());
            return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Core RAG logic — runs the full Retrieve → Augment → Generate pipeline.
     * Returns a structured array or throws on failure.
     */
    public function runAnalysis(ServiceRequest $serviceRequest): array
    {
        // ─────────────────────────────────────────────
        // STEP 1: RETRIEVE — Query historical pricing
        // ─────────────────────────────────────────────
        $description = strtolower($serviceRequest->issue_description ?? '');
        $areas       = $serviceRequest->areas ?? [];

        // Build a list of damage keywords from the customer's description + areas
        $damageKeywords = $this->extractKeywords($description, $areas);

        // Query repair_estimate_items for items matching those keywords
        $historicalData = [];
        if (!empty($damageKeywords)) {
            $query = RepairEstimateItem::query();
            foreach ($damageKeywords as $keyword) {
                $query->orWhere('description', 'ILIKE', "%{$keyword}%");
            }
            $items = $query->get();

            // Group by keyword and compute averages
            foreach ($damageKeywords as $keyword) {
                $matching = $items->filter(fn($i) => stripos($i->description, $keyword) !== false);
                if ($matching->count() > 0) {
                    $historicalData[] = [
                        'keyword'    => $keyword,
                        'avg_parts'  => round($matching->avg('parts_cost'), 2),
                        'avg_labor'  => round($matching->avg('labor_cost'), 2),
                        'job_count'  => $matching->count(),
                    ];
                }
            }
        }

        // ─────────────────────────────────────────────
        // STEP 2: AUGMENT — Build the AI prompt
        // ─────────────────────────────────────────────
        $historicalContext = '';
        if (!empty($historicalData)) {
            $historicalContext = "\n\nHere are REAL historical repair prices from this specific auto shop's past jobs (use these as your primary pricing reference):\n";
            foreach ($historicalData as $h) {
                $historicalContext .= "- {$h['keyword']}: avg parts ₱{$h['avg_parts']}, avg labor ₱{$h['avg_labor']} (based on {$h['job_count']} past job/s)\n";
            }
        } else {
            $historicalContext = "\n\nNote: No historical pricing data found for this damage type yet. Use general Philippine auto repair market rates as reference.";
        }

        $prompt = "You are an expert auto repair estimator for MMG Autozone, an auto repair shop in the Philippines. Analyze the damage in the provided photos and generate a cost estimate.

Customer Vehicle: {$serviceRequest->vehicle_model}" . ($serviceRequest->plate_no ? " ({$serviceRequest->plate_no})" : "") . "
Customer Description: " . ($serviceRequest->issue_description ?? 'No description provided') . ($serviceRequest->additional_notes ? "\nAdditional Notes: {$serviceRequest->additional_notes}" : "") . "
{$historicalContext}

Instructions:
1. Carefully examine the photos for all visible damage.
2. Use the historical shop prices above as your primary pricing reference. If no historical data is available, use fair Philippine market rates.
3. All prices must be in Philippine Peso (₱).
4. Return ONLY a valid JSON object with this exact structure (no markdown, no explanation text outside the JSON):

{
  \"damage_summary\": \"A 2-3 sentence plain English description of the damage you see in the photos.\",
  \"confidence\": \"High | Medium | Low\",
  \"confidence_note\": \"Brief reason for the confidence level.\",
  \"suggested_items\": [
    {
      \"description\": \"Item name\",
      \"parts_cost\": 0,
      \"labor_cost\": 0,
      \"subtotal\": 0
    }
  ],
  \"total_min\": 0,
  \"total_max\": 0,
  \"disclaimer\": \"This is a preliminary AI-generated estimate based on photo analysis and historical shop data. The final cost will be confirmed after a physical inspection at MMG Autozone.\"
}";

        // ─────────────────────────────────────────────
        // STEP 3: GENERATE — Call Gemini Flash API
        // ─────────────────────────────────────────────
        $apiKey = config('services.gemini.api_key');
        if (!$apiKey) {
            throw new \Exception('GEMINI_API_KEY is not configured.');
        }

        // Build the content parts — text prompt + inline image URLs
        $parts = [['text' => $prompt]];

        $photos = $serviceRequest->photos ?? [];
        foreach (array_slice($photos, 0, 4) as $photoUrl) {
            try {
                $imageContent = null;
                
                // If it's a local asset URL, convert to local path (prevents local dev server HTTP hangs)
                if (str_starts_with($photoUrl, asset(''))) {
                    $relativePath = str_replace(asset(''), '', $photoUrl);
                    $localPath = public_path($relativePath);
                    if (file_exists($localPath)) {
                        $imageContent = file_get_contents($localPath);
                    }
                }
                
                // If not local or file_get_contents failed, try HTTP request
                if (!$imageContent) {
                    $imageResponse = Http::timeout(10)->get($photoUrl);
                    if ($imageResponse->successful()) {
                        $imageContent = $imageResponse->body();
                    }
                }

                if ($imageContent) {
                    $ext = strtolower(pathinfo(parse_url($photoUrl, PHP_URL_PATH), PATHINFO_EXTENSION));
                    $mimeType = match($ext) {
                        'png' => 'image/png',
                        'webp' => 'image/webp',
                        'heic' => 'image/heic',
                        'heif' => 'image/heif',
                        default => 'image/jpeg',
                    };

                    $parts[] = [
                        'inlineData' => [
                            'mimeType' => $mimeType,
                            'data'  => base64_encode($imageContent),
                        ]
                    ];
                }
            } catch (\Exception $e) {
                \Illuminate\Support\Facades\Log::warning("Failed to load photo for AI estimate: {$photoUrl}. Error: " . $e->getMessage());
            }
        }

        $response = Http::timeout(30)->post(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key={$apiKey}",
            [
                'contents' => [
                    ['parts' => $parts]
                ],
                'generationConfig' => [
                    'temperature'      => 0.3,
                    'maxOutputTokens'  => 4096,
                    'responseMimeType' => 'application/json',
                ]
            ]
        );

        if (!$response->successful()) {
            throw new \Exception('Gemini API error: ' . $response->body());
        }

        $text = $response->json('candidates.0.content.parts.0.text') ?? '';

        // Strip markdown code fences if present
        $text = preg_replace('/^```json\s*|\s*```$/m', '', trim($text));

        $parsed = json_decode($text, true);

        if (!$parsed || !isset($parsed['suggested_items'])) {
            throw new \Exception('Could not parse Gemini response as valid JSON. Raw: ' . substr($text, 0, 500));
        }

        return $parsed;
    }

    /**
     * Extract meaningful damage keywords from the customer's description and selected areas.
     */
    private function extractKeywords(string $description, array $areas): array
    {
        $allKeywords = [
            'bumper', 'fender', 'hood', 'door', 'panel', 'roof', 'trunk', 'windshield',
            'headlight', 'tail light', 'mirror', 'tire', 'wheel', 'rim', 'paint', 'repaint',
            'scratch', 'dent', 'crack', 'engine', 'brake', 'suspension', 'frame', 'body',
            'side skirt', 'spoiler', 'grille', 'radiator', 'bumper cover', 'quarter panel',
        ];

        $found = [];

        foreach ($allKeywords as $keyword) {
            if (stripos($description, $keyword) !== false) {
                $found[] = $keyword;
            }
        }

        // Also add the areas the customer explicitly selected
        foreach ($areas as $area) {
            $normalized = strtolower(trim($area));
            if (!in_array($normalized, $found)) {
                $found[] = $normalized;
            }
        }

        return array_unique($found);
    }
}
