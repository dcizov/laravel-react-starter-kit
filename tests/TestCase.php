<?php

namespace Tests;

use App\Enums\RoleEnum;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use Laravel\Fortify\Features;

abstract class TestCase extends BaseTestCase
{
    /**
     * Create a user with the super-admin role, granting all permissions.
     * Use this as the acting user in tests that are not specifically testing authorization.
     */
    protected function createSuperAdmin(): User
    {
        $user = User::factory()->create();
        $role = Role::findOrCreate(RoleEnum::SuperAdmin->value, 'web');
        $user->assignRole($role);

        return $user;
    }

    protected function skipUnlessFortifyHas(string $feature, ?string $message = null): void
    {
        if (! Features::enabled($feature)) {
            $this->markTestSkipped($message ?? "Fortify feature [{$feature}] is not enabled.");
        }
    }
}
