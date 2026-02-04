<script setup lang="ts">
import TreeGrid from './components/TreeGrid.vue';
import type { TreeItem } from './utils/TreeStore';

const items: TreeItem[] = [
    { id: 1, parent: null, label: 'Айтем 1' },
    { id: '91064cee', parent: 1, label: 'Айтем 2' },
    { id: 3, parent: 1, label: 'Айтем 3' },
    { id: 4, parent: '91064cee', label: 'Айтем 4' },
    { id: 5, parent: '91064cee', label: 'Айтем 5' },
    { id: 6, parent: '91064cee', label: 'Айтем 6' },
    { id: 7, parent: 4, label: 'Айтем 7' },
    { id: 8, parent: 4, label: 'Айтем 8' },
];
</script>

<template>
    <div
        class="flex min-h-screen flex-col bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 font-sans antialiased"
    >
        <header
            class="relative overflow-hidden bg-linear-to-r from-slate-900 via-slate-800 to-slate-900 px-8 py-6 shadow-xl"
        >
            <div class="bg-grid-white/[0.02] absolute inset-0 bg-size-[20px_20px]"></div>
            <div class="relative flex items-center gap-3">
                <div
                    class="flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30"
                >
                    <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                        />
                    </svg>
                </div>
                <div>
                    <h1 class="m-0 text-2xl font-bold tracking-tight text-white">MStroy Frontend Test</h1>
                    <p class="m-0 text-sm text-slate-400">Tree Grid Management System</p>
                </div>
            </div>
        </header>

        <main class="flex flex-1 flex-col p-8">
            <div
                class="ag-theme-alpine flex flex-1 overflow-hidden rounded-xl border border-slate-200/60 bg-white shadow-2xl ring-1 shadow-slate-200/50 ring-slate-900/5"
            >
                <TreeGrid :items="items" />
            </div>
        </main>

        <footer class="border-t border-slate-200 bg-white/50 px-8 py-4 backdrop-blur-sm">
            <p class="m-0 text-center text-sm text-slate-600">© 2026 MStroy. Система управления проектами.</p>
        </footer>
    </div>
</template>

<style scoped>
.bg-grid-white\/\[0\.02\] {
    background-image:
        linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
}
</style>
