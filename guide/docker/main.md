---
outline: deep
---

# Docker 入门指南

::: tip 🎯 本章目标
通过本章学习，你将能够：
- 理解 Docker 的核心概念
- 在服务器上安装和配置 Docker
- 将 Node.js 项目打包成 Docker 镜像并部署
- 掌握日常运维常用的 Docker 命令
:::

## 什么是 Docker？

Docker 是一个**容器化平台**，可以将应用程序及其所有依赖打包成一个标准化的单元（容器）。

### 为什么要用 Docker？

| 传统部署 | Docker 部署 |
|---------|------------|
| 需要在服务器上手动安装 Node.js、配置环境 | 环境打包在镜像中，一键运行 |
| "在我电脑上明明可以的" | 开发、测试、生产环境完全一致 |
| 升级/回滚需要手动操作 | 切换镜像版本即可 |
| 多个项目可能环境冲突 | 每个容器相互隔离 |

### 核心概念

```
📦 Dockerfile  →  🖼️ 镜像 (Image)  →  🚀 容器 (Container)
   (配方)           (蛋糕模具)           (做出来的蛋糕)
```

| 概念 | 类比 | 说明 |
|------|------|------|
| **Dockerfile** | 菜谱 | 描述如何构建镜像的文本文件 |
| **镜像 (Image)** | 安装包 | 包含应用代码和环境的只读模板 |
| **容器 (Container)** | 运行中的程序 | 镜像的运行实例，可以启动/停止 |
| **仓库 (Registry)** | 应用商店 | 存放镜像的地方，如 Docker Hub |

## 学习路线

按以下顺序阅读，循序渐进：

### 1️⃣ 环境准备
- [镜像源配置](./mirror.md) - 配置国内加速源，解决下载慢的问题（**建议先配置**）

### 2️⃣ 部署实战
- [Docker 部署](./deploy.md) - 安装 Docker + 项目容器化部署（核心内容）

### 3️⃣ 日常运维
- [常用命令](./command.md) - 镜像和容器的增删改查
- [网络配置](./network.md) - 容器间通信（多容器场景必备）

### 4️⃣ 进阶编排
- [Docker Compose](./compose.md) - 多容器编排，一键启动整套服务

## 快速开始

如果你时间有限，按照以下步骤快速上手：

```bash
# 1. 安装 Docker（CentOS）
sudo yum install -y docker-ce docker-ce-cli containerd.io
sudo systemctl start docker && sudo systemctl enable docker

# 2. 配置镜像加速（重要！）
sudo mkdir -p /etc/docker
echo '{"registry-mirrors":["https://docker.1ms.run"]}' | sudo tee /etc/docker/daemon.json
sudo systemctl restart docker

# 3. 测试安装
sudo docker run hello-world
```

看到 `Hello from Docker!` 就说明安装成功了！🎉

## 常见问题

::: details 我需要在本地电脑安装 Docker 吗？
- **开发阶段**：可选，本地安装可以方便测试
- **部署阶段**：必须在服务器上安装
- **Windows/Mac**：安装 [Docker Desktop](https://www.docker.com/products/docker-desktop/)
:::

::: details Docker 和虚拟机有什么区别？
| Docker 容器 | 虚拟机 |
|------------|-------|
| 共享主机内核，启动秒级 | 完整操作系统，启动分钟级 |
| 占用资源少（MB级） | 占用资源多（GB级） |
| 适合微服务部署 | 适合需要完整隔离的场景 |
:::

::: details sudo docker 每次都要输入密码很麻烦？
将用户加入 docker 组后就不需要 sudo 了：
```bash
sudo usermod -aG docker $USER
# 重新登录后生效
```
:::
