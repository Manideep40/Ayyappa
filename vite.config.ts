import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const ngrokHost = process.env.NGROK_HOST;
  const allowedHosts = [
    "localhost",
    "127.0.0.1",
    ...(ngrokHost ? [ngrokHost] : []),
  ];

  return ({
  server: {
    host: "::",
    port: 8080,
    allowedHosts,
    hmr: ngrokHost
      ? {
          host: ngrokHost,
          clientPort: 443,
          protocol: "wss",
        }
      : undefined,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
});
