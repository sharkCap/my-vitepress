---
outline: deep
---

# Nginx 基本命令

::: info 📖 什么是 Nginx？
Nginx 是一个高性能的 Web 服务器和反向代理服务器。常用于：
- 🌐 托管静态网站（前端项目）
- 🔄 反向代理（转发请求到后端 API）
- ⚖️ 负载均衡（分发请求到多个服务器）
:::

## 一、安装 Nginx

### CentOS

```bash
# 安装
sudo yum install -y nginx

# 启动并设置开机自启
sudo systemctl start nginx
sudo systemctl enable nginx
```

### Ubuntu

```bash
sudo apt update
sudo apt install -y nginx
```

安装完成后，访问 `http://服务器IP` 应能看到 Nginx 欢迎页面。

## 二、服务管理

### 2.1 查看状态

```bash
sudo systemctl status nginx
```

### 2.2 启动 / 停止 / 重启

```bash
# 启动
sudo systemctl start nginx

# 停止
sudo systemctl stop nginx

# 重启（会中断连接）
sudo systemctl restart nginx
```

### 2.3 重新加载配置

```bash
# 重新加载配置（不中断连接，推荐）
sudo systemctl reload nginx
# 或
sudo nginx -s reload
```

**restart vs reload 区别：**

| 操作 | 行为 | 适用场景 |
|------|------|----------|
| `restart` | 停止并重新启动 | 服务异常、模块更新 |
| `reload` | 仅重新加载配置 | 修改配置文件（推荐） |

## 三、配置检查与调试

### 3.1 检查配置文件语法

修改配置后先检查，避免配置错误导致服务崩溃：

```bash
sudo nginx -t
```

输出示例：
```
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

### 3.2 查看错误日志

```bash
sudo tail -f /var/log/nginx/error.log

sudo tail -n 50 /var/log/nginx/error.log
```

### 3.3 查看访问日志

```bash
sudo tail -f /var/log/nginx/access.log
```

### 3.4 检查端口占用

```bash
# 检查 80 端口是否被占用
sudo netstat -tuln | grep :80

# 或者
sudo lsof -i :80
```

## 四、配置文件位置

| 路径 | 说明 |
|------|------|
| `/etc/nginx/nginx.conf` | 主配置文件 |
| `/etc/nginx/conf.d/` | 额外配置文件目录 |
| `/var/log/nginx/` | 日志目录 |
| `/usr/share/nginx/html/` | 默认网站目录 |

::: tip 💡 下一步
学习 Nginx 配置：
- [反向代理](./proxy.md) - 转发请求到后端 API
- [跨域配置](./cors.md) - 解决浏览器跨域问题
- [压缩配置](./gzip.md) - 开启 Gzip 提升性能
:::
