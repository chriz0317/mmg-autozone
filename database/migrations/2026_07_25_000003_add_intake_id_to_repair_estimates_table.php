<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('repair_estimates', function (Blueprint $table) {
            $table->foreignId('intake_id')->nullable()->constrained('intakes')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('repair_estimates', function (Blueprint $table) {
            $table->dropForeign(['intake_id']);
            $table->dropColumn('intake_id');
        });
    }
};
