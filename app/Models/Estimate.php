<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Estimate extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'vehicle_model',
        'plate_no',
        'issue_description',
        'photos',
        'estimated_cost',
        'admin_remarks',
        'status',
        'appointment_date',
    ];

    protected $casts = [
        'photos' => 'array',
        'appointment_date' => 'datetime',
        'estimated_cost' => 'decimal:2',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
