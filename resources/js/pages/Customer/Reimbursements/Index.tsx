import { Head, Link } from '@inertiajs/react';

interface Reimbursement {
    id: number;
    week_date: string;
    amount: number;
    description: string;
    status: string;
    submitted_at: string;
    proof_file?: string | null;
}

interface Props {
    reimbursements: Reimbursement[];
}

export default function Index({ reimbursements }: Props) {
    return (
        <>
            <Head title="My Reimbursements" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="mb-6 flex items-center justify-between">
                                <h1 className="text-2xl font-bold">My Reimbursements</h1>
                                <Link
                                    href={route('reimbursements.create')}
                                    className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
                                >
                                    New Reimbursement
                                </Link>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full table-auto">
                                    <thead>
                                        <tr className="bg-gray-50">
                                            <th className="px-4 py-2 text-left">Week Date</th>
                                            <th className="px-4 py-2 text-left">Amount</th>
                                            <th className="px-4 py-2 text-left">Description</th>
                                            <th className="px-4 py-2 text-left">Status</th>
                                            <th className="px-4 py-2 text-left">Submitted At</th>
                                            <th className="px-4 py-2 text-left">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {reimbursements.map((reimbursement) => (
                                            <tr key={reimbursement.id} className="border-t">
                                                <td className="px-4 py-2">{new Date(reimbursement.week_date).toLocaleDateString()}</td>
                                                <td className="px-4 py-2">${reimbursement.amount}</td>
                                                <td className="px-4 py-2">{reimbursement.description}</td>
                                                <td className="px-4 py-2">
                                                    <span
                                                        className={`rounded px-2 py-1 text-xs ${
                                                            reimbursement.status === 'approved'
                                                                ? 'bg-green-100 text-green-800'
                                                                : reimbursement.status === 'rejected'
                                                                  ? 'bg-red-100 text-red-800'
                                                                  : 'bg-yellow-100 text-yellow-800'
                                                        }`}
                                                    >
                                                        {reimbursement.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-2">{new Date(reimbursement.submitted_at).toLocaleDateString()}</td>
                                                <td className="px-4 py-2">
                                                    <Link
                                                        href={route('reimbursements.show', reimbursement.id)}
                                                        className="text-blue-600 hover:text-blue-800"
                                                    >
                                                        View
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {reimbursements.length === 0 && <p className="py-8 text-center text-gray-500">No reimbursements found.</p>}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
