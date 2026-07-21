<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'MMG Admin',
            'email' => 'admin@mmgautozone.com',
            'password' => Hash::make('mmgadmin2026'),
            'role' => 'admin',
        ]);

        User::create([
            'name' => 'MMG Staff',
            'email' => 'staff@mmgautozone.com',
            'password' => Hash::make('mmgstaff2026'),
            'role' => 'staff',
        ]);
    }
}

