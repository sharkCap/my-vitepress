---
outline: deep
---

# Docker 部署

::: info 📖 什么是 Docker？
Docker 是一个容器化平台，可以将应用程序和其依赖打包成一个独立的「容器」。  
**好处：** 在你电脑上能跑的程序，打包成 Docker 镜像后，在任何服务器上都能跑，再也不用担心「在我电脑上明明可以的」这种问题！
:::

::: tip 🗺️ 阅读顺序建议
1. **本文 (deploy.md)** - Docker 安装 + 项目部署（核心）
2. [镜像源配置](./mirror.md) - 解决下载慢的问题
3. [常用命令](./command.md) - 日常运维查阅
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
输出类似于 Docker version 20.x.x 表示安装成功。

::: warning 遇到问题？
如果 `docker pull` 下载很慢或失败，请先配置 [国内镜像源](./mirror.md)
:::

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
### 1. 创建 Dockerfile
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

### 2. 构建 Docker 镜像

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
如果安装失败 请尝试[更换镜像](../docker/mirror.md)并单独安装

### 3. 运行容器
```bash
docker run -d -p 9969:9969 --name express-container express-app:latest
```
::: tip
- -d：后台运行容器。
- -p 3000:3000：将容器的 3000 端口映射到服务器的 3000 端口  
- --name：为容器命名
:::
>完整版
```bash
# 构建运行容器
# --name 指定容器名称为 express-container
# -p 指定外部端3000于容器内3000端口连接，从而可以通过主机的 3000 端口来访问容器内的服务
#    要记得<container_port>这个端口被nginx监听到，因为nginx默认监听80端口而已
# -v 代表绑定卷 也就是本地的 dist 文件如果变更 容器内的 dist文件也会做出相应改变
#    -v 两侧均需要使用绝对路径
# -d 表示在后台运行
# 最后的 express-app:latest 表示使用指定的镜像
# docker run --name container_name -p <host>:<container> -v <path> -d <name>:<tag>
docker run --name express-container -p 3000:3000 -v D:\a\b\c -d express-app:latest
```
>查看 PM2 进程列表
```bash
sudo docker exec express-container pm2 list
```
