<template>
    <div class="bg-white rounded-xl shadow-sm border border-slate-200 mb-2 h-4/6 mt-1 flex flex-col overflow-hidden">
        <!-- TABS -->
        <div class="h-9 bg-slate-100 flex items-end overflow-x-auto border-b border-slate-200 hide-scrollbar">
            <ul class="flex justify-start h-full items-center flex-grow">
                <li v-for="i in props.tabs.keys()" :key="i">
                    <tabItem :name="i" :activeTab="activeTab" @change-tab="activeTabChange" @delete-tab="deleteTab" />
                </li>
            </ul>
        </div>

        <!-- MONACO -->
        <div class="flex-grow relative bg-slate-50">
            <monacoEditor v-show="props.tabs.size > 0" class="absolute inset-0" v-model="mod" language="c" @editor-mounted="editorMounted" :read-only="false" />
            <div v-show="props.tabs.size === 0" class="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
                <Archive48Regular class="w-16 h-16 mb-4 opacity-50" />
                <p class="text-lg font-medium">No program selected</p>
                <p class="text-sm mt-1">Select a program from the left or upload a file to start</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { Archive48Regular } from "@vicons/fluent";
import tabItem from "./TabItem.vue";

const activeTab = ref("");

const mod = computed({
	get() {
		return props.tabs.get(activeTab.value);
	},
	set(v) {
		if (activeTab.value && v !== undefined) {
			props.tabs.set(activeTab.value, v);
		}
	},
});

const activeTabChange = (n: string) => {
	activeTab.value = n;
};

const deleteTab = (t: string) => {
	if (props.tabs.size == 0) return;

	if (activeTab.value == t) {
		const keys = Array.from(props.tabs.keys());
		const nextTab = keys.find(k => k !== t);
		activeTab.value = nextTab || "";
	}

	props.tabs.delete(t);
};

const props = defineProps<{
	tabs: Map<string, string>;
}>();

watch(() => props.tabs.size, (newSize) => {
	if (newSize > 0 && !activeTab.value) {
		activeTab.value = Array.from(props.tabs.keys())[0];
	}
});

const editorMounted = (editor: any) => {
	console.log("editor load complete");
};
</script>

