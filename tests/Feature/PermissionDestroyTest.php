<?php

namespace Tests\Feature;

use App\Models\Permission;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PermissionDestroyTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_cannot_delete_a_permission(): void
    {
        $permission = Permission::create(['name' => 'edit posts', 'guard_name' => 'web']);

        $this->delete(route('permissions.destroy', $permission))
            ->assertRedirect(route('login'));
    }

    public function test_authenticated_user_can_delete_a_permission(): void
    {
        $actor = $this->createSuperAdmin();
        $permission = Permission::create(['name' => 'edit posts', 'guard_name' => 'web']);

        $this->actingAs($actor)
            ->delete(route('permissions.destroy', $permission))
            ->assertRedirect(route('permissions.index'));

        $this->assertDatabaseMissing('permissions', ['id' => $permission->id]);
    }

    public function test_deleting_a_non_existent_permission_returns_404(): void
    {
        $actor = $this->createSuperAdmin();

        $this->actingAs($actor)
            ->delete(route('permissions.destroy', 99999))
            ->assertNotFound();
    }
}
