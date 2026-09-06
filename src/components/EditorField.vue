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
        <div class="flex-grow relative">
            <monacoEditor class="absolute inset-0" v-model="mod" language="c" @editor-mounted="editorMounted" :read-only="false" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

const activeTab = ref("");

const mod = computed({
	get() {
		return props.tabs.get(activeTab.value);
	},
	set(v) {
		props.tabs.set(activeTab.value, v!);
	},
});

const activeTabChange = (n: string) => {
	activeTab.value = n;
};

const deleteTab = (t: string) => {
	if (props.tabs.size == 0) return;

	if (activeTab.value == t) {
		activeTab.value == Array.from(props.tabs.keys())[0];
	}

	props.tabs.delete(t);
};

// let tabs: Ref<Map<string, string>> = ref(new Map());

const props = defineProps<{
	tabs: Map<string, string>;
}>();

const editorMounted = (editor: any) => {
	console.log("editor load complete", editor);
	props.tabs
		.set("tab1", "tab1 ctx")
		.set("tab2", "tab2 ctx")
		.set("tab3", "tab3 ctx");
	activeTab.value = "tab1";
};
</script>
