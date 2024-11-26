import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: "/my-vitepress/",
  title: "欢迎光临",
  description: "A VitePress Site",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "首页", link: "/" },
      { text: "文档", link: "/guide/server/account" },
    ],
    // 搜索栏
    search: {
      provider: "local",
    },
    sidebar: [
      {
        text: "服务器",
        items: [
          {
            text: "基本配置",
            items: [{ text: "账户", link: "/guide/server/account" }],
          },
          {
            text: "部署",
            link: "/guide/server/deploy",
          },
          {
            text: "Nginx",
            link: "/guide/server/nginx",
          },
        ],
      },
      {
        text: "Docker",
        items: [{ text: "指令", link: "/guide/docker/home" }],
      },
      {
        collapsed: true,
        text: "新页面",
        items: [
          {
            text: "页面1",
            link: "/new-page",
            items: [{ text: "页面2", link: "/new-page2" }],
          },
        ],
      },
    ],
    // github
    socialLinks: [
      { icon: "github", link: "https://github.com/vuejs/vitepress" },
    ],
    outlineTitle: "文章标题",
    // 页脚
    footer: {
      message: "11111",
      copyright: "Copyright ©zzz",
    },
  },
});
