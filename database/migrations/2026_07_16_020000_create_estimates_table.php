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
        Schema::create('estimates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('vehicle_model');
            $table->string('plate_no');
            $table->text('issue_description');
            $table->json('photos')->nullable();
            
            // Admin feedback fields
            $table->decimal('estimated_cost', 10, 2)->nullable();
            $table->text('admin_remarks')->nullable();
            
            // Status and appointment
            $table->enum('status', ['Pending', 'Reviewed', 'Approved', 'Rejected'])->default('Pending');
            $table->dateTime('appointment_date')->nullable();
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('estimates');
    }
};
