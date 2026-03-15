<?php

namespace Database\Seeders;

use App\Models\Contact;
use App\Models\Settings;
use Illuminate\Database\Seeder;

class SettingsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Settings::create([
            'logo' => null,
            'favicon' => null,

            'address' => '',
            'shop_address' => '',

            'inside_dhaka_delivery' => 0,
            'outside_dhaka_delivery' => 0,

            'meta_title' => '',
            'meta_description' => '',
            'meta_keywords' => '',

            'privacy_policy' => '',
            'terms_condition' => '',
            'copyright' => '© ' . date('Y') . 'Abu Sayed khan. All rights reserved.',
        ]);

        Contact::create([
            'name' => 'phone',
            'icon' => 'fas fa-phone',
            'color' => '#28a745',
            'url' => 'tel:+8801601064020',
            'order' => 1,
            'status' => true,
        ]);
    }
}
