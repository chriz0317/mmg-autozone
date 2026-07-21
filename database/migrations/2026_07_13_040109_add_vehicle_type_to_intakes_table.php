<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('intakes', function (Blueprint $table) {
            // Adds the vehicle_type column so the PDF knows which map to load later
            $table->string('vehicle_type')->nullable()->after('damage_markers');
        });
    }

    public function down(): void
    {
        Schema::table('intakes', function (Blueprint $table) {
            $table->dropColumn('vehicle_type');
        });
    }
};