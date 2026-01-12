---
outline: deep
---

# MongoDB 基本指令

::: tip 💻 在哪里执行这些命令？
1. **Windows**：打开终端，输入 `mongosh` 连接数据库
2. **Docker**：`docker exec -it mongodb mongosh -u admin -p 密码`
3. **图形化工具**：MongoDB Compass 或 VS Code 插件
:::

## 一、数据库操作

### 1.1 查看数据库

```bash
show dbs
```

### 1.2 创建/切换数据库

```bash
# 如果数据库不存在，插入数据时会自动创建
use your_database
```

### 1.3 删除数据库

```bash
db.dropDatabase()
```

::: warning ⚠️ 注意
删除数据库是不可逆的，请谨慎操作！
:::

## 二、集合操作（表）

### 2.1 查看集合

```bash
show collections
```

### 2.2 创建集合

```bash
# 方式一：显式创建
db.createCollection("users")

# 方式二：插入数据时自动创建（更常用）
db.users.insertOne({ name: "John", age: 30 })
```

### 2.3 删除集合

```bash
db.users.drop()
```

## 三、文档操作（CRUD）

### 3.1 插入文档（Create）

```bash
# 插入一条
db.users.insertOne({ name: "Alice", age: 25, city: "Beijing" })

# 插入多条
db.users.insertMany([
  { name: "Bob", age: 28, city: "Shanghai" },
  { name: "Charlie", age: 32, city: "Guangzhou" }
])
```

### 3.2 查询文档（Read）

```bash
# 查询所有
db.users.find()

# 条件查询
db.users.find({ age: { $gt: 25 } })  # age > 25

# 只返回指定字段
db.users.find({}, { name: 1, age: 1 })

# 查询一条
db.users.findOne({ name: "Alice" })
```

**常用查询操作符：**

| 操作符 | 说明 | 示例 |
|--------|------|------|
| `$gt` | 大于 | `{ age: { $gt: 25 } }` |
| `$gte` | 大于等于 | `{ age: { $gte: 25 } }` |
| `$lt` | 小于 | `{ age: { $lt: 30 } }` |
| `$lte` | 小于等于 | `{ age: { $lte: 30 } }` |
| `$ne` | 不等于 | `{ name: { $ne: "Alice" } }` |
| `$in` | 在数组中 | `{ city: { $in: ["Beijing", "Shanghai"] } }` |

### 3.3 更新文档（Update）

```bash
# 更新一条
db.users.updateOne(
  { name: "Alice" },
  { $set: { age: 26 } }
)

# 更新多条
db.users.updateMany(
  { city: "Beijing" },
  { $set: { city: "北京" } }
)
```

### 3.4 删除文档（Delete）

```bash
# 删除一条
db.users.deleteOne({ name: "Alice" })

# 删除多条
db.users.deleteMany({ city: "Beijing" })

# 删除所有（清空集合）
db.users.deleteMany({})
```

## 四、用户管理

### 4.1 创建用户

```bash
# 切换到 admin 数据库
use admin

# 创建管理员用户
db.createUser({
  user: "admin",
  pwd: "123456",
  roles: ["root"]
})

# 创建普通用户（只能操作指定数据库）
use mydb
db.createUser({
  user: "appuser",
  pwd: "123456",
  roles: [{ role: "readWrite", db: "mydb" }]
})
```

### 4.2 查看用户

```bash
show users
```

### 4.3 删除用户

```bash
db.dropUser("appuser")
```

## 五、索引

索引可以提高查询性能，类似书的目录。

```bash
# 创建索引
db.users.createIndex({ name: 1 })  # 1 升序，-1 降序

# 创建唯一索引
db.users.createIndex({ email: 1 }, { unique: true })

# 查看索引
db.users.getIndexes()

# 删除索引
db.users.dropIndex("name_1")
```

## 六、Windows 服务管理

::: details Windows 专用命令
```bash
# 查看 MongoDB 进程
tasklist | findstr mongod

# 启动服务
net start MongoDB

# 停止服务
net stop MongoDB

# 命令行启动（指定数据目录）
mongod --dbpath "D:\MongoDB\data\db"
```
:::
