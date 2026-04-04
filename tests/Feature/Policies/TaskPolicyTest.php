<?php

namespace Tests\Feature\Policies;

use App\Enums\PermissionEnum;
use App\Models\Permission;
use App\Models\Role;
use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TaskPolicyTest extends TestCase
{
    use RefreshDatabase;

    private function createUserWithPermission(PermissionEnum $permission): User
    {
        $user = User::factory()->create();
        $perm = Permission::findOrCreate($permission->value, 'web');
        $role = Role::findOrCreate('test-role', 'web');
        $role->givePermissionTo($perm);
        $user->assignRole($role);

        return $user;
    }

    // --- Super Admin Bypass ---

    public function test_super_admin_can_view_tasks_index(): void
    {
        $actor = $this->createSuperAdmin();

        $this->actingAs($actor)
            ->get(route('tasks.index'))
            ->assertOk();
    }

    public function test_super_admin_can_create_a_task(): void
    {
        $actor = $this->createSuperAdmin();

        $this->actingAs($actor)
            ->post(route('tasks.store'), [
                'title' => 'Super admin task',
                'status' => 'todo',
                'label' => 'bug',
                'priority' => 'high',
            ])
            ->assertRedirect(route('tasks.index'));
    }

    // --- view-tasks permission ---

    public function test_user_with_view_tasks_permission_can_access_index(): void
    {
        $actor = $this->createUserWithPermission(PermissionEnum::ViewTasks);

        $this->actingAs($actor)
            ->get(route('tasks.index'))
            ->assertOk();
    }

    public function test_user_without_view_tasks_permission_cannot_access_index(): void
    {
        $actor = User::factory()->create();

        $this->actingAs($actor)
            ->get(route('tasks.index'))
            ->assertForbidden();
    }

    // --- create-tasks permission ---

    public function test_user_with_create_tasks_permission_can_create_a_task(): void
    {
        $actor = $this->createUserWithPermission(PermissionEnum::CreateTasks);

        $this->actingAs($actor)
            ->post(route('tasks.store'), [
                'title' => 'New task',
                'status' => 'todo',
                'label' => 'feature',
                'priority' => 'medium',
            ])
            ->assertRedirect(route('tasks.index'));
    }

    public function test_user_without_create_tasks_permission_cannot_create_a_task(): void
    {
        $actor = User::factory()->create();

        $this->actingAs($actor)
            ->post(route('tasks.store'), [
                'title' => 'New task',
                'status' => 'todo',
                'label' => 'feature',
                'priority' => 'medium',
            ])
            ->assertForbidden();
    }

    // --- edit-tasks permission ---

    public function test_user_with_edit_tasks_permission_can_update_a_task(): void
    {
        $actor = $this->createUserWithPermission(PermissionEnum::EditTasks);
        $task = Task::factory()->create();

        $this->actingAs($actor)
            ->patch(route('tasks.update', $task), [
                'title' => 'Updated title',
                'status' => 'in-progress',
                'label' => 'bug',
                'priority' => 'high',
            ])
            ->assertRedirect(route('tasks.index'));
    }

    public function test_user_without_edit_tasks_permission_cannot_update_a_task(): void
    {
        $actor = User::factory()->create();
        $task = Task::factory()->create();

        $this->actingAs($actor)
            ->patch(route('tasks.update', $task), [
                'title' => 'Updated title',
                'status' => 'in-progress',
                'label' => 'bug',
                'priority' => 'high',
            ])
            ->assertForbidden();
    }

    // --- delete-tasks permission ---

    public function test_user_with_delete_tasks_permission_can_delete_a_task(): void
    {
        $actor = $this->createUserWithPermission(PermissionEnum::DeleteTasks);
        $task = Task::factory()->create();

        $this->actingAs($actor)
            ->delete(route('tasks.destroy', $task))
            ->assertRedirect(route('tasks.index'));
    }

    public function test_user_without_delete_tasks_permission_cannot_delete_a_task(): void
    {
        $actor = User::factory()->create();
        $task = Task::factory()->create();

        $this->actingAs($actor)
            ->delete(route('tasks.destroy', $task))
            ->assertForbidden();
    }

    public function test_user_with_delete_tasks_permission_can_bulk_delete_tasks(): void
    {
        $actor = $this->createUserWithPermission(PermissionEnum::DeleteTasks);
        $tasks = Task::factory()->count(2)->create();

        $this->actingAs($actor)
            ->delete(route('tasks.destroy-bulk'), ['ids' => $tasks->pluck('id')->all()])
            ->assertRedirect(route('tasks.index'));
    }

    public function test_user_without_delete_tasks_permission_cannot_bulk_delete_tasks(): void
    {
        $actor = User::factory()->create();
        $tasks = Task::factory()->count(2)->create();

        $this->actingAs($actor)
            ->delete(route('tasks.destroy-bulk'), ['ids' => $tasks->pluck('id')->all()])
            ->assertForbidden();
    }

    // --- Guest ---

    public function test_guest_cannot_access_tasks_index(): void
    {
        $this->get(route('tasks.index'))
            ->assertRedirect(route('login'));
    }
}
