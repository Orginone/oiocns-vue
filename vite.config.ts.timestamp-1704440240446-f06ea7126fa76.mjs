// vite.config.ts
import { defineConfig } from "file:///C:/Users/zjdex/Desktop/oiocns-vue/node_modules/.pnpm/vite@4.5.1_@types+node@18.19.3_less@4.2.0_sass@1.69.5_terser@5.26.0/node_modules/vite/dist/node/index.js";

// config/theme/index.ts
import fs from "fs";
import lessToJS from "file:///C:/Users/zjdex/Desktop/oiocns-vue/node_modules/.pnpm/less-vars-to-js@1.3.0/node_modules/less-vars-to-js/dist/index.js";
import path from "path";
var __vite_injected_original_dirname = "C:\\Users\\zjdex\\Desktop\\oiocns-vue\\config\\theme";
var themeVariables = lessToJS(
  fs.readFileSync(path.resolve(__vite_injected_original_dirname, "./variables.less"), "utf8")
);

// vite.config.ts
import vue from "file:///C:/Users/zjdex/Desktop/oiocns-vue/node_modules/.pnpm/@vitejs+plugin-vue@3.2.0_vite@4.5.1_vue@3.3.13/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import * as path2 from "path";
import AutoImport from "file:///C:/Users/zjdex/Desktop/oiocns-vue/node_modules/.pnpm/unplugin-auto-import@0.10.3_@vueuse+core@9.13.0_vite@4.5.1/node_modules/unplugin-auto-import/dist/vite.mjs";
import Components from "file:///C:/Users/zjdex/Desktop/oiocns-vue/node_modules/.pnpm/unplugin-vue-components@0.21.2_vite@4.5.1_vue@3.3.13/node_modules/unplugin-vue-components/dist/vite.mjs";
import { ElementPlusResolver } from "file:///C:/Users/zjdex/Desktop/oiocns-vue/node_modules/.pnpm/unplugin-vue-components@0.21.2_vite@4.5.1_vue@3.3.13/node_modules/unplugin-vue-components/dist/resolvers.mjs";

// src/config/index.ts
var settings = {
  // 请求根路径
  baseUrl: "/",
  // 是否开启代理，本地需要开，线上环境关闭
  proxyFlag: true,
  // 端口
  port: 8e3,
  // 是否开启https
  https: false,
  // 扩展端口
  host: "localhost",
  // 公共路径
  base: "/",
  // 是否展示打包分析页面
  isVisualizer: false
};

