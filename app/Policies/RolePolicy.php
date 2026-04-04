<?php

namespace App\Policies;

use App\Enums\PermissionEnum;
use App\Models\Role;
use App\Models\User;

class RolePolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->can(PermissionEnum::ViewRoles->value);
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Role $role): bool
    {
        return $user->can(PermissionEnum::ViewRoles->value);
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->can(PermissionEnum::CreateRoles->value);
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Role $role): bool
    {
        return $user->can(PermissionEnum::EditRoles->value);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Role $role): bool
    {
        return $user->can(PermissionEnum::DeleteRoles->value);
    }

    /**
     * Determine whether the user can delete any model.
     */
    public function deleteAny(User $user): bool
    {
        return $user->can(PermissionEnum::DeleteRoles->value);
    }
}
