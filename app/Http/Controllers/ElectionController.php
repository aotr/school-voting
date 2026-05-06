<?php

namespace App\Http\Controllers;

use App\Models\Election;
use Illuminate\Http\Request;

class ElectionController extends Controller
{
    public function update(Request $request, Election $election)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'year' => 'required|integer',
            'is_active' => 'boolean',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:10240',
        ]);

        $data = $request->except('logo');

        if ($request->hasFile('logo')) {
            $path = $request->file('logo')->store('logos', 'public');
            $data['logo_path'] = 'storage/' . $path;
        }

        // If making this active, deactivate others
        if ($request->is_active) {
            Election::where('id', '!=', $election->id)->update(['is_active' => false]);
        }

        $election->update($data);

        return back()->with('success', 'Election updated successfully.');
    }
}