// vite.config.ts
import { visualizer } from "file:///C:/Users/zjdex/Desktop/oiocns-vue/node_modules/.pnpm/rollup-plugin-visualizer@5.11.0/node_modules/rollup-plugin-visualizer/dist/plugin/index.js";
import AutoZip from "file:///C:/Users/zjdex/Desktop/oiocns-vue/node_modules/.pnpm/vite-plugin-auto-zip@1.0.4/node_modules/vite-plugin-auto-zip/plugin.js";
import viteCompression from "file:///C:/Users/zjdex/Desktop/oiocns-vue/node_modules/.pnpm/vite-plugin-compression@0.5.1_vite@4.5.1/node_modules/vite-plugin-compression/dist/index.mjs";
import Icons from "file:///C:/Users/zjdex/Desktop/oiocns-vue/node_modules/.pnpm/unplugin-icons@0.14.15_@vue+compiler-sfc@3.3.13/node_modules/unplugin-icons/dist/vite.mjs";
import IconsResolver from "file:///C:/Users/zjdex/Desktop/oiocns-vue/node_modules/.pnpm/unplugin-icons@0.14.15_@vue+compiler-sfc@3.3.13/node_modules/unplugin-icons/dist/resolver.mjs";
var __vite_injected_original_dirname2 = "C:\\Users\\zjdex\\Desktop\\oiocns-vue";
var vite_config_default = defineConfig(({ command, mode }) => {
  console.log("\u8FD0\u884C\u73AF\u5883", command, mode);
  return {
    base: settings.base,
    // 生产环境路径
    plugins: [
      vue(),
      //按需导入element-plus组件
      viteCompression({
        verbose: true,
        disable: true,
        //不禁用压缩
        threshold: 10240,
        //压缩前最小文件
        algorithm: "gzip",
        //压缩算法
        deleteOriginFile: true,
        //压缩后是否删除源文件
        ext: ".gz"
      }),
      mode === "zip" && AutoZip(),
      AutoImport({
        resolvers: [ElementPlusResolver(), IconsResolver({ prefix: "Icon" })],
        include: [
          /\.[tj]sx?$/,
          // .ts, .tsx, .js, .jsx
          /\.vue$/,
          /\.vue\?vue/,
          // .vue
          /\.md$/
          // .md
        ],
        eslintrc: {
          enabled: true,
          filepath: "./.eslintrc-auto-import.json",
          globalsPropValue: true
        },
        dts: true,
        imports: ["vue", "vue-router"]
      }),
      Components({
        resolvers: [
          ElementPlusResolver({ importStyle: "sass" }),
          IconsResolver({ enabledCollections: "ep" })
        ]
      }),
      Icons({
        autoInstall: true
      }),
      settings.isVisualizer && visualizer({ open: true, filename: "report.html" })
    ],
    resolve: {
      alias: {
        // 配置别名
        "@": path2.resolve(__vite_injected_original_dirname2, "src"),
        "@assets": path2.resolve(__vite_injected_original_dirname2, "src/assets"),
        "@components": path2.resolve(__vite_injected_original_dirname2, "src/components"),
        "@config": path2.resolve(__vite_injected_original_dirname2, "src/config"),
        "@router": path2.resolve(__vite_injected_original_dirname2, "src/router"),
        "@utils": path2.resolve(__vite_injected_original_dirname2, "src/utils"),
        "@views": path2.resolve(__vite_injected_original_dirname2, "src/views"),
        "@plugins": path2.resolve(__vite_injected_original_dirname2, "src/plugins"),
        "@store": path2.resolve(__vite_injected_original_dirname2, "src/store")
      }
    },
    optimizeDeps: {
      include: ["@/../lib/vform/designer.umd.js"]
    },
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
          modifyVars: themeVariables
        }
      }
    },
    build: {
      target: "modules",
      outDir: "dist",
      // 指定输出路径
      assetsDir: "static",
      // 指定生成静态资源的存放路径
      minify: "terser",
      // 混淆器,terser构建后文件体积更小
      sourcemap: false,
      // 输出.map文件
      chunkSizeWarningLimit: 1024,
      commonjsOptions: {
        include: /node_modules|lib/
      },
      terserOptions: {
        compress: {
          drop_console: true,
          // 生产环境移除console
          drop_debugger: true,
          // 生产环境移除debugger
          pure_funcs: ["console.log"]
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
          chunkFileNames: "static/js/[name]-[hash].js",
          entryFileNames: "static/js/[name]-[hash].js",
          assetFileNames: "static/[ext]/[name]-[hash].[ext]",
          vue: ["vue", "vue-router", "vuex"],
          "element-plus": "elementPlus",
          manualChunks(id) {
            if (id.includes("node_modules")) {
              return id.toString().split("node_modules/")[1].split("/")[0].toString();
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
      host: "0.0.0.0",
      hmr: true,
      watch: {
        usePolling: true
        // WSL必须,否则热更新无效
      },
      proxy: settings.proxyFlag ? {
        "/orginone": {
          // target: 'http://localhost:800', // 后台接口
          target: "https://asset.orginone.cn",
          // 后台接口
          changeOrigin: true,
          // 是否允许跨域
          ws: true
        }
      } : {}
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAiY29uZmlnL3RoZW1lL2luZGV4LnRzIiwgInNyYy9jb25maWcvaW5kZXgudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFx6amRleFxcXFxEZXNrdG9wXFxcXG9pb2Nucy12dWVcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXHpqZGV4XFxcXERlc2t0b3BcXFxcb2lvY25zLXZ1ZVxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvempkZXgvRGVza3RvcC9vaW9jbnMtdnVlL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcclxuaW1wb3J0IHsgdGhlbWVWYXJpYWJsZXMgfSBmcm9tICcuL2NvbmZpZy90aGVtZS9pbmRleCdcclxuaW1wb3J0IHZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnXHJcbmltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCdcclxuLy8gaW1wb3J0IHN0eWxlSW1wb3J0IGZyb20gJ3ZpdGUtcGx1Z2luLXN0eWxlLWltcG9ydCc7XHJcbmltcG9ydCBBdXRvSW1wb3J0IGZyb20gJ3VucGx1Z2luLWF1dG8taW1wb3J0L3ZpdGUnXHJcbmltcG9ydCBDb21wb25lbnRzIGZyb20gJ3VucGx1Z2luLXZ1ZS1jb21wb25lbnRzL3ZpdGUnXHJcbmltcG9ydCB7IEVsZW1lbnRQbHVzUmVzb2x2ZXIgfSBmcm9tICd1bnBsdWdpbi12dWUtY29tcG9uZW50cy9yZXNvbHZlcnMnXHJcbmltcG9ydCB7IHNldHRpbmdzIH0gZnJvbSAnLi9zcmMvY29uZmlnL2luZGV4J1xyXG4vLyBcdTUyMDZcdTY3OTBcdTYzRDJcdTRFRjZcclxuaW1wb3J0IHsgdmlzdWFsaXplciB9IGZyb20gJ3JvbGx1cC1wbHVnaW4tdmlzdWFsaXplcidcclxuaW1wb3J0IEF1dG9aaXAgZnJvbSAndml0ZS1wbHVnaW4tYXV0by16aXAnXHJcbmltcG9ydCB2aXRlQ29tcHJlc3Npb24gZnJvbSAndml0ZS1wbHVnaW4tY29tcHJlc3Npb24nXHJcbi8vIFx1ODFFQVx1NTJBOFx1NUJGQ1x1NTE2NWVsZW1lbnRcdTU2RkVcdTY4MDdcclxuaW1wb3J0IEljb25zIGZyb20gJ3VucGx1Z2luLWljb25zL3ZpdGUnXHJcbmltcG9ydCBJY29uc1Jlc29sdmVyIGZyb20gJ3VucGx1Z2luLWljb25zL3Jlc29sdmVyJ1xyXG4vLyBpbXBvcnQgc3ZnTG9hZGVyIGZyb20gJ3ZpdGUtc3ZnLWxvYWRlcic7XHJcbi8vIGNvbnNvbGUubG9nKCdcdTdDN0JcdTU3OEInLCBwcm9jZXNzLmVudi5OT0RFX0VOVilcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBjb21tYW5kLCBtb2RlIH0pID0+IHtcclxuICBjb25zb2xlLmxvZygnXHU4RkQwXHU4ODRDXHU3M0FGXHU1ODgzJywgY29tbWFuZCwgbW9kZSlcclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIGJhc2U6IHNldHRpbmdzLmJhc2UsIC8vIFx1NzUxRlx1NEVBN1x1NzNBRlx1NTg4M1x1OERFRlx1NUY4NFxyXG4gICAgcGx1Z2luczogW1xyXG4gICAgICB2dWUoKSwgLy9cdTYzMDlcdTk3MDBcdTVCRkNcdTUxNjVlbGVtZW50LXBsdXNcdTdFQzRcdTRFRjZcclxuICAgICAgdml0ZUNvbXByZXNzaW9uKHtcclxuICAgICAgICB2ZXJib3NlOiB0cnVlLFxyXG4gICAgICAgIGRpc2FibGU6IHRydWUsIC8vXHU0RTBEXHU3OTgxXHU3NTI4XHU1MzhCXHU3RjI5XHJcbiAgICAgICAgdGhyZXNob2xkOiAxMDI0MCwgLy9cdTUzOEJcdTdGMjlcdTUyNERcdTY3MDBcdTVDMEZcdTY1ODdcdTRFRjZcclxuICAgICAgICBhbGdvcml0aG06ICdnemlwJywgLy9cdTUzOEJcdTdGMjlcdTdCOTdcdTZDRDVcclxuICAgICAgICBkZWxldGVPcmlnaW5GaWxlOiB0cnVlLCAvL1x1NTM4Qlx1N0YyOVx1NTQwRVx1NjYyRlx1NTQyNlx1NTIyMFx1OTY2NFx1NkU5MFx1NjU4N1x1NEVGNlxyXG4gICAgICAgIGV4dDogJy5neidcclxuICAgICAgfSksXHJcbiAgICAgIG1vZGUgPT09ICd6aXAnICYmIEF1dG9aaXAoKSxcclxuICAgICAgQXV0b0ltcG9ydCh7XHJcbiAgICAgICAgcmVzb2x2ZXJzOiBbRWxlbWVudFBsdXNSZXNvbHZlcigpLCBJY29uc1Jlc29sdmVyKHsgcHJlZml4OiAnSWNvbicgfSldLFxyXG4gICAgICAgIGluY2x1ZGU6IFtcclxuICAgICAgICAgIC9cXC5bdGpdc3g/JC8sIC8vIC50cywgLnRzeCwgLmpzLCAuanN4XHJcbiAgICAgICAgICAvXFwudnVlJC8sXHJcbiAgICAgICAgICAvXFwudnVlXFw/dnVlLywgLy8gLnZ1ZVxyXG4gICAgICAgICAgL1xcLm1kJC8gLy8gLm1kXHJcbiAgICAgICAgXSxcclxuICAgICAgICBlc2xpbnRyYzoge1xyXG4gICAgICAgICAgZW5hYmxlZDogdHJ1ZSxcclxuICAgICAgICAgIGZpbGVwYXRoOiBcIi4vLmVzbGludHJjLWF1dG8taW1wb3J0Lmpzb25cIixcclxuICAgICAgICAgIGdsb2JhbHNQcm9wVmFsdWU6IHRydWUsXHJcbiAgICAgICAgfSxcclxuICAgICAgICBkdHM6IHRydWUsXHJcbiAgICAgICAgaW1wb3J0czogWyd2dWUnLCAndnVlLXJvdXRlciddXHJcbiAgICAgIH0pLFxyXG4gICAgICBDb21wb25lbnRzKHtcclxuICAgICAgICByZXNvbHZlcnM6IFtcclxuICAgICAgICAgIEVsZW1lbnRQbHVzUmVzb2x2ZXIoeyBpbXBvcnRTdHlsZTogJ3Nhc3MnIH0pLFxyXG4gICAgICAgICAgSWNvbnNSZXNvbHZlcih7IGVuYWJsZWRDb2xsZWN0aW9uczogJ2VwJyB9KVxyXG4gICAgICAgIF1cclxuICAgICAgfSksXHJcbiAgICAgIEljb25zKHtcclxuICAgICAgICBhdXRvSW5zdGFsbDogdHJ1ZVxyXG4gICAgICB9KSxcclxuICAgICAgc2V0dGluZ3MuaXNWaXN1YWxpemVyICYmIHZpc3VhbGl6ZXIoeyBvcGVuOiB0cnVlLCBmaWxlbmFtZTogJ3JlcG9ydC5odG1sJyB9KVxyXG4gICAgXSxcclxuICAgIHJlc29sdmU6IHtcclxuICAgICAgYWxpYXM6IHtcclxuICAgICAgICAvLyBcdTkxNERcdTdGNkVcdTUyMkJcdTU0MERcclxuICAgICAgICAnQCc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMnKSxcclxuICAgICAgICAnQGFzc2V0cyc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMvYXNzZXRzJyksXHJcbiAgICAgICAgJ0Bjb21wb25lbnRzJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ3NyYy9jb21wb25lbnRzJyksXHJcbiAgICAgICAgJ0Bjb25maWcnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnc3JjL2NvbmZpZycpLFxyXG4gICAgICAgICdAcm91dGVyJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ3NyYy9yb3V0ZXInKSxcclxuICAgICAgICAnQHV0aWxzJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ3NyYy91dGlscycpLFxyXG4gICAgICAgICdAdmlld3MnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnc3JjL3ZpZXdzJyksXHJcbiAgICAgICAgJ0BwbHVnaW5zJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ3NyYy9wbHVnaW5zJyksXHJcbiAgICAgICAgJ0BzdG9yZSc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMvc3RvcmUnKVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgb3B0aW1pemVEZXBzOiB7XHJcbiAgICAgIGluY2x1ZGU6IFsnQC8uLi9saWIvdmZvcm0vZGVzaWduZXIudW1kLmpzJ11cclxuICAgIH0sXHJcbiAgICBjc3M6IHtcclxuICAgICAgcHJlcHJvY2Vzc29yT3B0aW9uczoge1xyXG4gICAgICAgIGxlc3M6IHtcclxuICAgICAgICAgIGphdmFzY3JpcHRFbmFibGVkOiB0cnVlLFxyXG4gICAgICAgICAgbW9kaWZ5VmFyczogdGhlbWVWYXJpYWJsZXMsXHJcbiAgICAgICAgfSxcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIGJ1aWxkOiB7XHJcbiAgICAgIHRhcmdldDogJ21vZHVsZXMnLFxyXG4gICAgICBvdXREaXI6ICdkaXN0JywgLy8gXHU2MzA3XHU1QjlBXHU4RjkzXHU1MUZBXHU4REVGXHU1Rjg0XHJcbiAgICAgIGFzc2V0c0RpcjogJ3N0YXRpYycsIC8vIFx1NjMwN1x1NUI5QVx1NzUxRlx1NjIxMFx1OTc1OVx1NjAwMVx1OEQ0NFx1NkU5MFx1NzY4NFx1NUI1OFx1NjUzRVx1OERFRlx1NUY4NFxyXG4gICAgICBtaW5pZnk6ICd0ZXJzZXInLCAvLyBcdTZERjdcdTZEQzZcdTU2NjgsdGVyc2VyXHU2Nzg0XHU1RUZBXHU1NDBFXHU2NTg3XHU0RUY2XHU0RjUzXHU3OUVGXHU2NkY0XHU1QzBGXHJcbiAgICAgIHNvdXJjZW1hcDogZmFsc2UsIC8vIFx1OEY5M1x1NTFGQS5tYXBcdTY1ODdcdTRFRjZcclxuICAgICAgY2h1bmtTaXplV2FybmluZ0xpbWl0OiAxMDI0LFxyXG4gICAgICBjb21tb25qc09wdGlvbnM6IHtcclxuICAgICAgICBpbmNsdWRlOiAvbm9kZV9tb2R1bGVzfGxpYi9cclxuICAgICAgfSxcclxuICAgICAgdGVyc2VyT3B0aW9uczoge1xyXG4gICAgICAgIGNvbXByZXNzOiB7XHJcbiAgICAgICAgICBkcm9wX2NvbnNvbGU6IHRydWUsIC8vIFx1NzUxRlx1NEVBN1x1NzNBRlx1NTg4M1x1NzlGQlx1OTY2NGNvbnNvbGVcclxuICAgICAgICAgIGRyb3BfZGVidWdnZXI6IHRydWUsIC8vIFx1NzUxRlx1NEVBN1x1NzNBRlx1NTg4M1x1NzlGQlx1OTY2NGRlYnVnZ2VyXHJcbiAgICAgICAgICBwdXJlX2Z1bmNzOiBbJ2NvbnNvbGUubG9nJ11cclxuICAgICAgICB9LFxyXG4gICAgICAgIG91dHB1dDoge1xyXG4gICAgICAgICAgLy8gXHU1M0JCXHU2Mzg5XHU2Q0U4XHU5MUNBXHU1MTg1XHU1QkI5XHJcbiAgICAgICAgICBjb21tZW50czogdHJ1ZVxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuICAgICAgcm9sbHVwT3B0aW9uczoge1xyXG4gICAgICAgIC8vIFx1Nzg2RVx1NEZERFx1NTkxNlx1OTBFOFx1NTMxNlx1NTkwNFx1NzQwNlx1OTBBM1x1NEU5Qlx1NEY2MFx1NEUwRFx1NjBGM1x1NjI1M1x1NTMwNVx1OEZEQlx1NUU5M1x1NzY4NFx1NEY5RFx1OEQ1NlxyXG4gICAgICAgIC8vIGV4dGVybmFsOiBbJ3Z1ZScsICdlbGVtZW50LXBsdXMnXSwgLy8gXHU2Q0U4XHU2MTBGXHU3NzBCXHU4RkQ5XHU5MUNDXHJcbiAgICAgICAgb3V0cHV0OiB7XHJcbiAgICAgICAgICBjaHVua0ZpbGVOYW1lczogJ3N0YXRpYy9qcy9bbmFtZV0tW2hhc2hdLmpzJyxcclxuICAgICAgICAgIGVudHJ5RmlsZU5hbWVzOiAnc3RhdGljL2pzL1tuYW1lXS1baGFzaF0uanMnLFxyXG4gICAgICAgICAgYXNzZXRGaWxlTmFtZXM6ICdzdGF0aWMvW2V4dF0vW25hbWVdLVtoYXNoXS5bZXh0XScsXHJcbiAgICAgICAgICB2dWU6IFsndnVlJywgJ3Z1ZS1yb3V0ZXInLCAndnVleCddLFxyXG4gICAgICAgICAgJ2VsZW1lbnQtcGx1cyc6ICdlbGVtZW50UGx1cycsXHJcbiAgICAgICAgICBtYW51YWxDaHVua3MoaWQpIHtcclxuICAgICAgICAgICAgLy8gaWYgKGlkLmluY2x1ZGVzKCdjb21wb25lbnRzJykpIHtcclxuICAgICAgICAgICAgLy8gICAvLyBcdTYyOEEgY29tcG9uZW50cyBcdTY1ODdcdTRFRjZcdTkxQ0NcdTk3NjJcdTc2ODRcdTY1ODdcdTRFRjZcdTkwRkRcdTYyNTNcdTUzMDVcdTUyMzAgY29tcG9uZW50cy5qcyBcdTRFMkRcclxuICAgICAgICAgICAgLy8gICByZXR1cm4gJ2NvbXBvbmVudHMnXHJcbiAgICAgICAgICAgIC8vIH1cclxuICAgICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKCdub2RlX21vZHVsZXMnKSkge1xyXG4gICAgICAgICAgICAgIHJldHVybiBpZC50b1N0cmluZygpLnNwbGl0KCdub2RlX21vZHVsZXMvJylbMV0uc3BsaXQoJy8nKVswXS50b1N0cmluZygpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBzZXJ2ZXI6IHtcclxuICAgICAgLy8gXHU2NjJGXHU1NDI2XHU0RTNCXHU1MkE4XHU1NTI0XHU5MTkyXHU2RDRGXHU4OUM4XHU1NjY4XHJcbiAgICAgIG9wZW46IHRydWUsXHJcbiAgICAgIC8vIFx1NTM2MFx1NzUyOFx1N0FFRlx1NTNFM1xyXG4gICAgICBwb3J0OiBzZXR0aW5ncy5wb3J0LFxyXG4gICAgICAvLyBcdTY2MkZcdTU0MjZcdTRGN0ZcdTc1MjhodHRwc1x1OEJGN1x1NkM0MlxyXG4gICAgICBodHRwczogc2V0dGluZ3MuaHR0cHMsXHJcbiAgICAgIC8vIFx1NjI2OVx1NUM1NVx1OEJCRlx1OTVFRVx1N0FFRlx1NTNFM1xyXG4gICAgICBob3N0OiAnMC4wLjAuMCcsXHJcbiAgICAgIGhtcjogdHJ1ZSxcclxuICAgICAgd2F0Y2g6IHtcclxuICAgICAgICB1c2VQb2xsaW5nOiB0cnVlIC8vIFdTTFx1NUZDNVx1OTg3QixcdTU0MjZcdTUyMTlcdTcwRURcdTY2RjRcdTY1QjBcdTY1RTBcdTY1NDhcclxuICAgICAgfSxcclxuICAgICAgcHJveHk6IHNldHRpbmdzLnByb3h5RmxhZ1xyXG4gICAgICAgID8ge1xyXG4gICAgICAgICAgICAnL29yZ2lub25lJzoge1xyXG4gICAgICAgICAgICAgIC8vIHRhcmdldDogJ2h0dHA6Ly9sb2NhbGhvc3Q6ODAwJywgLy8gXHU1NDBFXHU1M0YwXHU2M0E1XHU1M0UzXHJcbiAgICAgICAgICAgICAgdGFyZ2V0OiAnaHR0cHM6Ly9hc3NldC5vcmdpbm9uZS5jbicsIC8vIFx1NTQwRVx1NTNGMFx1NjNBNVx1NTNFM1xyXG4gICAgICAgICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSwgLy8gXHU2NjJGXHU1NDI2XHU1MTQxXHU4QkI4XHU4REU4XHU1N0RGXHJcbiAgICAgICAgICAgICAgd3M6IHRydWVcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgIH1cclxuICAgICAgICA6IHt9XHJcbiAgICB9XHJcbiAgfVxyXG59KVxyXG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXHpqZGV4XFxcXERlc2t0b3BcXFxcb2lvY25zLXZ1ZVxcXFxjb25maWdcXFxcdGhlbWVcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXHpqZGV4XFxcXERlc2t0b3BcXFxcb2lvY25zLXZ1ZVxcXFxjb25maWdcXFxcdGhlbWVcXFxcaW5kZXgudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL3pqZGV4L0Rlc2t0b3Avb2lvY25zLXZ1ZS9jb25maWcvdGhlbWUvaW5kZXgudHNcIjtpbXBvcnQgZnMgZnJvbSAnZnMnXHJcbmltcG9ydCBsZXNzVG9KUyBmcm9tICdsZXNzLXZhcnMtdG8tanMnXHJcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXHJcblxyXG5leHBvcnQgY29uc3QgdGhlbWVWYXJpYWJsZXMgPSBsZXNzVG9KUyhcclxuICBmcy5yZWFkRmlsZVN5bmMocGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4vdmFyaWFibGVzLmxlc3MnKSwgJ3V0ZjgnKSxcclxuKVxyXG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXHpqZGV4XFxcXERlc2t0b3BcXFxcb2lvY25zLXZ1ZVxcXFxzcmNcXFxcY29uZmlnXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFx6amRleFxcXFxEZXNrdG9wXFxcXG9pb2Nucy12dWVcXFxcc3JjXFxcXGNvbmZpZ1xcXFxpbmRleC50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvempkZXgvRGVza3RvcC9vaW9jbnMtdnVlL3NyYy9jb25maWcvaW5kZXgudHNcIjsvLyBjb25zdCBCQVNFX1VSTCA9IHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAnZGV2ZWxvcG1lbnQnID8gJy9vcmdpbm9uZScgOiAnaHR0cDovL2xvY2FsaG9zdDo4MDgwJ1xyXG5cclxuY29uc3Qgc2V0dGluZ3M6IGFueSA9IHtcclxuICAvLyBcdThCRjdcdTZDNDJcdTY4MzlcdThERUZcdTVGODRcclxuICBiYXNlVXJsOiAnLycsXHJcbiAgLy8gXHU2NjJGXHU1NDI2XHU1RjAwXHU1NDJGXHU0RUUzXHU3NDA2XHVGRjBDXHU2NzJDXHU1NzMwXHU5NzAwXHU4OTgxXHU1RjAwXHVGRjBDXHU3RUJGXHU0RTBBXHU3M0FGXHU1ODgzXHU1MTczXHU5NUVEXHJcbiAgcHJveHlGbGFnOiB0cnVlLFxyXG4gIC8vIFx1N0FFRlx1NTNFM1xyXG4gIHBvcnQ6IDgwMDAsXHJcbiAgLy8gXHU2NjJGXHU1NDI2XHU1RjAwXHU1NDJGaHR0cHNcclxuICBodHRwczogZmFsc2UsXHJcbiAgLy8gXHU2MjY5XHU1QzU1XHU3QUVGXHU1M0UzXHJcbiAgaG9zdDogJ2xvY2FsaG9zdCcsXHJcbiAgLy8gXHU1MTZDXHU1MTcxXHU4REVGXHU1Rjg0XHJcbiAgYmFzZTogJy8nLFxyXG4gIC8vIFx1NjYyRlx1NTQyNlx1NUM1NVx1NzkzQVx1NjI1M1x1NTMwNVx1NTIwNlx1Njc5MFx1OTg3NVx1OTc2MlxyXG4gIGlzVmlzdWFsaXplcjogZmFsc2UsXHJcbn1cclxuXHJcbmV4cG9ydCB7IHNldHRpbmdzIH1cclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUErUixTQUFTLG9CQUFvQjs7O0FDQUUsT0FBTyxRQUFRO0FBQzdVLE9BQU8sY0FBYztBQUNyQixPQUFPLFVBQVU7QUFGakIsSUFBTSxtQ0FBbUM7QUFJbEMsSUFBTSxpQkFBaUI7QUFBQSxFQUM1QixHQUFHLGFBQWEsS0FBSyxRQUFRLGtDQUFXLGtCQUFrQixHQUFHLE1BQU07QUFDckU7OztBREpBLE9BQU8sU0FBUztBQUNoQixZQUFZQSxXQUFVO0FBRXRCLE9BQU8sZ0JBQWdCO0FBQ3ZCLE9BQU8sZ0JBQWdCO0FBQ3ZCLFNBQVMsMkJBQTJCOzs7QUVMcEMsSUFBTSxXQUFnQjtBQUFBO0FBQUEsRUFFcEIsU0FBUztBQUFBO0FBQUEsRUFFVCxXQUFXO0FBQUE7QUFBQSxFQUVYLE1BQU07QUFBQTtBQUFBLEVBRU4sT0FBTztBQUFBO0FBQUEsRUFFUCxNQUFNO0FBQUE7QUFBQSxFQUVOLE1BQU07QUFBQTtBQUFBLEVBRU4sY0FBYztBQUNoQjs7O0FGUEEsU0FBUyxrQkFBa0I7QUFDM0IsT0FBTyxhQUFhO0FBQ3BCLE9BQU8scUJBQXFCO0FBRTVCLE9BQU8sV0FBVztBQUNsQixPQUFPLG1CQUFtQjtBQWYxQixJQUFNQyxvQ0FBbUM7QUFtQnpDLElBQU8sc0JBQVEsYUFBYSxDQUFDLEVBQUUsU0FBUyxLQUFLLE1BQU07QUFDakQsVUFBUSxJQUFJLDRCQUFRLFNBQVMsSUFBSTtBQUVqQyxTQUFPO0FBQUEsSUFDTCxNQUFNLFNBQVM7QUFBQTtBQUFBLElBQ2YsU0FBUztBQUFBLE1BQ1AsSUFBSTtBQUFBO0FBQUEsTUFDSixnQkFBZ0I7QUFBQSxRQUNkLFNBQVM7QUFBQSxRQUNULFNBQVM7QUFBQTtBQUFBLFFBQ1QsV0FBVztBQUFBO0FBQUEsUUFDWCxXQUFXO0FBQUE7QUFBQSxRQUNYLGtCQUFrQjtBQUFBO0FBQUEsUUFDbEIsS0FBSztBQUFBLE1BQ1AsQ0FBQztBQUFBLE1BQ0QsU0FBUyxTQUFTLFFBQVE7QUFBQSxNQUMxQixXQUFXO0FBQUEsUUFDVCxXQUFXLENBQUMsb0JBQW9CLEdBQUcsY0FBYyxFQUFFLFFBQVEsT0FBTyxDQUFDLENBQUM7QUFBQSxRQUNwRSxTQUFTO0FBQUEsVUFDUDtBQUFBO0FBQUEsVUFDQTtBQUFBLFVBQ0E7QUFBQTtBQUFBLFVBQ0E7QUFBQTtBQUFBLFFBQ0Y7QUFBQSxRQUNBLFVBQVU7QUFBQSxVQUNSLFNBQVM7QUFBQSxVQUNULFVBQVU7QUFBQSxVQUNWLGtCQUFrQjtBQUFBLFFBQ3BCO0FBQUEsUUFDQSxLQUFLO0FBQUEsUUFDTCxTQUFTLENBQUMsT0FBTyxZQUFZO0FBQUEsTUFDL0IsQ0FBQztBQUFBLE1BQ0QsV0FBVztBQUFBLFFBQ1QsV0FBVztBQUFBLFVBQ1Qsb0JBQW9CLEVBQUUsYUFBYSxPQUFPLENBQUM7QUFBQSxVQUMzQyxjQUFjLEVBQUUsb0JBQW9CLEtBQUssQ0FBQztBQUFBLFFBQzVDO0FBQUEsTUFDRixDQUFDO0FBQUEsTUFDRCxNQUFNO0FBQUEsUUFDSixhQUFhO0FBQUEsTUFDZixDQUFDO0FBQUEsTUFDRCxTQUFTLGdCQUFnQixXQUFXLEVBQUUsTUFBTSxNQUFNLFVBQVUsY0FBYyxDQUFDO0FBQUEsSUFDN0U7QUFBQSxJQUNBLFNBQVM7QUFBQSxNQUNQLE9BQU87QUFBQTtBQUFBLFFBRUwsS0FBVSxjQUFRQyxtQ0FBVyxLQUFLO0FBQUEsUUFDbEMsV0FBZ0IsY0FBUUEsbUNBQVcsWUFBWTtBQUFBLFFBQy9DLGVBQW9CLGNBQVFBLG1DQUFXLGdCQUFnQjtBQUFBLFFBQ3ZELFdBQWdCLGNBQVFBLG1DQUFXLFlBQVk7QUFBQSxRQUMvQyxXQUFnQixjQUFRQSxtQ0FBVyxZQUFZO0FBQUEsUUFDL0MsVUFBZSxjQUFRQSxtQ0FBVyxXQUFXO0FBQUEsUUFDN0MsVUFBZSxjQUFRQSxtQ0FBVyxXQUFXO0FBQUEsUUFDN0MsWUFBaUIsY0FBUUEsbUNBQVcsYUFBYTtBQUFBLFFBQ2pELFVBQWUsY0FBUUEsbUNBQVcsV0FBVztBQUFBLE1BQy9DO0FBQUEsSUFDRjtBQUFBLElBQ0EsY0FBYztBQUFBLE1BQ1osU0FBUyxDQUFDLGdDQUFnQztBQUFBLElBQzVDO0FBQUEsSUFDQSxLQUFLO0FBQUEsTUFDSCxxQkFBcUI7QUFBQSxRQUNuQixNQUFNO0FBQUEsVUFDSixtQkFBbUI7QUFBQSxVQUNuQixZQUFZO0FBQUEsUUFDZDtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsSUFDQSxPQUFPO0FBQUEsTUFDTCxRQUFRO0FBQUEsTUFDUixRQUFRO0FBQUE7QUFBQSxNQUNSLFdBQVc7QUFBQTtBQUFBLE1BQ1gsUUFBUTtBQUFBO0FBQUEsTUFDUixXQUFXO0FBQUE7QUFBQSxNQUNYLHVCQUF1QjtBQUFBLE1BQ3ZCLGlCQUFpQjtBQUFBLFFBQ2YsU0FBUztBQUFBLE1BQ1g7QUFBQSxNQUNBLGVBQWU7QUFBQSxRQUNiLFVBQVU7QUFBQSxVQUNSLGNBQWM7QUFBQTtBQUFBLFVBQ2QsZUFBZTtBQUFBO0FBQUEsVUFDZixZQUFZLENBQUMsYUFBYTtBQUFBLFFBQzVCO0FBQUEsUUFDQSxRQUFRO0FBQUE7QUFBQSxVQUVOLFVBQVU7QUFBQSxRQUNaO0FBQUEsTUFDRjtBQUFBLE1BQ0EsZUFBZTtBQUFBO0FBQUE7QUFBQSxRQUdiLFFBQVE7QUFBQSxVQUNOLGdCQUFnQjtBQUFBLFVBQ2hCLGdCQUFnQjtBQUFBLFVBQ2hCLGdCQUFnQjtBQUFBLFVBQ2hCLEtBQUssQ0FBQyxPQUFPLGNBQWMsTUFBTTtBQUFBLFVBQ2pDLGdCQUFnQjtBQUFBLFVBQ2hCLGFBQWEsSUFBSTtBQUtmLGdCQUFJLEdBQUcsU0FBUyxjQUFjLEdBQUc7QUFDL0IscUJBQU8sR0FBRyxTQUFTLEVBQUUsTUFBTSxlQUFlLEVBQUUsQ0FBQyxFQUFFLE1BQU0sR0FBRyxFQUFFLENBQUMsRUFBRSxTQUFTO0FBQUEsWUFDeEU7QUFBQSxVQUNGO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsSUFDQSxRQUFRO0FBQUE7QUFBQSxNQUVOLE1BQU07QUFBQTtBQUFBLE1BRU4sTUFBTSxTQUFTO0FBQUE7QUFBQSxNQUVmLE9BQU8sU0FBUztBQUFBO0FBQUEsTUFFaEIsTUFBTTtBQUFBLE1BQ04sS0FBSztBQUFBLE1BQ0wsT0FBTztBQUFBLFFBQ0wsWUFBWTtBQUFBO0FBQUEsTUFDZDtBQUFBLE1BQ0EsT0FBTyxTQUFTLFlBQ1o7QUFBQSxRQUNFLGFBQWE7QUFBQTtBQUFBLFVBRVgsUUFBUTtBQUFBO0FBQUEsVUFDUixjQUFjO0FBQUE7QUFBQSxVQUNkLElBQUk7QUFBQSxRQUNOO0FBQUEsTUFDRixJQUNBLENBQUM7QUFBQSxJQUNQO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbInBhdGgiLCAiX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUiLCAiX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUiXQp9Cg==
