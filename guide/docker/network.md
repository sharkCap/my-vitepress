---
outline: deep
---

# Docker 网络配置

::: info 📖 什么时候需要学习网络配置？
当你有**多个容器需要互相通信**时，比如：
- Express 后端容器需要连接 MongoDB 容器
- Nginx 容器需要反向代理到 Node.js 容器
- 前端容器需要调用后端 API 容器
:::

## 一、为什么需要 Docker 网络？

### 问题场景

假设你有两个容器：
- `express-container`：运行 Express 后端，端口 3000
- `mongo-container`：运行 MongoDB 数据库，端口 27017

**❌ 错误做法**：在 Express 中使用 `localhost:27017` 连接数据库
```javascript
// 这样写是错的！容器内的 localhost 指向容器自己，不是主机
mongoose.connect('mongodb://localhost:27017/mydb')
```

**✅ 正确做法**：将容器加入同一网络，使用容器名访问
```javascript
// 容器名 = 域名，Docker 会自动解析
mongoose.connect('mongodb://mongo-container:27017/mydb')
```

### 工作原理

```
┌─────────────────────────────────────────────────────┐
│                   Docker 网络 (app-net)              │
│                                                      │
│  ┌──────────────────┐    ┌──────────────────┐       │
│  │ express-container │    │  mongo-container  │       │
│  │    (Node.js)      │───▶│    (MongoDB)      │       │
│  │                   │    │                   │       │
│  │ mongo-container   │    │                   │       │
│  │ 会被解析为容器IP   │    │                   │       │
│  └──────────────────┘    └──────────────────┘       │
│                                                      │
└─────────────────────────────────────────────────────┘
```

## 二、网络操作命令

### 2.1 创建网络

```bash
# 创建一个自定义网络
sudo docker network create app-net

# 创建时指定网络模式（默认是 bridge）
sudo docker network create --driver bridge app-net
```

### 2.2 查看网络

```bash
# 列出所有网络
sudo docker network ls

# 查看网络详情（包括已连接的容器）
sudo docker network inspect app-net
```

**输出示例：**
```
NETWORK ID     NAME      DRIVER    SCOPE
a1b2c3d4e5f6   app-net   bridge    local
abc123456789   bridge    bridge    local
def987654321   host      host      local
```

### 2.3 容器加入网络

**方式一：运行时加入**
```bash
# 使用 --network 参数指定网络
sudo docker run -d \
  --name express-container \
  --network app-net \
  -p 3000:3000 \
  express-app
```

**方式二：将已运行的容器加入网络**
```bash
sudo docker network connect app-net express-container
```

### 2.4 容器离开网络

```bash
sudo docker network disconnect app-net express-container
```

### 2.5 删除网络

```bash
# 删除指定网络（需先断开所有容器）
sudo docker network rm app-net

# 删除所有未使用的网络
sudo docker network prune
```

## 三、实战案例

### 案例：Express + MongoDB 部署

**目标**：部署一个 Express 后端 + MongoDB 数据库

#### 步骤 1：创建网络

```bash
sudo docker network create app-net
```

#### 步骤 2：运行 MongoDB 容器

```bash
sudo docker run -d \
  --name mongo-container \
  --network app-net \
  -v mongo-data:/data/db \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=123456 \
  mongo:6
```

::: tip 参数说明
- `--network app-net`：加入 app-net 网络
- `-v mongo-data:/data/db`：数据持久化到卷
- `-e`：设置环境变量（数据库账号密码）
:::

#### 步骤 3：修改 Express 连接配置

```javascript
// 使用容器名作为主机名
const mongoUri = 'mongodb://admin:123456@mongo-container:27017/mydb?authSource=admin'
mongoose.connect(mongoUri)
```

#### 步骤 4：运行 Express 容器

```bash
sudo docker run -d \
  --name express-container \
  --network app-net \
  -p 3000:3000 \
  express-app
```

#### 步骤 5：验证连接

```bash
# 进入 Express 容器测试网络
sudo docker exec -it express-container sh

# 在容器内 ping MongoDB 容器（验证 DNS 解析）
ping mongo-container
```

## 四、网络模式对比

Docker 提供了多种网络模式：

| 模式 | 说明 | 使用场景 |
|------|------|---------|
| **bridge**（默认） | 创建虚拟网桥，容器通过网桥通信 | 单机多容器通信 |
| **host** | 容器直接使用主机网络 | 需要最佳网络性能 |
| **none** | 禁用网络 | 安全隔离场景 |
| **overlay** | 跨主机容器通信 | Docker Swarm 集群 |

::: tip 💡 建议
日常使用 **bridge 模式 + 自定义网络** 即可满足大部分需求
:::

## 五、常见问题

::: details 容器之间 ping 不通？
1. 确认两个容器在同一网络：`docker network inspect app-net`
2. 确认容器正在运行：`docker ps`
3. 使用容器名而不是 localhost
:::

::: details 为什么不直接用默认的 bridge 网络？
默认的 bridge 网络**不支持容器名 DNS 解析**，只能用 IP 地址访问。  
自定义网络自动支持容器名解析，更方便！
:::

::: details 如何查看容器的 IP 地址？
```bash
sudo docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' 容器名
```
:::
