---
outline: deep
---

# 服务器
>镜像：CentOS 7.6  
前端：react  
后端：express

## 部署
### 1. 更新系统
```bash
sudo yum update -y
```

### 2. 安装 Node.js
Express 和 React 都需要 Node.js 环境。你可以通过 nvm（Node Version Manager）来安装 Node.js，或者直接安装。  
```bash
# 安装 nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash

# 使用 nvm 安装 Node.js
nvm install --lts
```
如果node版本过高在**CentOS 7.6**中可能会安装失败，可选用[docker](../docker/home.md#docker-部署)方式进行安装。  

### 3. 安装 Nginx
[Nginx配置](./nginx.md)
```bash
sudo yum install -y nginx
```
### 4. 前端上传
可以使用 scp 或 xftp 上传代码，或者直接在服务器上克隆 Git 仓库
#### 命令 
```bash
# 删除远程仓库dist文件
ssh root@host "rm -rf /home/admin/test/*"

# 上传dist文件
scp -r dist/* root@host:/home/admin/test/
```
#### scp2 
>安装
```bash
npm install scp2
```
>根目录下新建`deploy/index.js`
```js
// cjs写法
// const client = require('scp2');
// const path = require('path');
// const chalk = require('chalk');

// es6写法
import client from "scp2";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// 手动定义 __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log("start upload file");
client.scp(
  path.resolve(__dirname, "../dist"),
  {
    host: "<host>",
    username: "<username>",
    password: "<password>",
    path: "<path>",
  },
  function (err) {
    if (err) {
      console.log("upload failure\n" + err);
      return;
    }
    console.log("upload success");
  }
);
```


### 5. 后端
[docker部署](../docker/home.md#docker-部署)