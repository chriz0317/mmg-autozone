<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('intakes', function (Blueprint $table) {
            $table->unsignedBigInteger('estimate_id')->nullable()->after('id');
            $table->foreign('estimate_id')->references('id')->on('service_requests')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::table('intakes', function (Blueprint $table) {
            $table->dropForeign(['estimate_id']);
            $table->dropColumn('estimate_id');
        });
    }
};
