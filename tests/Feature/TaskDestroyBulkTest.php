<?php

namespace Tests\Feature;

use App\Models\Task;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TaskDestroyBulkTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_cannot_bulk_delete_tasks(): void
    {
        $tasks = Task::factory()->count(3)->create();

        $this->delete(route('tasks.destroy-bulk'), [
            'ids' => $tasks->pluck('id')->toArray(),
        ])->assertRedirect(route('login'));
    }

    public function test_authenticated_user_can_bulk_delete_tasks(): void
    {
        $actor = $this->createSuperAdmin();
        $tasks = Task::factory()->count(3)->create();
        $ids = $tasks->pluck('id')->toArray();

        $this->actingAs($actor)
            ->delete(route('tasks.destroy-bulk'), ['ids' => $ids])
            ->assertRedirect(route('tasks.index'));

        foreach ($ids as $id) {
            $this->assertDatabaseMissing('tasks', ['id' => $id]);
        }
    }

    public function test_bulk_delete_requires_ids(): void
    {
        $actor = $this->createSuperAdmin();

        $this->actingAs($actor)
            ->delete(route('tasks.destroy-bulk'), [])
            ->assertSessionHasErrors('ids');
    }

    public function test_bulk_delete_rejects_non_existent_ids(): void
    {
        $actor = $this->createSuperAdmin();

        $this->actingAs($actor)
            ->delete(route('tasks.destroy-bulk'), ['ids' => [99999]])
            ->assertSessionHasErrors('ids.0');
    }
}
