<?php

namespace Database\Factories;

use App\Models\Task;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Task>
 */
class TaskFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => fake()->sentence(rand(4, 10), false),
            'status' => fake()->randomElement(Task::STATUSES),
            'label' => fake()->randomElement(Task::LABELS),
            'priority' => fake()->randomElement(Task::PRIORITIES),
        ];
    }
}
