import { Head, Link } from '@inertiajs/react';

export default function Dashboard() {
    return (
        <>
            <Head title="Customer Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h1 className="mb-4 text-2xl font-bold">Customer Dashboard</h1>

                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div className="rounded-lg bg-blue-50 p-6">
                                    <h2 className="mb-2 text-lg font-semibold">Reimbursements</h2>
                                    <p className="mb-4 text-gray-600">Manage your reimbursement requests</p>
                                    <Link
                                        href={route('customer.reimbursements.index')}
                                        className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
                                    >
                                        View Reimbursements
                                    </Link>
                                </div>

                                <div className="rounded-lg bg-green-50 p-6">
                                    <h2 className="mb-2 text-lg font-semibold">Download Template</h2>
                                    <p className="mb-4 text-gray-600">Download the reimbursement form template</p>
                                    <Link
                                        href={route('customer.download-template')}
                                        className="rounded bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-700"
                                    >
                                        Download Template
                                    </Link>
                                </div>
                            </div>

                            <div className="mt-6">
                                <form method="POST" action={route('customer.logout')}>
                                    <button type="submit" className="rounded bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-700">
                                        Logout
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
