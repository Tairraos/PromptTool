# 单机 😍🅿𝗋𝗈𝗆𝗉𝗍 小助手😍 

## 分支于 moonvy.com 的 OPS 项目

## 提示词小助手 | 可视化编辑提示词

这是一个旨在把 AIGC 提示词（现在支持 Midjourney）可视化并提供编辑功能的工具，有以下特性

-   显示英文提示词的中文翻译
-   翻译输入的中文提示词到英文（因为 Midjourney 仅支持英文提示词）
-   为提示词进行分类（角色、风格、质量、命令、负面）
-   轻松的排序、隐藏提示词
-   把提示词可视化结果导出为图片
-   本地提示词词典，通过 Excel 管理

## 相对原项目的改变

 - 取消 Node server，换用 apache 服务
     - 推荐 XAMPP： https://www.apachefriends.org/
     - 安装它，还能在本地跑很多东西，比如 wordpress, discuz 论坛...
     - 还能调试自己的 web 项目，比如本项目
     - 翻译 api 跨域调用，需要有服务器代理，本项目使用 php 代理
 - 取消 Notion 库，放弃 Cloud 服务，打造单纯单机工具
 - 使用单个 Excel 代替原版多个 csv 文件的管理方式
     - 取消使用 csv build json 来使用，直接 load excel
     - prompt 库放在 web/public/prompt.xlsx
     - build 的时候此文件会被复制到部署位置
     - 如果直接维护部署位置的 prompt 库，不需要重新build，刷新页面即起作用
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
 - 扫描了 civitai 的几万个图片 prompt, 添加大量 Prompt
     - 特征 61
     - 姿势 51
     - 上装 24
     - 下装 12
     - 鞋袜 12
     - 帽子 15
     - 饰品 25
     - 环境 88
     - 画风 28
     - 流派 50
     - 出图偏好 28
     - 画面效果 41
     - 图片形式 55
     - 图片视角 47

## 开发者

 - 开发者通常都会在本地跑一个 web 服务器方便自己开发和调试吧
 - 大部分人会选择 apache 官方出品的 XAMPP 吧： https://www.apachefriends.org/
 - 使用这个工具可以解决本地 https 证书问题： https://github.com/FiloSottile/mkcert/releases
 - 下面命令一次性为多个域名生成证书，域名写在 hosts 里，都指向 `127.0.0.1` 即可用任意一个访问本机服务器
 - `mkcert-v1.4.4-windows-amd64.exe localhost www.localweb.com hack.localweb.com workspace.localweb.com`
 - 本机服务器可以配置多个域名指向不同的目标，搜索 apache vhost

## 部署

 - clone 当前分支
 - npm i 安装依赖
 - 全文搜索 `minifix` 把它指向你将要deploy的位置
 - npm run build
 - 使用域名在浏览器里访问工具

## 部署说明
 - 因为我们的web放的位置不同，所以要做此修改，minifix 有四处
     - 两处是翻译用的代理，我也不知道原工程为什么要写两遍一样的代码
     - 一处是 vue 路由配置，指定自己的根在哪里
     - 一处是 vite build 的时候，要把编译出来的文件拷到指定位置
 - 我的工具地址是：https://workspace.localweb.com/Experiment/Tools/prompt/
 - 我的本地文件目录是：d:\Workspace\Experiment\Tools\prompt
 - 所以你会在代码的 `minifix` 里看到这个路径
 - 你也可以添加一个 https://prompt.localweb.com/ 来使用
 - 这些信息可以帮你更好地理理代码里 `minifix` 的原始值

## 如何修改默认提示词词典

 - 在 web deploy 目录会生成一个 prompt.xlsx，编辑它就可以更新自己的基础 prompt
 - 粘帖别人的 prompt 到工作区，清理，把喜欢的 prompt 都标灰，然后使用复制标灰功能，直接带翻译粘帖到 prompt.xlsx

## 调试
 - 使用 `npm run dev` 可以不 build 直接跑
     - 此时有 sourcemap 可以直接在浏览器 console 里调试源代码
     - 翻译代理不能工作, 先 `npm run build` 一次，就会把翻译代理部署到可以工作的位置了
 - 加载 Excel 出错
     - 通常是 prompt.xls 第三栏 dir 为空
     - 也有可能是在下面的空白行有一个空格，程序读到非空行即会当做数据解析
     - 代码已经做了容错，上面的情况几乎不会发生
     - 缺 dir 会用最近读到的一个 dir 名字代替
     - 有无数据的单纯空格行会直接跳过
 - npm run build 出错
     - 注意部署目录的 prompt.xls 打开着的话，就被 excel 锁定导致部署失败 

