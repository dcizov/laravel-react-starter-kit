<?php

namespace Tests\Feature\Policies;

use App\Enums\PermissionEnum;
use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PermissionPolicyTest extends TestCase
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

    public function test_super_admin_can_view_permissions_index(): void
    {
        $actor = $this->createSuperAdmin();

        $this->actingAs($actor)
            ->get(route('permissions.index'))
            ->assertOk();
    }

    public function test_super_admin_can_create_a_permission(): void
    {
        $actor = $this->createSuperAdmin();

        $this->actingAs($actor)
            ->post(route('permissions.store'), [
                'name' => 'super-admin-perm',
                'guard_name' => 'web',
            ])
            ->assertRedirect(route('permissions.index'));
    }

    // --- view-permissions permission ---

    public function test_user_with_view_permissions_permission_can_access_index(): void
    {
        $actor = $this->createUserWithPermission(PermissionEnum::ViewPermissions);

        $this->actingAs($actor)
            ->get(route('permissions.index'))
            ->assertOk();
    }

    public function test_user_without_view_permissions_permission_cannot_access_index(): void
    {
        $actor = User::factory()->create();

        $this->actingAs($actor)
            ->get(route('permissions.index'))
            ->assertForbidden();
    }

    // --- create-permissions permission ---

    public function test_user_with_create_permissions_permission_can_create_a_permission(): void
    {
        $actor = $this->createUserWithPermission(PermissionEnum::CreatePermissions);

        $this->actingAs($actor)
            ->post(route('permissions.store'), [
                'name' => 'new-permission',
                'guard_name' => 'web',
            ])
            ->assertRedirect(route('permissions.index'));
    }

    public function test_user_without_create_permissions_permission_cannot_create_a_permission(): void
    {
        $actor = User::factory()->create();

        $this->actingAs($actor)
            ->post(route('permissions.store'), [
                'name' => 'new-permission',
                'guard_name' => 'web',
            ])
            ->assertForbidden();
    }

    // --- edit-permissions permission ---

    public function test_user_with_edit_permissions_permission_can_update_a_permission(): void
    {
        $actor = $this->createUserWithPermission(PermissionEnum::EditPermissions);
        $permission = Permission::create(['name' => 'editable', 'guard_name' => 'web']);

        $this->actingAs($actor)
            ->patch(route('permissions.update', $permission), [
                'name' => 'editable-updated',
                'guard_name' => 'web',
            ])
            ->assertRedirect(route('permissions.index'));
    }

    public function test_user_without_edit_permissions_permission_cannot_update_a_permission(): void
    {
        $actor = User::factory()->create();
        $permission = Permission::create(['name' => 'editable', 'guard_name' => 'web']);

        $this->actingAs($actor)
            ->patch(route('permissions.update', $permission), [
                'name' => 'editable-updated',
                'guard_name' => 'web',
            ])
            ->assertForbidden();
    }

    // --- delete-permissions permission ---

    public function test_user_with_delete_permissions_permission_can_delete_a_permission(): void
    {
        $actor = $this->createUserWithPermission(PermissionEnum::DeletePermissions);
        $permission = Permission::create(['name' => 'to-delete', 'guard_name' => 'web']);

        $this->actingAs($actor)
            ->delete(route('permissions.destroy', $permission))
            ->assertRedirect(route('permissions.index'));
    }

    public function test_user_without_delete_permissions_permission_cannot_delete_a_permission(): void
    {
        $actor = User::factory()->create();
        $permission = Permission::create(['name' => 'to-delete', 'guard_name' => 'web']);

        $this->actingAs($actor)
            ->delete(route('permissions.destroy', $permission))
            ->assertForbidden();
    }

    public function test_user_with_delete_permissions_permission_can_bulk_delete(): void
    {
        $actor = $this->createUserWithPermission(PermissionEnum::DeletePermissions);
        $perms = collect([
            Permission::create(['name' => 'bulk-perm-1', 'guard_name' => 'web']),
            Permission::create(['name' => 'bulk-perm-2', 'guard_name' => 'web']),
        ]);

        $this->actingAs($actor)
            ->delete(route('permissions.destroy-bulk'), ['ids' => $perms->pluck('id')->all()])
            ->assertRedirect(route('permissions.index'));
    }

    public function test_user_without_delete_permissions_permission_cannot_bulk_delete(): void
    {
        $actor = User::factory()->create();
        $perms = collect([
            Permission::create(['name' => 'bulk-perm-1', 'guard_name' => 'web']),
            Permission::create(['name' => 'bulk-perm-2', 'guard_name' => 'web']),
        ]);

        $this->actingAs($actor)
            ->delete(route('permissions.destroy-bulk'), ['ids' => $perms->pluck('id')->all()])
            ->assertForbidden();
    }

    // --- Guest ---

    public function test_guest_cannot_access_permissions_index(): void
    {
        $this->get(route('permissions.index'))
            ->assertRedirect(route('login'));
    }
}
