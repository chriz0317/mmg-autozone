<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('intakes', function (Blueprint $table) {
            $table->string('source')->default('Walk-In')->after('status');
        });

        Schema::table('repair_estimates', function (Blueprint $table) {
            $table->string('source')->default('Walk-In')->after('net_due');
        });

        Schema::table('transactions', function (Blueprint $table) {
            $table->string('source')->default('Walk-In')->after('total_amount');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('intakes', function (Blueprint $table) {
            $table->dropColumn('source');
        });

        Schema::table('repair_estimates', function (Blueprint $table) {
            $table->dropColumn('source');
        });

        Schema::table('transactions', function (Blueprint $table) {
            $table->dropColumn('source');
        });
    }
};
