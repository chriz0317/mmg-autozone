<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ServiceMaterial extends Model
{
    use HasFactory;

    protected $fillable = [
        'service_id',
        'inventory_item_id',
        'quantity_required',
    ];

    public function inventoryItem()
    {
        return $this->belongsTo(InventoryItem::class, 'inventory_item_id');
    }
}
