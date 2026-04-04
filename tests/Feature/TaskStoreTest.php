<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TaskStoreTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_cannot_create_tasks(): void
    {
        $this->post(route('tasks.store'), [
            'title' => 'Fix bug',
            'status' => 'todo',
            'label' => 'bug',
            'priority' => 'high',
        ])->assertRedirect(route('login'));
    }

    public function test_authenticated_user_can_create_a_task(): void
    {
        $actor = $this->createSuperAdmin();

        $this->actingAs($actor)
            ->post(route('tasks.store'), [
                'title' => 'Fix login bug',
                'status' => 'todo',
                'label' => 'bug',
                'priority' => 'high',
            ])
            ->assertRedirect(route('tasks.index'));

        $this->assertDatabaseHas('tasks', [
            'title' => 'Fix login bug',
            'status' => 'todo',
            'label' => 'bug',
            'priority' => 'high',
        ]);
    }

    public function test_title_is_required(): void
    {
        $actor = $this->createSuperAdmin();

        $this->actingAs($actor)
            ->post(route('tasks.store'), [
                'title' => '',
                'status' => 'todo',
                'label' => 'bug',
                'priority' => 'high',
            ])
            ->assertSessionHasErrors('title');
    }

    public function test_status_must_be_a_valid_value(): void
    {
        $actor = $this->createSuperAdmin();

        $this->actingAs($actor)
            ->post(route('tasks.store'), [
                'title' => 'Fix bug',
                'status' => 'invalid',
                'label' => 'bug',
                'priority' => 'high',
            ])
            ->assertSessionHasErrors('status');
    }

    public function test_label_must_be_a_valid_value(): void
    {
        $actor = $this->createSuperAdmin();

        $this->actingAs($actor)
            ->post(route('tasks.store'), [
                'title' => 'Fix bug',
                'status' => 'todo',
                'label' => 'invalid',
                'priority' => 'high',
            ])
            ->assertSessionHasErrors('label');
    }

    public function test_priority_must_be_a_valid_value(): void
    {
        $actor = $this->createSuperAdmin();

        $this->actingAs($actor)
            ->post(route('tasks.store'), [
                'title' => 'Fix bug',
                'status' => 'todo',
                'label' => 'bug',
                'priority' => 'invalid',
            ])
            ->assertSessionHasErrors('priority');
    }
}
