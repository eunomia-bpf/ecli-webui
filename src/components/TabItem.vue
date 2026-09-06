<template>
    <div @click="changeTab"
        :class="[
            'group relative flex items-center h-9 px-3 min-w-[120px] max-w-[200px] cursor-pointer transition-colors border-r border-slate-200',
            name === activeTab 
                ? 'bg-white text-slate-800 border-t-2 border-t-sprout-500' 
                : 'bg-slate-100 text-slate-500 hover:bg-slate-200 border-t-2 border-t-transparent'
        ]">
        
        <!-- File Icon (optional, using CircleDot to denote code) -->
        <el-icon size="14" class="mr-2 shrink-0" :color="name === activeTab ? '#6f9052' : '#94a3b8'">
            <CircleDot />
        </el-icon>

        <span class="truncate select-none flex-grow text-xs font-medium">
            {{ props.name }}
        </span>

        <!-- Close button -->
        <button @click.stop="deleteTab" 
            :class="[
                'ml-2 shrink-0 w-5 h-5 rounded flex items-center justify-center transition-colors',
                name === activeTab ? 'opacity-100' : 'opacity-0 group-hover:opacity-100',
                'hover:bg-slate-200 hover:text-red-500'
            ]">
            <el-icon size="12">
                <X />
            </el-icon>
        </button>
    </div>
</template>


<script setup lang="ts">
import { CircleDot, X } from "@vicons/tabler";

const props = defineProps<{
	name: string;
	activeTab: string;
}>();

const emit = defineEmits<{
	(e: "change-tab", name: string): void;
	(e: "delete-tab", name: string): void;
}>();

const changeTab = () => {
	console.log("change tab to", props.name);
	emit("change-tab", props.name);
};
// FIXME: deleteTab is not working ?
const deleteTab = () => {
	console.log("delete tab", props.name);
	emit("delete-tab", props.name);
};
</script>
