const baseURL = import.meta.env.VITE_BASE_URL
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
  css: ['~/assets/css/main.css'],
  compatibilityDate: '2024-07-02',
  app: {
    head: {
      title: "Hamifold 🍖",
      htmlAttrs: {
        lang: "en",
      },
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          hid: "description",
          name: "description",
          content:
            "Hamifold: Empowering Creators in the HAM chain",
        },
        { hid: "og-type", property: "og:type", content: "website" },
        {
          hid: "og-title",
          property: "og:title",
          content: "Hamifold",
        },
        {
          hid: "og-desc",
          property: "og:description",
          content:
            "Hamifold: Empowering Creators in the HAM chain",
        },
        {
          hid: "og-image",
          property: "og:image",
          content: `${baseURL}/hamifold-thumb.png`,
        },
        {
          hid: "og-url",
          property: "og:url",
          content: baseURL,
        },
        { hid: "t-type", name: "twitter:card", content: "summary_large_image" },
        { hid: "twitter-image", name: "twitter:image", content: `${baseURL}/hamifold-thumb.png` },
        { name: "format-detection", content: "telephone=no" },
      ],
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
    },
  },
});