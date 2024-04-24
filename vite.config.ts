import { URL, fileURLToPath } from "node:url";

import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import Components from "unplugin-vue-components/vite";
import { defineConfig } from "vite";
import viteCompression from "vite-plugin-compression";
const proxyAddr: string = "http://10.0.0.15:8527";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		vue(),
		AutoImport({
			resolvers: [ElementPlusResolver()],
			imports: ["vue"],
		}),
		// vueJsx(),
		Components({
			dts: true,
			resolvers: [ElementPlusResolver()],
		}),
		viteCompression({
			algorithm: "brotliCompress",
		}),
	],
	optimizeDeps: {
		include: [`monaco-editor/esm/vs/editor/editor.worker`],
	},
	resolve: {
		alias: {
			"@": fileURLToPath(new URL("./src", import.meta.url)),
			api: fileURLToPath(new URL("./api-client", import.meta.url)),
			emception: fileURLToPath(
				new URL("./node_modules/emception", import.meta.url),
			),
			// quicknode: fileURLToPath(
			// 	new URL("./emception/build/quicknode", import.meta.url),
			// ),
			// llvm: fileURLToPath(
			// 	new URL("./emception/build/llvm/bin", import.meta.url),
			// ),
			// wasm: fileURLToPath(new URL("./wasm-bin", import.meta.url)),
		},
	},
	build: {
		chunkSizeWarningLimit: 16000,
		rollupOptions: {
			external: [/\.mjs$/],
		},
	},

	server: {
		proxy: {
			"/api": {
				target: `${proxyAddr}`,
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api/, ""),
			},
		},
	},
	worker: {
		plugins: [],
	},
});
