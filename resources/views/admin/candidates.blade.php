<x-app-layout>
    <div class="py-10">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
            
            <!-- Header Section -->
            <div class="sm:flex sm:items-center sm:justify-between">
                <div>
                    <h1 class="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Candidates</h1>
                    <p class="text-sm text-zinc-500 dark:text-zinc-400 mt-2">Manage the candidates participating in the current election.</p>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                <!-- Add Candidate Form (Sidebar on large screens) -->
                <div class="lg:col-span-1">
                    <div class="bg-white dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden sticky top-24">
                        <div class="border-b border-zinc-200 dark:border-zinc-800 px-6 py-5 bg-zinc-50/50 dark:bg-zinc-900/50">
                            <h3 class="text-base font-semibold leading-6 text-zinc-900 dark:text-zinc-50">Add New Candidate</h3>
                            <p class="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Register a new candidate profile.</p>
                        </div>
                        <div class="px-6 py-6">
                            <form action="{{ route('admin.candidates.store') }}" method="POST" enctype="multipart/form-data" class="space-y-4">
                                @csrf
                                <input type="hidden" name="election_id" value="{{ $election ? $election->id : '' }}">
                                
                                <div>
                                    <label for="name" class="block text-sm font-medium leading-6 text-zinc-900 dark:text-zinc-100">Full Name</label>
                                    <div class="mt-2">
                                        <input type="text" name="name" id="name" required class="block w-full rounded-md border-0 py-1.5 text-zinc-900 dark:text-zinc-100 dark:bg-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 dark:ring-zinc-700 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 transition-all">
                                    </div>
                                </div>

                                <div>
                                    <label for="code" class="block text-sm font-medium leading-6 text-zinc-900 dark:text-zinc-100">Unique Code (Slug)</label>
                                    <div class="mt-2">
                                        <input type="text" name="code" id="code" required class="block w-full rounded-md border-0 py-1.5 text-zinc-900 dark:text-zinc-100 dark:bg-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 dark:ring-zinc-700 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 transition-all" placeholder="e.g. tuhina-khatun">
                                    </div>
                                </div>

                                <div>
                                    <label for="tagline" class="block text-sm font-medium leading-6 text-zinc-900 dark:text-zinc-100">Symbol Name / Tagline</label>
                                    <div class="mt-2">
                                        <input type="text" name="tagline" id="tagline" class="block w-full rounded-md border-0 py-1.5 text-zinc-900 dark:text-zinc-100 dark:bg-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 dark:ring-zinc-700 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 transition-all" placeholder="e.g. Clock">
                                    </div>
                                </div>

                                <div>
                                    <label for="symbol" class="block text-sm font-medium leading-6 text-zinc-900 dark:text-zinc-100">Symbol Icon (Upload)</label>
                                    <div class="mt-2">
                                        <input type="file" name="symbol" id="symbol" class="block w-full text-sm text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition-all">
                                    </div>
                                </div>

                                <div class="pt-2">
                                    <button type="submit" class="w-full inline-flex justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors">
                                        Add Candidate
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                <!-- Candidates List -->
                <div class="lg:col-span-2">
                    <div class="bg-white dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
                        <div class="overflow-x-auto">
                            <table class="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800">
                                <thead class="bg-zinc-50/80 dark:bg-zinc-900/80">
                                    <tr>
                                        <th scope="col" class="py-3.5 pl-6 pr-3 text-left text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Candidate</th>
                                        <th scope="col" class="px-3 py-3.5 text-left text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Code</th>
                                        <th scope="col" class="px-3 py-3.5 text-left text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Symbol</th>
                                        <th scope="col" class="relative py-3.5 pl-3 pr-6 text-right text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-zinc-200 dark:divide-zinc-800 bg-white dark:bg-zinc-950">
                                    @forelse($candidates as $candidate)
                                    <tr class="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors group">
                                        <td class="whitespace-nowrap py-4 pl-6 pr-3">
                                            <div class="flex items-center">
                                                <div class="h-10 w-10 flex-shrink-0 bg-zinc-100 dark:bg-zinc-800 rounded-full border border-zinc-200 dark:border-zinc-700 flex items-center justify-center overflow-hidden p-1.5">
                                                    <img src="{{ asset($candidate->symbol_path) }}" alt="" class="h-full w-full object-contain">
                                                </div>
                                                <div class="ml-4">
                                                    <div class="font-medium text-zinc-900 dark:text-zinc-100">{{ $candidate->name }}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td class="whitespace-nowrap px-3 py-4 text-sm text-zinc-500 dark:text-zinc-400 font-mono">
                                            {{ $candidate->code }}
                                        </td>
                                        <td class="whitespace-nowrap px-3 py-4 text-sm text-zinc-500 dark:text-zinc-400">
                                            {{ $candidate->tagline }}
                                        </td>
                                        <td class="relative whitespace-nowrap py-4 pl-3 pr-6 text-right text-sm font-medium space-x-3">
                                            <a href="{{ route('admin.candidates.edit', $candidate) }}" class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300">
                                                Edit
                                            </a>
                                            <form action="{{ route('admin.candidates.destroy', $candidate) }}" method="POST" class="inline" onsubmit="return confirm('Are you sure you want to delete {{ $candidate->name }}?');">
                                                @csrf
                                                @method('DELETE')
                                                <button type="submit" class="text-zinc-400 hover:text-red-600 dark:hover:text-red-500 transition-colors">
                                                    <span class="sr-only">Delete</span>
                                                    <svg class="h-5 w-5 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </form>
                                        </td>
                                    </tr>
                                    @empty
                                    <tr>
                                        <td colspan="4" class="py-12 text-center">
                                            <svg class="mx-auto h-12 w-12 text-zinc-300 dark:text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                            <h3 class="mt-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100">No candidates</h3>
                                            <p class="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Get started by adding a new candidate.</p>
                                        </td>
                                    </tr>
                                    @endforelse
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</x-app-layout>
