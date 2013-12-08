cocos-utils
===========

Cocos utilities for Cocos2d-html5 NPM supporting.

A tool to help developers coding cocos2d-html5 easily.


## 安装
* 安装`nodejs`，该步骤省略。
* 执行命令：
```
npm install cocos-utils -g
```

## 创建cocos2d-html5项目
`cd`到工程所要存放的目录下（一般来说是在服务器的目录中），例如想建工程名为`helloworld`的项目，执行以下命令：
```bash
cd the/dir/you/want/to/put/your/project/
cocos new helloworld
cd helloworld
npm install
cocos install
```

## 访问开发版本
* 确保你的工程已部署，访问`projects/proj.html5/index.html`

## 发布
在`helloworld`文件夹下执行：
```bash
cocos publish
```

## 访问发布版本
* 确保你的工程以部署，访问projects/proj.html5/release.html

## 命令说明
### cocos new project
创建工程的命令。会通过现有工具内模板进行创建。今后会做成可以让用户指定自己的模板，例如`cocos new project -temp myTemp`。
### cocos genRes
生成系统的资源文件路径到项目的`cfg/res.js`文件中，做为资源路径的统一管理。如果对资源的名字和路径有改动，请先执行该命令。相关配置为`cocos.json`的`genRes`。
### cocos genJsRes
功能同上类似，生成项目中的js文件的路径配置到`cfg/jsRes.js`中。如果对js文件的名字和路径有改动，请先执行该命令。相关配置为`cocos.json`的`genRes`。
### cocos genBaseJsList
生成项目启动时需要载入的基本的js列表。如果对依赖的模块有改动，请先执行改命令。相关配置为`cocos.json`的`genBaseJsList`。
### cocos install
该命令将会依次调用`cocos genRes`，`cocos genJsRes`， `cocos genBaseJsList`。
### cocos publish
将工程混淆压缩发布。

## cocos.json
该配置文件存放了执行`cocos`一些列命令的相关配置
* genRes--->资源文件路径配置生成器
```js
var cfg = {
    "output" : "cfg/res.js",//生成的js名称
    "fileTypes" : [
        "png", "jpg", "bmp", "jpeg", "gif", "mp3", "ogg", "wav", "mp4", "plist",
        "xml", "fnt", "tmx", "tsx", "ccbi", "font", "txt", "vsh", "fsh", "json"
    ],//扫描的文件类型
    "dirCfgs" : ["res/Normal->res/Normal"]//扫描的文件夹，`->`后面为需要去除的前缀，例如： res/Normal/a.png 将会转为 a.png
}
```
* genRes--->js文件路径配置生成器
{
    "output" : "cfg/jsRes.js",//生成的js名称
    "fileTypes" : ["js"],//扫描的文件类型
    "dirCfgs" : ["src", "test"]//扫描的文件夹
}

* publish--->发布配置
{
    "output" : "projects/proj.html5/mini.js",//mini文件路径
    "miniCfg" : "-nm -c -d __PUBLISH=true -b "//uglifyjs压缩配置
}