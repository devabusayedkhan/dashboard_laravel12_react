<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Settings extends Model
{
    protected $fillable = [
        'logo',
        'favicon',

        'address',
        'shop_address',

        'inside_dhaka_delivery',
        'outside_dhaka_delivery',

        'meta_title',
        'meta_description',
        'meta_keywords',
        
        'privacy_policy',
        'terms_condition',

        'copyright',
    ];
}
