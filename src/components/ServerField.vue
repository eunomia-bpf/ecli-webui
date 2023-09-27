<template>
    <div class="row-span-1 bg-white flex flex-col rounded-md">
        <ttl>
            Server
            <template #extra>
                <n-popover trigger="hover">
                    <template #trigger>
                        <n-button text>
                            <n-icon size="20" color="#255359">
                                <Add12Regular />
                            </n-icon>
                        </n-button>
                    </template>
                    <span>Add Server</span>
                </n-popover>
            </template>
        </ttl>

        <div class="w-full h-4 flex-grow overflow-y-auto rounded-md p-2 mt-2">
            <ul class="w-full">
                <li v-for="s in props.servers" :key="s.id">
                    <serverItem :name="s.name" :url="s.url" @changeSelectedSrv="updateOnServer" />
                    <!--TODO: ADD LISTEN TASK OP-->
                </li>
            </ul>
        </div>
    </div>
</template>


<script setup lang="ts">
import ttl from '@/components/HeadTitle.vue'

let props = defineProps<{
    onServerId: number
    servers: Array<{
        id: number
        name: string
        url: string
    }>
}>()


let emit = defineEmits<{
    (e: 'onServerChange', id: number): void
}>()



const updateOnServer = (id: number) => {
    emit('onServerChange', id);
    console.log(`Selected Server Updated -> ${id}`);
};

</script>
