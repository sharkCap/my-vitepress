---
outline: deep
---

# Express 连接 MongoDB

::: info 📖 本节目标
学习如何在 Express 项目中使用 Mongoose 连接 MongoDB 并进行 CRUD 操作。
:::

## 一、安装依赖

```bash
npm install mongoose
```

## 二、连接数据库

### 2.1 基础连接

```js
// app.js

import express from "express";
import mongoose from "mongoose";

const PORT = 9969; // 用于设置端口号
const app = express(); // 创建一个express应用程序实例

/**
 * MONGO_USERNAME 用户名
 * MONGO_PASSWORD 密码
 * MONGO_HOST 地址
 * MONGO_PORT 端口
 * MONGO_DB 数据库名
 */
const { MONGO_USERNAME, MONGO_PASSWORD, MONGO_HOST, MONGO_PORT, MONGO_DB } =
  process.env;

// mongoose.connect('mongodb://localhost:27017/todolist');
mongoose
  .connect(
    `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}`
  )
  .then(() => {
    console.log("MongoDB 连接成功");
  })
  .catch((err) => {
    console.error("MongoDB 连接错误:", err);
  });

// 启动 Express 应用程序
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
```

::: tip 连接字符串格式
- **需要认证**：`mongodb://username:password@host:port/database`
- **无需认证**：`mongodb://host:port/database`
- **Docker 内部网络**：`mongodb://admin:123456@mongodb:27017/mydb`（使用容器名）
:::

### 2.2 环境变量配置

创建 `.env` 文件管理敏感信息：

```bash
# .env
MONGO_HOST=localhost
MONGO_PORT=27017
MONGO_DB=todolist
MONGO_USERNAME=admin
MONGO_PASSWORD=123456
```

::: warning ⚠️ 安全提示
`.env` 文件不要提交到 Git，记得添加到 `.gitignore`
:::

## 三、定义模型（Schema）

```js
// src/db/Todo.js

import mongoose from "mongoose";

const todoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // 自动添加 createdAt 和 updatedAt
  }
);

export default mongoose.model("Todo", todoSchema);
```

**常用字段类型：**

| 类型 | 说明 | 示例 |
|------|------|------|
| `String` | 字符串 | `name: { type: String }` |
| `Number` | 数字 | `age: { type: Number }` |
| `Boolean` | 布尔值 | `isActive: { type: Boolean }` |
| `Date` | 日期 | `createdAt: { type: Date }` |
| `ObjectId` | 关联其他文档 | `userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }` |
| `Array` | 数组 | `tags: [String]` |

## 四、CRUD 操作

### 4.1 创建数据（Create）

```js
router.post("/todo", async (req, res) => {
  try {
    const todo = new Todo({
      title: req.body.title,
      completed: false,
    });
    const savedTodo = await todo.save();
    res.status(201).json({ data: savedTodo });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
```

### 4.2 查询数据（Read）

```js
// 查询所有
router.get("/todo", async (req, res) => {
  const todos = await Todo.find();
  res.json({ data: todos });
});

// 查询单个
router.get("/todo/:id", async (req, res) => {
  const todo = await Todo.findById(req.params.id);
  res.json({ data: todo });
});

// 条件查询
const activeTodos = await Todo.find({ completed: false });
```

### 4.3 更新数据（Update）

```js
router.put("/todo/:id", async (req, res) => {
  try {
    const todo = await Todo.findByIdAndUpdate(
      req.params.id,
      { title: req.body.title, completed: req.body.completed },
      { new: true } // 返回更新后的文档
    );
    if (!todo) {
      return res.status(404).json({ error: "找不到该待办事项" });
    }
    res.json({ data: todo });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
```

### 4.4 删除数据（Delete）

```js
router.delete("/todo/:id", async (req, res) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);
    if (!todo) {
      return res.status(404).json({ error: "找不到该待办事项" });
    }
    res.json({ message: "删除成功" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

## 五、常用查询方法

| 方法 | 说明 |
|------|------|
| `find()` | 查询所有匹配的文档 |
| `findOne()` | 查询第一个匹配的文档 |
| `findById()` | 根据 ID 查询 |
| `findByIdAndUpdate()` | 根据 ID 更新 |
| `findByIdAndDelete()` | 根据 ID 删除 |
| `countDocuments()` | 统计数量 |
| `exists()` | 判断是否存在 |

## 六、项目结构参考

```
src/
├── db/
│   ├── connect.js      # 数据库连接
│   └── models/
│       └── Todo.js     # 模型定义
├── routes/
│   └── todo.js         # 路由
└── app.js              # 入口文件
```
