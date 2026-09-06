<script setup lang="ts">
// General Button.
const props = defineProps<{
    text?: boolean;
}>();
</script>

<template>
    <button 
        :class="[
            'inline-flex items-center justify-center px-4 py-2 text-sm font-medium transition-all duration-200 ease-in-out rounded-full active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed',
            props.text 
                ? 'bg-transparent text-slate-700 hover:bg-slate-100 hover:text-slate-900 disabled:hover:bg-transparent' 
                : 'bg-kamenozoki-400 text-white shadow-sm hover:shadow-md hover:bg-kamenozoki-300 disabled:hover:shadow-sm disabled:hover:bg-kamenozoki-400'
        ]"
    >
        <slot></slot>
    </button>
</template>
