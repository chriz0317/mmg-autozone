<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RepairEstimate extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $casts = [
        'date' => 'date',
    ];

    public function intake()
    {
        return $this->belongsTo(Intake::class);
    }

    public function items()
    {
        return $this->hasMany(RepairEstimateItem::class);
    }
}
