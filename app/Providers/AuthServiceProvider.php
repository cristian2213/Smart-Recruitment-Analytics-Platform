<?php

namespace App\Providers;

use App\Enums\User\PermissionEnum;
use App\Models\User;
use Illuminate\Auth\Access\Response;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        // register and check each permission dynamically
        foreach (PermissionEnum::cases() as $permission) {
            Gate::define($permission->value, function (User $user) use ($permission): Response {
                return $user->hasPermissionTo($permission) ? Response::allow() : Response::deny('You do not have permission to perform this action.');
            });
        }
    }
}
