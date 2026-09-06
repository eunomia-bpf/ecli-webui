<template>
    <!-- TODO: refactor ( a more simple way? -->
    <VueUploadComponent name="Upload file" @change="fileUploaded" drop="true"
        class="inline-flex items-center justify-center px-4 py-2 text-sm font-medium tracking-wide transition-all duration-300 ease-out rounded-md active:scale-95 cursor-pointer min-w-max ml-1 mr-2 bg-sprout-300 text-sprout-950 shadow hover:shadow-md hover:bg-sprout-400 hover:-translate-y-0.5">
        <el-icon class="mr-1" size="16"><ArrowUpload20Regular /></el-icon>Upload
    </VueUploadComponent>
</template>

<script setup lang="ts">
import VueUploadComponent from "vue-upload-component";
import { ArrowUpload20Regular } from "@vicons/fluent";
import type { StartTaskRequest } from "../api-client/api";

const emit = defineEmits<{
	(e: "update-standby", r: StartTaskRequest): void;
	(e: "add-to-tab", name: string, ctx: string): void;
}>();

const buf2base64 = (u8aBuf: Uint8Array) => {
	return btoa(
		u8aBuf.reduce((data, byte) => data + String.fromCharCode(byte), ""),
	);
};
const isTxtSrc = (f: File) => {
	const srcFileTypes = ["text/x-c++src", "text/x-csrc", "text/x-chdr"];
	return srcFileTypes.includes(f.type) || f.name.endsWith(".c") || f.name.endsWith(".h");
};
const fileUploaded = async (e: any) => {
	const files = e.target.files || e.dataTransfer?.files;

	// recogniz file type
	const buf = await files[0].arrayBuffer();
	const u8aBuf = new Uint8Array(buf);
	const trunedFileHead = [...u8aBuf].slice(0, 4);

	if (
		trunedFileHead.map((x) => x.toString(16).padStart(2, "0")).join("") ==
		"0061736d"
	) {
		// wasm bin sig
		console.log("uploaded wasm binary, commit into standby slot");

		const encoded = buf2base64(u8aBuf);
		emit("update-standby", { program_data_buf: encoded, program_type: "wasm" });
	} else if (files[0].type === "application/json") {
		// json

		emit("update-standby", {
			program_data_buf: buf2base64(u8aBuf),
			program_type: "json",
		});
	} else if (files[0] === "application/x-tar") {
		// tar

		emit("update-standby", {
			program_data_buf: buf2base64(u8aBuf),
			program_type: "tar",
		});
	} else if (isTxtSrc(files[0])) {
		// source file, send to editor
		console.log(`adding ${files[0].name}`);
		const text = await files[0].text();
		emit("add-to-tab", files[0].name, text);
	} else {
		console.log("unresolve file type");
	}
};
</script>
