---
outline: deep
---

# 反向代理
配置 Nginx 以反向代理到你的后端 API，并且确保前端页面能够访问
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

        # 将原始请求的 Host 头部传递给后端
        proxy_set_header Host $host;
        # 将客户端的真实 IP 地址传递给后端
        proxy_set_header X-Real-IP $remote_addr;
        # 保持 X-Forwarded-For 头，记录所有经过的代理地址
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        # 将请求的协议（http 或 https）传递给后端
        proxy_set_header X-Forwarded-Proto $scheme;
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
