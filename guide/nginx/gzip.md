---
outline: deep
---

# 压缩

开启gzip压缩

## 配置

```bash
sudo vim /etc/nginx/nginx.conf
```

```nginx
http {
    # 启用 Gzip 压缩
    gzip on;

    # 允许压缩的最低文件大小，文件大小小于此值不会被压缩，默认为 0（即压缩所有内容）
    gzip_min_length 1024;  # 设置为 1KB，只有超过 1KB 的文件才会被压缩

    # 设置压缩的级别，范围为 1 - 9，越高压缩比越大，但会消耗更多的 CPU 资源
    gzip_comp_level 6;  # 设置为 6，平衡压缩效果与 CPU 使用

    # 设置可以被压缩的 MIME 类型，确保支持文本、JSON、CSS、JS 文件的压缩
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss application/font-woff application/font-woff2 image/svg+xml;

    # 启用压缩时使用的 HTTP 版本
    gzip_http_version 1.1;  # 针对 HTTP/1.1 开启 gzip

    # 代理服务器响应也可以进行 gzip 压缩
    gzip_proxied any;  # 支持任何代理的响应进行 gzip 压缩

    # 禁用对某些特定浏览器的 gzip 压缩，如 IE6
    gzip_disable "msie6";  # 禁用对 IE6 的 gzip 压缩

    # 启用 Vary: Accept-Encoding 头，帮助缓存系统区分压缩和非压缩版本
    gzip_vary on;  # 启用 Vary: Accept-Encoding，缓存压缩的内容

    # 设置允许的最大缓冲区大小，影响压缩的速度和效率
    gzip_buffers 16 8k;  # 16 个 8KB 的缓冲区

    # 设置压缩时的缓冲区
    gzip_proxied any;  # 允许任何代理服务器的响应进行 gzip 压缩

    # 继续其他常规的 Nginx 配置项
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    server {
        listen 80;
        server_name example.com;

        location / {
            # 使用 gzip 压缩所有请求
            try_files $uri $uri/ /index.html;
        }
    }
}
```

## 检测

```bash
sudo nginx -t
```

## 重启

```bash
# 重启服务
sudo systemctl restart nginx
# 重新加载配置
sudo systemctl reload nginx
# 或
nginx -s reload
```
