<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserStoreTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_cannot_create_users(): void
    {
        $this->post(route('users.store'), [
            'name' => 'New User',
            'email' => 'new@example.com',
            'password' => 'Password1!',
            'password_confirmation' => 'Password1!',
        ])->assertRedirect(route('login'));
    }

    public function test_authenticated_user_can_create_a_user(): void
    {
        $actor = $this->createSuperAdmin();

        $this->actingAs($actor)
            ->post(route('users.store'), [
                'name' => 'Jane Doe',
                'email' => 'jane@example.com',
                'password' => 'Password1!',
                'password_confirmation' => 'Password1!',
            ])
            ->assertRedirect(route('users.index'));

        $this->assertDatabaseHas('users', [
            'name' => 'Jane Doe',
            'email' => 'jane@example.com',
        ]);
    }

    public function test_name_is_required(): void
    {
        $actor = $this->createSuperAdmin();

        $this->actingAs($actor)
            ->post(route('users.store'), [
                'name' => '',
                'email' => 'jane@example.com',
                'password' => 'Password1!',
                'password_confirmation' => 'Password1!',
            ])
            ->assertSessionHasErrors('name');
    }

    public function test_email_must_be_unique(): void
    {
        User::factory()->create(['email' => 'taken@example.com']);
        $actor = $this->createSuperAdmin();

        $this->actingAs($actor)
            ->post(route('users.store'), [
                'name' => 'Another User',
                'email' => 'taken@example.com',
                'password' => 'Password1!',
                'password_confirmation' => 'Password1!',
            ])
            ->assertSessionHasErrors('email');
    }

    public function test_password_must_be_confirmed(): void
    {
        $actor = $this->createSuperAdmin();

        $this->actingAs($actor)
            ->post(route('users.store'), [
                'name' => 'Jane Doe',
                'email' => 'jane@example.com',
                'password' => 'Password1!',
                'password_confirmation' => 'different',
            ])
            ->assertSessionHasErrors('password');
    }
}
