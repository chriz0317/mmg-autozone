<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('intakes', function (Blueprint $table) {
            $table->string('address')->nullable()->after('customer');
            $table->date('due_date')->nullable()->after('contact_no');
            $table->string('color')->nullable()->after('plate_no');
            $table->string('received_by')->nullable()->after('color');
            $table->text('scope_of_works')->nullable()->after('notes');
        });
    }

    public function down(): void
    {
        Schema::table('intakes', function (Blueprint $table) {
            $table->dropColumn(['address', 'due_date', 'color', 'received_by', 'scope_of_works']);
        });
    }
};