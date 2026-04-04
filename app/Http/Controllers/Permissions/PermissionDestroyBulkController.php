<?php

namespace App\Http\Controllers\Permissions;

use App\Http\Controllers\Controller;
use App\Models\Permission;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class PermissionDestroyBulkController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request): RedirectResponse
    {
        $this->authorize('deleteAny', Permission::class);

        $request->validate([
            'ids' => ['required', 'array'],
            'ids.*' => ['required', 'integer', 'exists:permissions,id'],
        ]);

        Permission::whereIn('id', $request->ids)->delete();

        return to_route('permissions.index');
    }
}
