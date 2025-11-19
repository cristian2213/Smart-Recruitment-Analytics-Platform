<?php

namespace Database\Factories;

use App\Enums\Job\ApplicationStatus;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Application>
 */
class ApplicationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'uuid' => Str::uuid()->toString(),
            'match_score' => fake()->randomFloat(2, 0, 100),
            'status' => fake()->randomElement(ApplicationStatus::cases()),
            'user_id' => User::factory()->applicantRole()->create()->id,
        ];
    }
}
