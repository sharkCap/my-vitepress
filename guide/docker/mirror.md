---
outline: deep
---

# Docker 镜像源
为 Docker 配置国内镜像源，例如阿里云的镜像加速器：
## 1. 编辑
```bash
sudo nano /etc/docker/daemon.json
```
## 2. 添加
```json
{
  "registry-mirrors": ["https://xxxx.mirror.aliyuncs.com"]
}
```
>镜像网站  
> [Docker Pull](https://dockerpull.org/)  
> [阿里云](https://cr.console.aliyun.com/cn-shanghai/instances/mirrors)
## 3. 保存并重启
```bash
sudo systemctl restart docker
```
## 3. 测试
```bash
sudo docker run hello-world
```