<?php

namespace App\Http\Controllers;

use App\Models\Candidate;
use App\Models\Election;
use App\Models\Vote;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    public function dashboard()
    {
        $election = Election::latest()->first();
        $totalVotes = Vote::count();
        $candidatesCount = Candidate::count();

        return view('admin.dashboard', compact('election', 'totalVotes', 'candidatesCount'));
    }

    public function results()
    {
        $election = Election::where('is_active', true)->first() ?? Election::latest()->first();
        $candidates = [];
        $totalVotes = 0;

        if ($election) {
            $totalVotes = $election->votes()->count();
            $candidates = $election->candidates()->orderBy('vote_count', 'desc')->get();
        }

        return view('admin.results', compact('election', 'candidates', 'totalVotes'));
    }

    public function resetVotes(Request $request)
    {
        $election = Election::where('is_active', true)->first();
        if ($election) {
            DB::transaction(function () use ($election) {
                $election->votes()->delete();
                $election->candidates()->update(['vote_count' => 0]);
            });
        }

        return redirect()->route('admin.results')->with('success', 'All votes have been reset.');
    }
}
