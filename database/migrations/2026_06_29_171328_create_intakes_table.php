<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('intakes', function (Blueprint $table) {
            $table->id();
            $table->string('reference_number')->unique();
            $table->string('customer')->nullable();
            $table->string('vehicle')->nullable();
            $table->string('plate_no')->nullable();
            
            // We use JSON columns here to easily store the S, D, C markers from your React map
            $table->json('damage_markers')->nullable();
            $table->integer('fuel_level')->default(2);
            $table->decimal('amount_to_pay', 10, 2)->nullable();
            $table->json('checklist')->nullable();
            $table->json('accessories')->nullable();
            $table->json('loose_items')->nullable();
            $table->text('notes')->nullable();
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('intakes');
    }
};