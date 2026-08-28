<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('service_requests', function (Blueprint $table) {
            $table->json('ai_estimate')->nullable()->after('photos');
            $table->timestamp('ai_analyzed_at')->nullable()->after('ai_estimate');
        });
    }

    public function down(): void
    {
        Schema::table('service_requests', function (Blueprint $table) {
            $table->dropColumn(['ai_estimate', 'ai_analyzed_at']);
        });
    }
};
