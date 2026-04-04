<?php

namespace Tests\Feature;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RoleStoreTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_cannot_create_roles(): void
    {
        $this->post(route('roles.store'), [
            'name' => 'editor',
            'guard_name' => 'web',
        ])->assertRedirect(route('login'));
    }

    public function test_authenticated_user_can_create_a_role(): void
    {
        $actor = $this->createSuperAdmin();

        $this->actingAs($actor)
            ->post(route('roles.store'), [
                'name' => 'editor',
                'guard_name' => 'web',
            ])
            ->assertRedirect(route('roles.index'));

        $this->assertDatabaseHas('roles', [
            'name' => 'editor',
            'guard_name' => 'web',
        ]);
    }

    public function test_name_is_required(): void
    {
        $actor = $this->createSuperAdmin();

        $this->actingAs($actor)
            ->post(route('roles.store'), [
                'name' => '',
                'guard_name' => 'web',
            ])
            ->assertSessionHasErrors('name');
    }

    public function test_guard_name_is_required(): void
    {
        $actor = $this->createSuperAdmin();

        $this->actingAs($actor)
            ->post(route('roles.store'), [
                'name' => 'editor',
                'guard_name' => '',
            ])
            ->assertSessionHasErrors('guard_name');
    }

    public function test_name_must_be_unique(): void
    {
        Role::create(['name' => 'editor', 'guard_name' => 'web']);
        $actor = $this->createSuperAdmin();

        $this->actingAs($actor)
            ->post(route('roles.store'), [
                'name' => 'editor',
                'guard_name' => 'web',
            ])
            ->assertSessionHasErrors('name');
    }

    public function test_role_can_be_created_with_permissions(): void
    {
        $actor = $this->createSuperAdmin();
        $permission = Permission::create(['name' => 'edit posts', 'guard_name' => 'web']);

        $this->actingAs($actor)
            ->post(route('roles.store'), [
                'name' => 'editor',
                'guard_name' => 'web',
                'permission_ids' => [$permission->id],
            ])
            ->assertRedirect(route('roles.index'));

        $role = Role::where('name', 'editor')->first();
        $this->assertNotNull($role);
        $this->assertTrue($role->hasPermissionTo('edit posts'));
    }
}
