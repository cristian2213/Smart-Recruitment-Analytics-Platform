<?php

namespace Database\Seeders;

use App\Enums\User\Permission;
use App\Enums\User\Role as UserRole;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AuthorizationSeeder extends Seeder
{
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
        $roles = UserRole::cases();
        $roles = array_map(fn($role) => ['role' => $role->value], $roles);
        DB::table('roles')->insert($roles);
    }

    private function _createPermissions(): void
    {
        $permissions = Permission::cases();
        $permissions = array_map(fn($permission) => ['permission' => $permission->value], $permissions);
        DB::table('permissions')->insert($permissions);
    }

    private function _createRolePermissions(): void
    {
        $roles = DB::table('roles')->get();

        foreach ($roles as $role_obj) {
            switch ($role_obj->role) {
                case UserRole::Admin->value:
                    $permissions = DB::table('permissions')->pluck('id');
                    $rolePermissions = array_map(fn($permission) => ['role_id' => $role_obj->id, 'permission_id' => $permission], $permissions->toArray());
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
