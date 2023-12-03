# 单机 😍🅿𝗋𝗈𝗆𝗉𝗍 小助手😍 

# 1 介绍
## 1.1 工程说明
 - 本工程是 moonvy.com 的 OPS 项目分支，[点击访问原工程链接](https://github.com/Moonvy/OpenPromptStudio)
 - 本工程有单机 release 包，如果你有 web 服务器，[下载release包](https://github.com/Tairraos/PromptTool/releases) 解压即完成部署

## 1.2 提示词小助手 | 可视化编辑提示词

这是一个旨在把 AIGC 提示词（现在支持 Midjourney）可视化并提供编辑功能的工具，有以下特性

 -   显示英文提示词的中文翻译
 -   翻译输入的中文提示词到英文（因为 Midjourney 仅支持英文提示词）
 -   为提示词进行分类（角色、风格、质量、命令、负面）
 -   轻松的排序、隐藏提示词
 -   把提示词可视化结果导出为图片
 -   本地提示词词典，通过 Excel 管理

![工具截图](screenshot.png)

# 2 部署
## 2.1 已有服务器部署
 - 如果你已经有本机 web 服务器，要部署在域名根上，[下载release包](https://github.com/Tairraos/PromptTool/releases) 解压即完成部署
 - 如果你你还没有本机 web 服务器，继续阅读

## 2.2 准备服务器和文件目录
 - 我使用 apache 官方的 XAMPP： https://www.apachefriends.org/ 顶上点击 Download 下载对应你操作系统的包
 - 我的 Xampp 安装在 `D:\apps\xampp` 目录
 - 我的项目clone 在 `D:\Workspace\SDPromptTool`，直接使用 release 包可以不需要克隆项目
 - 我的 web 服务指向路径 `D:\Workspace\SDPromptTool\dist`，你可以任意准备一个方便的目录
 - 2.3 的配置，如果你的安装目录或 web 根目录不同，下面配置需要相应修改

## 2.3 配置服务器
 - 在 `D:\Workspace\SDPromptTool\dist` 下添加一个 `index.html` 文件，内容为 `test pass` 用于测试服务器有没有配置成功
 - 在 hosts 文件里为工具添加本机域名 `127.0.0.1 prompt.localweb.com`，
 - 使用工具为域名生成 https 证书： https://github.com/FiloSottile/mkcert/releases
 - `mkcert-v1.4.4-windows-amd64.exe -key-file server.key -cert-file server.crt prompt.localweb.com`
 - 生成的 `server.key` 和 `server.crt`，移到 `D:\Apps\Xampp\apache\conf\`，如果放在其它目录，注意修改配置
 - 编辑 `D:\Apps\Xampp\apache\conf\extra\httpd-vhosts.conf`, 添加如下内容，注意目录和证书位置
```
<VirtualHost *:80>
    ServerAdmin webmaster@localweb.com
    DocumentRoot "D:/Workspace/SDPromptTool/dist"
    ServerName prompt.localweb.com
    ErrorLog "D:/Apps/Xampp/apache/logs/prompt-error.log"
    CustomLog "D:/Apps/Xampp/apache/logs/prompt-access.log" common
</VirtualHost>
<VirtualHost *:443>
    DocumentRoot "D:/Workspace/SDPromptTool/dist"
    ServerName prompt.localweb.com:443
    ServerAdmin webmaster@localweb.com
    SSLEngine on
    SSLCertificateFile "D:/Apps/Xampp/apache/conf/server.crt"
    SSLCertificateKeyFile "D:/Apps/Xampp/apache/conf/server.key"
    ErrorLog "D:/Apps/Xampp/apache/logs/prompt-error.ssl.log"
    CustomLog "D:/Apps/Xampp/apache/logs/prompt-access.ssl.log" common
</VirtualHost>                       
<Directory "D:/Workspace/SDPromptTool/dist">
    Options FollowSymLinks Multiviews Indexes
    MultiviewsMatch Any
    AllowOverride All
    Require all granted
</Directory>
```
 - 重启 apache，浏览器里访问 (https://prompt.localweb.com/) 看到 `test pass`, 说明本地服务器准备好了
 - [下载release包](https://github.com/Tairraos/PromptTool/releases) 解压即完成部署
 - 如果你不想部署在 web 根位置，继续阅读

## 2.4 手动 Build 部署
 - `git clone https://github.com/Tairraos/PromptTool.git`
 - `cd SDPromptTool`
 - `npm i`
 - 全文搜索 `minifix` 修改四处URL
     - 两处是翻译用的代理，我也不知道原工程为什么要写两遍一样的代码
     - 一处是 vue 路由配置，指定自己的根在哪里
     - 一处是 vite build 的时候，要把编译出来的文件拷到指定位置
 - `npm run build`
 - 浏览器里访问 https://prompt.localweb.com/

# 3 维护
## 3.1 如何维护提示词词典
 - 在 web deploy 目录会生成一个 prompt.xlsx，编辑它就可以更新自己的基础 prompt
 - 粘帖别人的 prompt 到工作区，清理，把喜欢的 prompt 都标灰，然后使用复制标灰功能，直接带翻译粘帖到 prompt.xlsx

## 3.2 调试
 - 使用 `npm run dev` 调试源代码
     - 此时有 sourcemap 可以直接在浏览器 console 里调试源代码
     - 如果翻译代理不工作
         - 1 搜索 `minifix` 把两处翻译代理地址指向你的本地工具 URL
         - 2 如果从来没有部署过，需要 `npm run build` 把翻译代理部署上去
         - 3 需要浏览器配置 cros 调试插件，允许 127.0.0.1 的 vite 调试服务访问带域名的翻译代理
 - 提示词字典显示`未知`分类
     - prompt.xls 里，有些 `prompt` C列 `dir` 为空
 - 加载 Excel 出错
     - 可能是空白行非空，比如有一个空格，程序读到非空行当做数据解析
     - 代码做了容错，检查 console 的输出，看看 xlsx 的哪个位置解析出错
 - npm run build 出错
     - 部署目录的 prompt.xls 正打开着的话，会被 excel 锁定冲突，导致部署失败

# 4 相对原 Repo 的改动

 - 取消 Node server，换用 apache 服务
     - 翻译 api 跨域调用，需要有服务器代理，本项目使用 php 代理
 - 取消 Notion 库，放弃 Cloud 服务，打造单纯单机工具
 - 使用单个 Excel 代替原版多个 csv 文件的管理方式
     - 原项目使用 csv build json 来使用，不直观，难维护
     - prompt 库放在 web/public/prompt.xlsx
     - build 时会检测部署位置下的 prompt.xlsx 是否比工程中的新
     - 如果部署位置 prompt.xlsx 更新，build 的时候会将它复制到工程
     - 更新的 prompt.xlsx 可跟随工程一并提交到 git repo 里保存
 - 优化翻译机制
     - 缺省使用有道翻译，不需要申请 api key，开箱即用
     - 也可以选择百度翻译，准确性更高，申请地址：https://api.fanyi.baidu.com/
     - 如果选择百度，将 web/public/keys.php.example 改名成 keys.php
     - keys.php 被写在 .gitignore 里，不会被上传到 git, 放心填写隐私 key
 - 增加了清理 prompt 的功能
     - 在界面绿色提示词下方，一个魔术棒图标
     - 清理会去除权重，去除重复，去除非 prompt 指令，留下单纯的prompt
 - 增加了批量复制 prompt 功能
     - 点击下方【复制标灰的提示词】会把标灰的提示词以 Excel 格式复制到剪贴板
     - 打开 prompt.xlsx 可以直接帖进空白的行收集，为提示词添加分类名即可
     - 如果标灰的 prompt 已经存在于 xlsx 里，或者刚刚被复制过，不会再次被复制
 - 增加了未知提示词样式
     - 在 prompt.xlsx 里没有的 prompt 底部会显示一条红线
 - 取消原项目无用的内容
     - 取消引用的外部 webfont，会 build 出来一堆文件，实际本机字体就很好看
     - 取消 legacy build，兼容中古浏览器没必要
 - 扫描了 civitai 的近万个图片 prompt, 清洗，翻译，手工筛选，更新 prompt.xlsx
     - 各分类详细，比 Moonvy 的词典好用太多了，统计如下
     - 鼻子(9), 耳朵(13), 胡子(7), 脸(17), 眉毛(7), 眼睛(36), 嘴(7), 头发(136), 表情(49),
     - 情绪(37), 身体特征(20), 头脸特征(41), 姿势(51), 全身装(29), 上装(24), 下装(12), 
     - 鞋袜(12), 帽子(15), 饰品(20), 面具(5), 头饰(31), 眼镜(6), 耳环(3), 环境(88), 
     - 画风(28), 流派(50), 偏好(28), 画面效果(41), 形式(55), 视角(47)
