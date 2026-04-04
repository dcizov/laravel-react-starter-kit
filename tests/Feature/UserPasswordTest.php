<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class UserPasswordTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_cannot_update_a_user_password(): void
    {
        $user = User::factory()->create();

        $this->put(route('users.password.update', $user), [
            'password' => 'NewPassword1!',
            'password_confirmation' => 'NewPassword1!',
        ])->assertRedirect(route('login'));
    }

    public function test_authenticated_user_can_update_a_user_password(): void
    {
        $actor = $this->createSuperAdmin();
        $user = User::factory()->create();

        $this->actingAs($actor)
            ->put(route('users.password.update', $user), [
                'password' => 'NewPassword1!',
                'password_confirmation' => 'NewPassword1!',
            ])
            ->assertRedirect();

        $user->refresh();
        $this->assertTrue(Hash::check('NewPassword1!', $user->password));
    }

    public function test_password_must_be_confirmed(): void
    {
        $actor = $this->createSuperAdmin();
        $user = User::factory()->create();

        $this->actingAs($actor)
            ->put(route('users.password.update', $user), [
                'password' => 'NewPassword1!',
                'password_confirmation' => 'different',
            ])
            ->assertSessionHasErrors('password');
    }

    public function test_password_is_required(): void
    {
        $actor = $this->createSuperAdmin();
        $user = User::factory()->create();

        $this->actingAs($actor)
            ->put(route('users.password.update', $user), [
                'password' => '',
                'password_confirmation' => '',
            ])
            ->assertSessionHasErrors('password');
    }
}
