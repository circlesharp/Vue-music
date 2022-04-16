import { defineConfig } from 'vite';
import { createVuePlugin } from 'vite-plugin-vue2';
import path from 'path';
import resolveExtensionVue from 'vite-plugin-resolve-extension-vue';
import vitePluginStylusAlias from 'vite-plugin-stylus-alias'

const HOST = '0.0.0.0';
const REPLACEMENT = `${path.resolve(__dirname, './src')}/`;

export default () => {
  return defineConfig({
    base: './',
    server: {
      host: HOST,
      port: process.env.PORT,
    },
    resolve: {
      alias: [
        {
          find: '@/',
          replacement: REPLACEMENT,
        },
        {
          find: 'src/',
          replacement: REPLACEMENT,
        },
        {
          find: 'components/',
          replacement: `${path.resolve(__dirname, './src/components')}/`,
        },
        {
          find: 'common/',
          replacement: `${path.resolve(__dirname, './src/common')}/`,
        },
        {
          find: 'api/',
          replacement: `${path.resolve(__dirname, './src/api')}/`,
        },
        {
          find: 'base/',
          replacement: `${path.resolve(__dirname, './src/base')}/`,
        },
      ],
    },
    plugins: [
      // vue 插件
      createVuePlugin(),

      // 处理 .vue 后缀缺失
      resolveExtensionVue(),

      // 处理 stylus alias
      vitePluginStylusAlias()
    ],
  });
};
