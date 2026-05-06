<?php

namespace Tests\Feature;

use App\Models\Candidate;
use App\Models\Election;
use App\Models\User;
use App\Models\Vote;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class VotingSystemTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->withoutVite();
    }

    public function test_voter_can_view_active_election()
    {
        $election = Election::create([
            'year' => 2026,
            'title' => 'Test Election',
            'is_active' => true,
        ]);

        $response = $this->get('/');
        
        $response->assertStatus(200);
        $response->assertSee('Test Election');
    }

    public function test_voter_can_cast_a_vote()
    {
        $election = Election::create([
            'year' => 2026,
            'title' => 'Test Election',
            'is_active' => true,
        ]);

        $candidate = Candidate::create([
            'election_id' => $election->id,
            'code' => 'test-candidate',
            'name' => 'John Doe',
            'symbol_path' => 'star',
            'vote_count' => 0,
        ]);

        $response = $this->postJson('/vote', [
            'candidate_id' => $candidate->id,
        ]);

        $response->assertStatus(200);
        $response->assertJson(['success' => true]);

        $this->assertDatabaseHas('votes', [
            'election_id' => $election->id,
            'candidate_id' => $candidate->id,
        ]);

        $this->assertDatabaseHas('candidates', [
            'id' => $candidate->id,
            'vote_count' => 1,
        ]);
    }

    public function test_voter_cannot_vote_in_closed_election()
    {
        $election = Election::create([
            'year' => 2026,
            'title' => 'Test Election',
            'is_active' => false,
        ]);

        $candidate = Candidate::create([
            'election_id' => $election->id,
            'code' => 'test-candidate',
            'name' => 'John Doe',
            'symbol_path' => 'star',
            'vote_count' => 0,
        ]);

        $response = $this->postJson('/vote', [
            'candidate_id' => $candidate->id,
        ]);

        $response->assertStatus(400);
        $response->assertJson(['success' => false]);
    }

    public function test_admin_can_login_and_access_dashboard()
    {
        $admin = User::factory()->create([
            'password' => bcrypt('password'),
        ]);

        $response = $this->post('/login', [
            'email' => $admin->email,
            'password' => 'password',
        ]);

        $response->assertRedirect('/admin');
        $this->assertAuthenticatedAs($admin);

        $dashboardResponse = $this->get('/admin');
        $dashboardResponse->assertStatus(200);
    }

    public function test_admin_can_add_candidate()
    {
        $admin = User::factory()->create();
        $election = Election::create([
            'year' => 2026,
            'title' => 'Test Election',
            'is_active' => true,
        ]);

        $response = $this->actingAs($admin)->post('/admin/candidates', [
            'election_id' => $election->id,
            'name' => 'Jane Smith',
            'code' => 'jane-smith',
            'tagline' => 'Best Candidate',
            'symbol_path' => 'heart',
        ]);

        $response->assertRedirect();
        
        $this->assertDatabaseHas('candidates', [
            'name' => 'Jane Smith',
            'code' => 'jane-smith',
        ]);
    }

    public function test_admin_can_reset_votes()
    {
        $admin = User::factory()->create();
        
        $election = Election::create([
            'year' => 2026,
            'title' => 'Test Election',
            'is_active' => true,
        ]);

        $candidate = Candidate::create([
            'election_id' => $election->id,
            'code' => 'test-candidate',
            'name' => 'John Doe',
            'symbol_path' => 'star',
            'vote_count' => 5,
        ]);

        // Seed 5 votes
        for ($i = 0; $i < 5; $i++) {
            Vote::create([
                'election_id' => $election->id,
                'candidate_id' => $candidate->id,
            ]);
        }

        $this->assertEquals(5, Vote::count());

        $response = $this->actingAs($admin)->post('/admin/results/reset');

        $response->assertRedirect('/admin/results');
        
        $this->assertEquals(0, Vote::count());
        $this->assertDatabaseHas('candidates', [
            'id' => $candidate->id,
            'vote_count' => 0,
        ]);
    }
}
