import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { viteMockServe } from 'vite-plugin-mock'
import Icons from 'unplugin-icons/vite'
import { resolve } from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      imports: ['vue', 'vue-router', 'pinia'],
      dts: 'src/auto-imports.d.ts'
    }),
    Components({
      resolvers: [ElementPlusResolver({ importStyle: false })],
      dts: 'src/components.d.ts'
    }),
    Icons({ autoInstall: true }),
    viteMockServe({
      mockPath: 'mock',
      enable: process.env.NODE_ENV === 'development'
    }),
    visualizer({
      open: false,
      gzipSize: true,
      filename: 'visualizer.html'
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  build: {
    rollupOptions: {
      output: {
        // Rolldown 不支持 object manualChunks，统一放 vendor
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('element-plus')) return 'element-plus'
            if (id.includes('echarts') || id.includes('vue-echarts')) return 'echarts'
            if (id.includes('@iconify')) return 'iconify'
            return 'vendor'
          }
        }
      }
    }
  },
  optimizeDeps: {
    include: ['element-plus', 'echarts', 'vue-echarts', '@iconify/vue']
  }
})
