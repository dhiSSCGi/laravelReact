<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Transportation Reimbursement Form</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
            font-family: Arial, sans-serif;
            font-size: 11px;
            color: #000;
            background: #fff;
            padding: 30px 40px;
        }

        .page-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 24px;
        }
        .logo img { width: 72px; height: auto; }
        .doc-number { font-size: 10px; text-align: right; padding-top: 4px; }

        .form-title {
            text-align: center;
            font-size: 13px;
            font-weight: bold;
            letter-spacing: 0.5px;
            margin-bottom: 10px;
        }

        table.main { width: 100%; border-collapse: collapse; }
        table.main td, table.main th {
            border: 1px solid #000;
            padding: 4px 6px;
            vertical-align: middle;
            font-size: 11px;
        }

        .section-header td {
            background-color: #d9d9d9;
            font-weight: bold;
            text-align: center;
            font-size: 11px;
            letter-spacing: 0.3px;
        }

        .label-cell {
            text-align: right;
            white-space: nowrap;
            font-weight: normal;
            width: 1%;
        }

        .fare-header th {
            background-color: #fff;
            font-weight: bold;
            text-align: center;
            font-size: 11px;
            vertical-align: middle;
        }

        .fare-row td { height: 22px; }
        .sig-line { min-height: 28px; height: 28px; }

        .page-footer {
            margin-top: 20px;
            font-size: 9px;
            font-style: italic;
            color: #555;
        }

        /* ── Proof section ── */
        .proofs-section {
            margin-top: 30px;
            page-break-before: always;
        }
        .proofs-section h2 {
            font-size: 12px;
            font-weight: bold;
            margin-bottom: 6px;
            text-align: center;
            letter-spacing: 0.3px;
        }
        .proofs-meta {
            text-align: center;
            font-size: 10px;
            margin-bottom: 14px;
            color: #555;
        }

        /* 2-column grid */
        .proof-grid {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 12px;
        }

        /* Force new page every 6 proofs (3 rows of 2) */
        .proof-page-break {
            page-break-before: always;
            grid-column: 1 / -1;
            margin: 0;
            padding: 0;
            height: 0;
            border: none;
        }

        .proof-item {
            border: 1px solid #ccc;
            padding: 8px;
            page-break-inside: avoid;
            overflow: hidden;
            height: 320px;        /* fixed height so all cards are equal */
        }

        .proof-item img {
            width: 100%;
            height: 270px;        /* taller image area */
            object-fit: contain;
            display: block;
            background: #f9f9f9;
        }
        .proof-item .proof-meta {
            font-size: 10px;
            margin-bottom: 6px;
            line-height: 1.5;
        }
       
        .pdf-note {
            font-style: italic;
            color: #555;
            font-size: 10px;
            margin-top: 4px;
        }

        @media print {
            body { padding: 15px 20px; }
            .proofs-section { page-break-before: always; }
        }
    </style>
