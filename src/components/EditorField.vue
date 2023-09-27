<template>
    <div class="bg-white rounded-md mb-1 h-4/6 mt-1 flex flex-col">
        <!-- TABS -->
        <div class="h-8 rounded-t-md px-0.5 overflow-x-auto bg-white flex items-center">
            <div class="flex justify-start h-full items-center flex-grow gap-1">
                <tabItem name="foob" ctx="al"></tabItem>
                <tabItem name="foob" ctx="al"></tabItem>
                <tabItem name="foob" ctx="al"></tabItem>
            </div>
        </div>

        <!-- MONACO -->
        <monacoEditor class="h-full" v-model="editingValue" :language="language" :hight-change="hightChange" width="100%"
            height="100%" @editor-mounted="editorMounted" :read-only="editorRO" />

    </div>
</template>

<script setup lang="ts">
import { ref, type Ref } from 'vue';




let editorRO: Ref<boolean> = ref(false);
let editingValue = ref(`
/* hello
world */`)

let language = ref('c')
let hightChange = ref<boolean>(false)

const editorMounted = (editor: any) => {
    console.log('editor load complete', editor)
}
</script>
