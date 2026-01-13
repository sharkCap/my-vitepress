---
outline: deep
---

# Docker 部署

::: info 📖 什么是 Docker？
Docker 是一个容器化平台，可以将应用程序和其依赖打包成一个独立的「容器」。  
**好处：** 在你电脑上能跑的程序，打包成 Docker 镜像后，在任何服务器上都能跑，再也不用担心「在我电脑上明明可以的」这种问题！
:::

::: tip 🗺️ 建议先看
如果 `docker pull` 下载很慢，请先配置 [国内镜像源](./mirror.md)
:::

## 一、安装 Docker

### 在 CentOS 上安装 Docker
```bash
# 更新系统软件包（无需重复更新）
sudo yum update -y
# 安装依赖
sudo yum install -y yum-utils device-mapper-persistent-data lvm2
# 添加 Docker 官方仓库
sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
# 安装 Docker CE
sudo yum install -y docker-ce docker-ce-cli containerd.io
# 启动 Docker 服务
sudo systemctl start docker
sudo systemctl enable docker
# 验证安装
docker --version
```
输出类似于 `Docker version 20.x.x` 表示安装成功。

## 二、核心概念速览

在开始之前，先理解 3 个核心概念：

| 概念 | 类比 | 说明 |
|------|------|------|
| **镜像 (Image)** | 安装包 | 包含应用代码和环境的只读模板 |
| **容器 (Container)** | 运行中的程序 | 镜像的运行实例，可以启动/停止 |
| **Dockerfile** | 安装说明书 | 描述如何构建镜像的文本文件 |

```
📦 Dockerfile  →  🖼️ 镜像 (Image)  →  🚀 容器 (Container)
   (配方)           (蛋糕模具)           (做出来的蛋糕)
```

## 三、项目容器化

### 前端项目（React/Vue）

前端项目有两种部署方式：

| 方式 | 说明 | 适用场景 |
|------|------|---------|
| **多阶段构建（推荐）** | 在 Docker 中执行 build，输出纯净镜像 | CI/CD、生产环境 |
| **仅打包产物** | 本地 build 后只上传 dist | 快速部署、带宽有限 |

#### 方式一：多阶段构建（推荐）

```Dockerfile
# 阶段1：构建
FROM node:18-alpine AS builder

WORKDIR /app

# 复制依赖文件
COPY package*.json ./

# 安装依赖
RUN npm config set registry https://registry.npmmirror.com/ && \
    npm install

# 复制源码并构建
COPY . .
RUN npm run build

# 阶段2：生产镜像
FROM nginx:alpine

# 复制构建产物到 Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# 复制自定义 Nginx 配置（可选）
# COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

::: tip 多阶段构建的好处
- ✅ 最终镜像只包含 `dist` + Nginx，体积很小（约 20MB）
- ✅ 不包含 node_modules，更安全
- ✅ 构建环境和运行环境分离
:::

**构建和运行：**
```bash
# 构建镜像
docker build -t react-app:latest .

# 运行容器
docker run -d -p 80:80 --name react-container react-app:latest
```

#### 方式二：仅上传 dist（简单快速）

本地执行 `npm run build`，只把 `dist` 目录上传到服务器：

```Dockerfile
FROM nginx:alpine

# 复制本地构建好的 dist 目录
COPY dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

```bash
# 本地构建
npm run build

# 上传 dist 和 Dockerfile 到服务器，然后构建镜像
docker build -t react-app:latest .
```

#### 前端路由配置（SPA）

如果使用 React Router / Vue Router 的 history 模式，需要配置 Nginx：

创建 `nginx.conf`：
```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # 支持前端路由
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

修改 Dockerfile：
```Dockerfile
FROM nginx:alpine
COPY dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### 前端 + 后端 API 代理

如果前端需要调用后端 API，在 `nginx.conf` 中添加代理：

```nginx
server {
    listen 80;
    root /usr/share/nginx/html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # API 代理到后端容器
    location /api {
        proxy_pass http://express-container:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

::: warning ⚠️ 注意
使用容器名 `express-container` 需要前后端容器在同一 Docker 网络中！
```bash
docker network create app-net
docker run -d --name express-container --network app-net express-app
docker run -d --name react-container --network app-net -p 80:80 react-app
```
:::

---

### 后端项目（Express/Node.js）

#### 1. 创建 Dockerfile
>在 Express 项目根目录下创建一个名为 `Dockerfile` 的文件：
```Dockerfile
# 基于 PM2 的官方镜像
FROM keymetrics/pm2:latest-alpine

# 设置工作目录
WORKDIR /usr/src/app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 修改npm镜像
RUN npm config set registry https://registry.npmmirror.com/

