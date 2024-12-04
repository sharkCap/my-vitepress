---
outline: deep
---

# 基本指令

## 状态

### 查看

```bash
tasklist | findstr mongod
```

> 或者直接访问 http://127.0.0.1:27017/

### 启动

```bash
# 指定(命令)
mongod --dbpath "D:\Program Files\MongoDB\Server\8.0\data\db"

# 默认(服务)
net start MongoDB
```

> 配置文件 _D:\Program Files\MongoDB\Server\8.0\data_ `mongod.cfg`  
> 如果没有通过 `mongod --dbpath` 命令手动指定数据存储路径，MongoDB 会使用这个配置文件
> 中的 dbPath。

```yaml
# Where and how to store data.
storage:
  dbPath: D:\Program Files\MongoDB\Server\8.0\data
```

### 停止

```bash
# 如果 MongoDB 是作为服务运行的
net stop MongoDB

# 如果 MongoDB 是以命令行方式运行的
Ctrl + C
```

## 用户

### 创建账户

```bash
# 切换到admin数据库
use admin

# 添加管理员用户
db.createUser({user: "root", pwd: "123456", roles: ["root"]})
```

### 查看

```bash
# 查看当前数据库的所有用户
show users
db.getUsers()
# 查看用户信息
db.getUser("root")
# 查看所有数据库中的用户
db.system.users.find()
```

### 删除

```bash
db.dropUser("myUser")
```

### 修改

```bash
# 修改权限
db.updateUser("myUser", {
  roles: [
    { role: "readWrite", db: "test" },
    { role: "dbAdmin", db: "test" }
  ]
})

# 修改密码
db.updateUser("myUser", {
  pwd: "newPassword"
})
```

### 启用身份验证

编辑 `mongod.conf` 配置文件，将 security.authorization 设置为 enabled，然后重启 MongoDB 服务

```yaml
security:
  authorization: "enabled"
```

启用身份验证后，使用管理员登录

```bash
mongosh --host localhost --port 27017 -u admin -p adminPassword --authenticationDatabase admin
```

## 操作数据库

### 查看

```bash
show dbs
```

### 创建和切换

如果数据库不存在，MongoDB 会在插入数据时自动创建

```bash
use your_database
```

### 删除

```bash
db.dropDatabase()
```

::: warning
注意： 删除数据库是不可逆的，请谨慎操作。
:::

## 操作集合（表）

### 查看集合

```bash
show collections
# 或者
db.getCollectionNames()
```

### 创建集合

```bash
# 创建一个名为 users 的集合
db.createCollection("users")
```

> 插入一条记录到 users 集合，MongoDB 会自动创建该集合

```bash
# 创建一个名为 users 的集合
db.users.insertOne({ name: "John Doe", age: 30 })
```

### 删除集合

```bash
# 删除 users 集合
db.users.drop()
```

### 查看集合详细信息

```bash
# 查看 users 集合的统计信息
db.users.stats()
```

### 插入文档到集合

```bash
# 插入一条
db.users.insertOne({ name: "Alice", age: 25, city: "New York" })

# 插入多条文档
db.users.insertMany([
  { name: "Bob", age: 28, city: "San Francisco" },
  { name: "Charlie", age: 32, city: "Los Angeles" }
])
```

### 查询集合中的文档

```bash
# 查询 users 集合中所有的文档
db.users.find()

# 美化输出
db.users.find().pretty()
```

### 删除文档

```bash
# 删除 users 集合中第一个匹配的文档
db.users.deleteOne({ name: "Alice" })

# 删除所有符合条件的文档
db.users.deleteMany({ city: "New York" })
```

### 更新文档

```bash
# 将 users 集合中 name 为 "Alice" 的用户的年龄修改为 26
db.users.updateOne(
  { name: "Alice" },
  { $set: { age: 26 } }
)

# 更新多个文档
db.users.updateMany(
  { city: "New York" },
  { $set: { city: "Boston" } }
)
```

### 创建索引

```bash
# 在 users 集合中为 name 字段创建索引
db.users.createIndex({ name: 1 })
```

### 查看集合的索引

```bash
# 查看 users 集合的索引
db.users.getIndexes()
```
