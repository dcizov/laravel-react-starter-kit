<?php

namespace App\Http\Controllers\Roles;

use App\Http\Controllers\Controller;
use App\Http\Requests\Roles\RoleIndexRequest;
use App\Http\Requests\Roles\RoleStoreRequest;
use App\Http\Requests\Roles\RoleUpdateRequest;
use App\Http\Resources\RoleResource;
use App\Models\Permission;
use App\Models\Role;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class RoleController extends Controller
{
    /**
     * Display a listing of roles.
     */
    public function index(RoleIndexRequest $request): Response
    {
        $this->authorize('viewAny', Role::class);

        $filters = $request->filters();

        $roles = Role::query()
            ->select(Role::INDEX_COLUMNS)
            ->with('permissions:id,name')
            ->withCount('users')
            ->filter($filters)
            ->sorted($filters['sortBy'], $filters['sortDir'], Role::SORTABLE)
            ->paginate($filters['perPage'])
            ->withQueryString();

        return Inertia::render('roles/index', [
            'roles' => [
                'data' => collect($roles->items())->map(fn (Role $role) => (new RoleResource($role))->resolve())->values(),
                'current_page' => $roles->currentPage(),
                'per_page' => $roles->perPage(),
                'total' => $roles->total(),
                'last_page' => $roles->lastPage(),
            ],
            'filters' => $filters,
            'perPageOptions' => Role::PER_PAGE_OPTIONS,
            'guardOptions' => fn () => Role::query()->distinct()->orderBy('guard_name')->pluck('guard_name'),
            'permissions' => fn () => Permission::pluck('name', 'id'),
        ]);
    }

    /**
     * Store a newly created role.
     */
    public function store(RoleStoreRequest $request): RedirectResponse
    {
        $this->authorize('create', Role::class);

        $validated = $request->validated();
        $role = Role::create($validated);
        $permissions = Permission::whereIn('id', $validated['permission_ids'] ?? [])->get();
        $role->syncPermissions($permissions);

        return to_route('roles.index');
    }

    /**
     * Update the specified role.
     */
    public function update(RoleUpdateRequest $request, Role $role): RedirectResponse
    {
        $this->authorize('update', $role);

        $validated = $request->validated();
        $role->update($validated);
        $permissions = Permission::whereIn('id', $validated['permission_ids'] ?? [])->get();
        $role->syncPermissions($permissions);

        return to_route('roles.index');
    }

    /**
     * Remove the specified role.
     */
    public function destroy(Role $role): RedirectResponse
    {
        $this->authorize('delete', $role);

        $role->delete();

        return to_route('roles.index');
    }
}
