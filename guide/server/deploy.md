---
outline: deep
---

# 服务器部署

::: info 📖 部署概览
本文介绍如何将前端 (React) + 后端 (Express) 项目部署到 CentOS 服务器。
:::

## 部署流程

```
1. 服务器初始化 → 2. 安装环境 → 3. 部署前端 → 4. 部署后端 → 5. 配置 Nginx
```

| 步骤 | 内容 |
|------|------|
| 服务器初始化 | 更新系统、配置防火墙 |
| 安装环境 | Node.js、Nginx、Docker（可选） |
| 部署前端 | 构建产物上传到 Nginx |
| 部署后端 | 直接运行 / PM2 / Docker |
| 配置 Nginx | 反向代理、Gzip |

## 一、服务器初始化
### 1.1 更新系统

```bash
sudo yum update -y
```

### 1.2 开放端口

```bash
# 开放常用端口
sudo firewall-cmd --permanent --add-port=80/tcp
sudo firewall-cmd --permanent --add-port=443/tcp
sudo firewall-cmd --permanent --add-port=3000/tcp
sudo firewall-cmd --reload
```

::: warning ❗ 云服务器用户
记得在云服务商控制台的**安全组**中也要开放对应端口！
:::

## 二、安装环境

### 2.1 安装 Node.js
```bash
# 安装 nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
source ~/.bashrc

# 安装 Node.js LTS 版本
nvm install --lts
node -v
```

::: warning CentOS 7 兼容性问题
CentOS 7 的 glibc 版本较低，新版 Node.js 可能无法运行。  
**解决方案**：使用 [Docker 部署](../docker/deploy.md)，在容器内运行 Node.js
:::

### 2.2 安装 Nginx

```bash
sudo yum install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

访问 `http://服务器IP` 查看是否安装成功。

> Nginx 配置详见 [反向代理](../nginx/proxy.md)

## 三、部署前端

### 3.1 构建项目

在本地执行：

```bash
npm run build
```

### 3.2 上传文件

#### 方式一：scp 命令（推荐） 
```bash
# 清空远程目录
ssh root@服务器IP "rm -rf /home/admin/dist/*"

# 上传 dist 文件
scp -r dist/* root@服务器IP:/home/admin/dist/
```

#### 方式二：Xftp/FileZilla

使用图形化工具上传，适合新手。

#### 方式三：自动化脚本

::: details 📦 使用 scp2 自动上传

**安装：**
```bash
npm install scp2 -D
```

**创建 deploy/index.js：**
```js
import client from "scp2";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 从环境变量读取配置（更安全）
const { DEPLOY_HOST, DEPLOY_USER, DEPLOY_PASS, DEPLOY_PATH } = process.env;

console.log("开始上传...");
client.scp(
  path.resolve(__dirname, "../dist"),
  {
    host: DEPLOY_HOST,
    username: DEPLOY_USER,
    password: DEPLOY_PASS,
    path: DEPLOY_PATH,
  },
  (err) => {
    if (err) {
      console.error("上传失败:", err);
      process.exit(1);
    }
    console.log("上传成功！");
  }
);
```

**运行：**
```bash
DEPLOY_HOST=xx.xx.xx.xx DEPLOY_USER=root DEPLOY_PASS=密码 DEPLOY_PATH=/home/admin/dist node deploy/index.js
```
:::

::: warning ⚠️ 安全提示
不要在代码中硬编码密码！建议：
- 使用环境变量传递敏感信息
- 或使用 SSH 密钥认证（无需密码）
:::

### 3.3 配置 Nginx

编辑 Nginx 配置：

```bash
sudo vim /etc/nginx/nginx.conf
```

```nginx
server {
    listen 80;
    server_name your-domain.com;

    root /home/admin/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

```bash
sudo nginx -t && sudo nginx -s reload
```

## 四、部署后端

### 4.1 方式选择

| 方式 | 适用场景 | 说明 |
|------|---------|------|
| 直接运行 | 开发测试 | `node app.js`，终端关闭就停止 |
| PM2 | 生产环境 | 进程管理、自动重启、日志管理 |
| Docker | 推荐 | 环境隔离、一键部署 |

### 4.2 使用 PM2

```bash
# 安装 PM2
npm install -g pm2

# 启动应用
pm2 start src/app.js --name express-app

# 常用命令
pm2 list          # 查看进程
pm2 logs          # 查看日志
pm2 restart all   # 重启所有
pm2 stop all      # 停止所有

# 设置开机自启
pm2 startup
pm2 save
```

### 4.3 使用 Docker

详见 [Docker 部署](../docker/deploy.md)

### 4.4 配置 Nginx 反向代理

将 API 请求代理到后端：

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # 前端
    root /home/admin/dist;
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 后端 API
    location /api {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 五、验证部署

```bash
# 检查 Nginx 状态
sudo systemctl status nginx

# 检查后端进程
pm2 list
# 或
lsof -i :3000

# 测试访问
curl http://localhost
curl http://localhost/api/health
```

🎉 看到页面正常返回就说明部署成功！