import { Head, Link } from '@inertiajs/react';

interface Reimbursement {
    id: number;
    week_date: string;
    amount: number;
    description: string;
    proof_file: string | null;
    status: string;
    submitted_at: string;
    user: {
        name: string;
        email: string;
    };
}

interface Props {
    reimbursement: Reimbursement;
}

export default function Show({ reimbursement }: Props) {
    return (
        <>
            <Head title={`Reimbursement #${reimbursement.id}`} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="mb-6 flex items-center">
                                <Link href={route('reimbursements.index')} className="mr-4 text-blue-600 hover:text-blue-800">
                                    ← Back to Reimbursements
                                </Link>
                                <h1 className="text-2xl font-bold">Reimbursement #{reimbursement.id}</h1>
                            </div>

                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div>
                                    <h2 className="mb-4 text-lg font-semibold">Details</h2>
                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Amount</label>
                                            <p className="text-lg font-semibold">${reimbursement.amount}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Status</label>
                                            <span
                                                className={`rounded px-2 py-1 text-sm ${
                                                    reimbursement.status === 'approved'
                                                        ? 'bg-green-100 text-green-800'
                                                        : reimbursement.status === 'rejected'
                                                          ? 'bg-red-100 text-red-800'
                                                          : 'bg-yellow-100 text-yellow-800'
                                                }`}
                                            >
                                                {reimbursement.status}
                                            </span>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Submitted At</label>
                                            <p>{new Date(reimbursement.submitted_at).toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h2 className="mb-4 text-lg font-semibold">Description</h2>
                                    <p className="text-gray-700">{reimbursement.description}</p>

                                    {reimbursement.proof_file && (
                                        <div className="mt-4">
                                            <label className="mb-2 block text-sm font-medium text-gray-700">Proof File</label>
                                            <a
                                                href={`/storage/${reimbursement.proof_file}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 underline hover:text-blue-800"
                                            >
                                                View Proof File
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
