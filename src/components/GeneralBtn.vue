<script setup lang="ts">
// General Button.
const props = defineProps<{
    text?: boolean;
}>();
</script>

<template>
    <button 
        :class="[
            'inline-flex items-center justify-center px-5 py-2 text-sm font-semibold tracking-wide transition-all duration-300 ease-out rounded-full active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed',
            props.text 
                ? 'bg-transparent text-slate-600 hover:bg-slate-100/80 hover:text-indigo-600 disabled:hover:bg-transparent disabled:hover:text-slate-600' 
                : 'bg-indigo-600 text-white shadow-sm hover:shadow-md hover:bg-indigo-700 hover:-translate-y-0.5 disabled:hover:shadow-sm disabled:hover:bg-indigo-600 disabled:hover:translate-y-0'
        ]"
    >
        <slot></slot>
    </button>
</template>
