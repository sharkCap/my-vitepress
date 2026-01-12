---
outline: deep
---

# 反向代理

::: info 📖 什么是反向代理？
反向代理是指用户访问 Nginx，Nginx 再把请求转发给后端服务。

```
用户  →  Nginx(:80)  →  Express(:3000)
            ↓
         前端页面
```

**为什么需要？**
- 前后端都用 80 端口，避免跨域
- 隐藏后端真实端口，更安全
- 可以做负载均衡
:::

## 一、配置示例

编辑配置文件：
```bash
sudo vim /etc/nginx/nginx.conf
```

```nginx
server {
    listen       80;
    server_name  example.com;  # 替换为你的域名或 IP

    # 前端静态文件
    root         /home/admin/dist;
    index        index.html;

    # 前端路由（Vue/React 单页应用）
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API 反向代理
    location /api {
        proxy_pass http://localhost:3000;

        # 传递原始请求信息给后端
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

**关键配置说明：**

| 配置项 | 说明 |
|--------|------|
| `proxy_pass` | 后端服务地址 |
| `proxy_set_header Host` | 传递原始域名 |
| `proxy_set_header X-Real-IP` | 传递客户端真实 IP |
| `try_files` | 前端路由支持（history 模式） |

## 二、生效配置
```bash
# 1. 检查配置语法
sudo nginx -t

# 2. 重新加载配置
sudo nginx -s reload
```

## 三、常见场景

::: details 代理多个后端服务
```nginx
# API 服务
location /api {
    proxy_pass http://localhost:3000;
}

# 用户服务
location /user {
    proxy_pass http://localhost:3001;
}

# WebSocket
location /ws {
    proxy_pass http://localhost:3002;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
}
```
:::

::: details 代理到 Docker 容器
```nginx
# 如果后端运行在 Docker 中
location /api {
    # 使用容器名（需要在同一网络）
    proxy_pass http://express-container:3000;
}
```
:::
