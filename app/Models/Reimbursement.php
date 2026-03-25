<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;


class Reimbursement extends Model
{
    use SoftDeletes;
    protected $fillable = ['user_id', 'week_start', 'week_end', 'status'];

    protected $casts = [
        'week_start' => 'date',
        'week_end'   => 'date',
    ];

    public function tickets()
    {
        return $this->hasMany(Ticket::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function getTotalAmountAttribute(): float
    {
        return $this->tickets->sum('amount');
    }
}