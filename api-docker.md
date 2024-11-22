---
outline: deep
---

# Docker
>Linux下的docker指令
## Docker 基本操作
### 1. 查看镜像
>运行以下命令查看本地已有的镜像
```bash
sudo docker images
```
>输出示例
```
# 镜像名称          # 版本标签           # 唯一标识           # 创建时间           # 大小
REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
my-express-app      latest              abc123456789        2 hours ago         123MB
node                16-alpine           def987654321        3 days ago          50MB
```
### 2. 删除镜像
```bash
# 删除悬空镜像（清理所有 <none> 的镜像）
sudo docker image prune

# 手动删除指定镜像
sudo docker rmi d2c882e2637f
```
>输出示例
```
# 镜像名称          # 版本标签           # 唯一标识           # 创建时间           # 大小
REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
my-express-app      latest              abc123456789        2 hours ago         123MB
node                16-alpine           def987654321        3 days ago          50MB
```

### 3. 查看容器
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
### 4. 删除容器
```bash
# 停止容器
sudo docker stop express-container

# 删除容器
sudo docker rm express-container
```
