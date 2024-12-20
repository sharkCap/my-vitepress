---
outline: [1,6]
---

# Redux 介绍

> Redux 是 React 最常用的集中状态管理工具，类似于 Vue 中的 Pinia（Vuex），可以独立于框架运行
> 作用：通过集中管理的方式管理应用的状态

![image.png](https://shark-capt.oss-cn-shanghai.aliyuncs.com/vitepress/assets/react/day03/1.png)
**为什么要使用 Redux？**

1. 独立于组件，无视组件之间的层级关系，简化通信问题
2. 单项数据流清晰，易于定位 bug
3. 调试工具配套良好，方便调试

# Redux 快速体验

## 1. 实现计数器

> 需求：不和任何框架绑定，不使用任何构建工具，使用纯 Redux 实现计数器

![image.png](https://shark-capt.oss-cn-shanghai.aliyuncs.com/vitepress/assets/react/day03/2.png)
使用步骤：

1. 定义一个 reducer 函数 （根据当前想要做的修改返回一个新的状态）
2. 使用 createStore 方法传入 reducer 函数 生成一个 store 实例对象
3. 使用 store 实例的 subscribe 方法 订阅数据的变化（数据一旦变化，可以得到通知）
4. 使用 store 实例的 dispatch 方法提交 action 对象 触发数据变化（告诉 reducer 你想怎么改数据）
5. 使用 store 实例的 getState 方法 获取最新的状态数据更新到视图中

代码实现：

```html
<button id="decrement">-</button>
<span id="count">0</span>
<button id="increment">+</button>

<script src="https://unpkg.com/redux@latest/dist/redux.min.js"></script>

<script>
  // 定义reducer函数
  // 内部主要的工作是根据不同的action 返回不同的state
  function counterReducer(state = { count: 0 }, action) {
    switch (action.type) {
      case "INCREMENT":
        return { count: state.count + 1 };
      case "DECREMENT":
        return { count: state.count - 1 };
      default:
        return state;
    }
  }
  // 使用reducer函数生成store实例
  const store = Redux.createStore(counterReducer);

  // 订阅数据变化
  store.subscribe(() => {
    console.log(store.getState());
    document.getElementById("count").innerText = store.getState().count;
  });
  // 增
  const inBtn = document.getElementById("increment");
  inBtn.addEventListener("click", () => {
    store.dispatch({
      type: "INCREMENT",
    });
  });
  // 减
  const dBtn = document.getElementById("decrement");
  dBtn.addEventListener("click", () => {
    store.dispatch({
      type: "DECREMENT",
    });
  });
</script>
```

## 2. Redux 数据流架构

> Redux 的难点是理解它对于数据修改的规则, 下图动态展示了在整个数据的修改中，数据的流向

![1](https://shark-capt.oss-cn-shanghai.aliyuncs.com/vitepress/assets/react/day03/3.png)
为了职责清晰，Redux 代码被分为三个核心的概念，我们学 redux，其实就是学这三个核心概念之间的配合，三个概念分别是:

1. state: 一个对象 存放着我们管理的数据
2. action: 一个对象 用来描述你想怎么改数据
3. reducer: 一个函数 根据 action 的描述更新 state

# Redux 与 React - 环境准备

> Redux 虽然是一个框架无关可以独立运行的插件，但是社区通常还是把它与 React 绑定在一起使用，以一个计数器案例体验一下 Redux + React 的基础使用

## 1. 配套工具

> 在 React 中使用 redux，官方要求安装俩个其他插件 - Redux Toolkit 和 react-redux

1. Redux Toolkit（RTK）- 官方推荐编写 Redux 逻辑的方式，是一套工具的集合集，简化书写方式

2. react-redux - 用来 链接 Redux 和 React 组件 的中间件

![image.png](https://shark-capt.oss-cn-shanghai.aliyuncs.com/vitepress/assets/react/day03/4.png)

## 2. 配置基础环境

1.  使用 CRA 快速创建 React 项目

```bash
npx create-react-app react-redux
```

2.  安装配套工具

```bash
npm i @reduxjs/toolkit  react-redux
```

3.  启动项目

```bash
npm run start
```

## 3. store 目录结构设计

![image.png](https://shark-capt.oss-cn-shanghai.aliyuncs.com/vitepress/assets/react/day03/5.png)

1. 通常集中状态管理的部分都会单独创建一个单独的 `store` 目录

2. 应用通常会有很多个子 store 模块，所以创建一个 `modules` 目录，在内部编写业务分类的子 store

3. store 中的入口文件 index.js 的作用是组合 modules 中所有的子模块，并导出 store

# Redux 与 React - 实现 counter

## 1. 整体路径熟悉

![image.png](https://shark-capt.oss-cn-shanghai.aliyuncs.com/vitepress/assets/react/day03/6.png)

## 2. 使用 React Toolkit 创建 counterStore

```javascript
import { createSlice } from "@reduxjs/toolkit";

const counterStore = createSlice({
  // 模块名称独一无二
  name: "counter",
  // 初始数据
  initialState: {
    count: 1,
  },
  // 修改数据的同步方法
  reducers: {
    increment(state) {
      state.count++;
    },
    decrement(state) {
      state.count--;
    },
  },
});
// 结构出actionCreater
const { increment, decrement } = counter.actions;

// 获取reducer函数
const counterReducer = counterStore.reducer;

// 导出
export { increment, decrement };
export default counterReducer;
```

```javascript
import { configureStore } from "@reduxjs/toolkit";

import counterReducer from "./modules/counterStore";

export default configureStore({
  reducer: {
    // 注册子模块
    counter: counterReducer,
  },
});
```

## 3. 为 React 注入 store

> react-redux 负责把 Redux 和 React 链接 起来，内置 Provider 组件 通过 store 参数把创建好的 store 实例注入到应用中，链接正式建立

```jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
// 导入store
import store from "./store";
// 导入store提供组件Provider
import { Provider } from "react-redux";

ReactDOM.createRoot(document.getElementById("root")).render(
  // 提供store数据
  <Provider store={store}>
    <App />
  </Provider>
);
```

## 4. React 组件使用 store 中的数据

> 在 React 组件中使用 store 中的数据，需要用到一个钩子函数 - useSelector，它的作用是把 store 中的数据映射到组件中，使用样例如下：

![image.png](https://shark-capt.oss-cn-shanghai.aliyuncs.com/vitepress/assets/react/day03/7.png)

## 5. React 组件修改 store 中的数据

> React 组件中修改 store 中的数据需要借助另外一个 hook 函数 - useDispatch，它的作用是生成提交 action 对象的 dispatch 函数，使用样例如下：

![image.png](https://shark-capt.oss-cn-shanghai.aliyuncs.com/vitepress/assets/react/day03/8.png)

# Redux 与 React - 提交 action 传参

> 需求：组件中有俩个按钮 `add to 10` 和 `add to 20` 可以直接把 count 值修改到对应的数字，目标 count 值是在组件中传递过去的，需要在提交 action 的时候传递参数

![image.png](https://shark-capt.oss-cn-shanghai.aliyuncs.com/vitepress/assets/react/day03/9.png)
实现方式：在 reducers 的同步修改方法中添加 action 对象参数，在调用 actionCreater 的时候传递参数，参数会被传递到 action 对象 payload 属性上

![image.png](https://shark-capt.oss-cn-shanghai.aliyuncs.com/vitepress/assets/react/day03/10.png)

# Redux 与 React - 异步 action 处理

**需求理解**
![image.png](https://shark-capt.oss-cn-shanghai.aliyuncs.com/vitepress/assets/react/day03/11.png)

**实现步骤**

1. 创建 store 的写法保持不变，配置好同步修改状态的方法
2. 单独封装一个函数，在函数内部 return 一个新函数，在新函数中
   2.1 封装异步请求获取数据
   2.2 调用同步 actionCreater 传入异步数据生成一个 action 对象，并使用 dispatch 提交
3. 组件中 dispatch 的写法保持不变

**代码实现**

> 测试接口地址： [http://geek.itheima.net/v1_0/channels](http://geek.itheima.net/v1_0/channels')

```javascript
import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const channelStore = createSlice({
  name: "channel",
  initialState: {
    channelList: [],
  },
  reducers: {
    setChannelList(state, action) {
      state.channelList = action.payload;
    },
  },
});

// 创建异步
const { setChannelList } = channelStore.actions;
const url = "http://geek.itheima.net/v1_0/channels";
// 封装一个函数 在函数中return一个新函数 在新函数中封装异步
// 得到数据之后通过dispatch函数 触发修改
const fetchChannelList = () => {
  return async (dispatch) => {
    const res = await axios.get(url);
    dispatch(setChannelList(res.data.data.channels));
  };
};

export { fetchChannelList };

const channelReducer = channelStore.reducer;
export default channelReducer;
```

```jsx
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchChannelList } from "./store/channelStore";

function App() {
  // 使用数据
  const { channelList } = useSelector((state) => state.channel);
  useEffect(() => {
    dispatch(fetchChannelList());
  }, [dispatch]);

  return (
    <div className="App">
      <ul>
        {channelList.map((task) => (
          <li key={task.id}>{task.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
```

# Redux 调试 - devtools

> Redux 官方提供了针对于 Redux 的调试工具，支持实时 state 信息展示，action 提交信息查看等

![image.png](https://shark-capt.oss-cn-shanghai.aliyuncs.com/vitepress/assets/react/day03/12.png)

# 美团小案例

## 1. 案例演示

![image.png](https://shark-capt.oss-cn-shanghai.aliyuncs.com/vitepress/assets/react/day03/13.png)

> 基本开发思路：使用 RTK（Redux Toolkit）来管理应用状态, 组件负责 数据渲染 和 dispatch action

## 2. 准备并熟悉环境

1.  克隆项目到本地（内置了基础静态组件和模版）

```bash
git clone http://git.itcast.cn/heimaqianduan/redux-meituan.git
```

2.  安装所有依赖

```bash
npm i
```

3.  启动 mock 服务（内置了 json-server）

```bash
npm run serve
```

4.  启动前端服务

```bash
npm run start
```

## 3. 分类和商品列表渲染

![image.png](https://shark-capt.oss-cn-shanghai.aliyuncs.com/vitepress/assets/react/day03/14.png)
1- 编写 store 逻辑

```javascript
// 编写store
import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const foodsStore = createSlice({
  name: "foods",
  initialState: {
    // 商品列表
    foodsList: [],
  },
  reducers: {
    // 更改商品列表
    setFoodsList(state, action) {
      state.foodsList = action.payload;
    },
  },
});

// 异步获取部分
const { setFoodsList } = foodsStore.actions;
const fetchFoodsList = () => {
  return async (dispatch) => {
    // 编写异步逻辑
    const res = await axios.get("http://localhost:3004/takeaway");
    // 调用dispatch函数提交action
    dispatch(setFoodsList(res.data));
  };
};

export { fetchFoodsList };

const reducer = foodsStore.reducer;

export default reducer;
```

2- 组件使用 store 数据

```jsx
// 省略部分代码
import { useDispatch, useSelector } from "react-redux";
import { fetchFoodsList } from "./store/modules/takeaway";
import { useEffect } from "react";

const App = () => {
  // 触发action执行
  // 1. useDispatch -> dispatch 2. actionCreater导入进来 3.useEffect
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchFoodsList());
  }, [dispatch]);

  return (
    <div className="home">
      {/* 导航 */}
      <NavBar />

      {/* 内容 */}
      <div className="content-wrap">
        <div className="content">
          <Menu />
          <div className="list-content">
            <div className="goods-list">
              {/* 外卖商品列表 */}
              {foodsList.map((item) => {
                return (
                  <FoodsCategory
                    key={item.tag}
                    // 列表标题
                    name={item.name}
                    // 列表商品
                    foods={item.foods}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
      {/* 购物车 */}
      <Cart />
    </div>
  );
};

export default App;
```

## 4. 点击分类激活交互实现

![image.png](https://shark-capt.oss-cn-shanghai.aliyuncs.com/vitepress/assets/react/day03/15.png)
1- 编写 store 逻辑

```javascript
// 编写store

import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const foodsStore = createSlice({
  name: "foods",
  initialState: {
    // 菜单激活下标值
    activeIndex: 0,
  },
  reducers: {
    // 更改activeIndex
    changeActiveIndex(state, action) {
      state.activeIndex = action.payload;
    },
  },
});

// 导出
const { changeActiveIndex } = foodsStore.actions;

export { changeActiveIndex };

const reducer = foodsStore.reducer;

export default reducer;
```

2- 编写组件逻辑

```jsx
const Menu = () => {
  const { foodsList, activeIndex } = useSelector((state) => state.foods);
  const dispatch = useDispatch();
  const menus = foodsList.map((item) => ({ tag: item.tag, name: item.name }));
  return (
    <nav className="list-menu">
      {/* 添加active类名会变成激活状态 */}
      {menus.map((item, index) => {
        return (
          <div
            // 提交action切换激活index
            onClick={() => dispatch(changeActiveIndex(index))}
            key={item.tag}
            // 动态控制active显示
            className={classNames(
              "list-menu-item",
              activeIndex === index && "active"
            )}
          >
            {item.name}
          </div>
        );
      })}
    </nav>
  );
};
```

## 5. 商品列表切换显示

![image.png](https://shark-capt.oss-cn-shanghai.aliyuncs.com/vitepress/assets/react/day03/16.png)

```jsx
<div className="list-content">
  <div className="goods-list">
    {/* 外卖商品列表 */}
    {foodsList.map((item, index) => {
      return (
        activeIndex === index && (
          <FoodsCategory
            key={item.tag}
            // 列表标题
            name={item.name}
            // 列表商品
            foods={item.foods}
          />
        )
      );
    })}
  </div>
</div>
```

## 6. 添加购物车实现

![image.png](https://shark-capt.oss-cn-shanghai.aliyuncs.com/vitepress/assets/react/day03/17.png)
1- 编写 store 逻辑

```javascript
// 编写store

import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const foodsStore = createSlice({
  name: "foods",
  reducers: {
    // 添加购物车
    addCart(state, action) {
      // 是否添加过？以action.payload.id去cartList中匹配 匹配到了 添加过
      const item = state.cartList.find((item) => item.id === action.payload.id);
      if (item) {
        item.count++;
      } else {
        state.cartList.push(action.payload);
      }
    },
  },
});

// 导出actionCreater
const { addCart } = foodsStore.actions;

export { addCart };

const reducer = foodsStore.reducer;

export default reducer;
```

2- 编写组件逻辑

```jsx
<div className="goods-count">
  {/* 添加商品 */}
  <span
    className="plus"
    onClick={() =>
      dispatch(
        addCart({
          id,
          picture,
          name,
          unit,
          description,
          food_tag_list,
          month_saled,
          like_ratio_desc,
          price,
          tag,
          count,
        })
      )
    }
  ></span>
</div>
```

## 7. 统计区域实现

![image.png](https://shark-capt.oss-cn-shanghai.aliyuncs.com/vitepress/assets/react/day03/18.png)

实现思路

1. 基于 store 中的 cartList 的 length 渲染数量
2. 基于 store 中的 cartList 累加 price \* count
3. 购物车 cartList 的 length 不为零则高亮

```jsx
// 计算总价
const totalPrice = cartList.reduce((a, c) => a + c.price * c.count, 0);

{
  /* fill 添加fill类名购物车高亮*/
}
{
  /* 购物车数量 */
}
<div
  onClick={onShow}
  className={classNames("icon", cartList.length > 0 && "fill")}
>
  {cartList.length > 0 && (
    <div className="cartCornerMark">{cartList.length}</div>
  )}
</div>;
```

## 8. 购物车列表功能实现

![image.png](https://shark-capt.oss-cn-shanghai.aliyuncs.com/vitepress/assets/react/day03/19.png)

1-控制列表渲染

```jsx
const Cart = () => {
  return (
    <div className="cartContainer">
      {/* 添加visible类名 div会显示出来 */}
      <div className={classNames("cartPanel", "visible")}>
        {/* 购物车列表 */}
        <div className="scrollArea">
          {cartList.map((item) => {
            return (
              <div className="cartItem" key={item.id}>
                <img className="shopPic" src={item.picture} alt="" />
                <div className="main">
                  <div className="skuInfo">
                    <div className="name">{item.name}</div>
                  </div>
                  <div className="payableAmount">
                    <span className="yuan">¥</span>
                    <span className="price">{item.price}</span>
                  </div>
                </div>
                <div className="skuBtnWrapper btnGroup">
                  {/* 数量组件 */}
                  <Count count={item.count} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Cart;
```

2- 购物车增减逻辑实现

```javascript
// count增
increCount (state, action) {
  // 关键点：找到当前要修改谁的count id
  const item = state.cartList.find(item => item.id === action.payload.id)
  item.count++
},
// count减
decreCount (state, action) {
  // 关键点：找到当前要修改谁的count id
  const item = state.cartList.find(item => item.id === action.payload.id)
  if (item.count === 0) {
    return
  }
  item.count--
}
```

```jsx
<div className="skuBtnWrapper btnGroup">
  {/* 数量组件 */}
  <Count
    count={item.count}
    onPlus={() => dispatch(increCount({ id: item.id }))}
    onMinus={() => dispatch(decreCount({ id: item.id }))}
  />
</div>
```

3-清空购物车实现

```javascript
// 清除购物车
clearCart (state) {
  state.cartList = []
}
```

```jsx
<div className="header">
  <span className="text">购物车</span>
  <span className="clearCart" onClick={() => dispatch(clearCart())}>
    清空购物车
  </span>
</div>
```

## 9. 控制购物车显示和隐藏

![image.png](https://shark-capt.oss-cn-shanghai.aliyuncs.com/vitepress/assets/react/day03/20.png)

```jsx
// 控制购物车打开关闭的状态
const [visible, setVisible] = useState(false);

const onShow = () => {
  if (cartList.length > 0) {
    setVisible(true);
  }
};

{
  /* 遮罩层 添加visible类名可以显示出来 */
}
<div
  className={classNames("cartOverlay", visible && "visible")}
  onClick={() => setVisible(false)}
/>;
```

##
