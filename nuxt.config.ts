import { nodePolyfills } from "vite-plugin-node-polyfills";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
    },
    pageTransition: { name: "page", mode: "out-in" },
  },
  build: {
    transpile:
      process.env.NODE_ENV === "production"
        ? ["naive-ui", "vueuc", "@css-render/vue3-ssr", "@juggle/resize-observer"]
        : ["@juggle/resize-observer"],
  },
  imports: {
    dirs: ["stores"],
  },

  modules: [
    "@nuxtjs/tailwindcss",
    "@nuxtjs/color-mode",
    "@nuxtjs/device",
    [
      "@pinia/nuxt",
      {
        autoImports: ["defineStore", "acceptHMRUpdate"],
      },
    ],
  ],

  nitro: {
    serverAssets: [
      {
        baseName: "emails",
        dir: "./assets/emails",
      },
    ],
  },

  runtimeConfig: {
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    MONGODB_DBNAME: process.env.MONGODB_DBNAME,
    // These keys are only available server-side
    MONGODB_URI: process.env.MONGODB_URI,

    public: {
      API_BASE_URL: "http://localhost:3000/api",
      // These keys are available client-side
      BASE_URL: "http://localhost:3000",
    },
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
  },

  tailwindcss: {
    injectPosition: "first",
  },

  vite: {
    optimizeDeps: {
      include:
        process.env.NODE_ENV === "development"
          ? ["naive-ui", "vueuc", "date-fns-tz/esm/formatInTimeZone"]
          : [],
    },
    plugins: [
      nodePolyfills({
        // Whether to polyfill `node:` protocol imports.
        protocolImports: true,
      }),
    ],
  },
});
