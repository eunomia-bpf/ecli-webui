<script setup lang="ts">
// General Button.
const props = defineProps<{
    text?: boolean;
}>();
</script>

<template>
    <button 
        :class="[
            'inline-flex items-center justify-center px-4 py-2 text-sm font-medium tracking-wide transition-all duration-300 ease-out rounded-md active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed',
            props.text 
                ? 'bg-transparent text-slate-600 hover:bg-slate-100 hover:text-sprout-800 disabled:hover:bg-transparent disabled:hover:text-slate-600' 
                : 'bg-sprout-300 text-sprout-950 shadow hover:shadow-md hover:bg-sprout-400 hover:-translate-y-0.5 disabled:hover:shadow-none disabled:hover:bg-sprout-300 disabled:hover:translate-y-0'
        ]"
    >
        <slot></slot>
    </button>
</template>
