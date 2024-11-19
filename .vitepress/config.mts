import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/my-vitepress/',
  title: "My Awesome Project",
  description: "A VitePress Site",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Home", link: "/" },
      { text: "Examples", link: "/markdown-examples" },
    ],
    // 搜索栏
    search: {
      provider: "local",
    },
    sidebar: [
      {
        text: "Examples",
        items: [
          { text: "Markdown Examples", link: "/markdown-examples" },
          { text: "Runtime API Examples", link: "/api-examples" },
        ],
      },
      {
        collapsed: true,
        text: "新页面",
        items: [
          { text: "页面1", link: "/new-page" },
          { text: "页面2", link: "/new-page2" },
        ],
      },
    ],
    // github
    socialLinks: [
      { icon: "github", link: "https://github.com/vuejs/vitepress" },
    ],
    // 页脚
    footer: {
      message: "11111",
      copyright: "Copyright ©zzz",
    },
  },
});
