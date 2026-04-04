<?php

namespace App\Http\Controllers\Users;

use App\Http\Controllers\Controller;
use App\Http\Requests\Users\UserPasswordUpdateRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;

class UserPasswordController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(UserPasswordUpdateRequest $request, User $user): RedirectResponse
    {
        $this->authorize('update', $user);

        $user->update(['password' => $request->validated()['password']]);

        return back();
    }
}
