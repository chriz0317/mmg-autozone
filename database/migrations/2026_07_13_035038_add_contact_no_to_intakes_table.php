<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('intakes', function (Blueprint $table) {
            // Adds the contact_no column right after the address column
            $table->string('contact_no')->nullable()->after('address');
        });
    }

    public function down(): void
    {
        Schema::table('intakes', function (Blueprint $table) {
            $table->dropColumn('contact_no');
        });
    }
};