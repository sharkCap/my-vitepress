---
outline: deep
---

# 基本命令

## Nginx 状态

### 检查状态

查看 Nginx 服务是否正常启动。如果没有启动，查看启动时的错误信息

```bash
sudo systemctl status nginx
```

### 启动或重启

```bash
# 启动 Nginx
sudo systemctl start nginx
# 重启 Nginx
sudo systemctl restart nginx
```

### 重新加载

```bash
# 重新加载配置
sudo systemctl reload nginx
# 或
nginx -s reload
```

| 操作    | 行为                         | 影响范围                     | 适用场景                         |
| ------- | ---------------------------- | ---------------------------- | -------------------------------- |
| restart | 停止并重新启动服务           | 有短暂中断，关闭所有现有连接 | 服务异常，模块更新，彻底重启所需 |
| reload  | 重新加载配置文件，不重启服务 | 无中断，当前连接不受影响     | 修改配置文件，避免中断连接       |

### 检查 Nginx 配置文件

如果启动失败，可能是由于配置文件错误。检查 Nginx 配置文件是否有效

```bash
sudo nginx -t
```

### 查看 Nginx 错误日志

```bash
sudo tail -n 50 /var/log/nginx/error.log
```

### 5. 检查端口占用情况

检查 80 端口（默认 Nginx 端口）是否已经被其他进程占用

```bash
sudo netstat -tuln | grep :80
```
