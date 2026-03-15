<?php

namespace App\Http\Middleware;

use App\Models\Contact;
use App\Models\Settings;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */


    public function share(Request $request): array
    {
        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $request->user(),
                'permissions' => fn() => $request->user()
                    ? $request->user()->getAllPermissions()->pluck('name')->values()
                    : [],
                'roles' => fn() => $request->user()
                    ? $request->user()->getRoleNames()->values()
                    : [],
            ],

            'settings' => fn() => $this->getSettings(),

        ]);
    }

    //----------Settings--------------
    protected function getSettings(): array
    {
        $settings = Settings::query()
            ->select([
                'logo',
                'favicon',
                'address',
                'shop_address',
                'copyright',
            ])
            ->first();

        $contact = Contact::query()
            ->where('status', true)
            ->orderBy('order')
            ->get();

        return [

            'logo' => $settings?->logo
                ? asset($settings?->logo)
                : asset('logo/logo.png'),

            'favicon' => $settings?->favicon
                ? asset($settings?->favicon)
                : asset('logo/favicon.png'),
            'address' => $settings?->address ?? '',
            'shop_address' => $settings?->shop_address ?? '',
            'copyright' => $settings?->copyright ?? '',

            'contact' => $contact,
        ];
    }
    // ----------End Settings----------------
}
