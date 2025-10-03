<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        if (User::exists()) {
            return;
        }

        $admin = User::factory()
            ->adminRole()
            ->create();

        $hrManager = User::factory()
            ->hrManagerRole()
            ->create(['created_by' => $admin->id]);

        $recruiter = User::factory()
            ->recruiterRole()
            ->create(['created_by' => $hrManager->id]);

        User::factory()
            ->count(1)
            ->applicantRole()
            ->create(['created_by' => $recruiter->id]);
    }
}
