<template>
    <div class="flex h-screen w-screen bg-customBg-100 p-3 relative">
        <div class="flex-none w-10">
            side bar
        </div>
        <div class="grid grid-cols-6 flex-auto gap-2">

            <!-- LEFT SIDE -->
            <div class="col-span-2">
                <div class="grid grid-rows-4 w-full h-full gap-2">
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

                        <div class="w-full h-40 flex-grow overflow-y-auto rounded-md p-2 mt-2">
                            <serverItem :state="serverStateConnected">foo bar</serverItem>
                            <serverItem :state="serverStateDisconnected">foo bar</serverItem>
                            <serverItem :state="serverStateConnected">foo bar</serverItem>
                            <serverItem :state="serverStateDisconnected">foo bar</serverItem>
                        </div>
                    </div>


                    <div class="row-span-3 bg-white rounded-md flex flex-col">
                        <ttl>Program</ttl>
                        <div class="w-full h-44 flex-grow overflow-y-auto rounded-md p-2 mb-1 mt-2">
                            <progItem>foo bar</progItem>
                            <progItem>foo bar</progItem>
                            <progItem>foo bar</progItem>
                            <progItem>foo bar</progItem>
                            <progItem>foo bar</progItem>
                            <progItem>foo bar</progItem>
                            <progItem>foo bar</progItem>
                            <progItem>foo bar</progItem>
                            <progItem>foo bar</progItem>
                            <progItem>foo bar</progItem>
                            <progItem>foo bar</progItem>
                            <progItem>foo bar</progItem>
                        </div>


                    </div>
                </div>
            </div>

            <!-- RIGHT SIDE -->
            <div class="col-span-4 rounded-md px-2 h-full flex flex-col">

                <div class="flex justify-start gap-3 h-10 items-center">

                    <upload />

                    <div class="flex justify-end gap-3 h-full w-full px-2">

                        <btn :disabled="downloadDisabled" class="bg-kamenozoki-300">Download</btn>
                        <btn :disabled="downloadDisabled" class="bg-kamenozoki-300">Run</btn>
                        <btn class="bg-kamenozoki-300">Compile</btn>
                    </div>
                </div>

                <!-- TABS -->
                <div class="h-8 rounded-t-md overflow-x-auto bg-white flex items-center">
                    <tab />
                </div>

                <!-- MONACO -->
                <monacoEditor class="bg-white px-1 rounded-b-md mb-1 h-full" v-model="editingValue" :language="language"
                    :hight-change="hightChange" width="100%" height="100%" @editor-mounted="editorMounted"
                    :read-only="editorRO" />

                <!-- CONSOLE -->
                <div class="bg-slate-50 w-full h-1/5 rounded-md flex flex-col">

                    <ttl>Console
                        <template #extra>
                            <n-popover trigger="hover">
                                <template #trigger>
                                    <n-button text>
                                        <n-icon size="20" color="#255359">
                                            <Archive48Regular />
                                        </n-icon>
                                    </n-button>
                                </template>
                                <span>Clean</span>
                            </n-popover>
                        </template>
                    </ttl>

                    <div class="w-full h-4 overflow-auto px-1 flex-grow rounded-md">
                        <csl :ctx="testn" at="test" />
                    </div>

                </div>
            </div>
        </div>

    </div>
</template>


<script setup lang="ts">
import { ref, type Ref } from 'vue';
import monacoEditor from '../components/MonacoEditor.vue'
import btn from '../components/Button.vue'
import { Add12Regular, Archive48Regular } from '@vicons/fluent'
import ttl from '../components/Title.vue'
import csl from '../components/Console.vue'
import progItem from '../components/ProgItem.vue'
import serverItem from '../components/ServerItem.vue'
import upload from '../components/Upload.vue'
import tab from '../components/Tab.vue'
import { State } from '../components/serverState'

let serverStateConnected = ref<State>(State.Connected);
let serverStateDisconnected = ref<State>(State.Disconnected);

let sourceFileList = ref<string[]>([]);
let selectedSourceFile = ref<string>('');

let testn = ref<string>(`> sudo btrfs subvol show /nix
nix
	Name: 			nix
	UUID: 			4253cd61-4899-334d-9b6d-16b2fd21278a
	Parent UUID: 		-
	Received UUID: 		-
	Creation time: 		2022-05-26 14:32:15 +0800
	Subvolume ID: 		258
	Generation: 		3446860
	Gen at creation: 	8
	Parent ID: 		5
	Top level ID: 		5
	Flags: 			-
	Send transid: 		0
	Send time: 		2022-05-26 14:32:15 +0800
	Receive transid: 	0
	Receive time: 		-
	Snapshot(s):`);



let editorRO: Ref<boolean> = ref(false);
let editingValue = ref(`
/* hello
world */`)

let language = ref('c')
let hightChange = ref<boolean>(false)

let downloadDisabled = ref<boolean>(true)

const editorMounted = (editor: any) => {
    console.log('editor load complete', editor)
}



</script>

