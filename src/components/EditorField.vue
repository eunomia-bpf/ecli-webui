<template>
    <div class="bg-white rounded-md mb-1 h-4/6 mt-1 flex flex-col">
        <!-- TABS -->
        <div class="h-8 rounded-t-md px-0.5 overflow-x-auto bg-white flex items-center">
            <ul class="flex justify-start h-full items-center flex-grow gap-1">
                <li v-for="t in tabs" :key="t.name">
                    <tabItem :id="t.id" :name="t.name" :activeTab="activeTab" @change-tab="activeTabChange"
                        @delete-tab="deleteTab" />
                </li>
            </ul>
        </div>

        <!-- MONACO -->
        <monacoEditor class="h-full" v-model="tabs[activeTab].content" language="c" :hight-change="hightChange" width="100%"
            height="100%" @editor-mounted="editorMounted" :read-only="false" />

    </div>
</template>

<script setup lang="ts">
import { ref, type Ref, computed } from 'vue';

const tabs = ref([
    { id: 0, name: 'Tab 1', content: 'Hello, world!' },
    { id: 1, name: 'Tab 2', content: 'Foo bar baz' },
    { id: 2, name: 'Tab 3', content: 'Lorem ipsum dolor sit amet' },
]);

let activeTab = ref(0);

const activeTabChange = (id: number) => {
    activeTab.value = id;
};

const deleteTab = (id: number) => {
    const index = tabs.value.findIndex((tab) => tab.id === id);
    if (index !== -1) {
        tabs.value.splice(index, 1);
    }
};

let hightChange = ref<boolean>(false)

const editorMounted = (editor: any) => {
    console.log('editor load complete', editor)
}
</script>
