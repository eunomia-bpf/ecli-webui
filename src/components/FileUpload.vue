<template>
    <!-- <el-upload ref="upload" class="flex justify-start items-center"
        action="https://run.mocky.io/v3/ff4fecce-bac4-4288-90a5-09023b60c090" :limit="5" :on-exceed="handleExceed"
        :auto-upload="false">
        <template #trigger>
            <btn color="#0D5661" text-color="#FFFFFB" class="bg-kamenozoki-300">
                Select File
            </btn>
        </template>
        <btn color="#0D5661" text-color="#FFFFFB" class="ml-2 bg-kamenozoki-300" @click="submitUpload">
            upload
        </btn>
    </el-upload> -->
    <input type="file" accept="application/wasm" @change="fileUploaded" />
    <btn color="#961b3c" text-color="#FFFFFB" class="ml-2 bg-mandy-600" @click="clearFiles">
        Clean
    </btn>
</template>
  
<script setup lang="ts">
import btn from './GeneralBtn.vue'

const clearFiles = () => {

}
import { ecliApi } from '@/api'

const fileUploaded = async (e: any) => {
    let files = e.target.files || e.dataTransfer!.files;

    let reader = new FileReader();
    reader.readAsDataURL(files[0]);
    let buf = await files[0].arrayBuffer();
    let encoded = btoa(
        new Uint8Array(buf)
            .reduce((data, byte) => data + String.fromCharCode(byte), '')
    );
    console.log(encoded);
    await ecliApi.startTask({ program_data_buf: encoded, program_type: "wasm" })
}

</script>
