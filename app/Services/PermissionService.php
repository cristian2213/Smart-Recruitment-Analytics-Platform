<?php

namespace App\Services;

use App\Enums\User\PermissionEnum;
use App\Enums\User\RoleEnum;

class PermissionService
{
    protected array $rolePermissions = [
        RoleEnum::ADMIN->value => [
            PermissionEnum::ViewUsers,
            PermissionEnum::CreateUsers,
            PermissionEnum::ReadUsers,
            PermissionEnum::UpdateUsers,
            PermissionEnum::DeleteUsers,
            PermissionEnum::ViewJobs,
            PermissionEnum::CreateJobs,
            PermissionEnum::ReadJobs,
            PermissionEnum::UpdateJobs,
            PermissionEnum::DeleteJobs,
        ],

        RoleEnum::HR_MANAGER->value => [
            PermissionEnum::ViewJobs,
            PermissionEnum::CreateJobs,
            PermissionEnum::ReadJobs,
            PermissionEnum::UpdateJobs,
            PermissionEnum::DeleteJobs,
        ],

        RoleEnum::RECRUITER->value => [
            PermissionEnum::ViewJobs,
            PermissionEnum::CreateJobs,
            PermissionEnum::ReadJobs,
            PermissionEnum::UpdateJobs,
            PermissionEnum::DeleteJobs,
        ],

        RoleEnum::APPLICANT->value => [
            PermissionEnum::ViewJobs,
        ],
    ];

    public function getRoles(): array
    {
        return array_keys($this->rolePermissions);
    }

    public function getPermissions(): array
    {
        $permissions = collect(PermissionEnum::cases());
        $permCb = fn (PermissionEnum $permissionEnum): string => $permissionEnum->value;

        return $permissions->map($permCb)->toArray();
    }

    public function getPermissionsForRole(RoleEnum $role): array
    {
        return $this->rolePermissions[$role->value] ?? [];
    }
}
