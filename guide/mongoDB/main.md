---
outline: deep
---

# MongoDB 安装指南

::: info 📖 什么是 MongoDB？
MongoDB 是一个基于文档的 NoSQL 数据库，数据以 JSON 格式存储，灵活易用。  
对于前端开发者来说，数据结构与 JavaScript 对象很相似，上手容易！
:::

## 一、Windows 安装

### 1.1 安装 MongoDB Server
#### 1. 下载
[MongoDB Community Server](https://www.mongodb.com/try/download/community)

#### 2. 配置环境变量
环境变量 > 系统变量 > Path > 新增  
例如：`D:\Program Files\MongoDB\Server\8.0\bin`  

配置后可以在任意位置使用 `mongod` 命令。

#### 3. 启动服务
创建数据库文件的存放位置
> 在你data的目录下，创建一个db文件

启动 MongoDB 服务
```bash
# 指定启动存储路径
mongod --dbpath 'D:\Program Files\MongoDB\Server\8.0\data\db'
```
查看是否启动成功  
在浏览器中输入地址和端口号：http://localhost:27017


### 1.2 安装 MongoDB Shell

新版 MongoDB 不再自带 `mongo` 命令，需要单独安装 `mongosh`。

#### 1. 下载
[MongoDB Shell](https://www.mongodb.com/try/download/shell)

#### 2. 配置环境变量
环境变量 > 系统变量 > Path > 新增  
例如：`C:\mongosh-2.3.4-win32-x64\bin`

#### 3. 连接数据库
```bash
# 默认
mongosh

# 指定
mongosh --host localhost --port 27017
```

### 1.3 图形化工具（可选）

| 工具 | 说明 |
|------|------|
| [MongoDB Compass](https://www.mongodb.com/try/download/compass) | 官方图形化工具 |
| [Database Client](https://marketplace.visualstudio.com/items?itemName=cweijan.dbclient-jdbc) | VS Code 插件，轻量级 |

## 二、Docker 安装（服务器推荐）
### 2.1 拉取镜像
```bash
# 最新镜像
sudo docker pull mongo

# 指定版本（推荐）
sudo docker pull mongo:6
```

### 2.2 运行容器

#### 数据持久化（推荐）
```bash
sudo docker run -d \
  --name mongodb \
  -p 27017:27017 \
  -v /data/mongodb:/data/db \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=admin123 \
  mongo:6
```

**参数说明：**

| 参数 | 说明 |
|------|------|
| `--name mongodb` | 容器名称 |
| `-p 27017:27017` | 端口映射 |
| `-v /data/mongodb:/data/db` | 数据持久化到宿主机 |
| `-e MONGO_INITDB_ROOT_USERNAME` | 管理员用户名 |
| `-e MONGO_INITDB_ROOT_PASSWORD` | 管理员密码 |

#### 多容器场景（与 Express 配合）

如果你的 Express 也运行在 Docker 中，建议使用内部网络：

```bash
# 1. 创建网络
sudo docker network create app-net

# 2. 运行 MongoDB（不暴露端口到外网，更安全）
sudo docker run -d \
  --name mongodb \
  --network app-net \
  -v /data/mongodb:/data/db \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=admin123 \
  mongo:6
```

这样 Express 容器可以通过 `mongodb://admin:admin123@mongodb:27017` 连接。

> 详见 [Docker 网络配置](../docker/network.md)

#### 不挂载卷（不推荐）

::: warning ❗ 数据会丢失
不挂载卷的方式，容器删除后数据会丢失！仅适合测试。
:::
```bash
docker run -d \
  --name mongodb \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=admin123 \
  mongo:6
```

### 2.3 连接数据库

```bash
# 进入容器连接
sudo docker exec -it mongodb mongosh -u admin -p admin123

# 远程连接（需要暴露端口）
mongosh "mongodb://admin:admin123@<服务器IP>:27017"
```

::: tip 💡 下一步
安装完成后，可以学习：
- [基本指令](./command.md) - 数据库和集合的操作命令
- [后端交互](./express.md) - Express + Mongoose 实战
:::
