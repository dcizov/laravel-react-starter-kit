<?php

namespace App\Enums;

/**
 * Built-in application roles.
 *
 * SuperAdmin bypasses all policy checks via a Gate before hook.
 *
 * @see App\Providers\AppServiceProvider::configureAuthorization()
 * @see https://spatie.be/docs/laravel-permission/basic-usage/role-permissions
 */
enum RoleEnum: string
{
    case SuperAdmin = 'super-admin';
    case Admin = 'admin';
    case User = 'user';
}
