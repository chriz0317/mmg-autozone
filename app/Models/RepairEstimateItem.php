<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RepairEstimateItem extends Model
{
    use HasFactory;

    protected $guarded = [];

    public function estimate()
    {
        return $this->belongsTo(RepairEstimate::class, 'repair_estimate_id');
    }

    public function getQtyAttribute()
    {
        return $this->category;
    }

    public function getUnitAttribute()
    {
        return $this->sub_text;
    }
}
