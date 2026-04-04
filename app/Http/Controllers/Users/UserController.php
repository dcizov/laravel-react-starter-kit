<?php

namespace App\Http\Controllers\Users;

use App\Http\Controllers\Controller;
use App\Http\Requests\Users\UserIndexRequest;
use App\Http\Requests\Users\UserStoreRequest;
use App\Http\Requests\Users\UserUpdateRequest;
use App\Http\Resources\UserResource;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    /**
     * Display a listing of all users.
     */
    public function index(UserIndexRequest $request): Response
    {
        $this->authorize('viewAny', User::class);

        $filters = $request->filters();

        $users = User::query()
            ->select(User::INDEX_COLUMNS)
            ->with('roles:id,name,guard_name,created_at,updated_at')
            ->filter($filters)
            ->sorted($filters['sortBy'], $filters['sortDir'], User::SORTABLE)
            ->paginate($filters['perPage'])
            ->withQueryString();

        return Inertia::render('users/index', [
            'users' => [
                'data' => collect($users->items())->map(fn (User $user) => (new UserResource($user))->resolve())->values(),
                'current_page' => $users->currentPage(),
                'per_page' => $users->perPage(),
                'total' => $users->total(),
                'last_page' => $users->lastPage(),
            ],
            'filters' => $filters,
            'perPageOptions' => User::PER_PAGE_OPTIONS,
            'roles' => Inertia::once(fn () => Role::orderBy('name')->pluck('name', 'id')),
            'roleOptions' => Inertia::once(fn () => Role::orderBy('name')->pluck('name')),
        ]);
    }

    /**
     * Store a newly created user in storage.
     */
    public function store(UserStoreRequest $request): RedirectResponse
    {
        $this->authorize('create', User::class);

        $user = User::create($request->safe()->except('role_ids'));

        if ($request->filled('role_ids')) {

            $roleIds = $request->validated()['role_ids'] ?? [];
            $roles = Role::whereIn('id', $roleIds)->get();

            $user->syncRoles($roles);
        }

        return to_route('users.index');
    }

    /**
     * Update the user's profile information.
     */
    public function update(UserUpdateRequest $request, User $user): RedirectResponse
    {
        $this->authorize('update', $user);

        $user->fill($request->validated());

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
            $user->save();
            $user->sendEmailVerificationNotification();
        } else {
            $user->save();
        }

        return back();
    }

    /**
     * Remove the specified user from storage.
     */
    public function destroy(User $user): RedirectResponse
    {
        $this->authorize('delete', $user);

        $user->delete();

        return to_route('users.index');
    }
}
