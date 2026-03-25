<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Reimbursement;

class ReimbursementPolicy
{
    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Reimbursement $reimbursement): bool
    {
        return $user->id === $reimbursement->user_id;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Reimbursement $reimbursement): bool
    {
        return $user->id === $reimbursement->user_id;
    }
}