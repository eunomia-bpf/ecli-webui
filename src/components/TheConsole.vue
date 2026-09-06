<script setup lang="ts">
const props = defineProps<{
	ctx: Array<string>;
}>();

const formatString = (str: string) => {
	return str.replace(/\n/g, "<br>");
};

const getColorClass = (str: string) => {
    const lower = str.toLowerCase();
    if (lower.includes('compilation successful')) {
        return 'text-green-600 font-bold';
    }
    if (lower.includes('error') || lower.includes('failed')) {
        return 'text-red-600';
    }
    if (lower.includes('warning')) {
        return 'text-yellow-600';
    }
    return 'text-gray-600';
};
</script>

<template>
    <ul class="w-full h-full list-none font-mono m-2">
        <li v-for="(s, index) in props.ctx" :key="index" class="whitespace-nowrap">
            <span :class="getColorClass(s)" v-if="s.includes('\n')" v-html="formatString(s)"></span>
            <span :class="getColorClass(s)" v-else>{{ s }}</span>
        </li>
    </ul>
</template>
