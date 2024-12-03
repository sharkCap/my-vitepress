---
outline: deep
---

# 基本命令

## Nginx 状态
### 1. 检查 Nginx 服务的状态
查看 Nginx 服务是否正常启动。如果没有启动，查看启动时的错误信息
```bash
sudo systemctl status nginx
```

### 2. 启动或重启
```bash
# 启动 Nginx
sudo systemctl start nginx
# 重启 Nginx
sudo systemctl restart nginx
```

### 3. 检查 Nginx 配置文件
如果启动失败，可能是由于配置文件错误。检查 Nginx 配置文件是否有效
```bash
sudo nginx -t
```

### 4. 查看 Nginx 错误日志
```bash
sudo tail -n 50 /var/log/nginx/error.log
```

### 5. 检查端口占用情况
检查 80 端口（默认 Nginx 端口）是否已经被其他进程占用
```bash
sudo netstat -tuln | grep :80
```