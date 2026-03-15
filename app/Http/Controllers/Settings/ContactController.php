<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'icon' => ['nullable', 'string', 'max:255'],
            'color' => ['nullable', 'string', 'max:20'],
            'photo' => ['nullable', 'image', 'mimes:jpg,jpeg,png,svg,webp', 'max:2048'],
            'url' => ['required', 'string', 'max:255'],
            'order' => ['nullable', 'integer', 'min:0'],
            'status' => ['required', 'boolean'],
        ]);

        if ($request->hasFile('photo')) {
            $validated['photo'] = $this->fileUpload($request->file('photo'), 'social-and-contact-icon');
        }

        $maxOrder = Contact::max('order');

        if (! isset($validated['order']) || $validated['order'] === null) {
            $validated['order'] = is_null($maxOrder) ? 0 : $maxOrder + 1;
        } else {
            $newOrder = (int) $validated['order'];

            Contact::where('order', '>=', $newOrder)->increment('order');

            $validated['order'] = $newOrder;
        }

        Contact::create($validated);

        return back()->with('success', 'Contact created successfully.');
    }

    public function update(Request $request, Contact $contact): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'icon' => ['nullable', 'string', 'max:255'],
            'color' => ['nullable', 'string', 'max:20'],
            'photo' => ['nullable', 'image', 'mimes:jpg,jpeg,png,svg,webp', 'max:2048'],
            'url' => ['required', 'string', 'max:255'],
            'order' => [
                'required',
                'integer',
                'min:0',
                'unique:contacts,order,' . $contact->id,
            ],
            'status' => ['required', 'boolean'],
        ]);

        if ($request->hasFile('photo')) {
            if ($contact->photo) {
                $this->fileDelete($contact->photo);
            }

            $validated['photo'] = $this->fileUpload(
                $request->file('photo'),
                'social-and-contact-icon'
            );
        }

        $contact->update($validated);

        return back()->with('success', 'Contact updated successfully.');
    }

    public function reorder(Request $request)
    {
        $validated = $request->validate([
            'contacts' => ['required', 'array'],
            'contacts.*.id' => ['required', 'integer', 'exists:contacts,id'],
            'contacts.*.order' => ['required', 'integer', 'min:1'],
        ]);

        foreach ($validated['contacts'] as $item) {
            Contact::where('id', $item['id'])->update([
                'order' => $item['order'],
            ]);
        }

        return back()->with('success', 'Contact order updated successfully.');
    }

    public function destroy(Contact $contact): RedirectResponse
    {
        if ($contact->photo) {
            $this->fileDelete($contact->photo);
        }

        $contact->delete();

        Contact::query()
            ->orderBy('order')
            ->get()
            ->each(function ($item, $index) {
                Contact::where('id', $item->id)->update([
                    'order' => $index + 1,
                ]);
            });

        return back()->with('success', 'Contact deleted successfully.');
    }
}
