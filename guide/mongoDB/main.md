---
outline: deep
---

# MongoDB
## Winods 安装
### 安装MongoDB
#### 1. 下载
[MongoDB Community Server](https://www.mongodb.com/try/download/community)
#### 2. 配置环境变量
环境变量 > 系统变量 > Path > 新增  
例如：``D:\Program Files\MongoDB\Server\8.0\bin``  
目的是可以使用 `mongod` 命令
#### 3. 启动
创建数据库文件的存放位置
> 在你data的目录下，创建一个db文件

启动 MongoDB 服务
```bash
# 指定启动存储路径
mongod --dbpath 'D:\Program Files\MongoDB\Server\8.0\data\db'
```
查看是否启动成功  
在浏览器中输入地址和端口号：http://localhost:27017


### 安装 MongoDB Shell
因新版本没有 `mongo`指令,使用 `mongosh` 代替
#### 1. 下载
[MongoDB Shell](https://www.mongodb.com/try/download/shell)  
使用 MongoDB Shell（mongosh）来连接数据库，功能和 mongo 相似
#### 2. 配置环境变量
环境变量 > 系统变量 > Path > 新增  
例如：`C:\mongosh-2.3.4-win32-x64\bin`  
目的是可以使用 `mongosh` 命令
#### 2. 连接数据库
```bash
# 默认
mongosh

# 指定
mongosh --host localhost --port 27017
```

### 图形化界面
#### MongoDB Compass
[MongoDB Compass](https://www.mongodb.com/try/download/compass)
#### VSCode插件
[Database Client](https://marketplace.visualstudio.com/items?itemName=cweijan.dbclient-jdbc)

## Docker 安装
服务器中使用docker安装
### 1. 下载
```bash
# 最新镜像
docker pull mongo

# 指定版本
docker pull mongo:6.0
```

### 2. 运行
#### 持久化
```bash
docker run -d \
  --name mongodb \
  -p 27017:27017 \
  -v /data/mongodb:/data/db \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=admin123 \
  mongo
```
::: tip
- --name mongodb：容器名称，方便管理。
- -p 27017:27017：将 MongoDB 的默认端口映射到主机，方便访问。
- **-v /data/mongodb:/data/db：将宿主机目录 /data/mongodb 挂载到容器中的 /data/db，确保数据持久化。**
- -e MONGO_INITDB_ROOT_USERNAME 和 MONGO_INITDB_ROOT_PASSWORD：设置 MongoDB 的管理员用户名和密码。
:::
#### Docker 内部存储
Docker 内部的存储方式，不挂载宿主机的目录。这种方式会将数据存储在 Docker 容器的内部文件系统中（容器停止或删除后数据会丢失
```bash
docker run -d \
  --name mongodb \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=admin123 \
  mongo
```

### 3. 连接
```bash
# 进入容器连接
docker exec -it mongodb mongosh

# 远程连接
mongosh mongodb://admin:admin123@<server_ip>:27017
```
