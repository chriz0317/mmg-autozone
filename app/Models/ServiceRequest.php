<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ServiceRequest extends Model
{
    use HasFactory;

    // Explicitly define the table if it was renamed, though Laravel usually guesses correctly 
    // based on 'ServiceRequest' -> 'service_requests'
    protected $table = 'service_requests';

    protected $fillable = [
        'user_id',
        'service_type', // photo_estimate, repair, repaint
        'name',
        'contact_no',
        'email',
        'vehicle_model',
        'plate_no',
        'issue_description',
        'photos',
        'areas',
        'color_preference',
        'additional_notes',
        'estimated_cost',
        'admin_remarks',
        'status',
        'appointment_date',
        'preferred_date',
    ];

    protected $casts = [
        'photos' => 'array',
        'areas' => 'array',
        'appointment_date' => 'datetime',
        'preferred_date' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function intake()
    {
        return $this->hasOne(Intake::class, 'estimate_id');
    }

    public function repairEstimate()
    {
        return $this->hasOne(RepairEstimate::class, 'service_request_id');
    }
}
