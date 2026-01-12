---
outline: deep
---

# Docker Compose 入门

::: info 📖 什么是 Docker Compose？
Docker Compose 是一个用于定义和运行**多容器应用**的工具。  
通过一个 `docker-compose.yml` 配置文件，一条命令就能启动整套服务！
:::

## 一、为什么需要 Compose？

### 传统方式的痛点

部署一个 Express + MongoDB 项目需要运行多条命令：

```bash
# 1. 创建网络
docker network create app-net

# 2. 运行 MongoDB
docker run -d --name mongo --network app-net -v mongo-data:/data/db mongo:6

# 3. 构建应用镜像
docker build -t express-app .

# 4. 运行应用
docker run -d --name express --network app-net -p 3000:3000 express-app
```

每次部署都要记住这些命令，容易出错！

### Compose 方式

用一个配置文件描述所有服务，一条命令搞定：

```bash
docker compose up -d
```

## 二、安装 Docker Compose

::: tip 好消息
Docker Desktop（Windows/Mac）和新版 Docker 已经内置了 Compose，无需单独安装！
:::

**Linux 检查是否已安装：**
```bash
docker compose version
```

**如果未安装（CentOS）：**
```bash
# 下载 Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# 添加执行权限
sudo chmod +x /usr/local/bin/docker-compose

# 创建软链接（支持 docker compose 命令）
sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose

# 验证安装
docker-compose --version
```

## 三、配置文件详解

在项目根目录创建 `docker-compose.yml` 文件：

### 基础示例

```yaml
# docker-compose.yml
version: '3.8'

services:
  # 服务名称（可自定义）
  express:
    build: .                    # 使用当前目录的 Dockerfile 构建
    container_name: express-container
    ports:
      - "3000:3000"             # 端口映射 主机:容器
    depends_on:
      - mongo                   # 依赖 mongo 服务，会先启动 mongo
    environment:
      - NODE_ENV=production
      - MONGO_URI=mongodb://mongo:27017/mydb
    restart: unless-stopped     # 自动重启策略

  mongo:
    image: mongo:6              # 使用官方镜像
    container_name: mongo-container
    volumes:
      - mongo-data:/data/db     # 数据持久化
    environment:
      - MONGO_INITDB_ROOT_USERNAME=admin
      - MONGO_INITDB_ROOT_PASSWORD=123456
    restart: unless-stopped

# 定义数据卷
volumes:
  mongo-data:
```

### 配置项说明

| 配置项 | 说明 |
|--------|------|
| `version` | Compose 文件版本，推荐 3.8 |
| `services` | 定义各个服务（容器） |
| `build` | 指定 Dockerfile 路径进行构建 |
| `image` | 使用现成的镜像 |
| `ports` | 端口映射 `主机端口:容器端口` |
| `volumes` | 数据卷挂载 |
| `environment` | 环境变量 |
| `depends_on` | 服务依赖关系 |
| `restart` | 重启策略 |
| `networks` | 加入的网络（默认自动创建） |

## 四、常用命令

### 4.1 启动服务

```bash
# 启动所有服务（后台运行）
docker compose up -d

# 启动并重新构建镜像
docker compose up -d --build

# 只启动指定服务
docker compose up -d express
```

### 4.2 查看状态

```bash
# 查看服务状态
docker compose ps

# 查看服务日志
docker compose logs

# 实时查看日志
docker compose logs -f

# 查看指定服务日志
docker compose logs express
```

### 4.3 停止服务

```bash
# 停止所有服务
docker compose stop

# 停止并删除容器、网络
docker compose down

# 停止并删除容器、网络、数据卷（⚠️ 数据会丢失）
docker compose down -v
```

### 4.4 其他操作

```bash
# 进入服务容器
docker compose exec express sh

# 重启服务
docker compose restart

# 查看服务配置
docker compose config
```

## 五、实战案例

### 案例：完整的前后端部署

```yaml
# docker-compose.yml
version: '3.8'

services:
  # Nginx 前端 + 反向代理
  nginx:
    image: nginx:alpine
    container_name: nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./dist:/usr/share/nginx/html:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - express
    restart: unless-stopped

  # Express 后端
  express:
    build: ./backend
    container_name: express
    expose:
      - "3000"                  # 只在内部网络暴露，不映射到主机
    environment:
      - NODE_ENV=production
      - MONGO_URI=mongodb://admin:123456@mongo:27017/mydb?authSource=admin
    depends_on:
      - mongo
    restart: unless-stopped

  # MongoDB 数据库
  mongo:
    image: mongo:6
    container_name: mongo
    volumes:
      - mongo-data:/data/db
    environment:
      - MONGO_INITDB_ROOT_USERNAME=admin
      - MONGO_INITDB_ROOT_PASSWORD=123456
    restart: unless-stopped

volumes:
  mongo-data:
```

### 部署流程

```bash
# 1. 上传项目到服务器
# 2. 进入项目目录
cd /path/to/project

# 3. 启动所有服务
docker compose up -d --build

# 4. 查看运行状态
docker compose ps

# 5. 查看日志排查问题
docker compose logs -f
```

## 六、常见问题

::: details depends_on 能保证服务完全就绪吗？
**不能！** `depends_on` 只保证容器启动顺序，不保证服务就绪。

例如 MongoDB 容器启动了，但数据库可能还没准备好接受连接。

**解决方案**：在应用代码中添加重连逻辑，或使用 `healthcheck` 配置。
:::

::: details 如何更新服务？
```bash
# 重新构建并启动（会自动替换旧容器）
docker compose up -d --build

# 只更新指定服务
docker compose up -d --build express
```
:::

::: details 环境变量太多怎么办？
使用 `.env` 文件：

```bash
# .env
MONGO_USER=admin
MONGO_PASS=123456
NODE_ENV=production
```

```yaml
# docker-compose.yml
services:
  mongo:
    environment:
      - MONGO_INITDB_ROOT_USERNAME=${MONGO_USER}
      - MONGO_INITDB_ROOT_PASSWORD=${MONGO_PASS}
```
:::

::: details docker-compose 和 docker compose 有什么区别？
- `docker-compose`：旧版独立工具（V1）
- `docker compose`：新版集成到 Docker CLI（V2，推荐）

两者功能基本一致，新项目建议使用 `docker compose`。
:::
