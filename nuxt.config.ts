// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@nuxtjs/tailwindcss", "@nuxtjs/color-mode"],

  runtimeConfig: {
    // These keys are only available server-side
    MONGODB_URI: process.env.MONGODB_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    MONGODB_DBNAME: process.env.MONGODB_DBNAME,
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,

    public: {
      // These keys are available client-side
      BASE_URL: "http://localhost:3000",
      API_BASE_URL: "http://localhost:3000/api",
    },
  },

  build: {
    transpile:
      process.env.NODE_ENV === "production"
        ? [
            "naive-ui",
            "vueuc",
            "@css-render/vue3-ssr",
            "@juggle/resize-observer",
          ]
        : ["@juggle/resize-observer"],
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
  },

  nitro: {
    serverAssets: [
      {
        baseName: "emails",
        dir: "./assets/emails",
      },
    ],
  },

  app: {
    pageTransition: { name: "page", mode: "out-in" },
    head: {
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
    },
  },
});
