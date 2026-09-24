<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('service_requests', function (Blueprint $table) {
            // Stores array of {area_id, area_label, severity} from the interactive car diagram
            $table->json('damage_markers')->nullable()->after('ai_estimate');
            // Stores the rule-based price breakdown {items, total_min, total_max}
            $table->json('estimate_breakdown')->nullable()->after('damage_markers');
            // Whether this was auto-approved by the smart approval system
            $table->boolean('auto_approved')->default(false)->after('estimate_breakdown');
        });
    }

    public function down(): void
    {
        Schema::table('service_requests', function (Blueprint $table) {
            $table->dropColumn(['damage_markers', 'estimate_breakdown', 'auto_approved']);
        });
    }
};
