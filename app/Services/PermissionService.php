<?php

namespace App\Services;

use App\Enums\User\PermissionEnum;
use App\Enums\User\RoleEnum;

class PermissionService
{
    protected array $rolePermissions = [
        RoleEnum::Admin->value => [
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

        RoleEnum::HRManager->value => [
            PermissionEnum::ViewJobs,
            PermissionEnum::CreateJobs,
            PermissionEnum::ReadJobs,
            PermissionEnum::UpdateJobs,
            PermissionEnum::DeleteJobs,
        ],

        RoleEnum::Recruiter->value => [
            PermissionEnum::ViewJobs,
            PermissionEnum::CreateJobs,
            PermissionEnum::ReadJobs,
            PermissionEnum::UpdateJobs,
            PermissionEnum::DeleteJobs,
        ],

        RoleEnum::Applicant->value => [
            PermissionEnum::ViewJobs,
        ],
    ];

    public function getRoles(): array
    {
        return array_map(fn (RoleEnum $roleEnum): array => ['role' => $roleEnum->value], RoleEnum::cases());
    }

    public function getPermissions(): array
    {
        return array_map(fn (PermissionEnum $permissionEnum): array => ['permission' => $permissionEnum->value], PermissionEnum::cases());
    }

    public function getPermissionsForRole(RoleEnum $role): array
    {
        return array_map(fn (PermissionEnum $permissionEnum): array => ['permission' => $permissionEnum->value], $this->rolePermissions[$role->value] ?? []);
    }
}
