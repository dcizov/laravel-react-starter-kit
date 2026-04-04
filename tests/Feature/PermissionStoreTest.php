<?php

namespace Tests\Feature;

use App\Models\Permission;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PermissionStoreTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_cannot_create_permissions(): void
    {
        $this->post(route('permissions.store'), [
            'name' => 'edit posts',
            'guard_name' => 'web',
        ])->assertRedirect(route('login'));
    }

    public function test_authenticated_user_can_create_a_permission(): void
    {
        $actor = $this->createSuperAdmin();

        $this->actingAs($actor)
            ->post(route('permissions.store'), [
                'name' => 'edit posts',
                'guard_name' => 'web',
            ])
            ->assertRedirect(route('permissions.index'));

        $this->assertDatabaseHas('permissions', [
            'name' => 'edit posts',
            'guard_name' => 'web',
        ]);
    }

    public function test_name_is_required(): void
    {
        $actor = $this->createSuperAdmin();

        $this->actingAs($actor)
            ->post(route('permissions.store'), [
                'name' => '',
                'guard_name' => 'web',
            ])
            ->assertSessionHasErrors('name');
    }

    public function test_guard_name_is_required(): void
    {
        $actor = $this->createSuperAdmin();

        $this->actingAs($actor)
            ->post(route('permissions.store'), [
                'name' => 'edit posts',
                'guard_name' => '',
            ])
            ->assertSessionHasErrors('guard_name');
    }

    public function test_name_must_be_unique(): void
    {
        Permission::create(['name' => 'edit posts', 'guard_name' => 'web']);
        $actor = $this->createSuperAdmin();

        $this->actingAs($actor)
            ->post(route('permissions.store'), [
                'name' => 'edit posts',
                'guard_name' => 'web',
            ])
            ->assertSessionHasErrors('name');
    }
}
