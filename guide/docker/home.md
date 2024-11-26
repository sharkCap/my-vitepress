---
outline: deep
---

# Docker
docker指令
## Docker 基本操作
### 1. 查看镜像
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
### 2. 删除镜像
```bash
# 删除悬空镜像（清理所有 <none> 的镜像）
sudo docker image prune

# 手动删除指定镜像
sudo docker rmi d2c882e2637f
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
## Docker 部署
### 一、安装 Docker
在 CentOS 上安装 Docker
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
### 二、项目容器化
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
#### 2. 构建 Docker 镜像
将项目上传到服务器，并进入**项目目录**后运行以下命令  
```bash
docker build -t express-app:latest .
```
::: tip
docker build -t &lt;image_name&gt;:&lt;tag&gt; .
- -t express-app:latest 为镜像命名为 express-app，版本为 latest
- . 表示 Dockerfile 在当前目录
:::
如果安装失败 请尝试[更换镜像](#docker-镜像)并单独安装

#### 3. 运行容器
```bash
docker run -d -p 3000:3000 --name express-container express-app:latest
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

## Docker 镜像
为 Docker 配置国内镜像源，例如阿里云的镜像加速器：
### 1. 编辑
```bash
sudo nano /etc/docker/daemon.json
```
### 2. 添加
```json
{
  "registry-mirrors": ["https://xxxx.mirror.aliyuncs.com"]
}
```
>镜像网站  
> [Docker Pull](https://dockerpull.org/)  
> [阿里云](https://cr.console.aliyun.com/cn-shanghai/instances/mirrors)
### 3. 保存并重启
```bash
sudo systemctl restart docker
```
### 3. 测试
```bash
sudo docker run hello-world
```