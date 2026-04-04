<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserTwoFactorTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_cannot_disable_two_factor(): void
    {
        $user = User::factory()->withTwoFactor()->create();

        $this->delete(route('users.two-factor.destroy', $user))
            ->assertRedirect(route('login'));
    }

    public function test_authenticated_user_can_disable_two_factor(): void
    {
        $actor = $this->createSuperAdmin();
        $user = User::factory()->withTwoFactor()->create();

        $this->assertTrue($user->hasEnabledTwoFactorAuthentication());

        $this->actingAs($actor)
            ->delete(route('users.two-factor.destroy', $user))
            ->assertRedirect();

        $user->refresh();
        $this->assertNull($user->two_factor_secret);
        $this->assertNull($user->two_factor_recovery_codes);
        $this->assertNull($user->two_factor_confirmed_at);
        $this->assertFalse($user->hasEnabledTwoFactorAuthentication());
    }

    public function test_disabling_two_factor_on_user_without_2fa_is_a_noop(): void
    {
        $actor = $this->createSuperAdmin();
        $user = User::factory()->create();

        $this->actingAs($actor)
            ->delete(route('users.two-factor.destroy', $user))
            ->assertRedirect();

        $user->refresh();
        $this->assertNull($user->two_factor_secret);
        $this->assertNull($user->two_factor_confirmed_at);
    }
}
