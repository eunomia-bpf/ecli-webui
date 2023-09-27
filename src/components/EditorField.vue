<template>
    <div class="bg-white rounded-md mb-1 h-4/6 mt-1 flex flex-col">
        <!-- TABS -->
        <div class="h-8 rounded-t-md px-0.5 overflow-x-auto bg-white flex items-center">
            <ul class="flex justify-start h-full items-center flex-grow gap-1">
                <li v-for="t in tabs" :key="t.name">
                    <tabItem :id="globalTabCount++" :name="t.name" @change-tab="activeTabChange" />
                </li>
            </ul>
        </div>

        <!-- MONACO -->
        <monacoEditor class="h-full" v-model="tabs[activeTab].content" language="c" :hight-change="hightChange" width="100%"
            height="100%" @editor-mounted="editorMounted" read-only="false" />

    </div>
</template>

<script setup lang="ts">
import { ref, type Ref, computed } from 'vue';

const tabs = ref([
    { name: 'Tab 1', content: 'Hello, world!' },
    { name: 'Tab 2', content: 'Foo bar baz' },
    { name: 'Tab 3', content: 'Lorem ipsum dolor sit amet' },
]);
let globalTabCount = ref(0);
let activeTab = ref(0);

const activeTabChange = computed({
    get: () => activeTab.value,
    set: (value) => {
        activeTab.value = value;
    },
});


let hightChange = ref<boolean>(false)

const editorMounted = (editor: any) => {
    console.log('editor load complete', editor)
}
</script>
