<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('repair_estimates', function (Blueprint $table) {
            $table->id();
            $table->string('estimate_no')->unique();
            $table->string('customer_name');
            $table->string('address')->nullable();
            $table->string('contact_no')->nullable();
            
            $table->string('insurance')->nullable();
            $table->string('reference_no')->nullable();
            $table->string('days_of_repair')->nullable();
            $table->string('prepared_by')->nullable();
            
            $table->string('vehicle_model')->nullable();
            $table->string('plate_no')->nullable();
            $table->string('color')->nullable();
            $table->string('frame_no')->nullable();
            
            $table->date('date')->nullable();
            
            $table->decimal('subtotal_parts', 10, 2)->default(0);
            $table->decimal('subtotal_labor', 10, 2)->default(0);
            
            $table->decimal('vat_percentage', 5, 2)->default(0);
            $table->decimal('vat_amount', 10, 2)->default(0);
            
            $table->decimal('deductible', 10, 2)->default(0);
            $table->decimal('depreciation', 10, 2)->default(0);
            
            $table->decimal('discount_amount', 10, 2)->default(0);
            $table->string('discount_notes')->nullable();
            
            $table->decimal('net_due', 12, 2)->default(0);
            $table->string('status')->default('Pending Approval'); // Draft, Pending Approval, Approved, Converted
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('repair_estimates');
    }
};
