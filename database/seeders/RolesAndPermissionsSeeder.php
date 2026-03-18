<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        // group_name => permissions[]
        $permissions = [
            // User Management
            'users' => [
                'admin.users',
                'admin.user.store',
                'admin.user.update',
                'admin.user.destroy',
                'admin.user.restore',
                'admin.user.forcedelete',
            ],

            // Role Management
            'roles' => [
                'admin.roles',
                'admin.role.store',
                'admin.role.update',
                'admin.role.destroy',
            ],

            // Permission Management
            'permissions' => [
                'admin.permissions',
                'admin.permission.store',
                'admin.permission.update',
                'admin.permission.destroy',
            ],
            'dashboard' => [
                'admin.dashboard',
            ],
            'settings' => [
                'manage-site',
            ],
        ];

        // Create permissions with group_name
        foreach ($permissions as $groupName => $perms) {
            foreach ($perms as $permName) {
                Permission::firstOrCreate([
                    'name'       => $permName,
                    'group_name' => $groupName,
                    'guard_name' => 'web',
                ]);
            }
        }

        // Roles
        $admin      = Role::firstOrCreate(['name' => 'admin']);
        $user       = Role::firstOrCreate(['name' => 'user']);

        // Super Admin gets everything
        $admin->syncPermissions(Permission::all());

        // Normal user (no admin access)
        $user->syncPermissions([]);
    }
}
