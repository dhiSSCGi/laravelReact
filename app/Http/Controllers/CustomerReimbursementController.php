<?php

namespace App\Http\Controllers;

use App\Models\Reimbursement;
use App\Models\Ticket;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Barryvdh\DomPDF\Facade\Pdf;

class CustomerReimbursementController extends Controller
{
    public function index()
    {
        $reimbursements = Auth::user()->reimbursements()->latest()->get();

        return inertia('Customer/Reimbursements/Index', [
            'reimbursements' => $reimbursements,
        ]);
    }

    public function create()
    {
        return inertia('Customer/Reimbursements/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'ticket_date' => 'required|date',
            'amount' => 'required|numeric|min:0',
            'description' => 'required|string|max:1000',
            'proof_file' => 'required|file|mimes:pdf,jpg,jpeg,png|max:2048',
        ]);

        $filePath = $request->file('proof_file')->store('tickets', 'public');

        Ticket::create([
            'user_id' => Auth::id(),
            'ticket_date' => $request->ticket_date,
            'amount' => $request->amount,
            'description' => $request->description,
            'proof_file' => $filePath,
        ]);

        return redirect()->route('dashboard')->with('success', 'Ticket added for the week successfully.');
    }

    public function show(Reimbursement $reimbursement)
    {
        $this->authorize('view', $reimbursement);

        return inertia('Customer/Reimbursements/Show', [
            'reimbursement' => $reimbursement->load('user'),
        ]);
    }

    public function downloadTemplate()
    {
        $templatePath = storage_path('app/templates/reimbursement_form.docx');

        if (!file_exists($templatePath)) {
            abort(404, 'Template not found.');
        }

        return response()->download($templatePath, 'Transportation_Reimbursement_Form.docx');
    }

    public function generateWeeklyFromTickets($weekStart)
    {
        $week = Carbon::parse($weekStart)->startOfWeek(Carbon::MONDAY);
        $weekEnd = (clone $week)->endOfWeek(Carbon::SUNDAY);

        if ($weekEnd->isFuture()) {
            abort(403, 'Cannot generate form for a week that is not completed.');
        }

        $tickets = Auth::user()->tickets()
            ->whereBetween('ticket_date', [$week->toDateString(), $weekEnd->toDateString()])
            ->get();

        if ($tickets->isEmpty()) {
            return redirect()->route('dashboard')->with('error', 'No tickets found for this week.');
        }

        $reimbursement = Reimbursement::firstOrCreate(
            [
                'user_id' => Auth::id(),
                'week_date' => $week,
            ],
            [
                'amount' => $tickets->sum('amount'),
                'description' => 'Weekly reimbursement for ' . $week->format('M d, Y'),
                'proof_files' => $tickets->pluck('proof_file')->toArray(),
                'status' => 'pending',
                'submitted_at' => now(),
            ]
        );

        $tickets->each->update(['included_in_reimbursement' => true]);

        $pdf = Pdf::loadView('reimbursement-form', compact('reimbursement'));

        return $pdf->download('reimbursement_form_' . $week->format('Y_m_d') . '.pdf');
    }

    public function generateForm(Reimbursement $reimbursement)
    {
        $this->authorize('view', $reimbursement);

        // Check if week is past (Mon-Fri completed)
        $weekEnd = $reimbursement->week_date->copy()->addDays(7);
        if ($weekEnd->isFuture()) {
            abort(403, 'Cannot generate form until the week is complete.');
        }

        $pdf = Pdf::loadView('reimbursement-form', compact('reimbursement'));
        return $pdf->download('reimbursement_form_' . $reimbursement->id . '.pdf');
    }
}