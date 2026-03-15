<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            RolesAndPermissionsSeeder::class,
            SettingsSeeder::class,
        ]);

        $user = User::factory()->create([
            'name' => 'Abu Sayed Khan',
            'phone' => '+8801601064020',
            'email' => 'devabusayedkhan@gmail.com',
            'password' => '11111111',
        ]);

        $user->assignRole('admin');
    }
}