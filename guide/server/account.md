---
outline: deep
---

# 服务器基本操作

::: info 📖 本节内容
本文整理了 Linux 服务器日常管理中常用的命令，适用于 CentOS / Ubuntu 等主流发行版。
:::

## 一、用户管理

### 1.1 切换用户
```bash
# 切换到 root 用户
su -

# 切换到指定用户
su - admin

# 使用 sudo 切换到 root
sudo -i

# 使用 sudo 切换到其他用户
sudo su - admin
```

### 1.2 创建用户
```bash
# 创建用户（自动创建主目录）
sudo useradd -m -s /bin/bash newuser

# 设置密码
sudo passwd newuser

# 添加 sudo 权限
sudo usermod -aG sudo newuser    # Ubuntu
sudo usermod -aG wheel newuser   # CentOS
```

::: tip 参数说明
- `-m`：自动创建主目录 `/home/newuser`
- `-s /bin/bash`：指定默认 shell
:::

### 1.3 查看用户
```bash
# 查看所有用户
cat /etc/passwd

# 查看当前用户
whoami

# 查看用户所属组
groups username
```

### 1.4 删除用户

```bash
# 删除用户（保留主目录）
sudo userdel newuser

# 删除用户并删除主目录
sudo userdel -r newuser
```

## 二、文件操作

### 2.1 常用命令

```bash
# 查看当前目录
pwd

# 列出文件
ls -la

# 进入目录
cd /path/to/dir

# 创建目录
mkdir -p /path/to/dir

# 复制文件/目录
cp -r source dest

# 移动/重命名
mv oldname newname

# 删除文件
rm filename

# 删除目录（递归）
rm -rf dirname
```

### 2.2 文件查看

```bash
# 查看文件内容
cat filename

# 分页查看
less filename

# 查看前/后 N 行
head -n 20 filename
tail -n 20 filename

# 实时查看日志
tail -f /var/log/nginx/error.log
```

### 2.3 文件权限

```bash
# 修改所有者
sudo chown -R admin:admin /home/admin/project

# 修改权限（rwxr-xr-x）
sudo chmod -R 755 /home/admin/project

# 给文件添加执行权限
chmod +x script.sh
```

## 三、系统管理

### 3.1 服务管理

```bash
# 查看服务状态
sudo systemctl status nginx

# 启动/停止/重启服务
sudo systemctl start nginx
sudo systemctl stop nginx
sudo systemctl restart nginx

# 设置开机自启
sudo systemctl enable nginx
sudo systemctl disable nginx
```

### 3.2 防火墙

```bash
# 查看防火墙状态
sudo firewall-cmd --state

# 开放端口
sudo firewall-cmd --permanent --add-port=80/tcp
sudo firewall-cmd --permanent --add-port=443/tcp
sudo firewall-cmd --permanent --add-port=3000/tcp

# 重新加载防火墙
sudo firewall-cmd --reload

# 查看已开放端口
sudo firewall-cmd --list-ports
```

::: warning ❗ 云服务器注意
除了服务器防火墙，还需要在云服务商控制台的**安全组**中开放对应端口！
:::

### 3.3 查看系统信息

```bash
# 查看磁盘使用
df -h

# 查看内存使用
free -h

# 查看 CPU 和内存实时状态
top

# 查看端口占用
netstat -tuln | grep LISTEN
```