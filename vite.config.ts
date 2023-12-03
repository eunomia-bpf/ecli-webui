import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { comlink } from 'vite-plugin-comlink'

const proxyAddr: string = 'http://127.0.0.1:8527'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    comlink(),
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
      imports: [
        'vue',
      ]
    }),
    vueJsx(),
    Components({
      dts: true,
      resolvers: [ElementPlusResolver()]
    })
  ],
  optimizeDeps: {
    include: [
      `monaco-editor/esm/vs/editor/editor.worker`
    ],
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      'api': fileURLToPath(new URL('./api-client', import.meta.url)),
      'quicknode': fileURLToPath(new URL('./emception/build/quicknode', import.meta.url)),
      'llvm': fileURLToPath(new URL('./emception/build/llvm/bin', import.meta.url)),
      'wasm': fileURLToPath(new URL('./wasm-bin', import.meta.url)),

    }

  },
  build: {
    chunkSizeWarningLimit: 16000,
    rollupOptions: {
      external: [
        /\.mjs$/,
        // 'wasm-bin/clang'

      ]
    }
  },

  server: {
    proxy: {
      '/api': {
        target: `${proxyAddr}`,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  worker: {
    plugins: [
      comlink()
    ]
  }
}
)
