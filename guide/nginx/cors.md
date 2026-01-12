---
outline: deep
---

# 跨域配置 (CORS)

::: info 📖 什么是跨域？
浏览器的**同源策略**会阻止网页访问不同域名/端口的资源。

```
前端: http://localhost:5173  →  后端: http://localhost:3000  ❌ 跨域
前端: http://example.com     →  后端: http://api.example.com   ❌ 跨域
```

**解决方案：**
1. 后端设置 CORS 头
2. Nginx 反向代理（推荐，前后端同域）
3. Nginx 添加 CORS 头（本文）
:::

## 一、配置示例

```bash
sudo vim /etc/nginx/nginx.conf
```

```nginx
server {
    listen       80;
    server_name  example.com;

    location /api {
        proxy_pass http://localhost:3000;

        # CORS 头部
        add_header Access-Control-Allow-Origin $http_origin;
        add_header Access-Control-Allow-Methods 'GET, POST, PUT, DELETE, OPTIONS';
        add_header Access-Control-Allow-Headers 'Content-Type, Authorization';
        add_header Access-Control-Allow-Credentials true;

        # 处理预检请求
        if ($request_method = 'OPTIONS') {
            add_header Access-Control-Allow-Origin $http_origin;
            add_header Access-Control-Allow-Methods 'GET, POST, PUT, DELETE, OPTIONS';
            add_header Access-Control-Allow-Headers 'Content-Type, Authorization';
            add_header Access-Control-Max-Age 86400;  # 缓存预检结果 24 小时
            return 204;
        }
    }
}
```

**关键配置说明：**

| 配置项 | 说明 |
|--------|------|
| `Access-Control-Allow-Origin` | 允许的来源域名 |
| `Access-Control-Allow-Methods` | 允许的请求方法 |
| `Access-Control-Allow-Headers` | 允许的请求头 |
| `Access-Control-Allow-Credentials` | 是否允许携带 Cookie |
| `Access-Control-Max-Age` | 预检结果缓存时间 |

::: warning ⚠️ 安全提示
- **不要使用 `*`**：`Access-Control-Allow-Origin *` 允许所有域名访问，存在安全风险
- **生产环境**：应该明确指定允许的域名，如 `https://example.com`
- **推荐方案**：使用反向代理让前后端同域，就不需要 CORS
:::

## 二、生效配置

```bash
# 1. 检查配置语法
sudo nginx -t

# 2. 重新加载配置
sudo nginx -s reload
```

## 三、替代方案：反向代理

更推荐的方式是使用[反向代理](./proxy.md)，让前后端请求走同一个域名，就不存在跨域问题：

```nginx
server {
    listen 80;
    server_name example.com;

    # 前端
    location / {
        root /var/www/html;
        try_files $uri $uri/ /index.html;
    }

    # 后端 API（同域，无跨域）
    location /api {
        proxy_pass http://localhost:3000;
    }
}
```