# 安装依赖
RUN npm install

# 复制项目文件
COPY . .

# 暴露端口
EXPOSE 9969

# 使用 PM2 启动应用
CMD ["pm2-runtime", "src/app.js"]
```


#### PM2 版本问题
使用`PM2`镜像和`Node`版本问题
[查看node版本](./command.md#进入容器)
>使用 FROM keymetrics/pm2:latest-alpine 作为基础镜像时，容器中使用的 Node.js 版本是由镜像本身决定的。因此，默认情况下，该镜像会使用一个已经预安装好的 Node.js 版本，可能是 Node.js v14 这个版本。**Node版本过低会导致有些依赖报错。**

#### 指定 Node.js 版本
```Dockerfile
# 使用指定版本的 Node.js 作为基础镜像
FROM node:16-alpine

# 设置工作目录
WORKDIR /usr/src/app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 修改npm镜像
RUN npm config set registry https://registry.npmmirror.com/

# 安装依赖
RUN npm install

# 复制项目文件
COPY . .

# 安装 PM2
RUN npm install -g pm2

# 暴露端口
EXPOSE 9969

# 使用 PM2 启动应用
CMD ["pm2-runtime", "src/app.js"]
```
>
::: tip
1. FROM node:16-alpine：选择一个具体版本的 Node.js 镜像，这里使用的是 node:16-alpine，你可以根据需要选择不同版本。
2. RUN npm install -g pm2：手动安装 PM2，而不是依赖基础镜像提供的 PM2。
3. 其他部分：安装依赖、复制项目文件等，保持不变。
:::

#### 2. 构建 Docker 镜像

**准备工作：** 将项目代码上传到服务器（可使用 FTP、Git 或 scp 命令）

进入**项目目录**（Dockerfile 所在目录）后运行以下命令  
```bash
docker build -t express-app:latest .

# 强制重新构建镜像
docker build --no-cache -t express-app:latest .
```
::: tip
docker build -t &lt;image_name&gt;:&lt;tag&gt; .
- -t express-app:latest 为镜像命名为 express-app，版本为 latest
- . 表示 Dockerfile 在当前目录
:::
如果安装失败，请尝试 [更换镜像源](./mirror.md) 后重试

### 3. 运行容器

**基础命令：**
```bash
docker run -d -p 9969:9969 --name express-container express-app:latest
```

**参数说明：**

| 参数 | 说明 | 示例 |
|------|------|------|
| `-d` | 后台运行容器 | - |
| `-p` | 端口映射 `主机端口:容器端口` | `-p 3000:3000` |
| `--name` | 为容器命名 | `--name express-container` |
| `-v` | 挂载数据卷（数据持久化） | `-v /host/path:/container/path` |
| `--network` | 加入指定网络 | `--network app-net` |
| `-e` | 设置环境变量 | `-e NODE_ENV=production` |
| `--restart` | 自动重启策略 | `--restart unless-stopped` |

#### 多容器场景（推荐）

当你的项目需要连接数据库（如 MongoDB）时，需要将容器加入同一网络：

```bash
# 1. 创建网络
docker network create app-net

# 2. 运行 MongoDB 容器
docker run -d \
  --name mongo-container \
  --network app-net \
  -v mongo-data:/data/db \
  mongo:6

# 3. 运行 Express 容器（加入同一网络）
docker run -d \
  --name express-container \
  --network app-net \
  -p 9969:9969 \
  express-app:latest
```

::: info 💡 `--network` 的作用
将容器加入同一网络后：
- 容器之间可以用**容器名**互相访问（Docker 会自动做 DNS 解析）
- 例如在 Express 中可以用 `mongodb://mongo-container:27017` 连接数据库
- 不需要暴露数据库端口到主机，更安全！

**不使用网络的话**：容器之间无法通过容器名通信，只能用 `--link`（已废弃）或宿主机 IP
:::

> 更多网络配置详见 [Docker 网络配置](./network.md)

#### 完整示例

```bash
# 生产环境推荐配置
docker run -d \
  --name express-container \
  --network app-net \
  -p 9969:9969 \
  -v /data/logs:/usr/src/app/logs \
  -e NODE_ENV=production \
  --restart unless-stopped \
  express-app:latest
```

>查看 PM2 进程列表
```bash
sudo docker exec express-container pm2 list
```

## 四、下一步

🎉 恭喜你完成了第一个 Docker 部署！接下来可以学习：

- [常用命令](./command.md) - 掌握日常运维操作
- [网络配置](./network.md) - 多容器通信详解
- [Docker Compose](./compose.md) - 一键部署多容器应用
