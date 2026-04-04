<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserDestroyTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_cannot_delete_a_user(): void
    {
        $user = User::factory()->create();

        $this->delete(route('users.destroy', $user))
            ->assertRedirect(route('login'));
    }

    public function test_authenticated_user_can_delete_a_user(): void
    {
        $actor = $this->createSuperAdmin();
        $user = User::factory()->create();

        $this->actingAs($actor)
            ->delete(route('users.destroy', $user))
            ->assertRedirect(route('users.index'));

        $this->assertDatabaseMissing('users', ['id' => $user->id]);
    }

    public function test_guests_cannot_bulk_delete_users(): void
    {
        $users = User::factory()->count(3)->create();

        $this->delete(route('users.destroy-bulk'), [
            'ids' => $users->pluck('id')->toArray(),
        ])->assertRedirect(route('login'));
    }

    public function test_authenticated_user_can_bulk_delete_users(): void
    {
        $actor = $this->createSuperAdmin();
        $users = User::factory()->count(3)->create();
        $ids = $users->pluck('id')->toArray();

        $this->actingAs($actor)
            ->delete(route('users.destroy-bulk'), ['ids' => $ids])
            ->assertRedirect(route('users.index'));

        foreach ($ids as $id) {
            $this->assertDatabaseMissing('users', ['id' => $id]);
        }
    }

    public function test_bulk_delete_requires_ids(): void
    {
        $actor = $this->createSuperAdmin();

        $this->actingAs($actor)
            ->delete(route('users.destroy-bulk'), [])
            ->assertSessionHasErrors('ids');
    }

    public function test_bulk_delete_rejects_non_existent_ids(): void
    {
        $actor = $this->createSuperAdmin();

        $this->actingAs($actor)
            ->delete(route('users.destroy-bulk'), ['ids' => [99999]])
            ->assertSessionHasErrors('ids.0');
    }
}
