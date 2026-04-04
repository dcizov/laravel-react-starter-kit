<?php

namespace Tests\Feature;

use App\Models\Permission;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PermissionDestroyBulkTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_cannot_bulk_delete_permissions(): void
    {
        $permissions = collect([
            Permission::create(['name' => 'edit posts', 'guard_name' => 'web']),
            Permission::create(['name' => 'delete posts', 'guard_name' => 'web']),
            Permission::create(['name' => 'publish posts', 'guard_name' => 'web']),
        ]);

        $this->delete(route('permissions.destroy-bulk'), [
            'ids' => $permissions->pluck('id')->toArray(),
        ])->assertRedirect(route('login'));
    }

    public function test_authenticated_user_can_bulk_delete_permissions(): void
    {
        $actor = $this->createSuperAdmin();
        $permissions = collect([
            Permission::create(['name' => 'edit posts', 'guard_name' => 'web']),
            Permission::create(['name' => 'delete posts', 'guard_name' => 'web']),
            Permission::create(['name' => 'publish posts', 'guard_name' => 'web']),
        ]);
        $ids = $permissions->pluck('id')->toArray();

        $this->actingAs($actor)
            ->delete(route('permissions.destroy-bulk'), ['ids' => $ids])
            ->assertRedirect(route('permissions.index'));

        foreach ($ids as $id) {
            $this->assertDatabaseMissing('permissions', ['id' => $id]);
        }
    }

    public function test_bulk_delete_requires_ids(): void
    {
        $actor = $this->createSuperAdmin();

        $this->actingAs($actor)
            ->delete(route('permissions.destroy-bulk'), [])
            ->assertSessionHasErrors('ids');
    }

    public function test_bulk_delete_rejects_non_existent_ids(): void
    {
        $actor = $this->createSuperAdmin();

        $this->actingAs($actor)
            ->delete(route('permissions.destroy-bulk'), ['ids' => [99999]])
            ->assertSessionHasErrors('ids.0');
    }
}
