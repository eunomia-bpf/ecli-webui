<template>
    <el-upload ref="upload" class="flex justify-start items-center"
        action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15" :limit="1" :on-exceed="handleExceed"
        :auto-upload="false">
        <template #trigger>
            <btn color="#0D5661" text-color="#FFFFFB" class="bg-kamenozoki-300">
                Select File
            </btn>
        </template>
        <btn color="#0D5661" text-color="#FFFFFB" class="ml-2 bg-kamenozoki-300" @click="submitUpload">
            upload
        </btn>
    </el-upload>
    <btn color="#961b3c" text-color="#FFFFFB" class="ml-2 bg-mandy-700" @click="clearFiles">
        Clean
    </btn>
</template>
  
<script setup lang="ts">
import { ref } from 'vue'
import { genFileId } from 'element-plus'
import type { UploadInstance, UploadProps, UploadRawFile } from 'element-plus'
import btn from './Button.vue'



const upload = ref<UploadInstance>()

const handleExceed: UploadProps['onExceed'] = (files) => {
    upload.value!.clearFiles()
    const file = files[0] as UploadRawFile
    file.uid = genFileId()
    upload.value!.handleStart(file)
}

const submitUpload = () => {
    upload.value!.submit()
}

const clearFiles = () => {
    upload.value!.clearFiles()
}

</script>
  