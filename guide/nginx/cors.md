---
outline: deep
---

# 跨域
解决浏览器同源策略
## 配置

```bash
sudo vim /etc/nginx/nginx.conf
```

```nginx
server {
    listen       80;
    listen       [::]:80;
    server_name  <host>;    # 指定服务器的域名或IP地址
    root         /home/admin/test;  # 前端地址
    index        index.html;        # 入口文件
    location / {
        try_files $uri /index.html;

        # hash路由
        # try_files $uri $uri/ /index.html;
    }

    location /api {
        # 将请求转发到后端应用服务
        proxy_pass http://localhost:3000;

        # 添加 CORS 头部
        # 允许所有域访问，如果需要限制来源可以替换 '*' 为具体域名
        add_header Access-Control-Allow-Origin *;
        # 允许的请求方法
        add_header Access-Control-Allow-Methods 'GET, POST, OPTIONS';
        # 允许的请求头部
        add_header Access-Control-Allow-Headers 'Content-Type, Authorization';
        # 是否允许客户端携带 cookie
        add_header Access-Control-Allow-Credentials true;

        # 处理 OPTIONS 请求（预检请求）
        if ($request_method = 'OPTIONS') {
            add_header Access-Control-Allow-Origin *;
            add_header Access-Control-Allow-Methods 'GET, POST, OPTIONS';
            add_header Access-Control-Allow-Headers 'Content-Type, Authorization';
            add_header Access-Control-Max-Age 1728000;
            return 204;
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
