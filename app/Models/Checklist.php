<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Checklist extends Model
{
    use HasFactory;

    // Allows mass assignment for all columns
    protected $guarded = [];

    // Tells Laravel to cast these specific columns to arrays automatically
    protected $casts = [
        'damage_markers' => 'array',
        'accessories' => 'array',
        'loose_items' => 'array',
        'remote_key_working' => 'boolean',
        'radio_off' => 'boolean',
        'horn' => 'boolean',
        'jack' => 'boolean',
        'tools' => 'boolean',
        'hub_caps' => 'boolean',
        'ewd' => 'boolean',
    ];
}