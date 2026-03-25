<?php

namespace App\Http\Controllers;

use App\Models\Reimbursement;
use App\Models\Ticket;
use Carbon\Carbon;
use Cloudinary\Cloudinary;
use Cloudinary\Configuration\Configuration;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;

class TicketController extends Controller
{
    private function cloudinary(): Cloudinary
    {
        $url = sprintf(
            'cloudinary://%s:%s@%s',
            env('CLOUDINARY_API_KEY'),
            env('CLOUDINARY_API_SECRET'),
            env('CLOUDINARY_CLOUD_NAME')
        );

        Configuration::instance($url);

        return new Cloudinary();
    }

    public function index()
    {
        $reimbursements = Reimbursement::with('tickets')
            ->where('user_id', auth()->id())
            ->has('tickets')
            ->orderByDesc('week_start')
            ->get()
            ->map(function ($r) {
                return [
                    'id'           => $r->id,
                    'week_start'   => $r->week_start->toDateString(),
                    'week_end'     => $r->week_end->toDateString(),
                    'status'       => $r->status,
                    'total_amount' => $r->total_amount,
                    'tickets'      => $r->tickets->map(fn($t) => [
                        'id'          => $t->id,
                        'date'        => $t->date->toDateString(),
                        'amount'      => $t->amount,
                        'description' => $t->description,
                        'proof_url'   => $t->proof_url,       // full Cloudinary URL
                        'proof_type'  => $t->proof_type,      // 'pdf' | 'image' | null
                    ]),
                ];
            });

        return Inertia::render('dashboard', compact('reimbursements'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'date'        => 'required|date',
            'amount'      => 'required|numeric|min:0',
            'description' => 'required|string',
            'proof_file'  => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:5120',
        ]);

        $date      = Carbon::parse($validated['date']);
        $weekStart = $date->copy()->startOfWeek(Carbon::MONDAY)->toDateString();
        $weekEnd   = $date->copy()->endOfWeek(Carbon::SUNDAY)->toDateString();

        $reimbursement = Reimbursement::firstOrCreate(
            ['user_id' => auth()->id(), 'week_start' => $weekStart],
            ['week_end' => $weekEnd, 'status' => 'pending']
        );

        $proofUrl  = null;
        $proofType = null;
        $publicId  = null;

        if ($request->hasFile('proof_file')) {
            $file         = $request->file('proof_file');
            $ext          = strtolower($file->getClientOriginalExtension());
            $proofType    = $ext === 'pdf' ? 'pdf' : 'image';
            $resourceType = $ext === 'pdf' ? 'raw' : 'image';

            $result = $this->cloudinary()
                ->uploadApi()
                ->upload($file->getRealPath(), [
                    'folder'        => 'reimbursements',
                    'resource_type' => $resourceType,
                ]);

            $proofUrl = $result['secure_url'];
            $publicId = $result['public_id'];
        }

        Ticket::create([
            'user_id'          => auth()->id(),
            'reimbursement_id' => $reimbursement->id,
            'date'             => $validated['date'],
            'amount'           => $validated['amount'],
            'description'      => $validated['description'],
            'proof_url'        => $proofUrl,
            'proof_type'       => $proofType,
            'proof_public_id'  => $publicId,
        ]);

        return redirect()->back()->with('success', 'Ticket added.');
    }

    public function destroy(Ticket $ticket)
    {
        abort_if($ticket->user_id !== auth()->id(), 403);

        if ($ticket->proof_public_id) {
            $resourceType = $ticket->proof_type === 'pdf' ? 'raw' : 'image';
            $this->cloudinary()
                ->uploadApi()
                ->destroy($ticket->proof_public_id, ['resource_type' => $resourceType]);
        }

        $reimbursement = $ticket->reimbursement;
        $ticket->delete();

        if ($reimbursement->tickets()->count() === 0) {
            $reimbursement->delete();
        }

        return redirect()->back()->with('success', 'Ticket deleted.');
    }

    // public function generateForm(Reimbursement $reimbursement)
    // {
    //     abort_if($reimbursement->user_id !== auth()->id(), 403);
    //     $reimbursement->load('tickets', 'user');

    //     return view('reimbursement-form', compact('reimbursement'));
    // }
    public function generateForm(Reimbursement $reimbursement)
    {
        abort_if($reimbursement->user_id !== auth()->id(), 403);

        $reimbursement->load('tickets', 'user');

        $pdf = Pdf::loadView('reimbursement-form', compact('reimbursement'))
            ->setOptions([
                'isHtml5ParserEnabled' => true,
                'isRemoteEnabled' => true,
            ])
            ->setPaper('a4', 'portrait');
        return $pdf->download('reimbursement-form.pdf'); // download
    }
}