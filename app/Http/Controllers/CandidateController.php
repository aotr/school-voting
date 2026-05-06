<?php

namespace App\Http\Controllers;

use App\Models\Candidate;
use App\Models\Election;
use Illuminate\Http\Request;

class CandidateController extends Controller
{
    public function index()
    {
        $election = Election::latest()->first();
        $candidates = $election ? $election->candidates : collect();
        return view('admin.candidates', compact('election', 'candidates'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'election_id' => 'required|exists:elections,id',
            'name' => 'required|string|max:255',
            'code' => 'required|string|unique:candidates,code',
            'tagline' => 'nullable|string|max:255',
            'symbol' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:10240',
        ]);

        $data = $request->except('symbol');
        
        if ($request->hasFile('symbol')) {
            $path = $request->file('symbol')->store('symbols', 'public');
            $data['symbol_path'] = 'storage/' . $path;
        } else {
            $data['symbol_path'] = 'assets/symbols/clock.svg'; // Default
        }

        Candidate::create($data);

        return back()->with('success', 'Candidate added successfully.');
    }

    public function edit(Candidate $candidate)
    {
        return view('admin.candidates.edit', compact('candidate'));
    }

    public function update(Request $request, Candidate $candidate)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|unique:candidates,code,' . $candidate->id,
            'tagline' => 'nullable|string|max:255',
            'symbol' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:10240',
        ]);

        $data = $request->except('symbol');

        if ($request->hasFile('symbol')) {
            $path = $request->file('symbol')->store('symbols', 'public');
            $data['symbol_path'] = 'storage/' . $path;
        }

        $candidate->update($data);

        return redirect()->route('admin.candidates')->with('success', 'Candidate updated successfully.');
    }

    public function destroy(Candidate $candidate)
    {
        $candidate->delete();
        return back()->with('success', 'Candidate removed successfully.');
    }
}
