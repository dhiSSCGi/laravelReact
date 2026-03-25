import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

interface CustomerLoginForm {
    email: string;
    password: string;
    remember: boolean;
    [key: string]: any;
}

export default function CustomerLogin() {
    const { data, setData, post, processing, errors, reset } = useForm<CustomerLoginForm>({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('customer.login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <AuthLayout title="Customer Login" description="Sign in to your customer portal.">
            <Head title="Customer Log in" />

            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                <h2 className="mb-6 text-center text-2xl font-bold text-slate-900 dark:text-white">Customer Login</h2>

                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <Label htmlFor="email" className="text-slate-700 dark:text-slate-200">
                            Email
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="mt-1 w-full rounded-md border-gray-300 bg-white text-slate-900 focus:border-indigo-500 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                            autoComplete="username"
                            autoFocus
                            onChange={(e) => setData('email', e.target.value)}
                        />
                        <InputError message={errors.email} className="mt-2" />
                    </div>

                    <div>
                        <Label htmlFor="password" className="text-slate-700 dark:text-slate-200">
                            Password
                        </Label>
                        <Input
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="mt-1 w-full rounded-md border-gray-300 bg-white text-slate-900 focus:border-indigo-500 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                            autoComplete="current-password"
                            onChange={(e) => setData('password', e.target.value)}
                        />
                        <InputError message={errors.password} className="mt-2" />
                    </div>

                    <div>
                        <div className="flex items-center">
                            <Checkbox
                                id="remember"
                                name="remember"
                                checked={data.remember}
                                onCheckedChange={(checked) => setData('remember', checked === true)}
                            />
                            <Label htmlFor="remember" className="ml-2 text-sm text-slate-600 dark:text-slate-300">
                                Remember me
                            </Label>
                        </div>
                    </div>

                    <div className="flex items-center justify-end">
                        <Button type="submit" disabled={processing}>
                            Log in
                        </Button>
                    </div>
                </form>

                <div className="mt-4 text-center">
                    <Link
                        href={route('customer.register')}
                        className="text-sm text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                    >
                        Don't have an account? Register
                    </Link>
                </div>
            </div>
        </AuthLayout>
    );
}
