<?php

namespace Database\Factories;

use App\Enums\User\RoleEnum;
use App\Models\Role;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'uuid' => Str::uuid()->toString(),
            'name' => fake()->name(),
            'last_name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('Admin123@#'),
            'remember_token' => Str::random(10),
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }

    // function to adminRole, hrManagerRole, recruiterRole, applicantRole
    public function adminRole(): static
    {
        $adminRole = Role::where('role', RoleEnum::Admin)->first();

        return $this->state(fn (array $attributes) => [
            'email' => 'admin@test.com',
            'created_by' => null,
        ])->hasAttached($adminRole, ['created_at' => now()]);
    }

    public function hrManagerRole(): static
    {
        $hrManagerRole = Role::where('role', RoleEnum::HRManager)->first();

        return $this->state(fn (array $attributes) => [
            'email' => 'hrmanager@test.com',
        ])->hasAttached($hrManagerRole, ['created_at' => now()]);
    }

    public function recruiterRole(): static
    {
        $recruiterRole = Role::where('role', RoleEnum::Recruiter)->first();

        return $this->state(fn (array $attributes) => [
            'email' => 'recruiter@test.com',
        ])->hasAttached($recruiterRole, ['created_at' => now()]);
    }

    public function applicantRole(): static
    {
        $applicantRole = Role::where('role', RoleEnum::Applicant)->first();

        return $this->state(fn (array $attributes) => [
            'email' => 'applicant@test.com',
        ])->hasAttached($applicantRole, ['created_at' => now()]);
    }
}
