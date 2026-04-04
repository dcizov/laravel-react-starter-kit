<?php

namespace Tests\Feature;

use App\Models\Task;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TaskDestroyTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_cannot_delete_tasks(): void
    {
        $task = Task::factory()->create();

        $this->delete(route('tasks.destroy', $task))
            ->assertRedirect(route('login'));
    }

    public function test_authenticated_user_can_delete_a_task(): void
    {
        $actor = $this->createSuperAdmin();
        $task = Task::factory()->create();

        $this->actingAs($actor)
            ->delete(route('tasks.destroy', $task))
            ->assertRedirect(route('tasks.index'));

        $this->assertDatabaseMissing('tasks', ['id' => $task->id]);
    }

    public function test_deleting_a_nonexistent_task_returns_404(): void
    {
        $actor = $this->createSuperAdmin();

        $this->actingAs($actor)
            ->delete(route('tasks.destroy', 99999))
            ->assertNotFound();
    }
}
