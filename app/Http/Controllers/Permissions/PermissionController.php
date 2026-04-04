<?php

namespace App\Http\Controllers\Permissions;

use App\Http\Controllers\Controller;
use App\Http\Requests\Permissions\PermissionIndexRequest;
use App\Http\Requests\Permissions\PermissionStoreRequest;
use App\Http\Requests\Permissions\PermissionUpdateRequest;
use App\Http\Resources\PermissionResource;
use App\Models\Permission;
use App\Models\Role;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class PermissionController extends Controller
{
    /**
     * Display a listing of permissions.
     */
    public function index(PermissionIndexRequest $request): Response
    {
        $this->authorize('viewAny', Permission::class);

        $filters = $request->filters();

        $permissions = Permission::query()
            ->select(Permission::INDEX_COLUMNS)
            ->with('roles:id,name')
            ->filter($filters)
            ->sorted($filters['sortBy'], $filters['sortDir'], Permission::SORTABLE)
            ->paginate($filters['perPage'])
            ->withQueryString();

        return Inertia::render('permissions/index', [
            'permissions' => [
                'data' => collect($permissions->items())->map(fn (Permission $permission) => (new PermissionResource($permission))->resolve())->values(),
                'current_page' => $permissions->currentPage(),
                'per_page' => $permissions->perPage(),
                'total' => $permissions->total(),
                'last_page' => $permissions->lastPage(),
            ],
            'filters' => $filters,
            'perPageOptions' => Permission::PER_PAGE_OPTIONS,
            'roleOptions' => Role::query()->orderBy('name')->pluck('name'),
        ]);
    }

    /**
     * Store a newly created permission.
     */
    public function store(PermissionStoreRequest $request): RedirectResponse
    {
        $this->authorize('create', Permission::class);

        Permission::create($request->validated());

        return to_route('permissions.index');
    }

    /**
     * Update the specified permission.
     */
    public function update(PermissionUpdateRequest $request, Permission $permission): RedirectResponse
    {
        $this->authorize('update', $permission);

        $permission->update($request->validated());

        return to_route('permissions.index');
    }

    /**
     * Remove the specified permission.
     */
    public function destroy(Permission $permission): RedirectResponse
    {
        $this->authorize('delete', $permission);

        $permission->delete();

        return to_route('permissions.index');
    }
}
