<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TransactionItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'transaction_id',
        'item_type',
        'item_id',
        'item_name',
        'quantity',
        'unit_price',
        'subtotal',
    ];

    public function transaction()
    {
        return $this->belongsTo(Transaction::class);
    }
}
