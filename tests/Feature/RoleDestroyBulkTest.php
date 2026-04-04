<?php

namespace Tests\Feature;

use App\Models\Role;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RoleDestroyBulkTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_cannot_bulk_delete_roles(): void
    {
        $roles = collect([
            Role::create(['name' => 'editor', 'guard_name' => 'web']),
            Role::create(['name' => 'viewer', 'guard_name' => 'web']),
            Role::create(['name' => 'manager', 'guard_name' => 'web']),
        ]);

        $this->delete(route('roles.destroy-bulk'), [
            'ids' => $roles->pluck('id')->toArray(),
        ])->assertRedirect(route('login'));
    }

    public function test_authenticated_user_can_bulk_delete_roles(): void
    {
        $actor = $this->createSuperAdmin();
        $roles = collect([
            Role::create(['name' => 'editor', 'guard_name' => 'web']),
            Role::create(['name' => 'viewer', 'guard_name' => 'web']),
            Role::create(['name' => 'manager', 'guard_name' => 'web']),
        ]);
        $ids = $roles->pluck('id')->toArray();

        $this->actingAs($actor)
            ->delete(route('roles.destroy-bulk'), ['ids' => $ids])
            ->assertRedirect(route('roles.index'));

        foreach ($ids as $id) {
            $this->assertDatabaseMissing('roles', ['id' => $id]);
        }
    }

    public function test_bulk_delete_requires_ids(): void
    {
        $actor = $this->createSuperAdmin();

        $this->actingAs($actor)
            ->delete(route('roles.destroy-bulk'), [])
            ->assertSessionHasErrors('ids');
    }

    public function test_bulk_delete_rejects_non_existent_ids(): void
    {
        $actor = $this->createSuperAdmin();

        $this->actingAs($actor)
            ->delete(route('roles.destroy-bulk'), ['ids' => [99999]])
            ->assertSessionHasErrors('ids.0');
    }
}
