<?php

namespace App\Http\Controllers\Users;

use App\Http\Controllers\Controller;
use App\Http\Requests\Users\UserRolesRequest;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\RedirectResponse;

class UserRolesController extends Controller
{
    /**
     * Sync the roles assigned to the given user.
     */
    public function __invoke(UserRolesRequest $request, User $user): RedirectResponse
    {
        $this->authorize('update', $user);

        $roleIds = $request->validated()['role_ids'] ?? [];
        $roles = Role::whereIn('id', $roleIds)->get();

        $user->syncRoles($roles);

        return back();
    }
}
