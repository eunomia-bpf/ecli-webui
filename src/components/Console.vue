<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
    ctx: string,
    at: string
}>()


function getRemainCtx(input: string): string {
    const index = input.indexOf('\n');
    if (index !== -1) {
        return input.substring(index + 1);
    }
    return "";
}

function genBody(ctx: string, at: string): string {
    let spaces = ' '.repeat(at.length + 2);
    let ret = '\n' + getRemainCtx(ctx).split('\n').map(line => spaces + line).join('\n');
    console.log(ret);
    return ret;
}

let body = computed(() => genBody(props.ctx, props.at));

</script>

<template>
    <div class="w-full h-full m-2 font-mono">
        <span class="text-gray-400 mr-3">{{ at }}</span>
        <span class="text-black">{{ ctx.split('\n')[0] }}</span>
        <span class="text-black whitespace-pre">{{ body }}</span>

    </div>
</template>