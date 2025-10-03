<?php

namespace Database\Seeders;

use App\Enums\User\RoleEnum as UserRole;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $adminRole = Role::where('role', UserRole::Admin)->first();
        $hrManagerRole = Role::where('role', UserRole::HRManager)->first();
        $recruiterRole = Role::where('role', UserRole::Recruiter)->first();
        $applicantRole = Role::where('role', UserRole::Applicant)->first();
        $currentDate = now();

        $admin = User::factory()
            ->adminRole()
            ->hasAttached($adminRole, ['created_at' => $currentDate])
            ->create();

        $hrManager = User::factory()
            ->hrManagerRole()
            ->hasAttached($hrManagerRole, ['created_at' => $currentDate])
            ->create(['created_by' => $admin->id]);

        $recruiter = User::factory()
            ->recruiterRole()
            ->hasAttached($recruiterRole, ['created_at' => $currentDate])
            ->create(['created_by' => $hrManager->id]);

        User::factory()
            ->count(1)
            ->applicantRole()
            ->hasAttached($applicantRole, ['created_at' => $currentDate])
            ->create(['created_by' => $recruiter->id]);
    }
}
