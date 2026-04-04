<?php

namespace Tests\Feature;

use App\Models\Task;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia;
use Tests\TestCase;

class TaskIndexTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_cannot_view_the_tasks_index(): void
    {
        $this->get(route('tasks.index'))
            ->assertRedirect(route('login'));
    }

    public function test_authenticated_users_can_view_the_tasks_index(): void
    {
        $actor = $this->createSuperAdmin();
        Task::factory()->count(3)->create();

        $this->actingAs($actor)
            ->get(route('tasks.index'))
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->component('tasks/index')
                ->has('tasks.data', 3)
                ->has('filters')
                ->has('perPageOptions')
            );
    }

    public function test_tasks_index_can_be_searched_by_title(): void
    {
        $actor = $this->createSuperAdmin();
        Task::factory()->create(['title' => 'Fix login bug']);
        Task::factory()->create(['title' => 'Add dark mode']);

        $this->actingAs($actor)
            ->get(route('tasks.index', ['search' => 'Fix login']))
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->has('tasks.data', 1)
                ->has('tasks.data.0', fn (AssertableInertia $task) => $task
                    ->where('title', 'Fix login bug')
                    ->etc()
                )
            );
    }

    public function test_tasks_index_can_be_filtered_by_status(): void
    {
        $actor = $this->createSuperAdmin();
        Task::factory()->create(['status' => 'todo']);
        Task::factory()->create(['status' => 'done']);
        Task::factory()->create(['status' => 'done']);

        $this->actingAs($actor)
            ->get(route('tasks.index', ['status' => ['done']]))
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->has('tasks.data', 2)
            );
    }

    public function test_tasks_index_can_be_filtered_by_multiple_statuses(): void
    {
        $actor = $this->createSuperAdmin();
        Task::factory()->create(['status' => 'todo']);
        Task::factory()->create(['status' => 'in-progress']);
        Task::factory()->create(['status' => 'done']);

        $this->actingAs($actor)
            ->get(route('tasks.index', ['status' => ['todo', 'in-progress']]))
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->has('tasks.data', 2)
            );
    }

    public function test_tasks_index_can_be_filtered_by_priority(): void
    {
        $actor = $this->createSuperAdmin();
        Task::factory()->create(['priority' => 'high']);
        Task::factory()->create(['priority' => 'low']);

        $this->actingAs($actor)
            ->get(route('tasks.index', ['priority' => ['high']]))
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->has('tasks.data', 1)
                ->has('tasks.data.0', fn (AssertableInertia $task) => $task
                    ->where('priority', 'high')
                    ->etc()
                )
            );
    }

    public function test_tasks_index_can_be_filtered_by_label(): void
    {
        $actor = $this->createSuperAdmin();
        Task::factory()->create(['label' => 'bug']);
        Task::factory()->create(['label' => 'feature']);

        $this->actingAs($actor)
            ->get(route('tasks.index', ['label' => ['bug']]))
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->has('tasks.data', 1)
                ->has('tasks.data.0', fn (AssertableInertia $task) => $task
                    ->where('label', 'bug')
                    ->etc()
                )
            );
    }

    public function test_tasks_index_rejects_invalid_status_filter(): void
    {
        $actor = $this->createSuperAdmin();

        $this->actingAs($actor)
            ->get(route('tasks.index', ['status' => ['invalid']]))
            ->assertSessionHasErrors('status.0');
    }
}
