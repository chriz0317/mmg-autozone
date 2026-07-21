<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('contact_no')->nullable()->after('email');
            $table->string('address')->nullable()->after('contact_no');
            // Update the default role to allow 'customer'
            $table->string('role')->default('customer')->change();
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['contact_no', 'address']);
            $table->string('role')->default('staff')->change();
        });
    }
};
