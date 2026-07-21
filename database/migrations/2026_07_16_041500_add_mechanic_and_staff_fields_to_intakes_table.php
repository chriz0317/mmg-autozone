<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('intakes', function (Blueprint $table) {
            $table->string('car_year')->nullable()->after('plate_no');
            $table->text('complaints')->nullable()->after('car_year');
            $table->json('mechanic_recommendations')->nullable()->after('complaints');
            
            $table->unsignedBigInteger('confirmed_by_id')->nullable()->after('status');
            $table->unsignedBigInteger('mechanic_id')->nullable()->after('confirmed_by_id');

            $table->foreign('confirmed_by_id')->references('id')->on('users')->onDelete('set null');
            $table->foreign('mechanic_id')->references('id')->on('users')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::table('intakes', function (Blueprint $table) {
            $table->dropForeign(['confirmed_by_id']);
            $table->dropForeign(['mechanic_id']);
            $table->dropColumn([
                'car_year', 
                'complaints', 
                'mechanic_recommendations', 
                'confirmed_by_id', 
                'mechanic_id'
            ]);
        });
    }
};
