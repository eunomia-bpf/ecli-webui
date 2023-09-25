<script setup lang="ts">

const props = defineProps<{
    ctx: Array<string>,
}>()

const formatString = (str: string) => {
    return str.replace(/\n/g, '<br>');
};
</script>

<template>
    <ul class="w-full h-full list-none font-mono m-2">
        <li v-for="s in props.ctx" :key="s" class="whitespace-nowrap">
            <span class="text-gray-600" v-if="s.includes('\n')" v-html="formatString(s)"></span>
            <span class="text-gray-600" v-else>{{ s }}</span>
        </li>
    </ul>
</template>
