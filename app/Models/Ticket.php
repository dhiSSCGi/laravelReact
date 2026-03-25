<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
class Ticket extends Model
{
    use SoftDeletes;

    // app/Models/Ticket.php
    protected $fillable = [
        'user_id',
        'reimbursement_id',
        'date',
        'amount',
        'description',
        'proof_url',
        'proof_type',
        'proof_public_id',
    ];

    protected $casts = ['date' => 'date'];

    public function reimbursement()
    {
        return $this->belongsTo(Reimbursement::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}