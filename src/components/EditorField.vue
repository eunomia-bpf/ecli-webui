<template>
    <div class="bg-white rounded-md mb-1 h-4/6 mt-1 flex flex-col">
        <!-- TABS -->
        <div class="h-8 rounded-t-md px-0.5 overflow-x-auto bg-white flex items-center">
            <ul class="flex justify-start h-full items-center flex-grow gap-1">
                <li v-for="i in props.tabs.keys()" :key="i">
                    <tabItem :name="i" :activeTab="activeTab" @change-tab="activeTabChange" @delete-tab="deleteTab" />
                </li>
            </ul>
        </div>

        <!-- MONACO -->
        <monacoEditor class="h-full" v-model="mod" language="c" width="100%" height="100%" @editor-mounted="editorMounted"
            :read-only="false" />
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

let activeTab = ref('')

let mod = computed({
    get() { return props.tabs.get(activeTab.value) },
    set(v) { props.tabs.set(activeTab.value, v!) }
})

const activeTabChange = (n: string) => {
    activeTab.value = n
}

const deleteTab = (t: string) => {
    if (props.tabs.size == 0) return;

    if (activeTab.value == t) {
        activeTab.value == Array.from(props.tabs.keys())[0];
    }

    props.tabs.delete(t);
}

// let tabs: Ref<Map<string, string>> = ref(new Map());

let props = defineProps<{
    tabs: Map<string, string>
}>()


const editorMounted = (editor: any) => {
    console.log('editor load complete', editor)
    props.tabs
        .set("tab1", "tab1 ctx")
        .set("tab2", "tab2 ctx")
        .set("tab3", "tab3 ctx");
    activeTab.value = 'tab1';
}
</script>
