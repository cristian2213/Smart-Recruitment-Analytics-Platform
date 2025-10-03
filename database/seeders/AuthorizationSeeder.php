<?php

namespace Database\Seeders;

use App\Enums\User\RoleEnum as UserRole;
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
        $this->_createRoles();
        $this->_createPermissions();
        $this->_createRolePermissions();
    }

    private function _createRoles(): void
    {
        $roles = $this->permissionService->getRoles();
        DB::table('roles')->upsert($roles, 'role', ['role']);
    }

    private function _createPermissions(): void
    {
        $permissions = $this->permissionService->getPermissions();
        DB::table('permissions')->upsert($permissions, 'permission', ['permission']);
    }

    private function _createRolePermissions(): void
    {
        $roles = DB::table('roles')->get();

        foreach ($roles as $role_obj) {
            switch ($role_obj->role) {
                case UserRole::Admin->value:
                    $permissionsArr = $this->permissionService->getPermissionsForRole(UserRole::Admin);
                    $permissions = DB::table('permissions')->pluck('id');
                    $rolePermissions = array_map(fn ($permission) => ['role_id' => $role_obj->id, 'permission_id' => $permission], $permissions->toArray());
                    DB::table('roles_permissions')->insert($rolePermissions);
                    break;

                case UserRole::HRManager->value:
                    // code...
                    break;

                case UserRole::Recruiter->value:
                    // code...
                    break;

                case UserRole::Applicant->value:
                    // code...
                    break;
            }
        }
    }
}
