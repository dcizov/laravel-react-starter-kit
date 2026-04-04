<?php

namespace Tests\Feature;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RolePermissionsTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_cannot_sync_role_permissions(): void
    {
        $role = Role::create(['name' => 'editor', 'guard_name' => 'web']);
        $permission = Permission::create(['name' => 'edit posts', 'guard_name' => 'web']);

        $this->put(route('roles.permissions.update', $role), [
            'permission_ids' => [$permission->id],
        ])->assertRedirect(route('login'));
    }

    public function test_authenticated_user_can_sync_permissions_to_a_role(): void
    {
        $actor = $this->createSuperAdmin();
        $role = Role::create(['name' => 'editor', 'guard_name' => 'web']);
        $permission = Permission::create(['name' => 'edit posts', 'guard_name' => 'web']);

        $this->actingAs($actor)
            ->put(route('roles.permissions.update', $role), [
                'permission_ids' => [$permission->id],
            ])
            ->assertRedirect();

        $this->assertTrue($role->fresh()->hasPermissionTo('edit posts'));
    }

    public function test_permissions_are_replaced_not_appended(): void
    {
        $actor = $this->createSuperAdmin();
        $role = Role::create(['name' => 'editor', 'guard_name' => 'web']);
        $old = Permission::create(['name' => 'edit posts', 'guard_name' => 'web']);
        $new = Permission::create(['name' => 'delete posts', 'guard_name' => 'web']);

        $role->givePermissionTo($old);

        $this->actingAs($actor)
            ->put(route('roles.permissions.update', $role), [
                'permission_ids' => [$new->id],
            ])
            ->assertRedirect();

        $fresh = $role->fresh();
        $this->assertFalse($fresh->hasPermissionTo('edit posts'));
        $this->assertTrue($fresh->hasPermissionTo('delete posts'));
    }

    public function test_all_permissions_can_be_removed(): void
    {
        $actor = $this->createSuperAdmin();
        $role = Role::create(['name' => 'editor', 'guard_name' => 'web']);
        $permission = Permission::create(['name' => 'edit posts', 'guard_name' => 'web']);

        $role->givePermissionTo($permission);

        $this->actingAs($actor)
            ->put(route('roles.permissions.update', $role), [])
            ->assertRedirect();

        $this->assertCount(0, $role->fresh()->permissions);
    }

    public function test_invalid_permission_id_fails_validation(): void
    {
        $actor = $this->createSuperAdmin();
        $role = Role::create(['name' => 'editor', 'guard_name' => 'web']);

        $this->actingAs($actor)
            ->put(route('roles.permissions.update', $role), [
                'permission_ids' => [999999],
            ])
            ->assertSessionHasErrors('permission_ids.0');
    }
}
