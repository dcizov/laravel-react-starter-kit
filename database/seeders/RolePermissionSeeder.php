<?php

namespace Database\Seeders;

use App\Enums\PermissionEnum;
use App\Enums\RoleEnum;
use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\PermissionRegistrar;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        foreach (PermissionEnum::cases() as $permission) {
            Permission::findOrCreate($permission->value, 'web');
        }

        $superAdmin = Role::findOrCreate(RoleEnum::SuperAdmin->value, 'web');
        $superAdmin->syncPermissions(PermissionEnum::cases());

        $adminPermissions = [
            PermissionEnum::ViewUsers,
            PermissionEnum::CreateUsers,
            PermissionEnum::EditUsers,
            PermissionEnum::DeleteUsers,
            PermissionEnum::ViewRoles,
            PermissionEnum::ViewPermissions,
            PermissionEnum::ViewTasks,
            PermissionEnum::CreateTasks,
            PermissionEnum::EditTasks,
            PermissionEnum::DeleteTasks,
        ];

        Role::findOrCreate(RoleEnum::Admin->value, 'web')
            ->syncPermissions($adminPermissions);

        $userPermissions = [
            PermissionEnum::ViewTasks,
            PermissionEnum::CreateTasks,
            PermissionEnum::EditTasks,
            PermissionEnum::DeleteTasks,
        ];

        Role::findOrCreate(RoleEnum::User->value, 'web')
            ->syncPermissions($userPermissions);

        $users = [
            'superadmin@example.com' => RoleEnum::SuperAdmin->value,
            'admin@example.com' => RoleEnum::Admin->value,
            'user@example.com' => RoleEnum::User->value,
        ];

        foreach ($users as $email => $role) {
            $user = User::where('email', $email)->first();
            if ($user) {
                $user->assignRole($role);
            }
        }
    }
}
