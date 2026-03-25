import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        week_date: '',
        amount: '',
        description: '',
        proof_file: null as File | null,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('reimbursements.store'), {
            forceFormData: true,
        });
    };

    return (
        <>
            <Head title="Create Reimbursement" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="mb-6 flex items-center">
                                <Link href={route('reimbursements.index')} className="mr-4 text-blue-600 hover:text-blue-800">
                                    ← Back to Reimbursements
                                </Link>
                                <h1 className="text-2xl font-bold">Create New Reimbursement</h1>
                            </div>

                            <form onSubmit={submit} encType="multipart/form-data">
                                <div className="mb-4">
                                    <Label htmlFor="week_date">Week Date</Label>

                                    <Input
                                        id="week_date"
                                        type="date"
                                        name="week_date"
                                        value={data.week_date}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('week_date', e.target.value)}
                                        required
                                    />

                                    <InputError message={errors.week_date} className="mt-2" />
                                </div>

                                <div className="mb-4">
                                    <Label htmlFor="amount">Amount ($)</Label>

                                    <Input
                                        id="amount"
                                        type="number"
                                        step="0.01"
                                        name="amount"
                                        value={data.amount}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('amount', e.target.value)}
                                        required
                                    />

                                    <InputError message={errors.amount} className="mt-2" />
                                </div>

                                <div className="mb-4">
                                    <Label htmlFor="description">Description</Label>

                                    <textarea
                                        id="description"
                                        name="description"
                                        value={data.description}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        rows={4}
                                        onChange={(e) => setData('description', e.target.value)}
                                        required
                                    />

                                    <InputError message={errors.description} className="mt-2" />
                                </div>

                                <div className="mb-4">
                                    <Label htmlFor="proof_file">Proof File (Parking Ticket)</Label>

                                    <input
                                        id="proof_file"
                                        type="file"
                                        name="proof_file"
                                        className="mt-1 block w-full"
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        onChange={(e) => setData('proof_file', e.target.files?.[0] || null)}
                                        required
                                    />

                                    <p className="mt-1 text-sm text-gray-500">Accepted formats: PDF, JPG, JPEG, PNG. Max size: 2MB</p>

                                    <InputError message={errors.proof_file} className="mt-2" />
                                </div>

                                <div className="flex items-center justify-end">
                                    <Button type="submit" disabled={processing}>
                                        Submit Reimbursement
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
