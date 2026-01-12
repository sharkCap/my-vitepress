---
outline: deep
---

# Docker 常用命令

::: tip 💡 命令速查
本页整理了 Docker 日常运维中最常用的命令，建议收藏备查。
:::

## 命令结构

Docker 命令的基本格式：
```bash
docker <对象> <操作> [参数]
#      镜像/容器  增删改查   选项
```

## 一、镜像操作
### 1.1 查看镜像

```bash
# 查看本地所有镜像
sudo docker images

# 只查看镜像ID
sudo docker images -q
```

**输出示例：**
```
REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
my-express-app      latest              abc123456789        2 hours ago         123MB
node                16-alpine           def987654321        3 days ago          50MB
```

| 字段 | 说明 |
|------|------|
| REPOSITORY | 镜像名称 |
| TAG | 版本标签（默认 latest） |
| IMAGE ID | 镜像唯一标识 |
| CREATED | 创建时间 |
| SIZE | 镜像大小 |
### 1.2 拉取镜像

```bash
# 从 Docker Hub 拉取镜像
sudo docker pull node:16-alpine

# 拉取指定版本
sudo docker pull nginx:1.24
```

### 1.3 删除镜像

```bash
# 删除悬空镜像（清理所有 <none> 的无用镜像）
sudo docker image prune

# 删除指定镜像（使用镜像 ID）
sudo docker rmi d2c882e2637f

# 删除指定镜像（使用名称:标签）
sudo docker rmi my-express-app:latest

# 删除镜像（省略标签默认为 latest）
sudo docker rmi my-express-app
```

::: warning ⚠️ 注意
删除镜像前，需要先停止并删除使用该镜像的所有容器
:::

## 二、容器操作
### 2.1 查看容器

```bash
# 查看运行中的容器
sudo docker ps

# 查看所有容器（包括已停止的）
sudo docker ps -a

# 只显示容器ID
sudo docker ps -q

# 查看最近创建的容器
sudo docker ps -l
```

**输出示例：**
```
CONTAINER ID   IMAGE          COMMAND       STATUS         PORTS                    NAMES
abc123         express-app    "node..."     Up 2 hours     0.0.0.0:3000->3000/tcp   express-container
```

| 状态 | 说明 |
|------|------|
| Up | 运行中 |
| Exited | 已停止 |
| Created | 已创建未启动 |

### 2.2 进入容器
```bash
# 进入容器的终端（使用 sh）
sudo docker exec -it <容器名或ID> sh

# 进入容器的终端（使用 bash，如果容器支持）
sudo docker exec -it express-container /bin/bash
```

::: tip 参数说明
- `-i`：保持标准输入打开（interactive）
- `-t`：分配一个伪终端（tty）
- 退出容器：输入 `exit` 或按 `Ctrl + D`
:::

**进入容器后可执行的操作示例：**
```bash
# 查看 Node.js 版本
node -v

# 查看当前目录文件
ls -la

# 查看环境变量
env
```

### 2.3 启动和停止
```bash
# 启动已停止的容器
sudo docker start <容器名或ID>

# 停止运行中的容器（优雅停止，等待进程结束）
sudo docker stop <容器名或ID>

# 强制停止容器（立即终止）
sudo docker kill <容器名或ID>

# 重启容器
sudo docker restart <容器名或ID>
```

### 2.4 删除容器
```bash
# 删除已停止的容器
sudo docker rm <容器名或ID>

# 强制删除容器（即使正在运行）
sudo docker rm -f <容器名或ID>

# 删除所有已停止的容器
sudo docker container prune
```

::: details 💡 常用组合：重新部署容器
```bash
# 1. 停止并删除旧容器
sudo docker rm -f express-container

# 2. 重新构建镜像
sudo docker build -t express-app .

# 3. 运行新容器
sudo docker run -d -p 9969:9969 --name express-container express-app
```
:::

### 2.5 查看日志
```bash
# 查看容器日志
sudo docker logs <容器名或ID>

# 实时查看日志（类似 tail -f）
sudo docker logs -f <容器名或ID>

# 查看最后 100 行日志
sudo docker logs --tail 100 <容器名或ID>

# 显示时间戳
sudo docker logs -t <容器名或ID>
```

## 三、实用技巧

### 3.1 清理空间

```bash
# 查看 Docker 占用空间
sudo docker system df

# 一键清理所有未使用的资源（镜像、容器、网络）
sudo docker system prune

# 包括未使用的镜像（更彻底）
sudo docker system prune -a
```

### 3.2 复制文件

```bash
# 从容器复制到主机
sudo docker cp <容器名>:/path/in/container /path/on/host

# 从主机复制到容器
sudo docker cp /path/on/host <容器名>:/path/in/container
```

### 3.3 查看容器详情

```bash
# 查看容器详细信息（网络、挂载等）
sudo docker inspect <容器名或ID>

# 查看容器资源使用情况
sudo docker stats
```

