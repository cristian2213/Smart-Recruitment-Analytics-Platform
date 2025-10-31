<?php

namespace App\Traits;

use App\Enums\User\PermissionEnum;
use App\Enums\User\RoleEnum;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;

trait UserAccessTrait
{
    /**
     * Get the current authenticated user.
     */
    protected function currentUser()
    {
        return Auth::user();
    }

    /**
     * Get the current user's role.
     */
    protected function userRole(): string
    {
        return Auth::user()->getRole();
    }

    /**
     * Get the current authenticated user's ID.
     */
    protected function userId(): int
    {
        return Auth::user()->id;
    }

    /**
     * Check if the current user has a given permission.
     */
    protected function userCan(PermissionEnum $permission): bool
    {
        return Auth::user()->can($permission->value);
    }

    /**
     * Check if the current user has a given permission. If not, throw an exception.
     *
     * @throws \Illuminate\Auth\Access\AuthorizationException
     */
    protected function userCanOrFail(PermissionEnum $permission): void
    {
        Gate::authorize($permission->value, auth()->user());
    }

    /**
     * Check if the current user is an admin.
     */
    protected function isAdmin(): bool
    {
        return $this->userRole() === RoleEnum::Admin->value;
    }

    /**
     * Check if the current user is an HR manager.
     */
    protected function isHRManager(): bool
    {
        return $this->userRole() === RoleEnum::HRManager->value;
    }

    /**
     * Check if the current user is a recruiter.
     */
    protected function isRecruiter(): bool
    {
        return $this->userRole() === RoleEnum::Recruiter->value;
    }

    /**
     * Check if the current user is an applicant.
     */
    protected function isApplicant(): bool
    {
        return $this->userRole() === RoleEnum::Applicant->value;
    }
}
