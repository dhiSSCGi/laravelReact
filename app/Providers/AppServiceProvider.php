<?php

namespace App\Providers;

use App\Models\Reimbursement;
use App\Policies\ReimbursementPolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Gate::policy(Reimbursement::class, ReimbursementPolicy::class);

        Gate::define('viewFilament', function (\App\Models\User $user): bool {
            return $user->role === 'admin';
        });
    }
}
