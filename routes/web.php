<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\CandidateController;
use App\Http\Controllers\ElectionController;
use App\Http\Controllers\VoteController;
use Illuminate\Support\Facades\Route;

// Public Voter Interface
Route::get('/', [VoteController::class, 'index'])->name('voter.index');
Route::post('/vote', [VoteController::class, 'store'])->name('vote.store');

// Basic auth routes (login form built-in or custom)
// I will use Laravel Breeze or basic Auth facade if I want, but for simplicity:
Route::get('/login', function () {
    return view('auth.login');
})->name('login');

Route::post('/login', function (\Illuminate\Http\Request $request) {
    $credentials = $request->validate([
        'email' => ['required', 'email'],
        'password' => ['required'],
    ]);

    if (\Illuminate\Support\Facades\Auth::attempt($credentials)) {
        $request->session()->regenerate();
        return redirect()->intended('admin');
    }

    return back()->withErrors([
        'email' => 'The provided credentials do not match our records.',
    ])->onlyInput('email');
});

Route::post('/logout', function (\Illuminate\Http\Request $request) {
    \Illuminate\Support\Facades\Auth::logout();
    $request->session()->invalidate();
    $request->session()->regenerateToken();
    return redirect('/');
})->name('logout');

// Admin Panel (Protected)
Route::middleware(['auth'])->prefix('admin')->group(function () {
    Route::get('/', [AdminController::class, 'dashboard'])->name('admin.dashboard');
    Route::get('/candidates', [CandidateController::class, 'index'])->name('admin.candidates');
    Route::post('/candidates', [CandidateController::class, 'store'])->name('admin.candidates.store');
    Route::get('/candidates/{candidate}/edit', [CandidateController::class, 'edit'])->name('admin.candidates.edit');
    Route::put('/candidates/{candidate}', [CandidateController::class, 'update'])->name('admin.candidates.update');
    Route::delete('/candidates/{candidate}', [CandidateController::class, 'destroy'])->name('admin.candidates.destroy');
    
    Route::get('/results', [AdminController::class, 'results'])->name('admin.results');
    Route::post('/results/reset', [AdminController::class, 'resetVotes'])->name('admin.reset');
    
    Route::put('/election/{election}', [ElectionController::class, 'update'])->name('admin.election.update');
});
