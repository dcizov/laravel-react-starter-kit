<?php

namespace Tests\Feature;

use App\Models\Role;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia;
use Tests\TestCase;

class RoleIndexTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_cannot_view_the_roles_index(): void
    {
        $this->get(route('roles.index'))
            ->assertRedirect(route('login'));
    }

    public function test_authenticated_users_can_view_the_roles_index(): void
    {
        $actor = $this->createSuperAdmin();
        Role::create(['name' => 'editor', 'guard_name' => 'web']);
        Role::create(['name' => 'viewer', 'guard_name' => 'web']);

        $this->actingAs($actor)
            ->get(route('roles.index'))
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->component('roles/index')
                ->has('roles.data', 3) // super-admin + editor + viewer
                ->has('guardOptions')
            );
    }

    public function test_roles_index_can_be_searched_by_name(): void
    {
        $actor = $this->createSuperAdmin();
        Role::create(['name' => 'editor', 'guard_name' => 'web']);
        Role::create(['name' => 'viewer', 'guard_name' => 'web']);

        $this->actingAs($actor)
            ->get(route('roles.index', ['search' => 'editor']))
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->has('roles.data', 1)
                ->has('roles.data.0', fn (AssertableInertia $role) => $role
                    ->where('name', 'editor')
                    ->etc()
                )
            );
    }

    public function test_roles_index_can_be_filtered_by_guard_name(): void
    {
        $actor = $this->createSuperAdmin();
        Role::create(['name' => 'editor', 'guard_name' => 'web']);
        Role::create(['name' => 'api-reader', 'guard_name' => 'api']);

        $this->actingAs($actor)
            ->get(route('roles.index', ['guard' => 'api']))
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->has('roles.data', 1)
                ->has('roles.data.0', fn (AssertableInertia $role) => $role
                    ->where('name', 'api-reader')
                    ->etc()
                )
                ->where('filters.guard', 'api')
            );
    }

    public function test_guard_options_lists_distinct_guard_names(): void
    {
        $actor = $this->createSuperAdmin();
        Role::create(['name' => 'editor', 'guard_name' => 'web']);
        Role::create(['name' => 'writer', 'guard_name' => 'web']);
        Role::create(['name' => 'api-reader', 'guard_name' => 'api']);

        $this->actingAs($actor)
            ->get(route('roles.index'))
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->where('guardOptions', ['api', 'web'])
            );
    }
}
