<?php

namespace Tests\Feature;

use App\Models\Role;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RoleDestroyTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_cannot_delete_a_role(): void
    {
        $role = Role::create(['name' => 'editor', 'guard_name' => 'web']);

        $this->delete(route('roles.destroy', $role))
            ->assertRedirect(route('login'));
    }

    public function test_authenticated_user_can_delete_a_role(): void
    {
        $actor = $this->createSuperAdmin();
        $role = Role::create(['name' => 'editor', 'guard_name' => 'web']);

        $this->actingAs($actor)
            ->delete(route('roles.destroy', $role))
            ->assertRedirect(route('roles.index'));

        $this->assertDatabaseMissing('roles', ['id' => $role->id]);
    }

    public function test_deleting_a_non_existent_role_returns_404(): void
    {
        $actor = $this->createSuperAdmin();

        $this->actingAs($actor)
            ->delete(route('roles.destroy', 99999))
            ->assertNotFound();
    }
}
