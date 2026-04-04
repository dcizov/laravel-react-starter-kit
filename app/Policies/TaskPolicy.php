<?php

namespace App\Policies;

use App\Enums\PermissionEnum;
use App\Models\Task;
use App\Models\User;

class TaskPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->can(PermissionEnum::ViewTasks->value);
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Task $task): bool
    {
        return $user->can(PermissionEnum::ViewTasks->value);
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->can(PermissionEnum::CreateTasks->value);
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Task $task): bool
    {
        return $user->can(PermissionEnum::EditTasks->value);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Task $task): bool
    {
        return $user->can(PermissionEnum::DeleteTasks->value);
    }

    /**
     * Determine whether the user can delete any model.
     */
    public function deleteAny(User $user): bool
    {
        return $user->can(PermissionEnum::DeleteTasks->value);
    }
}
