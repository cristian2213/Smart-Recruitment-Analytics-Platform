<?php

namespace Database\Factories;

use App\Enums\Job\JobStatus;
use App\Enums\User\RoleEnum;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Job>
 */
class JobFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => fake()->sentence(3),
            'description' => fake()->paragraph(3),
            'location' => fake()->city(),
            'skills' => json_encode(fake()->words(5, true)),
            'salary' => strval(fake()->numberBetween(1000, 10000)),
            'status' => fake()->randomElement(JobStatus::cases()),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }

    public function createdByAdmin(): static
    {
        $admin = User::with('roles')->whereHas('roles', function ($query) {
            $query->where('role', RoleEnum::Admin->value);
        })->first();

        $assigned_to = User::with('roles')->whereHas('roles', function ($query) {
            $query->where('role', RoleEnum::Recruiter->value);
        })->first();

        return $this->state(fn (array $attributes) => [
            'user_id' => $admin->id,
            'recruiter_id' => $assigned_to->id,
        ]);
    }
}
