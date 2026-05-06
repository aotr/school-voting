<?php

namespace App\Http\Controllers;

use App\Models\Election;
use App\Models\Vote;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class VoteController extends Controller
{
    public function index()
    {
        $election = Election::where('is_active', true)->with('candidates')->first();
        
        return view('voter.index', compact('election'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'candidate_id' => 'required|exists:candidates,id',
        ]);

        $election = Election::where('is_active', true)->first();
        
        if (!$election) {
            return response()->json(['success' => false, 'message' => 'No active election.'], 400);
        }

        try {
            DB::transaction(function () use ($election, $request) {
                // Record the vote
                Vote::create([
                    'election_id' => $election->id,
                    'candidate_id' => $request->candidate_id,
                ]);

                // Increment candidate vote count
                $candidate = $election->candidates()->find($request->candidate_id);
                $candidate->increment('vote_count');
            });

            return response()->json(['success' => true, 'message' => 'Vote recorded successfully.']);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Failed to record vote.'], 500);
        }
    }
}
