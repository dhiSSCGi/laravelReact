// resources/js/pages/Dashboard.tsx
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useEffect, useRef, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const breadcrumbs: BreadcrumbItem[] = [{ title: 'Dashboard', href: '/dashboard' }];

interface Ticket {
    id: number;
    date: string;
    amount: number;
    description: string;
    proof_url: string | null;
    proof_type: 'image' | 'pdf' | null;
}

interface WeekGroup {
    id: number;
    week_start: string;
    week_end: string;
    status: string;
    total_amount: number;
    tickets: Ticket[];
}

interface DashboardProps {
    reimbursements: WeekGroup[];
}

export default function Dashboard({ reimbursements = [] }: DashboardProps) {
    const { props } = usePage();
    const flash = (props as any).flash as { success?: string; error?: string } | undefined;

    const [expandedWeek, setExpandedWeek] = useState<number | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Show flash messages from Laravel as toasts
    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);
    const { data, setData, post, processing, errors, reset } = useForm({
        date: '',
        amount: '',
        description: '',
        proof_file: null as File | null,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('tickets.store'), {
            forceFormData: true,
            onSuccess: () => {
                reset();
                if (fileInputRef.current) fileInputRef.current.value = '';
                toast.success('Ticket added successfully.');
            },
            onError: () => toast.error('Failed to add ticket. Please check the form.'),
        });
    };

    const deleteTicket = (ticketId: number) => {
        toast.info(
            ({ closeToast }) => (
                <div>
                    <p>Delete this ticket?</p>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                        <button
                            onClick={() => {
                                router.delete(route('tickets.destroy', ticketId), {
                                    preserveScroll: true,
                                    onSuccess: () => toast.success('Ticket deleted.'),
                                    onError: () => toast.error('Failed to delete ticket.'),
                                });
                                closeToast?.();
                            }}
                            style={{
                                background: 'red',
                                color: 'white',
                                padding: '5px 15px',
                                borderRadius: '4px',
                            }}
                        >
                            Yes
                        </button>

                        <button onClick={closeToast}>Cancel</button>
                    </div>
                </div>
            ),
            {
                autoClose: false,
                closeOnClick: false,
                draggable: false,
            },
        );
    };

    const formatDate = (d: string) => new Date(d).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' });

    const formatWeekLabel = (week: WeekGroup) => `${formatDate(week.week_start)} – ${formatDate(week.week_end)}`;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <ToastContainer position="top-right" autoClose={1000} hideProgressBar={false} newestOnTop closeOnClick pauseOnHover />

            <div className="space-y-8">
                {/* ── Weekly Reimbursements ── */}
                <section className="rounded-xl border border-gray-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
                    <h1 className="text-2xl font-bold">Weekly Reimbursements</h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Each week is built from daily tickets submitted below.</p>

                    <div className="mt-6 space-y-3">
                        {reimbursements.length === 0 && (
                            <p className="text-sm text-gray-500 dark:text-gray-400">No reimbursements yet. Add a ticket below to get started.</p>
                        )}

                        {reimbursements.map((week) => (
                            <div key={week.id} className="rounded-lg border border-gray-200 dark:border-slate-700">
                                {/* Week header row */}
                                <div
                                    className="flex cursor-pointer items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-slate-800"
                                    onClick={() => setExpandedWeek(expandedWeek === week.id ? null : week.id)}
                                >
                                    <div className="flex items-center gap-4">
                                        <span className="font-medium">{formatWeekLabel(week)}</span>
                                        <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-200">
                                            {week.tickets.length} ticket{week.tickets.length !== 1 ? 's' : ''}
                                        </span>
                                        <span
                                            className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                                                week.status === 'approved'
                                                    ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200'
                                                    : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200'
                                            }`}
                                        >
                                            {week.status}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <span className="font-semibold text-green-600 dark:text-green-400">₱{week.total_amount}</span>
                                        <a
                                            href={route('reimbursements.generate-form', week.id)}
                                            target="_blank"
                                            rel="noreferrer"
                                            onClick={(e) => e.stopPropagation()}
                                            className="rounded bg-indigo-600 px-3 py-1 text-xs font-medium text-white hover:bg-indigo-700"
                                        >
                                            Generate Form
                                        </a>
                                        <span className="text-sm text-gray-400">{expandedWeek === week.id ? '▲' : '▼'}</span>
                                    </div>
                                </div>

                                {/* Expanded ticket list */}
                                {expandedWeek === week.id && (
                                    <div className="border-t border-gray-200 dark:border-slate-700">
                                        <table className="min-w-full table-auto text-left text-sm">
                                            <thead className="bg-gray-50 dark:bg-slate-800">
                                                <tr>
                                                    <th className="px-4 py-2">Date</th>
                                                    <th className="px-4 py-2">Amount</th>
                                                    <th className="px-4 py-2">Description</th>
                                                    <th className="px-4 py-2">Proof</th>
                                                    <th className="px-4 py-2"></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {week.tickets.map((ticket) => (
                                                    <tr key={ticket.id} className="border-t border-gray-100 dark:border-slate-700">
                                                        <td className="px-4 py-2">{formatDate(ticket.date)}</td>
                                                        <td className="px-4 py-2">₱{ticket.amount}</td>
                                                        <td className="px-4 py-2 text-gray-600 dark:text-gray-300">{ticket.description}</td>
                                                        <td className="px-4 py-2">
                                                            {ticket.proof_url ? (
                                                                <a
                                                                    href={`${ticket.proof_url}`}
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                    className="text-blue-600 hover:underline"
                                                                >
                                                                    View
                                                                </a>
                                                            ) : (
                                                                <span className="text-gray-400">None</span>
                                                            )}
                                                        </td>
                                                        <td className="px-4 py-2">
                                                            <button
                                                                onClick={() => deleteTicket(ticket.id)}
                                                                className="text-xs text-red-500 hover:underline"
                                                            >
                                                                Delete
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── Add Ticket Form ── */}
                <section className="rounded-xl border border-gray-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
                    <h2 className="text-xl font-semibold">Add Ticket</h2>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Tickets are automatically grouped into their week.</p>

                    <form onSubmit={submit} encType="multipart/form-data" className="mt-4 space-y-4">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <div>
                                <Label htmlFor="date">Date</Label>
                                <Input id="date" type="date" value={data.date} onChange={(e) => setData('date', e.target.value)} required />
                                <InputError message={errors.date} className="mt-1" />
                            </div>

                            <div>
                                <Label htmlFor="amount">Amount (₱)</Label>
                                <Input
                                    id="amount"
                                    type="number"
                                    step="0.01"
                                    value={data.amount}
                                    onChange={(e) => setData('amount', e.target.value)}
                                    required
                                />
                                <InputError message={errors.amount} className="mt-1" />
                            </div>

                            <div>
                                <Label htmlFor="proof_file">Proof File</Label>
                                <input
                                    ref={fileInputRef}
                                    id="proof_file"
                                    type="file"
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    onChange={(e) => setData('proof_file', e.target.files?.[0] ?? null)}
                                    className="mt-1 block w-full text-sm"
                                />
                                <InputError message={errors.proof_file} className="mt-1" />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="description">Description</Label>
                            <textarea
                                id="description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                required
                                rows={2}
                                className="mt-1 w-full rounded-md border border-gray-300 bg-white p-2 text-sm text-slate-900 focus:border-indigo-500 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                            />
                            <InputError message={errors.description} className="mt-1" />
                        </div>

                        <div className="flex justify-end">
                            <Button type="submit" disabled={processing}>
                                Add Ticket
                            </Button>
                        </div>
                    </form>
                </section>
            </div>
        </AppLayout>
    );
}
