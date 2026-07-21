<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Intake extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $casts = [
        'checklist' => 'array',
        'accessories' => 'array',
        'loose_items' => 'array',
        'damage_markers' => 'array',
        'mechanic_recommendations' => 'array',
    ];

    public function confirmedBy()
    {
        return $this->belongsTo(User::class, 'confirmed_by_id');
    }

    public function mechanic()
    {
        return $this->belongsTo(User::class, 'mechanic_id');
    }
}