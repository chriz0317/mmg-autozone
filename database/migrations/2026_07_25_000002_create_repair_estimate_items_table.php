<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('repair_estimate_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('repair_estimate_id')->constrained('repair_estimates')->cascadeOnDelete();
            
            $table->string('category'); // Parts, Body Works, Mechanical Works, Aircon Works, Painting
            $table->string('description')->nullable();
            $table->text('sub_text')->nullable(); // For sub-lists like "Straighten/Reform..."
            
            $table->decimal('parts_cost', 10, 2)->default(0);
            $table->decimal('labor_cost', 10, 2)->default(0);
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('repair_estimate_items');
    }
};
