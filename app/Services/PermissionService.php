<?php

namespace App\Services;

use App\Enums\User\PermissionEnum;
use App\Enums\User\RoleEnum;

class PermissionService
{
    protected array $rolePermissions;

    public function __construct()
    {
        $this->rolePermissions = [
            RoleEnum::Admin->value => [
                PermissionEnum::ViewUsers,
                PermissionEnum::ViewShowUser,
                PermissionEnum::ViewEditUser,
                PermissionEnum::CreateUsers,
                PermissionEnum::ReadUsers,
                PermissionEnum::UpdateUsers,
                PermissionEnum::DeleteUsers,
                PermissionEnum::DownloadUsers,

                PermissionEnum::ViewJobs,
                PermissionEnum::CreateJobs,
                PermissionEnum::ReadJobs,
                PermissionEnum::UpdateJobs,
                PermissionEnum::DeleteJobs,
            ],

            RoleEnum::HRManager->value => [
                PermissionEnum::ViewUsers,
                PermissionEnum::ViewShowUser,
                PermissionEnum::ViewEditUser,
                PermissionEnum::CreateUsers,
                PermissionEnum::ReadOwnUsers,
                PermissionEnum::UpdateOwnUsers,
                PermissionEnum::DeleteOwnUsers,
                PermissionEnum::DownloadOwnUsers,

                PermissionEnum::ViewJobs,
                PermissionEnum::CreateOwnJobs,
                PermissionEnum::ReadOwnJobs,
                PermissionEnum::UpdateOwnJobs,
                PermissionEnum::DeleteOwnJobs,
            ],

            RoleEnum::Recruiter->value => [
                PermissionEnum::ViewJobs,
                PermissionEnum::ReadJobs,
                PermissionEnum::UpdateJobsStatus,
            ],

            RoleEnum::Applicant->value => [
                PermissionEnum::ViewApplications,
                PermissionEnum::CreateApplications,
                PermissionEnum::ReadOwnApplications,
                PermissionEnum::UpdateOwnApplications,
                PermissionEnum::DeleteOwnApplications,
            ],
        ];
    }

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
