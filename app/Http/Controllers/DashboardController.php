<?php

namespace App\Http\Controllers;

use App\Models\Reimbursement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index()
    {
        $reimbursements = Auth::user()->reimbursements()->orderByDesc('week_date')->get();

        return inertia('dashboard', ['reimbursements' => $reimbursements]);
    }
}