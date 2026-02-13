import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // 启用 React Fast Refresh
      fastRefresh: true,
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@stores': path.resolve(__dirname, './src/stores'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@styles': path.resolve(__dirname, './src/styles'),
      '@shared': path.resolve(__dirname, '../shared'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
      '/ws': {
        target: 'ws://localhost:3001',
        ws: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false, // 生产环境关闭 sourcemap 以减小体积
    // 启用代码压缩和优化
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // 移除 console.log
        drop_debugger: true, // 移除 debugger
      },
    },
    // 代码分割策略
    rollupOptions: {
      output: {
        // 手动分包策略
        manualChunks: {
          // React 核心库
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // UI 组件库
          'ui-vendor': ['lucide-react'],
          // 图表库
          'charts-vendor': ['echarts', 'echarts-for-react'],
          // 数据可视化
          'viz-vendor': ['d3'],
          // 状态管理
          'state-vendor': ['zustand', '@tanstack/react-query'],
          // 其他第三方库
          'lib-vendor': ['axios', 'socket.io-client'],
        },
        // 文件命名
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const name = assetInfo.name || '';
          if (name.endsWith('.css')) {
            return 'assets/css/[name]-[hash][extname]';
          }
          if (/\.(png|jpe?g|gif|svg|webp|ico)$/.test(name)) {
            return 'assets/images/[name]-[hash][extname]';
          }
          if (/\.(woff2?|eot|ttf|otf)$/.test(name)) {
            return 'assets/fonts/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        },
      },
    },
    // 分包大小警告阈值
    chunkSizeWarningLimit: 500,
    // CSS 代码分割
    cssCodeSplit: true,
  },
  // 优化依赖预构建
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'zustand',
      '@tanstack/react-query',
      'lucide-react',
      'axios',
    ],
  },
  // 预加载配置
  experimental: {
    renderBuiltUrl(filename, { type }) {
      // 为关键资源添加 preload
      if (type === 'js' && filename.includes('main')) {
        return { runtime: `__VITE_PRELOAD__(${JSON.stringify(filename)})` };
      }
      return { relative: true };
    },
  },
});
