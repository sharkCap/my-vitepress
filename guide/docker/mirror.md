---
outline: deep
---

# Docker 镜像源配置

::: warning 为什么需要配置镜像源？
默认情况下，Docker 从国外的 Docker Hub 下载镜像，速度很慢甚至超时。  
配置国内镜像源后，下载速度可以提升 10-100 倍！
:::

## 配置步骤

### 1. 创建/编辑配置文件

```bash
# 如果目录不存在，先创建
sudo mkdir -p /etc/docker

# 编辑配置文件
sudo nano /etc/docker/daemon.json
```

::: tip nano 编辑器操作
- 编辑完成后按 `Ctrl + O` 保存
- 按 `Enter` 确认文件名
- 按 `Ctrl + X` 退出
:::

### 2. 添加镜像源配置

```json
{
  "registry-mirrors": [
    "https://docker.1ms.run",
    "https://docker.xuanyuan.me"
  ]
}
```

::: details 📋 可用的镜像源列表
| 镜像源 | 地址 |
|--------|------|
| Docker 镜像 | https://docker.1ms.run |
| 玄元镜像 | https://docker.xuanyuan.me |
| 阿里云（需登录获取） | [点击获取](https://cr.console.aliyun.com/cn-shanghai/instances/mirrors) |

> 💡 建议配置多个镜像源，如果一个不可用会自动切换到下一个
:::

### 3. 重启 Docker 服务

```bash
# 重启 Docker 使配置生效
sudo systemctl restart docker

# 检查 Docker 状态
sudo systemctl status docker
```

### 4. 验证配置

```bash
# 测试拉取镜像
sudo docker pull hello-world

# 运行测试
sudo docker run hello-world
```

如果看到 `Hello from Docker!` 的输出，说明配置成功！🎉

## 常见问题

::: details 配置后还是很慢？
1. 检查配置文件格式是否正确（JSON 格式要求严格）
2. 尝试更换其他镜像源
3. 确认是否已重启 Docker 服务
:::

::: details 如何查看当前使用的镜像源？
```bash
sudo docker info | grep -A 5 "Registry Mirrors"
```
:::