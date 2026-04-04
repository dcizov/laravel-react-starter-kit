<?php

namespace Tests\Feature;

use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia;
use Tests\TestCase;

class UserIndexTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_cannot_view_the_users_index(): void
    {
        $this->get(route('users.index'))
            ->assertRedirect(route('login'));
    }

    public function test_authenticated_users_can_view_the_users_index_with_pagination_and_filters(): void
    {
        $actor = $this->createSuperAdmin();
        User::factory()->create(['name' => 'Alpha Unique', 'email' => 'alpha@example.com']);
        User::factory()->create(['name' => 'Beta Unique', 'email' => 'beta@example.com']);
        User::factory()->unverified()->create([
            'name' => 'Gamma Unique',
            'email' => 'gamma@example.com',
        ]);

        $this->actingAs($actor);

        $response = $this->get(route('users.index', [
            'search' => 'alpha@example.com',
            'sortBy' => 'email',
            'sortDir' => 'desc',
            'perPage' => 10,
            'page' => 1,
        ]));

        $response->assertOk();
        $response->assertInertia(fn (AssertableInertia $page) => $page
            ->component('users/index')
            ->has('users.data', 1)
            ->has('users.data.0', fn (AssertableInertia $user) => $user
                ->where('name', 'Alpha Unique')
                ->etc()
            )
            ->where('filters.search', 'alpha@example.com')
            ->where('filters.sortBy', 'email')
            ->where('filters.sortDir', 'desc')
            ->where('filters.perPage', 10)
        );

        $filtered = $this->get(route('users.index', [
            'verified' => 'no',
        ]));
        $filtered->assertOk();
        $filtered->assertInertia(fn (AssertableInertia $page) => $page
            ->has('users.data.0', fn (AssertableInertia $user) => $user
                ->where('name', 'Gamma Unique')
                ->etc()
            )
            ->where('filters.verified', 'no')
        );
    }

    public function test_users_index_can_be_filtered_by_role(): void
    {
        $actor = $this->createSuperAdmin();
        $role = Role::create(['name' => 'editor', 'guard_name' => 'web']);
        $userWithRole = User::factory()->create(['name' => 'Role User']);
        $userWithRole->assignRole($role);
        User::factory()->create(['name' => 'No Role User']);

        $this->actingAs($actor);

        $response = $this->get(route('users.index', ['role' => 'editor']));

        $response->assertOk();
        $response->assertInertia(fn (AssertableInertia $page) => $page
            ->has('users.data', 1)
            ->has('users.data.0', fn (AssertableInertia $user) => $user
                ->where('name', 'Role User')
                ->etc()
            )
            ->where('filters.role', 'editor')
        );
    }

    public function test_users_index_role_filter_with_unknown_role_returns_empty(): void
    {
        $actor = $this->createSuperAdmin();
        User::factory()->count(2)->create();

        $this->actingAs($actor);

        $response = $this->get(route('users.index', ['role' => 'nonexistent-role']));

        $response->assertOk();
        $response->assertInertia(fn (AssertableInertia $page) => $page
            ->has('users.data', 0)
        );
    }

    public function test_users_index_invalid_page_returns_validation_error(): void
    {
        $actor = $this->createSuperAdmin();
        $this->actingAs($actor);

        $this->get(route('users.index', ['page' => 0]))
            ->assertSessionHasErrors('page');
    }
}
