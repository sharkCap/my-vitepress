---
outline: deep
---

# Nginx配置
配置 Nginx 以反向代理到你的后端 API，并且确保前端页面能够访问
### 1. 打开
```bash
sudo vim /etc/nginx/nginx.conf
```
### 2. 编辑
```nginx
server {
    listen       80;
    listen       [::]:80;
    server_name  <host>;
    root         /home/admin/test;  # 前端地址
    index        index.html;        # 入口文件
    location / {
        try_files $uri /index.html;

        # hash路由
        # try_files $uri $uri/ /index.html;
    }
    # 接口转发
    location /api {
        proxy_pass http://localhost:3000;  # 后端的地址
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 3. 检测
```bash
sudo nginx -t
```

### 4. 重启
```bash
# 重启服务
sudo systemctl restart nginx
# 重新加载配置
sudo systemctl reload nginx
# 或
nginx -s reload
```
| 操作    | 行为                       | 影响范围                   | 适用场景                       |
| ------- | ------------------------- | -------------------------- | ----------------------------- |
| restart | 停止并重新启动服务          | 有短暂中断，关闭所有现有连接 | 服务异常，模块更新，彻底重启所需 |
| reload  | 重新加载配置文件，不重启服务 | 无中断，当前连接不受影响	    | 修改配置文件，避免中断连接      |


