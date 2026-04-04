<?php

namespace Tests\Feature;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia;
use Tests\TestCase;

class PermissionIndexTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_cannot_view_the_permissions_index(): void
    {
        $this->get(route('permissions.index'))
            ->assertRedirect(route('login'));
    }

    public function test_authenticated_users_can_view_the_permissions_index(): void
    {
        $actor = $this->createSuperAdmin();
        Permission::create(['name' => 'edit posts', 'guard_name' => 'web']);
        Permission::create(['name' => 'delete posts', 'guard_name' => 'web']);

        $this->actingAs($actor)
            ->get(route('permissions.index'))
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->component('permissions/index')
                ->has('permissions.data', 2)
                ->has('roleOptions')
            );
    }

    public function test_permissions_index_can_be_searched_by_name(): void
    {
        $actor = $this->createSuperAdmin();
        Permission::create(['name' => 'edit posts', 'guard_name' => 'web']);
        Permission::create(['name' => 'delete posts', 'guard_name' => 'web']);

        $this->actingAs($actor)
            ->get(route('permissions.index', ['search' => 'edit']))
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->has('permissions.data', 1)
                ->has('permissions.data.0', fn (AssertableInertia $permission) => $permission
                    ->where('name', 'edit posts')
                    ->etc()
                )
            );
    }

    public function test_permissions_index_can_be_filtered_by_role(): void
    {
        $actor = $this->createSuperAdmin();
        $editor = Role::create(['name' => 'editor', 'guard_name' => 'web']);
        $editPosts = Permission::create(['name' => 'edit posts', 'guard_name' => 'web']);
        Permission::create(['name' => 'delete posts', 'guard_name' => 'web']);
        $editor->givePermissionTo($editPosts);

        $this->actingAs($actor)
            ->get(route('permissions.index', ['role' => 'editor']))
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->has('permissions.data', 1)
                ->has('permissions.data.0', fn (AssertableInertia $permission) => $permission
                    ->where('name', 'edit posts')
                    ->etc()
                )
                ->where('filters.role', 'editor')
            );
    }

    public function test_role_options_lists_all_role_names(): void
    {
        $actor = $this->createSuperAdmin();
        Role::create(['name' => 'editor', 'guard_name' => 'web']);
        Role::create(['name' => 'viewer', 'guard_name' => 'web']);

        $this->actingAs($actor)
            ->get(route('permissions.index'))
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->where('roleOptions', ['editor', 'super-admin', 'viewer'])
            );
    }
}
