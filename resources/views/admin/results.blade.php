<x-app-layout>
    <div class="flex-1 min-h-0 py-6">
        <div class="max-w-4xl mx-auto sm:px-6 lg:px-8 space-y-6">
            
            <!-- Header Section -->
            <div class="sm:flex sm:items-center sm:justify-between">
                <div>
                    <h1 class="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Election Results</h1>
                    <p class="text-sm text-zinc-500 dark:text-zinc-400 mt-2">Live tally and ranking of votes for the current election.</p>
                </div>
                <div class="mt-4 sm:mt-0">
                    <form action="{{ route('admin.reset') }}" method="POST" onsubmit="return confirm('WARNING: This will permanently delete ALL votes for this election. Are you sure?');">
                        @csrf
                        <button type="submit" class="inline-flex items-center justify-center rounded-md bg-white dark:bg-zinc-900 px-3 py-2 text-sm font-semibold text-red-600 dark:text-red-500 shadow-sm ring-1 ring-inset ring-red-300 dark:ring-red-900/50 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                            <svg class="-ml-0.5 mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Reset All Votes
                        </button>
                    </form>
                </div>
            </div>

            <!-- Results Card -->
            <div class="bg-white dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
                <div class="border-b border-zinc-200 dark:border-zinc-800 px-6 py-5 bg-zinc-50/50 dark:bg-zinc-900/50 flex justify-between items-center">
                    <h3 class="text-base font-semibold leading-6 text-zinc-900 dark:text-zinc-50">Current Standings</h3>
                    <div class="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 px-3 py-1 rounded-full text-sm font-semibold tracking-tight border border-indigo-200 dark:border-indigo-800/50">
                        Total Votes: {{ number_format($totalVotes) }}
                    </div>
                </div>
                
                <div class="px-6 py-6 sm:p-8 overflow-y-auto max-h-[calc(100vh-280px)]">
                    <div class="space-y-8">
                        @forelse($candidates as $index => $candidate)
                            @php
                                $percentage = $totalVotes > 0 ? round(($candidate->vote_count / $totalVotes) * 100, 1) : 0;
                            @endphp
                            <div class="group">
                                <div class="flex items-center justify-between mb-3">
                                    <div class="flex items-center gap-4">
                                        <div class="flex-shrink-0 h-14 w-14 rounded-full flex items-center justify-center font-bold text-lg border-2 {{ $index === 0 && $candidate->vote_count > 0 ? 'bg-amber-50 border-amber-200 text-amber-600 dark:bg-amber-500/10 dark:border-amber-500/20 dark:text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.2)]' : 'bg-zinc-50 border-zinc-200 text-zinc-500 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-400 group-hover:border-zinc-300 dark:group-hover:border-zinc-700 transition-colors' }}">
                                            @if($index === 0 && $candidate->vote_count > 0)
                                                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clip-rule="evenodd"></path></svg>
                                            @else
                                                #{{ $index + 1 }}
                                            @endif
                                        </div>
                                        <div>
                                            <h4 class="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                                                {{ $candidate->name }}
                                                @if($index === 0 && $candidate->vote_count > 0)
                                                    <span class="inline-flex items-center rounded-md bg-amber-50 dark:bg-amber-500/10 px-2 py-1 text-xs font-medium text-amber-700 dark:text-amber-400 ring-1 ring-inset ring-amber-600/20 dark:ring-amber-500/20">Leader</span>
                                                @endif
                                            </h4>
                                            <p class="text-sm font-medium text-zinc-500 dark:text-zinc-400 flex items-center gap-2 mt-0.5">
                                                <span class="inline-block h-4 w-4 bg-zinc-100 dark:bg-zinc-800 rounded flex items-center justify-center p-0.5 border border-zinc-200 dark:border-zinc-700"><img src="{{ asset($candidate->symbol_path) }}" class="h-full w-full object-contain"></span>
                                                {{ $candidate->tagline }}
                                            </p>
                                        </div>
                                    </div>
                                    <div class="text-right flex flex-col items-end">
                                        <div class="text-3xl font-black tracking-tighter text-indigo-600 dark:text-indigo-400">{{ number_format($candidate->vote_count) }}</div>
                                        <div class="text-sm font-semibold text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-900 px-2 rounded">{{ $percentage }}%</div>
                                    </div>
                                </div>
                                
                                <div class="w-full bg-zinc-100 dark:bg-zinc-900 rounded-full h-3 overflow-hidden shadow-inner border border-zinc-200/50 dark:border-zinc-800/50">
                                    <div class="h-full rounded-full transition-all duration-1000 ease-out relative {{ $index === 0 && $candidate->vote_count > 0 ? 'bg-gradient-to-r from-amber-400 to-amber-500 dark:from-amber-500 dark:to-amber-600' : 'bg-gradient-to-r from-indigo-500 to-indigo-600 dark:from-indigo-600 dark:to-indigo-700' }}" style="width: {{ $percentage }}%">
                                        <div class="absolute inset-0 bg-white/20 w-full animate-[shimmer_2s_infinite]"></div>
                                    </div>
                                </div>
                            </div>
                        @empty
                            <div class="text-center py-12">
                                <svg class="mx-auto h-12 w-12 text-zinc-300 dark:text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                                <h3 class="mt-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100">No data available</h3>
                                <p class="mt-1 text-sm text-zinc-500 dark:text-zinc-400">There are no candidates registered in the system yet.</p>
                            </div>
                        @endforelse
                    </div>
                </div>
            </div>
            
        </div>
    </div>
</x-app-layout>

<style>
@keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
}
</style>
