<?php

namespace Tests\Feature;

use App\Models\Permission;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PermissionUpdateTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_cannot_update_permissions(): void
    {
        $permission = Permission::create(['name' => 'edit posts', 'guard_name' => 'web']);

        $this->put(route('permissions.update', $permission), [
            'name' => 'delete posts',
            'guard_name' => 'web',
        ])->assertRedirect(route('login'));
    }

    public function test_authenticated_user_can_update_a_permission(): void
    {
        $actor = $this->createSuperAdmin();
        $permission = Permission::create(['name' => 'edit posts', 'guard_name' => 'web']);

        $this->actingAs($actor)
            ->put(route('permissions.update', $permission), [
                'name' => 'delete posts',
                'guard_name' => 'web',
            ])
            ->assertRedirect(route('permissions.index'));

        $this->assertDatabaseHas('permissions', [
            'id' => $permission->id,
            'name' => 'delete posts',
        ]);
    }

    public function test_name_is_required(): void
    {
        $actor = $this->createSuperAdmin();
        $permission = Permission::create(['name' => 'edit posts', 'guard_name' => 'web']);

        $this->actingAs($actor)
            ->put(route('permissions.update', $permission), [
                'name' => '',
                'guard_name' => 'web',
            ])
            ->assertSessionHasErrors('name');
    }

    public function test_name_must_be_unique_excluding_self(): void
    {
        $actor = $this->createSuperAdmin();
        Permission::create(['name' => 'delete posts', 'guard_name' => 'web']);
        $permission = Permission::create(['name' => 'edit posts', 'guard_name' => 'web']);

        $this->actingAs($actor)
            ->put(route('permissions.update', $permission), [
                'name' => 'delete posts',
                'guard_name' => 'web',
            ])
            ->assertSessionHasErrors('name');
    }

    public function test_permission_can_keep_its_own_name(): void
    {
        $actor = $this->createSuperAdmin();
        $permission = Permission::create(['name' => 'edit posts', 'guard_name' => 'web']);

        $this->actingAs($actor)
            ->put(route('permissions.update', $permission), [
                'name' => 'edit posts',
                'guard_name' => 'api',
            ])
            ->assertRedirect(route('permissions.index'));

        $this->assertDatabaseHas('permissions', [
            'id' => $permission->id,
            'guard_name' => 'api',
        ]);
    }
}
