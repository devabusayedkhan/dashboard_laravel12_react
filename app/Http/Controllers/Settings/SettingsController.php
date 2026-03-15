<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use App\Models\Settings;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SettingsController extends Controller
{
    public function index(): Response
    {
        $settings = Settings::first();

        $contacts = Contact::query()
            ->select([
                'id',
                'name',
                'icon',
                'color',
                'photo',
                'url',
                'order',
                'status',
            ])
            ->orderBy('order')
            ->get();

        return Inertia::render('admin/site-settings', [
            'siteSettings' => $settings,
            'contacts' => $contacts,
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $settings = Settings::first();

        $validated = $request->validate([
            'logo' => ['nullable', 'image', 'mimes:jpg,jpeg,png,svg,webp', 'max:2048'],
            'favicon' => ['nullable', 'image', 'mimes:png,ico,svg', 'max:1024'],

            'address' => ['nullable', 'string'],
            'shop_address' => ['nullable', 'string'],

            'inside_dhaka_delivery' => ['nullable', 'integer', 'min:0'],
            'outside_dhaka_delivery' => ['nullable', 'integer', 'min:0'],

            'meta_title' => ['nullable', 'string', 'max:255'],
            'meta_description' => ['nullable', 'string'],
            'meta_keywords' => ['nullable', 'string'],

            'privacy_policy' => ['nullable', 'string'],
            'terms_condition' => ['nullable', 'string'],
            'copyright' => ['nullable', 'string'],
        ]);

        if ($request->hasFile('logo')) {
            $this->fileDelete($settings->logo);
            $validated['logo'] = $this->fileUpload($request->file('logo'), 'logo');
        }

        if ($request->hasFile('favicon')) {
            $this->fileDelete($settings->favicon);
            $validated['favicon'] = $this->fileUpload($request->file('favicon'), 'favicon');
        }

        $settings->update($validated);

        return back()->with('success', 'Site settings updated successfully.');
    }
}
