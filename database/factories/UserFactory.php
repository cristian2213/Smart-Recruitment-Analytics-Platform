<?php

namespace Database\Factories;

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
        return $this->state(fn (array $attributes) => [
            'email' => 'admin@test.com',
            'created_by' => null,
        ]);
    }

    public function hrManagerRole(): static
    {
        return $this->state(fn (array $attributes) => [
            'email' => 'hrmanager@test.com',
        ]);
    }

    public function recruiterRole(): static
    {
        return $this->state(fn (array $attributes) => [
            'email' => 'recruiter@test.com',
        ]);
    }

    public function applicantRole(): static
    {
        return $this->state(fn (array $attributes) => [
            'email' => 'applicant@test.com',
        ]);
    }
}
