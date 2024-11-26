---
outline: deep
---
# 基本操作
### 一、切换用户
#### 1. 使用 `su` 命令
`su`（switch user）命令允许你切换到其他用户，或者以 root 用户身份执行命令。
>切换到 root 用户（如果你有 root 用户权限）
```bash
su -
```

>切换到其他用户（例如，切换到 admin 用户）：
```bash
su - admin
```

#### 2. 使用 `sudo` 命令
如果你是具有 sudo 权限的用户，可以使用 sudo 命令来执行需要管理员权限的操作。
>切换到 root 用户
```bash
sudo -i
```
>切换到其他用户
```bash
sudo su - admin
```

### 二、新建用户
#### 1. 创建
```bash
sudo useradd newuser
```
#### 2. 设置密码
```bash
sudo passwd newuser
```
#### 3. 设置默认的主目录
```bash
sudo useradd -m -s /bin/bash newuser
```
::: tip
- -m：自动创建主目录（/home/newuser）。
- -s：指定默认的 shell（例如 bash）
:::
#### 4. 分配权限
你还可以将新用户添加到一个特定的用户组（例如 `sudo` 组，允许用户使用 `sudo` 权限）：
```bash
sudo usermod -aG sudo newuser
```

### 三、查看用户
```bash
cat /etc/passwd
```
包含了系统中所有用户的基本信息（如用户名、用户ID、主目录、默认 shell 等）。

### 四、删除用户
>如果你想删除一个不再需要的用户，可以使用 userdel 命令
```bash
sudo userdel newuser
```
>如果还想删除该用户的主目录和文件，可以加上 -r 选项
```bash
sudo userdel -r newuser
```