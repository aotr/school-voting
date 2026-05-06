<x-app-layout>
    <div class="flex-1 min-h-0 py-6">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
            
            <!-- Header Section -->
            <div>
                <h1 class="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Dashboard</h1>
                <p class="text-sm text-zinc-500 dark:text-zinc-400 mt-2">Overview of the voting system and active election status.</p>
            </div>

            <!-- Stats Grid -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <!-- Total Votes Card -->
                <div class="bg-white dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm flex flex-col justify-between">
                    <div class="flex items-center justify-between">
                        <dt class="text-sm font-medium text-zinc-500 dark:text-zinc-400">Total Votes Cast</dt>
                        <svg class="h-5 w-5 text-zinc-400 dark:text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                        </svg>
                    </div>
                    <dd class="mt-4 text-4xl font-extrabold tracking-tight text-indigo-600 dark:text-indigo-400">{{ number_format($totalVotes) }}</dd>
                </div>

                <!-- Candidates Card -->
                <div class="bg-white dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm flex flex-col justify-between">
                    <div class="flex items-center justify-between">
                        <dt class="text-sm font-medium text-zinc-500 dark:text-zinc-400">Registered Candidates</dt>
                        <svg class="h-5 w-5 text-zinc-400 dark:text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                    </div>
                    <dd class="mt-4 text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">{{ number_format($candidatesCount) }}</dd>
                </div>

                <!-- Status Card -->
                <div class="bg-white dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm flex flex-col justify-between">
                    <div class="flex items-center justify-between">
                        <dt class="text-sm font-medium text-zinc-500 dark:text-zinc-400">Election Status</dt>
                        <svg class="h-5 w-5 {{ $election && $election->is_active ? 'text-emerald-500' : 'text-zinc-400' }}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <dd class="mt-4 flex items-baseline gap-x-2">
                        <span class="text-4xl font-extrabold tracking-tight {{ $election && $election->is_active ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-500' }}">
                            {{ $election ? ($election->is_active ? 'Active' : 'Closed') : 'None' }}
                        </span>
                    </dd>
                </div>
            </div>

            <!-- Settings Panel -->
            @if($election)
            <div class="bg-white dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm mt-8 overflow-hidden">
                <div class="border-b border-zinc-200 dark:border-zinc-800 px-6 py-4 bg-zinc-50/50 dark:bg-zinc-900/50">
                    <h3 class="text-lg font-semibold leading-6 text-zinc-900 dark:text-zinc-50">Election Settings</h3>
                    <p class="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Manage the properties of the current election.</p>
                </div>
                
                <div class="px-6 py-4 max-h-[calc(100vh-420px)] overflow-y-auto">
                    <form action="{{ route('admin.election.update', $election) }}" method="POST" enctype="multipart/form-data" class="space-y-6">
                        @csrf
                        @method('PUT')
                        <div class="grid grid-cols-1 gap-y-6 gap-x-6 sm:grid-cols-6">
                            <div class="sm:col-span-3">
                                <label for="title" class="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Election Title</label>
                                <div class="mt-2">
                                    <input type="text" name="title" id="title" value="{{ $election->title }}" class="block w-full rounded-md border-0 py-1.5 text-zinc-900 dark:text-zinc-100 dark:bg-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 dark:ring-zinc-700 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 transition-all">
                                </div>
                            </div>

                            <div class="sm:col-span-3">
                                <label for="year" class="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Year</label>
                                <div class="mt-2">
                                    <input type="number" name="year" id="year" value="{{ $election->year }}" class="block w-full rounded-md border-0 py-1.5 text-zinc-900 dark:text-zinc-100 dark:bg-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 dark:ring-zinc-700 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 transition-all">
                                </div>
                            </div>

                            <div class="sm:col-span-6">
                                <label class="block text-sm font-medium leading-6 text-zinc-700 dark:text-zinc-300">System Logo</label>
                                <div class="mt-2 flex items-center gap-6">
                                    <div class="h-20 w-20 bg-zinc-100 dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 flex items-center justify-center p-2 overflow-hidden">
                                        @if($election->logo_path)
                                            <img src="{{ asset($election->logo_path) }}" alt="Logo" class="max-h-full max-w-full object-contain">
                                        @else
                                            <img src="{{ asset('assets/symbols/school.svg') }}" alt="Default Logo" class="max-h-full max-w-full object-contain opacity-50">
                                        @endif
                                    </div>
                                    <div class="flex-1">
                                        <input type="file" name="logo" id="logo" class="block w-full text-sm text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition-all">
                                        <p class="text-xs text-zinc-500 mt-1">Upload a custom logo for the voting machine and admin panel.</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="sm:col-span-6">
                                <div class="relative flex items-start py-4">
                                    <div class="min-w-0 flex-1 text-sm leading-6">
                                        <label for="is_active" class="font-medium text-zinc-900 dark:text-zinc-100">Voting is Open</label>
                                        <p id="is_active-description" class="text-zinc-500 dark:text-zinc-400">If checked, voters can cast their votes in this election via the voting machine UI.</p>
                                    </div>
                                    <div class="ml-3 flex h-6 items-center">
                                        <input id="is_active" name="is_active" type="checkbox" value="1" {{ $election->is_active ? 'checked' : '' }} aria-describedby="is_active-description" class="h-5 w-5 rounded border-zinc-300 dark:border-zinc-700 dark:bg-zinc-900 text-indigo-600 focus:ring-indigo-600 cursor-pointer">
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="flex items-center justify-end border-t border-zinc-200 dark:border-zinc-800 pt-6 mt-6">
                            <button type="submit" class="inline-flex justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors">
                                Save Settings
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            @endif
        </div>
    </div>
</x-app-layout>
