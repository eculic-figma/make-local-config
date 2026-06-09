import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

function figmaPreviewScript(): Plugin {
  const src = process.env.FIGMA_PREVIEW_SCRIPT
  return {
    name: 'figma-preview-script',
    apply: 'serve',
    transformIndexHtml(html) {
      if (!src) return html
      return { html, tags: [{ tag: 'script', attrs: { src, blocking: 'render' }, injectTo: 'head-prepend' }] }
    },
  }
}

export default defineConfig({
  base: process.env.FIGMA_PUBLIC_URL ? `${process.env.FIGMA_PUBLIC_URL}/` : '/',
  plugins: [react(), tailwindcss(), figmaPreviewScript()],
  server: {
    host: '0.0.0.0',
    port: parseInt(process.env.PORT || '8443'),  // ← was defaulting to 5173
    strictPort: true,
    hmr: (process.env.FIGMA === '1' || process.env.FIGMA === 'true') ? { clientPort: 443 } : undefined,
    watch: { ignored: ['**/.figma/**'] },
  },
  preview: { host: '0.0.0.0', port: parseInt(process.env.PORT || '8443') },
})
