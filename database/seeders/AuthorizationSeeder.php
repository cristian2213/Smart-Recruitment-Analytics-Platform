<?php

namespace Database\Seeders;

use App\Enums\User\RoleEnum;
use App\Models\Permission;
use App\Models\Role;
use App\Services\PermissionService;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AuthorizationSeeder extends Seeder
{
    public function __construct(
        protected readonly PermissionService $permissionService
    ) {}

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        if ($this->_checkIfRecordsExist()) {
            return;
        }

        $this->_createRoles();
        $this->_createPermissions();
        $this->_createRolePermissions();
    }

    private function _checkIfRecordsExist(): bool
    {
        return Role::exists() && Permission::exists();
    }

    private function _createRoles(): void
    {
        $roles = $this->permissionService->getRoles();
        Role::insert($roles);
    }

    private function _createPermissions(): void
    {
        $permissions = $this->permissionService->getPermissions();
        Permission::insert($permissions);
    }

    private function _createRolePermissions(): void
    {
        $roles = Role::all();
        foreach ($roles as $role) {
            switch ($role->role) {
                case RoleEnum::Admin->value:
                    $raw_permissions = $this->permissionService->getPermissionsForRole(RoleEnum::Admin);

                    $permissions = Permission::whereIn('permission', $raw_permissions)
                        ->pluck('id')
                        ->map(fn ($permission) => ['role_id' => $role->id, 'permission_id' => $permission]);

                    DB::table('roles_permissions')
                        ->upsert($permissions->toArray(), ['role_id', 'permission_id'], ['role_id', 'permission_id']);
                    break;

                case RoleEnum::HRManager->value:
                    // code...
                    break;

                case RoleEnum::Recruiter->value:
                    // code...
                    break;

                case RoleEnum::Applicant->value:
                    // code...
                    break;
            }
        }
    }
}
