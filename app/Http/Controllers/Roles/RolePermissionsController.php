<?php

namespace App\Http\Controllers\Roles;

use App\Http\Controllers\Controller;
use App\Http\Requests\Roles\RolePermissionsRequest;
use App\Models\Permission;
use App\Models\Role;
use Illuminate\Http\RedirectResponse;

class RolePermissionsController extends Controller
{
    /**
     * Sync the permissions assigned to the given role.
     */
    public function __invoke(RolePermissionsRequest $request, Role $role): RedirectResponse
    {
        $this->authorize('update', $role);

        $permissionIds = $request->validated()['permission_ids'] ?? [];
        $permissions = Permission::whereIn('id', $permissionIds)->get();

        $role->syncPermissions($permissions);

        return back();
    }
}
