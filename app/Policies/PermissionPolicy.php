<?php

namespace App\Policies;

use App\Enums\PermissionEnum;
use App\Models\Permission;
use App\Models\User;

class PermissionPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->can(PermissionEnum::ViewPermissions->value);
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Permission $permission): bool
    {
        return $user->can(PermissionEnum::ViewPermissions->value);
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->can(PermissionEnum::CreatePermissions->value);
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Permission $permission): bool
    {
        return $user->can(PermissionEnum::EditPermissions->value);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Permission $permission): bool
    {
        return $user->can(PermissionEnum::DeletePermissions->value);
    }

    /**
     * Determine whether the user can delete any model.
     */
    public function deleteAny(User $user): bool
    {
        return $user->can(PermissionEnum::DeletePermissions->value);
    }
}
