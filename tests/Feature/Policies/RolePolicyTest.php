<?php

namespace Tests\Feature\Policies;

use App\Enums\PermissionEnum;
use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RolePolicyTest extends TestCase
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

    public function test_super_admin_can_view_roles_index(): void
    {
        $actor = $this->createSuperAdmin();

        $this->actingAs($actor)
            ->get(route('roles.index'))
            ->assertOk();
    }

    public function test_super_admin_can_create_a_role(): void
    {
        $actor = $this->createSuperAdmin();

        $this->actingAs($actor)
            ->post(route('roles.store'), [
                'name' => 'test-role',
                'guard_name' => 'web',
            ])
            ->assertRedirect(route('roles.index'));
    }

    // --- view-roles permission ---

    public function test_user_with_view_roles_permission_can_access_index(): void
    {
        $actor = $this->createUserWithPermission(PermissionEnum::ViewRoles);

        $this->actingAs($actor)
            ->get(route('roles.index'))
            ->assertOk();
    }

    public function test_user_without_view_roles_permission_cannot_access_index(): void
    {
        $actor = User::factory()->create();

        $this->actingAs($actor)
            ->get(route('roles.index'))
            ->assertForbidden();
    }

    // --- create-roles permission ---

    public function test_user_with_create_roles_permission_can_create_a_role(): void
    {
        $actor = $this->createUserWithPermission(PermissionEnum::CreateRoles);

        $this->actingAs($actor)
            ->post(route('roles.store'), [
                'name' => 'new-role',
                'guard_name' => 'web',
            ])
            ->assertRedirect(route('roles.index'));
    }

    public function test_user_without_create_roles_permission_cannot_create_a_role(): void
    {
        $actor = User::factory()->create();

        $this->actingAs($actor)
            ->post(route('roles.store'), [
                'name' => 'new-role',
                'guard_name' => 'web',
            ])
            ->assertForbidden();
    }

    // --- edit-roles permission ---

    public function test_user_with_edit_roles_permission_can_update_a_role(): void
    {
        $actor = $this->createUserWithPermission(PermissionEnum::EditRoles);
        $role = Role::create(['name' => 'editable', 'guard_name' => 'web']);

        $this->actingAs($actor)
            ->patch(route('roles.update', $role), [
                'name' => 'editable-updated',
                'guard_name' => 'web',
            ])
            ->assertRedirect(route('roles.index'));
    }

    public function test_user_without_edit_roles_permission_cannot_update_a_role(): void
    {
        $actor = User::factory()->create();
        $role = Role::create(['name' => 'editable', 'guard_name' => 'web']);

        $this->actingAs($actor)
            ->patch(route('roles.update', $role), [
                'name' => 'editable-updated',
                'guard_name' => 'web',
            ])
            ->assertForbidden();
    }

    // --- delete-roles permission ---

    public function test_user_with_delete_roles_permission_can_delete_a_role(): void
    {
        $actor = $this->createUserWithPermission(PermissionEnum::DeleteRoles);
        $role = Role::create(['name' => 'to-delete', 'guard_name' => 'web']);

        $this->actingAs($actor)
            ->delete(route('roles.destroy', $role))
            ->assertRedirect(route('roles.index'));
    }

    public function test_user_without_delete_roles_permission_cannot_delete_a_role(): void
    {
        $actor = User::factory()->create();
        $role = Role::create(['name' => 'to-delete', 'guard_name' => 'web']);

        $this->actingAs($actor)
            ->delete(route('roles.destroy', $role))
            ->assertForbidden();
    }

    public function test_user_with_delete_roles_permission_can_bulk_delete_roles(): void
    {
        $actor = $this->createUserWithPermission(PermissionEnum::DeleteRoles);
        $roles = collect([
            Role::create(['name' => 'bulk-1', 'guard_name' => 'web']),
            Role::create(['name' => 'bulk-2', 'guard_name' => 'web']),
        ]);

        $this->actingAs($actor)
            ->delete(route('roles.destroy-bulk'), ['ids' => $roles->pluck('id')->all()])
            ->assertRedirect(route('roles.index'));
    }

    public function test_user_without_delete_roles_permission_cannot_bulk_delete_roles(): void
    {
        $actor = User::factory()->create();
        $roles = collect([
            Role::create(['name' => 'bulk-1', 'guard_name' => 'web']),
            Role::create(['name' => 'bulk-2', 'guard_name' => 'web']),
        ]);

        $this->actingAs($actor)
            ->delete(route('roles.destroy-bulk'), ['ids' => $roles->pluck('id')->all()])
            ->assertForbidden();
    }

    // --- Guest ---

    public function test_guest_cannot_access_roles_index(): void
    {
        $this->get(route('roles.index'))
            ->assertRedirect(route('login'));
    }
}
