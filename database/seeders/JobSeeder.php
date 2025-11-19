<?php

namespace Database\Seeders;

use App\Models\Application;
use App\Models\Job;
use Illuminate\Database\Seeder;

class JobSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        if (Job::exists()) {
            return;
        }

        Job::factory()
            ->createdByAdmin()
            ->count(10)
            ->has(Application::factory()->count(2))
            ->create();
    }
}
