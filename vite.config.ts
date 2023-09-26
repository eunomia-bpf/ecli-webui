import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

const proxyAddr: string = 'http://127.0.0.1:8527'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
      imports: [
        'vue',
        {
          'naive-ui': [
            'useDialog',
            'useMessage',
            'useNotification',
            'useLoadingBar'
          ]
        }
      ]
    }),
    vueJsx(),
    Components({
      dts: true,
      resolvers: [NaiveUiResolver(), ElementPlusResolver()]
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
      // 'emception': fileURLToPath(new URL('./emception/build/emception', import.meta.url)),
      'api': fileURLToPath(new URL('./api-client', import.meta.url)),
    }

  },
  build: {
    chunkSizeWarningLimit: 16000,
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
}
)
