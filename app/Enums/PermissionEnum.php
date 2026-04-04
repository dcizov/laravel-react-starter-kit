<?php

namespace App\Enums;

/**
 * RBAC permission strings for this application.
 *
 * @see Database\Seeders\RolePermissionSeeder
 * @see https://spatie.be/docs/laravel-permission/basic-usage/permissions
 */
enum PermissionEnum: string
{
    // Users
    case ViewUsers = 'view-users';
    case CreateUsers = 'create-users';
    case EditUsers = 'edit-users';
    case DeleteUsers = 'delete-users';

    // Roles
    case ViewRoles = 'view-roles';
    case CreateRoles = 'create-roles';
    case EditRoles = 'edit-roles';
    case DeleteRoles = 'delete-roles';

    // Permissions
    case ViewPermissions = 'view-permissions';
    case CreatePermissions = 'create-permissions';
    case EditPermissions = 'edit-permissions';
    case DeletePermissions = 'delete-permissions';

    // Tasks
    case ViewTasks = 'view-tasks';
    case CreateTasks = 'create-tasks';
    case EditTasks = 'edit-tasks';
    case DeleteTasks = 'delete-tasks';
}
