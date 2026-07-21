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
    Schema::create('checklists', function (Blueprint $table) {
        $table->id();
        $table->string('reference_number')->unique();
        
        $table->string('customer_name');
        $table->string('contact_number')->nullable();
        $table->text('address')->nullable();
        $table->date('date_received')->nullable();
        $table->date('due_date')->nullable();
        $table->string('received_by')->nullable();
        
        $table->string('vehicle_type');
        $table->string('plate_number');
        $table->string('color')->nullable();
        $table->integer('mileage')->nullable();
        
        $table->text('scope_of_works')->nullable();
        
        $table->json('damage_markers')->nullable();
        
        $table->string('fuel_level')->default('1/2');
        $table->string('tire_brand_model')->nullable();
        $table->string('tire_inflation')->nullable();
        $table->boolean('remote_key_working')->default(false);
        $table->boolean('radio_off')->default(false);
        $table->boolean('horn')->default(false);
        
        $table->string('exterior_lights')->nullable();
        $table->string('interior_lights')->nullable();
        $table->string('indicator_lamp')->nullable();
        $table->string('power_windows')->nullable();
        $table->string('central_lock')->nullable();
        $table->string('window_tints')->nullable();
        $table->string('side_mirrors')->nullable();
        $table->string('front_bumper_sensor')->nullable();
        $table->string('rear_bumper_sensor')->nullable();
        
        $table->string('upholstery_clean')->nullable();
        $table->string('headlining_check')->nullable();
        $table->string('matting')->nullable();
        
        $table->string('windshield_crack_check')->nullable();
        $table->string('windshield_washer')->nullable();
        $table->string('wipers')->nullable();
        $table->string('hood_trunk_backdoor')->nullable();
        
        $table->string('spare_tire_brand')->nullable();
        $table->boolean('jack')->default(false);
        $table->boolean('tools')->default(false);
        $table->boolean('hub_caps')->default(false);
        $table->boolean('ewd')->default(false);
        $table->string('oil_water_level')->nullable();
        
        $table->json('accessories')->nullable();
        $table->json('loose_items')->nullable();
        
        $table->string('mode_of_payment')->nullable();
        $table->text('notes')->nullable();
        
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('checklists');
    }
};
