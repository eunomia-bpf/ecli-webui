<template>
    <input type="file" @change="fileUploaded" />
</template>
  
<script setup lang="ts">
import { type StartTaskRequest } from '../api-client/api';

let emit = defineEmits<{
    (e: 'update-standby', r: StartTaskRequest): void
    (e: 'add-to-tab', name: string, ctx: string): void
}>()

const buf2base64 = (u8aBuf: Uint8Array) => {
    return btoa(
        u8aBuf.reduce((data, byte) => data + String.fromCharCode(byte), '')
    );
}
const isTxtSrc = (t: string) => {
    let srcFileTypes = ["text/x-c++src", "text/x-csrc", "text/x-chdr"];
    return srcFileTypes.includes(t)
}
const fileUploaded = async (e: any) => {
    let files = e.target.files || e.dataTransfer!.files;

    // recogniz file type
    let buf = await files[0].arrayBuffer();
    let u8aBuf = new Uint8Array(buf);
    let trunedFileHead = [...u8aBuf].slice(0, 4);

    if (trunedFileHead.map(x => x.toString(16).padStart(2, '0'))
        .join('') == "0061736d") { // wasm bin sig
        console.log("uploaded wasm binary, commit into standby slot");

        let encoded = buf2base64(u8aBuf);
        emit('update-standby', { program_data_buf: encoded, program_type: "wasm" });

    } else if (files[0].type == "application/json") {
        // json

        emit('update-standby', {
            program_data_buf: buf2base64(u8aBuf),
            program_type: "json"
        });

    } else if (files[0] == "application/x-tar") {
        // tar

        emit('update-standby', {
            program_data_buf: buf2base64(u8aBuf),
            program_type: "tar"
        });
    } else if (isTxtSrc(files[0].type)) {
        // source file, send to editor
        console.log(`adding ${files[0].name}`);
        emit('add-to-tab', files[0].name, files[0].text())
    } else {
        console.log("unresolve file type");
    }
}

</script>
