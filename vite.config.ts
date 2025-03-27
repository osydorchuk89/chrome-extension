import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],
    build: {
        rollupOptions: {
            input: {
                popup: "index.html", // Popup UI
                content: "src/content.ts", // Content script
                background: "src/background.ts", // Background script
            },
            output: {
                entryFileNames: "[name].js",
            },
        },
    },
});
