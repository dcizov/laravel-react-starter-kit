<?php

namespace Tests\Feature;

use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserRolesTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_cannot_sync_user_roles(): void
    {
        $user = User::factory()->create();
        $role = Role::create(['name' => 'editor', 'guard_name' => 'web']);

        $this->put(route('users.roles.update', $user), [
            'role_ids' => [$role->id],
        ])->assertRedirect(route('login'));
    }

    public function test_authenticated_user_can_sync_roles_to_a_user(): void
    {
        $actor = $this->createSuperAdmin();
        $user = User::factory()->create();
        $role = Role::create(['name' => 'editor', 'guard_name' => 'web']);

        $this->actingAs($actor)
            ->put(route('users.roles.update', $user), [
                'role_ids' => [$role->id],
            ])
            ->assertRedirect();

        $this->assertTrue($user->fresh()->hasRole('editor'));
    }

    public function test_roles_are_replaced_not_appended(): void
    {
        $actor = $this->createSuperAdmin();
        $user = User::factory()->create();
        $old = Role::create(['name' => 'editor', 'guard_name' => 'web']);
        $new = Role::create(['name' => 'admin', 'guard_name' => 'web']);

        $user->assignRole($old);

        $this->actingAs($actor)
            ->put(route('users.roles.update', $user), [
                'role_ids' => [$new->id],
            ])
            ->assertRedirect();

        $fresh = $user->fresh();
        $this->assertFalse($fresh->hasRole('editor'));
        $this->assertTrue($fresh->hasRole('admin'));
    }

    public function test_all_roles_can_be_removed(): void
    {
        $actor = $this->createSuperAdmin();
        $user = User::factory()->create();
        $role = Role::create(['name' => 'editor', 'guard_name' => 'web']);

        $user->assignRole($role);

        $this->actingAs($actor)
            ->put(route('users.roles.update', $user), [])
            ->assertRedirect();

        $this->assertCount(0, $user->fresh()->roles);
    }

    public function test_invalid_role_id_fails_validation(): void
    {
        $actor = $this->createSuperAdmin();
        $user = User::factory()->create();

        $this->actingAs($actor)
            ->put(route('users.roles.update', $user), [
                'role_ids' => [999999],
            ])
            ->assertSessionHasErrors('role_ids.0');
    }
}
