<?php

namespace Tests\Feature\Policies;

use App\Enums\PermissionEnum;
use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserPolicyTest extends TestCase
{
    use RefreshDatabase;

    private function createUserWithPermission(PermissionEnum $permission): User
    {
        $user = User::factory()->create();
        $permission = Permission::findOrCreate($permission->value, 'web');
        $role = Role::findOrCreate('test-role', 'web');
        $role->givePermissionTo($permission);
        $user->assignRole($role);

        return $user;
    }

    // --- Super Admin Bypass ---

    public function test_super_admin_can_view_users_index(): void
    {
        $actor = $this->createSuperAdmin();

        $this->actingAs($actor)
            ->get(route('users.index'))
            ->assertOk();
    }

    public function test_super_admin_can_create_a_user(): void
    {
        $actor = $this->createSuperAdmin();

        $this->actingAs($actor)
            ->post(route('users.store'), [
                'name' => 'Super Admin Created',
                'email' => 'superadmin@example.com',
                'password' => 'Password1!',
                'password_confirmation' => 'Password1!',
            ])
            ->assertRedirect(route('users.index'));
    }

    public function test_super_admin_can_delete_a_user(): void
    {
        $actor = $this->createSuperAdmin();
        $user = User::factory()->create();

        $this->actingAs($actor)
            ->delete(route('users.destroy', $user))
            ->assertRedirect(route('users.index'));
    }

    // --- view-users permission ---

    public function test_user_with_view_users_permission_can_access_index(): void
    {
        $actor = $this->createUserWithPermission(PermissionEnum::ViewUsers);

        $this->actingAs($actor)
            ->get(route('users.index'))
            ->assertOk();
    }

    public function test_user_without_view_users_permission_cannot_access_index(): void
    {
        $actor = User::factory()->create();

        $this->actingAs($actor)
            ->get(route('users.index'))
            ->assertForbidden();
    }

    // --- create-users permission ---

    public function test_user_with_create_users_permission_can_create_a_user(): void
    {
        $actor = $this->createUserWithPermission(PermissionEnum::CreateUsers);

        $this->actingAs($actor)
            ->post(route('users.store'), [
                'name' => 'New User',
                'email' => 'new@example.com',
                'password' => 'Password1!',
                'password_confirmation' => 'Password1!',
            ])
            ->assertRedirect(route('users.index'));
    }

    public function test_user_without_create_users_permission_cannot_create_a_user(): void
    {
        $actor = User::factory()->create();

        $this->actingAs($actor)
            ->post(route('users.store'), [
                'name' => 'New User',
                'email' => 'new@example.com',
                'password' => 'Password1!',
                'password_confirmation' => 'Password1!',
            ])
            ->assertForbidden();
    }

    // --- edit-users permission ---

    public function test_user_with_edit_users_permission_can_update_a_user(): void
    {
        $actor = $this->createUserWithPermission(PermissionEnum::EditUsers);
        $user = User::factory()->create();

        $this->actingAs($actor)
            ->patch(route('users.update', $user), [
                'name' => 'Updated Name',
                'email' => $user->email,
            ])
            ->assertRedirect();
    }

    public function test_user_without_edit_users_permission_cannot_update_a_user(): void
    {
        $actor = User::factory()->create();
        $user = User::factory()->create();

        $this->actingAs($actor)
            ->patch(route('users.update', $user), [
                'name' => 'Updated Name',
                'email' => $user->email,
            ])
            ->assertForbidden();
    }

    // --- delete-users permission ---

    public function test_user_with_delete_users_permission_can_delete_a_user(): void
    {
        $actor = $this->createUserWithPermission(PermissionEnum::DeleteUsers);
        $user = User::factory()->create();

        $this->actingAs($actor)
            ->delete(route('users.destroy', $user))
            ->assertRedirect(route('users.index'));
    }

    public function test_user_without_delete_users_permission_cannot_delete_a_user(): void
    {
        $actor = User::factory()->create();
        $user = User::factory()->create();

        $this->actingAs($actor)
            ->delete(route('users.destroy', $user))
            ->assertForbidden();
    }

    public function test_user_with_delete_users_permission_can_bulk_delete_users(): void
    {
        $actor = $this->createUserWithPermission(PermissionEnum::DeleteUsers);
        $users = User::factory()->count(2)->create();

        $this->actingAs($actor)
            ->delete(route('users.destroy-bulk'), ['ids' => $users->pluck('id')->all()])
            ->assertRedirect(route('users.index'));
    }

    public function test_user_without_delete_users_permission_cannot_bulk_delete_users(): void
    {
        $actor = User::factory()->create();
        $users = User::factory()->count(2)->create();

        $this->actingAs($actor)
            ->delete(route('users.destroy-bulk'), ['ids' => $users->pluck('id')->all()])
            ->assertForbidden();
    }

    // --- Guest ---

    public function test_guest_cannot_access_users_index(): void
    {
        $this->get(route('users.index'))
            ->assertRedirect(route('login'));
    }

    public function test_guest_cannot_create_a_user(): void
    {
        $this->post(route('users.store'))
            ->assertRedirect(route('login'));
    }
}
