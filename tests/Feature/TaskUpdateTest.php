<?php

namespace Tests\Feature;

use App\Models\Task;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TaskUpdateTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_cannot_update_tasks(): void
    {
        $task = Task::factory()->create();

        $this->put(route('tasks.update', $task), [
            'title' => 'Updated title',
            'status' => 'done',
            'label' => 'feature',
            'priority' => 'low',
        ])->assertRedirect(route('login'));
    }

    public function test_authenticated_user_can_update_a_task(): void
    {
        $actor = $this->createSuperAdmin();
        $task = Task::factory()->create([
            'title' => 'Original title',
            'status' => 'todo',
        ]);

        $this->actingAs($actor)
            ->put(route('tasks.update', $task), [
                'title' => 'Updated title',
                'status' => 'done',
                'label' => 'feature',
                'priority' => 'low',
            ])
            ->assertRedirect(route('tasks.index'));

        $this->assertDatabaseHas('tasks', [
            'id' => $task->id,
            'title' => 'Updated title',
            'status' => 'done',
        ]);
    }

    public function test_title_is_required_on_update(): void
    {
        $actor = $this->createSuperAdmin();
        $task = Task::factory()->create();

        $this->actingAs($actor)
            ->put(route('tasks.update', $task), [
                'title' => '',
                'status' => 'todo',
                'label' => 'bug',
                'priority' => 'high',
            ])
            ->assertSessionHasErrors('title');
    }

    public function test_status_must_be_valid_on_update(): void
    {
        $actor = $this->createSuperAdmin();
        $task = Task::factory()->create();

        $this->actingAs($actor)
            ->put(route('tasks.update', $task), [
                'title' => 'Valid title',
                'status' => 'invalid',
                'label' => 'bug',
                'priority' => 'high',
            ])
            ->assertSessionHasErrors('status');
    }
}
