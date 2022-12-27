import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import * as path from 'path'
// import styleImport from 'vite-plugin-style-import';
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { settings } from './src/config/index'
// 分析插件
import { visualizer } from 'rollup-plugin-visualizer'
import AutoZip from 'vite-plugin-auto-zip'
import viteCompression from 'vite-plugin-compression'
// 自动导入element图标
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
// import svgLoader from 'vite-svg-loader';
// console.log('类型', process.env.NODE_ENV)

export default defineConfig(({ command, mode }) => {
  console.log('运行环境', command, mode)

  return {
    base: settings.base, // 生产环境路径
    plugins: [
      vue(), //按需导入element-plus组件
      viteCompression({
        verbose: true,
        disable: true, //不禁用压缩
        threshold: 10240, //压缩前最小文件
        algorithm: 'gzip', //压缩算法
        deleteOriginFile: true, //压缩后是否删除源文件
        ext: '.gz'
      }),
      mode === 'zip' && AutoZip(),
      AutoImport({
        resolvers: [ElementPlusResolver(), IconsResolver({ prefix: 'Icon' })],
        include: [
          /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
          /\.vue$/,
          /\.vue\?vue/, // .vue
          /\.md$/ // .md
        ],
        dts: true,
        imports: ['vue', 'vue-router']
      }),
      Components({
        resolvers: [
          ElementPlusResolver({ importStyle: 'sass' }),
          IconsResolver({ enabledCollections: 'ep' })
        ]
      }),
      Icons({
        autoInstall: true
      }),
      settings.isVisualizer && visualizer({ open: true, filename: 'report.html' })
    ],
    resolve: {
      alias: {
        // 配置别名
        '@': path.resolve(__dirname, 'src'),
        '@assets': path.resolve(__dirname, 'src/assets'),
        '@components': path.resolve(__dirname, 'src/components'),
        '@config': path.resolve(__dirname, 'src/config'),
        '@router': path.resolve(__dirname, 'src/router'),
        '@utils': path.resolve(__dirname, 'src/utils'),
        '@views': path.resolve(__dirname, 'src/views'),
        '@plugins': path.resolve(__dirname, 'src/plugins'),
        '@store': path.resolve(__dirname, 'src/store')
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use  "@/assets/style/element/index.scss" as *;'
        }
      }
    },
    build: {
      target: 'modules',
      outDir: 'dist', // 指定输出路径
      assetsDir: 'static', // 指定生成静态资源的存放路径
      minify: 'terser', // 混淆器,terser构建后文件体积更小
      sourcemap: false, // 输出.map文件
      chunkSizeWarningLimit: 1024,
      terserOptions: {
        compress: {
          drop_console: true, // 生产环境移除console
          drop_debugger: true, // 生产环境移除debugger
          pure_funcs: ['console.log']
        },
        output: {
          // 去掉注释内容
          comments: true
        }
      },
      rollupOptions: {
        // 确保外部化处理那些你不想打包进库的依赖
        // external: ['vue', 'element-plus'], // 注意看这里
        output: {
          chunkFileNames: 'static/js/[name]-[hash].js',
          entryFileNames: 'static/js/[name]-[hash].js',
          assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
          vue: ['vue', 'vue-router', 'vuex'],
          'element-plus': 'elementPlus',
          manualChunks(id) {
            // if (id.includes('components')) {
            //   // 把 components 文件里面的文件都打包到 components.js 中
            //   return 'components'
            // }
            if (id.includes('node_modules')) {
              return id.toString().split('node_modules/')[1].split('/')[0].toString()
            }
          }
        }
      }
    },
    server: {
      // 是否主动唤醒浏览器
      open: true,
      // 占用端口
      port: settings.port,
      // 是否使用https请求
      https: settings.https,
      // 扩展访问端口
      host: settings.host,
      hmr: true,
      watch: {
        usePolling: true // WSL必须,否则热更新无效
      },
      proxy: settings.proxyFlag
        ? {
            '/orginone': {
              // target: 'http://localhost:800', // 后台接口
              target: 'http://anyinone.com:800', // 后台接口
              changeOrigin: true, // 是否允许跨域
              ws: true
            },
          }
        : {}
    }
  }
})
