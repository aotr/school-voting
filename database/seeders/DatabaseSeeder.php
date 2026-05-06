<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory()->create([
            'name' => 'Administrator',
            'email' => 'admin@example.com',
            'password' => bcrypt('admin123'),
        ]);

        $election = \App\Models\Election::create([
            'year' => 2026,
            'title' => 'School Election 2026',
            'is_active' => true,
        ]);

        $candidates = [
            ['name' => 'Tuhina Khatun', 'symbol' => 'Clock'],
            ['name' => 'Jennifer Mandi', 'symbol' => 'Galaxy'],
            ['name' => 'Sumitra Hansda', 'symbol' => 'Butterfly'],
            ['name' => 'Nilamala Murmu', 'symbol' => 'Olive leaf'],
            ['name' => 'Anish Kujur', 'symbol' => 'Trophy'],
            ['name' => 'Devendra Sing', 'symbol' => 'Tree'],
            ['name' => 'Bikram Sing', 'symbol' => 'Book'],
            ['name' => 'Sunil Mandi', 'symbol' => 'Equality'],
        ];

        foreach ($candidates as $c) {
            $slug = \Illuminate\Support\Str::slug($c['symbol']);
            \App\Models\Candidate::create([
                'election_id' => $election->id,
                'code' => \Illuminate\Support\Str::slug($c['name']),
                'name' => $c['name'],
                'tagline' => $c['symbol'],
                'symbol_path' => 'assets/symbols/' . $slug . '.svg',
                'vote_count' => 0,
            ]);
        }
    }
}
