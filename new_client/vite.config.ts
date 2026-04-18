import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from "path"
import { tanstackRouter } from "@tanstack/router-plugin/vite"

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "")
  const clientPort = Number(env.VITE_PORT || 3000)
  const apiTarget = env.VITE_API_PROXY_TARGET || "http://localhost:5000"

  return {
    plugins: [tanstackRouter({
      target: "react",
      autoCodeSplitting: true
    }), react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },

    server: {
      port: clientPort,
      proxy: {
        "/api": {
          target: apiTarget,
          changeOrigin: true,
          secure: false
        }
      }
    }
  }
})
