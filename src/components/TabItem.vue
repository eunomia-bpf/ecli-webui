<template>
    <button @click="changeTab"
        class="flex items-center h-7 bg-customBg-100 rounded-sm hover:bg-moss-50 w-24 px-1 whitespace-nowrap">
        {{ props.name }}

        <div class="flex items-center justify-end w-full h-full pr-1">
            <n-button text>
                <n-icon>
                    <X />
                </n-icon>
            </n-button>
        </div>
    </button>
</template>


<script setup lang="ts">
import { X } from '@vicons/tabler'

let props = defineProps<{
    id: number
    name: string
}>()

let emit = defineEmits<{
    (e: 'change-tab', id: number): void
}>()

const changeTab = () => {
    console.log("change tab to", props.id)
    emit('change-tab', props.id)
}
</script>
