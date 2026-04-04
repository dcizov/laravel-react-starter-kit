<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class UserUpdateTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_cannot_update_users(): void
    {
        $user = User::factory()->create();

        $this->put(route('users.update', $user), [
            'name' => 'New Name',
            'email' => $user->email,
        ])->assertRedirect(route('login'));
    }

    public function test_authenticated_user_can_update_name(): void
    {
        $actor = $this->createSuperAdmin();
        $user = User::factory()->create(['name' => 'Old Name']);

        $this->actingAs($actor)
            ->put(route('users.update', $user), [
                'name' => 'New Name',
                'email' => $user->email,
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'name' => 'New Name',
        ]);
    }

    public function test_email_change_clears_verification_and_sends_notification(): void
    {
        Notification::fake();

        $actor = $this->createSuperAdmin();
        $user = User::factory()->create(['email' => 'old@example.com']);

        $this->actingAs($actor)
            ->put(route('users.update', $user), [
                'name' => $user->name,
                'email' => 'new@example.com',
            ]);

        $user->refresh();
        $this->assertNull($user->email_verified_at);
        $this->assertSame('new@example.com', $user->email);
        Notification::assertSentTo($user, VerifyEmail::class);
    }

    public function test_email_must_be_unique_excluding_current_user(): void
    {
        $actor = $this->createSuperAdmin();
        User::factory()->create(['email' => 'taken@example.com']);
        $user = User::factory()->create(['email' => 'mine@example.com']);

        $this->actingAs($actor)
            ->put(route('users.update', $user), [
                'name' => $user->name,
                'email' => 'taken@example.com',
            ])
            ->assertSessionHasErrors('email');
    }

    public function test_user_can_keep_their_own_email(): void
    {
        $actor = $this->createSuperAdmin();
        $user = User::factory()->create(['email' => 'mine@example.com']);

        $this->actingAs($actor)
            ->put(route('users.update', $user), [
                'name' => 'Updated Name',
                'email' => 'mine@example.com',
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'name' => 'Updated Name',
        ]);
    }
}
