---
outline: deep
---

# 连接 MongoDB 并操作数据库

Express 项目

## 安装

```bash
npm install mongoose
```

## 连接

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

::: tip
需要用户名密码  
mongodb://username:password@host:port/database

不需要用户名密码  
mongodb://host:port/database
:::

## 操作

### 创建模型

```js
// mongodb.js

import mongoose from "mongoose";

const todoSchema = new mongoose.Schema(
  {
    // 标题
    title: {
      type: String,
      required: true,
    },
    // 状态
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    // 启用时间戳
    timestamps: true,
  }
);

export default mongoose.model("Todo", todoSchema);
```

### 增加数据

```js
router.post("/todo/add", async (req, res) => {
  try {
    const todo = new Todo({
      title: req.body.title,
      completed: false,
    });
    const savedTodo = await todo.save();
    res.status(201).json(
      formatResponse({
        id: savedTodo._id,
        title: savedTodo.title,
        completed: savedTodo.completed,
      })
    );
  } catch (error) {
    res.status(400).json(formatResponse(null, 400, error.message));
  }
});
```

### 删除数据

> findByIdAndDelete

```js
router.delete("/todo/:id", async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (todo) {
      await todo.deleteOne();
      res.json(formatResponse({ message: "待办事项已删除" }));
    } else {
      res.status(404).json(formatResponse(null, 404, "找不到该待办事项"));
    }
  } catch (error) {
    res.status(500).json(formatResponse(null, 500, error.message));
  }
});
```

### 更新数据

> findByIdAndUpdate

```js
router.put("/todo/:id", async (req, res) => {
  try {
    // const todo = await Todo.findByIdAndUpdate(
    //   req.params.id,
    //   { completed: req.body.completed }, // 更新内容
    //   { new: true } // 返回更新后的文档
    // );
    // res.json(
    //   formatResponse({
    //     id: todo._id,
    //     title: todo.title,
    //     completed: todo.completed,
    //   })
    // );

    const todo = await Todo.findById(req.params.id);
    if (todo) {
      if (req.body.title !== undefined) todo.title = req.body.title;
      if (req.body.completed !== undefined) todo.completed = req.body.completed;

      const updatedTodo = await todo.save();
      res.json(
        formatResponse({
          id: updatedTodo._id,
          title: updatedTodo.title,
          completed: updatedTodo.completed,
        })
      );
    } else {
      res.status(404).json(formatResponse(null, 404, "找不到该待办事项"));
    }
  } catch (error) {
    res.status(400).json(formatResponse(null, 400, error.message));
  }
});
```

### 查询数据

```js
router.get("/todo/list", async (req, res) => {
  try {
    const todos = await Todo.find({}, "title completed");
    const formattedTodos = todos.map((todo) => ({
      id: todo._id,
      title: todo.title,
      completed: todo.completed,
    }));
    res.json(formatResponse(formattedTodos));
  } catch (error) {
    res.status(500).json(formatResponse(null, 500, error.message));
  }
});
```

```
目录结构
src/
  ├── db/
  │   └── mongodb.js
  ├── routes/
  │   ├── index.js
  │   └── todo.js
  └── app.js

```
