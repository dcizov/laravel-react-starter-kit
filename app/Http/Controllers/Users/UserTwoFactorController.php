<?php

namespace App\Http\Controllers\Users;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;

class UserTwoFactorController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(User $user): RedirectResponse
    {
        $this->authorize('update', $user);

        $user->forceFill([
            'two_factor_secret' => null,
            'two_factor_recovery_codes' => null,
            'two_factor_confirmed_at' => null,
        ])->save();

        return back();
    }
}
