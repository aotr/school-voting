<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="h-full bg-zinc-50 dark:bg-zinc-950">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ config('app.name', 'School Voting System') }} - Admin</title>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=inter:400,500,600,700,800&display=swap" rel="stylesheet" />

    <!-- Scripts -->
    @vite(['resources/css/app.css', 'resources/js/app.js'])

    <style>
        /* Hide scrollbars for a clean single-screen look */
        body { overflow: hidden !important; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { 
            background: rgba(0, 0, 0, 0.1); 
            border-radius: 10px; 
        }
        .dark ::-webkit-scrollbar-thumb { 
            background: rgba(255, 255, 255, 0.1); 
        }
        ::-webkit-scrollbar-thumb:hover { 
            background: rgba(0, 0, 0, 0.2); 
        }
        .dark ::-webkit-scrollbar-thumb:hover { 
            background: rgba(255, 255, 255, 0.2); 
        }
    </style>
</head>
<body class="h-full font-sans antialiased text-zinc-900 dark:text-zinc-100 overflow-hidden">
    <div class="flex flex-col h-screen">
        <!-- Navigation -->
        @auth
        <nav class="sticky top-0 z-50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between h-16">
                    <div class="flex">
                        <div class="flex-shrink-0 flex items-center gap-3">
                            @php
                                $election = \App\Models\Election::latest()->first();
                            @endphp
                            @if($election && $election->logo_path)
                                <img src="{{ asset($election->logo_path) }}" alt="Logo" class="h-8 w-8 object-contain">
                            @endif
                            <span class="text-lg font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-indigo-600">Admin Control</span>
                        </div>
                        <div class="hidden sm:-my-px sm:ml-8 sm:flex sm:space-x-8">
                            <a href="{{ route('admin.dashboard') }}" class="{{ request()->routeIs('admin.dashboard') ? 'border-indigo-500 text-zinc-900 dark:text-zinc-50 font-semibold' : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 font-medium' }} inline-flex items-center px-1 pt-1 border-b-2 text-sm transition-colors">Dashboard</a>
                            <a href="{{ route('admin.candidates') }}" class="{{ request()->routeIs('admin.candidates') ? 'border-indigo-500 text-zinc-900 dark:text-zinc-50 font-semibold' : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 font-medium' }} inline-flex items-center px-1 pt-1 border-b-2 text-sm transition-colors">Candidates</a>
                            <a href="{{ route('admin.results') }}" class="{{ request()->routeIs('admin.results') ? 'border-indigo-500 text-zinc-900 dark:text-zinc-50 font-semibold' : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 font-medium' }} inline-flex items-center px-1 pt-1 border-b-2 text-sm transition-colors">Results</a>
                        </div>
                    </div>
                    <div class="flex items-center gap-4">
                        <div class="text-sm font-medium text-zinc-500 dark:text-zinc-400 hidden md:block">
                            Logged in as {{ Auth::user()->name }}
                        </div>
                        <form method="POST" action="{{ route('logout') }}">
                            @csrf
                            <button type="submit" class="text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 px-3 py-1.5 rounded-md">
                                Logout
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </nav>
        @endauth

        <!-- Page Content -->
        <main class="flex-1 overflow-y-auto pb-12">
            @if (session('success'))
                <div class="max-w-7xl mx-auto mt-6 px-4 sm:px-6 lg:px-8">
                    <div class="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 p-4 rounded-lg flex items-start gap-3">
                        <svg class="h-5 w-5 text-emerald-600 dark:text-emerald-400 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                        </svg>
                        <p class="text-sm font-medium text-emerald-800 dark:text-emerald-300">{{ session('success') }}</p>
                    </div>
                </div>
            @endif

            @if ($errors->any())
                <div class="max-w-7xl mx-auto mt-6 px-4 sm:px-6 lg:px-8">
                    <div class="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 p-4 rounded-lg flex items-start gap-3">
                        <svg class="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                        </svg>
                        <ul class="list-disc pl-5 space-y-1 text-sm font-medium text-red-800 dark:text-red-300">
                            @foreach ($errors->all() as $error)
                                <li>{{ $error }}</li>
                            @endforeach
                        </ul>
                    </div>
                </div>
            @endif

            {{ $slot }}
        </main>
    </div>
</body>
</html>
