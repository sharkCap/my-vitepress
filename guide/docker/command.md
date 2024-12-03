---
outline: deep
---

# Docker 基本操作
docker指令
## 镜像
### 查看镜像
运行以下命令查看本地已有的镜像
```bash
sudo docker images
```
输出示例
```
# 镜像名称          # 版本标签           # 唯一标识           # 创建时间           # 大小
REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
my-express-app      latest              abc123456789        2 hours ago         123MB
node                16-alpine           def987654321        3 days ago          50MB
```
### 删除镜像
```bash
# 删除悬空镜像（清理所有 <none> 的镜像）
sudo docker image prune

# 手动删除指定镜像
sudo docker rmi d2c882e2637f
```

## 容器
### 查看容器
```bash
# 查看所有运行中的容器
sudo docker ps

# 查看所有容器（包括已停止的容器）
sudo docker ps -a

# 查看最近创建的容器
sudo docker ps -l

# 查看未运行的容器
sudo docker ps -a | grep Exited
```

### 进入容器
```bash
# 进入容器
docker exec -it <container_id> sh
# 或
docker exec -it express-container /bin/bash

# 查看 Node.js 版本
node -v
```


### 停止启动
```bash
# 启动容器
docker start <container_name_or_id>

# 停止容器
sudo docker stop express-container
```
### 删除容器
```bash
# 删除容器（需要先停止）
sudo docker rm express-container
```
### 查看日志
```bash
docker ps  # 查看容器是否正在运行
docker logs <container_id>  # 查看容器的日志，确认是否有任何错误
```

