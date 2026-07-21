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
        Schema::rename('estimates', 'service_requests');

        Schema::table('service_requests', function (Blueprint $table) {
            $table->string('service_type')->default('photo_estimate')->after('user_id'); // 'photo_estimate', 'repair', 'repaint'
            
            // Allow user_id to be nullable for guests if needed, or just keep it required if we enforce login.
            // In our case, the UI might be accessible to guests, so let's make user_id nullable.
            $table->foreignId('user_id')->nullable()->change();

            // Contact Info for guests or override
            $table->string('name')->nullable()->after('service_type');
            $table->string('contact_no')->nullable()->after('name');
            $table->string('email')->nullable()->after('contact_no');

            // Additional fields for repair/repaint
            $table->json('areas')->nullable()->after('photos');
            $table->string('color_preference')->nullable()->after('areas');
            $table->text('additional_notes')->nullable()->after('color_preference');
            
            // preferred_date
            $table->date('preferred_date')->nullable()->after('appointment_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('service_requests', function (Blueprint $table) {
            $table->dropColumn([
                'service_type',
                'name',
                'contact_no',
                'email',
                'areas',
                'color_preference',
                'additional_notes',
                'preferred_date'
            ]);
            
            $table->foreignId('user_id')->nullable(false)->change();
        });

        Schema::rename('service_requests', 'estimates');
    }
};