</head>
<body>

    @php
        $logoPath   = public_path('images/sscgi_logo.png');
        $logoBase64 = file_exists($logoPath)
            ? 'data:image/png;base64,' . base64_encode(file_get_contents($logoPath))
            : null;
        $ticketCount = $reimbursement->tickets->count();
        $minRows     = max($ticketCount, 3); // at least 3 rows in fare table
    @endphp

    {{-- Page Header --}}
    <div class="page-header">
        <div class="logo">
            @if($logoBase64)
                <img src="{{ $logoBase64 }}" alt="Company Logo">
            @endif
        </div>
        <div class="doc-number">HRD-TRF-{{ now()->format('Y') }}-</div>
    </div>

    <div class="form-title">TRANSPORTATION REIMBURSEMENT FORM</div>

    <table class="main">

        {{-- EMPLOYEE INFORMATION --}}
        <tr class="section-header"><td colspan="6">EMPLOYEE INFORMATION</td></tr>
        <tr>
            <td class="label-cell" style="width:12%">Name:</td>
            <td class="value-cell" colspan="2" style="width:28%">{{ $reimbursement->user->name }}</td>
            <td class="label-cell" style="width:14%">Department/<br>Section:</td>
            <td class="value-cell" colspan="2">{{ $reimbursement->user->department }}</td>
        </tr>
        <tr>
            <td class="label-cell">Employee ID:</td>
            <td class="value-cell" colspan="2">{{ $reimbursement->user->employee_id ?? '' }}</td>
            <td class="label-cell">Supervisor:</td>
            <td class="value-cell" colspan="2">{{ $reimbursement->user->supervisor }}</td>
        </tr>

        {{-- TRIP DETAILS --}}
        <tr class="section-header"><td colspan="6">TRIP DETAILS</td></tr>
        <tr>
            <td class="label-cell">Travel Date:</td>
            <td class="value-cell" colspan="2">
                {{ $reimbursement->week_start->format('M d') }} – {{ $reimbursement->week_end->format('M d, Y') }}
            </td>
            <td class="label-cell">Purpose of Travel:</td>
            <td class="value-cell" colspan="2"></td>
        </tr>
        <tr>
            <td class="label-cell">Origin:</td>
            <td class="value-cell" colspan="2"></td>
            <td class="label-cell">Destination:</td>
            <td class="value-cell" colspan="2"></td>
        </tr>
        <tr>
            <td class="label-cell" style="text-align:right">Cost Center /<br>Project Name /<br>Client Name:</td>
            <td class="value-cell" colspan="5"></td>
        </tr>

        {{-- FARE BREAKDOWN — all tickets, min 3 rows --}}
        <tr class="section-header"><td colspan="6">FARE BREAKDOWN</td></tr>
        <tr class="fare-header">
            <th style="width:14%">Date</th>
            <th style="width:14%">From</th>
            <th style="width:14%">To</th>
            <th style="width:24%">Mode of Transport</th>
            <th style="width:14%">Distance (KM)</th>
            <th style="width:20%">Amount (Php)</th>
        </tr>
        @foreach($reimbursement->tickets as $ticket)
        <tr class="fare-row">
            <td style="text-align:center">{{ $ticket->date->format('m/d/Y') }}</td>
            <td></td>
            <td></td>
            <td style="text-align:center">{{ $ticket->description }}</td>
            <td style="text-align:center"></td>
            <td style="text-align:right">{{ number_format($ticket->amount, 2) }}</td>
        </tr>
        @endforeach
        {{-- Pad to minimum 3 rows --}}
        @for($i = $ticketCount; $i < 3; $i++)
        <tr class="fare-row">
            <td>&nbsp;</td><td></td><td></td><td></td><td></td><td></td>
        </tr>
        @endfor

        {{-- REIMBURSEMENT SUMMARY --}}
        <tr class="section-header"><td colspan="6">REIMBURSEMENT SUMMARY</td></tr>
        <tr>
            <td class="label-cell">Total Distance<br>(KM):</td>
            <td class="value-cell" colspan="2"></td>
            <td class="label-cell">Reimbursable<br>Amount:</td>
            <td class="value-cell" colspan="2" style="font-weight:bold">
                ₱{{ number_format($reimbursement->total_amount, 2) }}
            </td>
        </tr>
        <tr>
            <td class="label-cell">Base Fare Covered:</td>
            <td class="value-cell" colspan="2"></td>
            <td colspan="3"></td>
        </tr>

        {{-- Supporting Documents --}}
        <tr>
            <td rowspan="5" colspan="3" style="vertical-align:top; padding-top:8px;">
                <strong>Supporting Documents:</strong><br>
                <span style="font-size:10px">*Select all that apply</span>
            </td>
            <td>[✔]</td>
            <td colspan="2">Original Receipts / Electronic Proof of Payment</td>
        </tr>
        <tr>
            <td>[&nbsp;&nbsp;]</td>
            <td colspan="2">Customer Service Report (CSR) signed by client</td>
        </tr>
        <tr>
            <td>[&nbsp;&nbsp;]</td>
            <td colspan="2">Supervisor's Approval (if required)</td>
        </tr>
        <tr>
            <td>[&nbsp;&nbsp;]</td>
            <td colspan="2">Meeting Invite / Minutes of Meeting (if applicable)</td>
        </tr>
        <tr>
            <td>[&nbsp;&nbsp;]</td>
            <td colspan="2">Others (specify):_______________</td>
        </tr>

        {{-- EMPLOYEE CERTIFICATION --}}
        <tr class="section-header"><td colspan="6">EMPLOYEE CERTIFICATION</td></tr>
        <tr>
            <td colspan="6" style="padding:6px 8px; font-size:10px; line-height:1.5">
                I hereby certify that the above expenses were incurred for official business purposes
                and that the information provided is accurate.
            </td>
        </tr>
        <tr class="sig-line">
            <td class="label-cell">Signature:</td>
            <td colspan="3"></td>
            <td class="label-cell">Date:</td>
            <td></td>
        </tr>

        {{-- SUPERVISOR APPROVAL --}}
        <tr class="section-header"><td colspan="6">SUPERVISOR APPROVAL AND CERTIFICATION</td></tr>
        <tr>
            <td colspan="6" style="padding:6px 8px; font-size:10px; line-height:1.5">
                I certify that I have reviewed this request, and the travel was necessary for official business purposes.
            </td>
        </tr>
        <tr class="sig-line">
            <td class="label-cell">Signature:</td>
            <td colspan="3"></td>
            <td class="label-cell">Date:</td>
            <td></td>
        </tr>

        {{-- FOR HR / FINANCE USE --}}
        <tr>
            <td colspan="3" style="text-align:center; font-weight:bold; background:#d9d9d9">FOR HR Use Only</td>
            <td colspan="3" style="text-align:center; font-weight:bold; background:#d9d9d9">FOR Finance Use Only</td>
        </tr>
        <tr>
            <td class="label-cell" style="text-align:right">Reviewed /<br>Endorsed By:</td>
            <td colspan="2"></td>
            <td class="label-cell">Reviewed /<br>Approved By:</td>
            <td colspan="2"></td>
        </tr>
        <tr>
            <td class="label-cell">Amount Approved:</td>
            <td colspan="2"></td>
            <td class="label-cell">Amount Approved:</td>
            <td colspan="2"></td>
        </tr>
        <tr class="sig-line">
            <td class="label-cell">Signature:</td>
            <td colspan="2"></td>
            <td class="label-cell">Signature:</td>
            <td colspan="2"></td>
        </tr>
        <tr class="sig-line">
            <td class="label-cell">Date:</td>
            <td colspan="2"></td>
            <td class="label-cell">Date:</td>
            <td colspan="2"></td>
        </tr>

    </table>

    <div class="page-footer">COMPANY INTERNAL USE</div>

    {{-- ── Proof Attachments — 2 columns, 6 per page ── --}}
    @php
        $proofTickets = $reimbursement->tickets->filter(fn($t) => $t->proof_url);
    @endphp

    @if($proofTickets->count() > 0)
    <div class="proofs-section">
        <h2>PROOF ATTACHMENTS — Week of {{ $reimbursement->week_start->format('M d') }}–{{ $reimbursement->week_end->format('M d, Y') }}</h2>
        <p class="proofs-meta">
            Employee: <strong>{{ $reimbursement->user->name }}</strong>
            &nbsp;|&nbsp;
            Total Reimbursable: <strong>₱{{ number_format($reimbursement->total_amount, 2) }}</strong>
        </p>

        <div class="proof-grid">
            @foreach($proofTickets->values() as $index => $ticket)
                {{-- Page break after every 6 proofs (insert before the 7th, 13th, etc.) --}}
                @if($index > 0 && $index % 6 === 0)
                    <div class="proof-page-break"></div>
                @endif

                <div class="proof-item">
                    <div class="proof-meta">
                        <strong>{{ $ticket->date->format('M d, Y') }}</strong>
                        &nbsp;·&nbsp; ₱{{ number_format($ticket->amount, 2) }}<br>
                        {{ $ticket->description }}
                    </div>

                    @if($ticket->proof_type === 'pdf')
                        <p class="pdf-note">
                            📎 <a href="{{ $ticket->proof_url }}" target="_blank">View PDF Receipt</a>
                        </p>
                    @else
                        <img src="{{ $ticket->proof_url }}"
                             alt="Proof {{ $ticket->date->format('M d, Y') }}">
                    @endif
                </div>
            @endforeach
        </div>
    </div>
    @endif

</body>
</html>