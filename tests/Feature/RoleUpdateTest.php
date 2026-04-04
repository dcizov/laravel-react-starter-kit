<?php

namespace Tests\Feature;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RoleUpdateTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_cannot_update_roles(): void
    {
        $role = Role::create(['name' => 'editor', 'guard_name' => 'web']);

        $this->put(route('roles.update', $role), [
            'name' => 'writer',
            'guard_name' => 'web',
        ])->assertRedirect(route('login'));
    }

    public function test_authenticated_user_can_update_a_role(): void
    {
        $actor = $this->createSuperAdmin();
        $role = Role::create(['name' => 'editor', 'guard_name' => 'web']);

        $this->actingAs($actor)
            ->put(route('roles.update', $role), [
                'name' => 'writer',
                'guard_name' => 'web',
            ])
            ->assertRedirect(route('roles.index'));

        $this->assertDatabaseHas('roles', [
            'id' => $role->id,
            'name' => 'writer',
        ]);
    }

    public function test_name_is_required(): void
    {
        $actor = $this->createSuperAdmin();
        $role = Role::create(['name' => 'editor', 'guard_name' => 'web']);

        $this->actingAs($actor)
            ->put(route('roles.update', $role), [
                'name' => '',
                'guard_name' => 'web',
            ])
            ->assertSessionHasErrors('name');
    }

    public function test_name_must_be_unique_excluding_self(): void
    {
        $actor = $this->createSuperAdmin();
        Role::create(['name' => 'admin', 'guard_name' => 'web']);
        $role = Role::create(['name' => 'editor', 'guard_name' => 'web']);

        $this->actingAs($actor)
            ->put(route('roles.update', $role), [
                'name' => 'admin',
                'guard_name' => 'web',
            ])
            ->assertSessionHasErrors('name');
    }

    public function test_role_can_keep_its_own_name(): void
    {
        $actor = $this->createSuperAdmin();
        $role = Role::create(['name' => 'editor', 'guard_name' => 'web']);

        $this->actingAs($actor)
            ->put(route('roles.update', $role), [
                'name' => 'editor',
                'guard_name' => 'api',
            ])
            ->assertRedirect(route('roles.index'));

        $this->assertDatabaseHas('roles', [
            'id' => $role->id,
            'guard_name' => 'api',
        ]);
    }

    public function test_role_permissions_can_be_synced_via_update(): void
    {
        $actor = $this->createSuperAdmin();
        $role = Role::create(['name' => 'editor', 'guard_name' => 'web']);
        $old = Permission::create(['name' => 'edit posts', 'guard_name' => 'web']);
        $new = Permission::create(['name' => 'delete posts', 'guard_name' => 'web']);

        $role->givePermissionTo($old);

        $this->actingAs($actor)
            ->put(route('roles.update', $role), [
                'name' => 'editor',
                'guard_name' => 'web',
                'permission_ids' => [$new->id],
            ])
            ->assertRedirect(route('roles.index'));

        $fresh = $role->fresh();
        $this->assertFalse($fresh->hasPermissionTo('edit posts'));
        $this->assertTrue($fresh->hasPermissionTo('delete posts'));
    }
}
