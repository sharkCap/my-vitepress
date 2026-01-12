import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: "/my-vitepress/",
  title: "欢迎光临",
  description: "A VitePress Site",
  ignoreDeadLinks: true,
  markdown: {
    image: {
      // 默认禁用；设置为 true 可为所有图片启用懒加载。
      lazyLoading: true
    }
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      // 当用户位于 `/guide/` 路径时，该链接处于激活状态
      { text: "服务器", link: "/guide/server/account", activeMatch: "/guide/" },
      { text: "React", link: "/react/day01/基础-1", activeMatch: "/react/" },
    ],
    // 搜索栏
    search: {
      provider: "local",
    },
    sidebar: {
      "/guide/": [
        {
          text: "服务器",
          items: [
            {
              text: "基本配置",
              link: "/guide/server/account",
            },
            {
              text: "部署",
              link: "/guide/server/deploy",
            },
          ],
        },
        {
          text: "Nginx",
          items: [
            { text: "基本指令", link: "/guide/nginx/command" },
            {
              text: "配置",
              items: [
                { text: "代理", link: "/guide/nginx/proxy" },
                { text: "跨域", link: "/guide/nginx/cors" },
                { text: "压缩", link: "/guide/nginx/gzip" },
              ],
            },
          ],
        },
        {
          text: "Docker",
          items: [
            { text: "入门指南", link: "/guide/docker/main" },
            { text: "镜像源", link: "/guide/docker/mirror" },
            { text: "部署", link: "/guide/docker/deploy" },
            { text: "常用命令", link: "/guide/docker/command" },
            { text: "网络配置", link: "/guide/docker/network" },
            { text: "Compose", link: "/guide/docker/compose" },
          ],
        },
        {
          text: "MongoDB",
          items: [
            { text: "安装", link: "/guide/mongoDB/main" },
            { text: "基本指令", link: "/guide/mongoDB/command" },
            { text: "后端交互", link: "/guide/mongoDB/express" },
          ],
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
      '/react/': [
        {
          text: 'React',
          items: [
            { text: '基础-上', link: '/react/day01/基础-1' },
            { text: '基础-下', link: '/react/day02/基础-2' },
            { text: 'Redux', link: '/react/day03/Redux' },
            { text: 'Router', link: '/react/day04/Router' },
            { text: '小结', link: '/react/day05/记账本' },
            {
              text: "实战",
              items: [
                { text: "准备", link: "/react/day06-09/01.项目前置准备" },
                { text: "登录", link: "/react/day06-09/02.登录模块" },
                { text: "layout", link: "/react/day06-09/03.Layout模块" },
                { text: "发布", link: "/react/day06-09/04.发布文章模块" },
                { text: "列表", link: "/react/day06-09/05.文章列表模块" },
                { text: "编辑", link: "/react/day06-09/06.编辑文章" },
                { text: "打包", link: "/react/day06-09/07.项目打包" },
              ],
            },
            {
              text: "进阶-1",
              items: [
                { text: "useReducer", link: "/react/day10/01.useReducer" },
                { text: "渲染性能优化", link: "/react/day10/02.渲染性能优化" },
                { text: "forwardRef", link: "/react/day10/03.forwardRef" },
                { text: "useImperativeHandle", link: "/react/day10/03.useImperativeHandle" },
                { text: "ClassAPI", link: "/react/day10/04.ClassAPI" },
                { text: "zustand", link: "/react/day10/05.zustand" },
              ],
            },
            {
              text: "进阶-2",
              items: [
                { text: "阶段重点与环境搭建", link: "/react/day11/01.阶段重点与环境搭建" },
                { text: "Hooks与TypeScript", link: "/react/day11/02.Hooks与TypeScript" },
                { text: "Component与TypeScript", link: "/react/day11/03.Component与TypeScript" },
              ],
            },
            {
              text: "进阶-3",
              items: [
                { text: "项目初始化", link: "/react/day12/01.项目初始化" },
                { text: "列表模块", link: "/react/day12/02.列表模块" },
                { text: "详情模块", link: "/react/day12/03.详情模块" },
              ],
            },
          ]
        }
      ]
    },
    // github
    socialLinks: [
      { icon: "github", link: "https://github.com/vuejs/vitepress" },
    ],
    outlineTitle: "目录",
    // 页脚
    footer: {
      message: "11111",
      copyright: "Copyright ©zzz",
    },
  },
});
