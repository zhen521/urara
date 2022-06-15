import preprocess from 'svelte-preprocess'
import adapterAuto from '@sveltejs/adapter-auto'
import adapterNode from '@sveltejs/adapter-node'
import adapterStatic from '@sveltejs/adapter-static'
import mdsvexConfig from './mdsvex.config.js'
import postcss from './postcss.config.js'
import UnoCSS from 'unocss/vite'
import { presetIcons, extractorSvelte } from 'unocss'
import { VitePWA } from 'vite-plugin-pwa'
import { mdsvex } from 'mdsvex'

import type { Config } from '@sveltejs/kit'

const defineConfig = (config: Config) => config

export default defineConfig({
  extensions: ['.svelte', ...(mdsvexConfig.extensions as string[])],
  preprocess: [mdsvex(mdsvexConfig), preprocess()],
  kit: {
    adapter: Object.keys(process.env).some(key => ['VERCEL', 'CF_PAGES', 'NETLIFY'].includes(key))
      ? adapterAuto()
      : process.env.ADAPTER === 'node'
      ? adapterNode({ out: 'build' })
      : adapterStatic({
          pages: 'build',
          assets: 'build',
          fallback: undefined
        }),
    csp: { mode: 'auto' },
    prerender: { default: true },
    vite: {
      mode: process.env.MODE || 'production',
      envPrefix: 'URARA_',
      css: { postcss: postcss as any },
      plugins: [
        UnoCSS({
          extractors: [extractorSvelte],
          presets: [presetIcons({ scale: 1.5 })]
        }),
        VitePWA({
          srcDir: './build',
          outDir: './.svelte-kit/output/client',
          registerType: 'autoUpdate',
          scope: '/',
          base: '/'
        })
      ]
    }
  }
})