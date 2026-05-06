<x-app-layout>
    <div class="py-10">
        <div class="max-w-3xl mx-auto sm:px-6 lg:px-8 space-y-6">
            
            <!-- Header Section -->
            <div class="sm:flex sm:items-center sm:justify-between">
                <div>
                    <h1 class="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Edit Candidate</h1>
                    <p class="text-sm text-zinc-500 dark:text-zinc-400 mt-2">Update candidate details and symbol icon.</p>
                </div>
                <div class="mt-4 sm:mt-0">
                    <a href="{{ route('admin.candidates') }}" class="inline-flex items-center justify-center rounded-md bg-white dark:bg-zinc-900 px-3 py-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100 shadow-sm ring-1 ring-inset ring-zinc-300 dark:ring-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                        Back to List
                    </a>
                </div>
            </div>

            <div class="bg-white dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
                <div class="px-6 py-8">
                    <form action="{{ route('admin.candidates.update', $candidate) }}" method="POST" enctype="multipart/form-data" class="space-y-6">
                        @csrf
                        @method('PUT')
                        
                        <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                            <div class="sm:col-span-1">
                                <label for="name" class="block text-sm font-medium leading-6 text-zinc-900 dark:text-zinc-100">Full Name</label>
                                <div class="mt-2">
                                    <input type="text" name="name" id="name" value="{{ $candidate->name }}" required class="block w-full rounded-md border-0 py-1.5 text-zinc-900 dark:text-zinc-100 dark:bg-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 dark:ring-zinc-700 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 transition-all">
                                </div>
                            </div>

                            <div class="sm:col-span-1">
                                <label for="code" class="block text-sm font-medium leading-6 text-zinc-900 dark:text-zinc-100">Unique Code (Slug)</label>
                                <div class="mt-2">
                                    <input type="text" name="code" id="code" value="{{ $candidate->code }}" required class="block w-full rounded-md border-0 py-1.5 text-zinc-900 dark:text-zinc-100 dark:bg-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 dark:ring-zinc-700 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 transition-all">
                                </div>
                            </div>

                            <div class="sm:col-span-2">
                                <label for="tagline" class="block text-sm font-medium leading-6 text-zinc-900 dark:text-zinc-100">Symbol Name / Tagline</label>
                                <div class="mt-2">
                                    <input type="text" name="tagline" id="tagline" value="{{ $candidate->tagline }}" class="block w-full rounded-md border-0 py-1.5 text-zinc-900 dark:text-zinc-100 dark:bg-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 dark:ring-zinc-700 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 transition-all">
                                </div>
                            </div>

                            <div class="sm:col-span-2">
                                <label class="block text-sm font-medium leading-6 text-zinc-900 dark:text-zinc-100">Current Symbol</label>
                                <div class="mt-2 flex items-center gap-4">
                                    <div class="h-20 w-20 bg-zinc-100 dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 flex items-center justify-center p-2 overflow-hidden">
                                        <img src="{{ asset($candidate->symbol_path) }}" alt="" class="max-h-full max-w-full object-contain">
                                    </div>
                                    <div class="flex-1">
                                        <label for="symbol" class="block text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 cursor-pointer">
                                            Change Symbol Icon
                                            <input type="file" name="symbol" id="symbol" class="sr-only">
                                        </label>
                                        <p class="text-xs text-zinc-500 mt-1">Upload a new SVG or PNG image. Recommended size: 256x256.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="flex items-center justify-end gap-3 border-t border-zinc-200 dark:border-zinc-800 pt-6 mt-6">
                            <a href="{{ route('admin.candidates') }}" class="text-sm font-semibold leading-6 text-zinc-900 dark:text-zinc-100">Cancel</a>
                            <button type="submit" class="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors">
                                Update Candidate
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</x-app-layout>
