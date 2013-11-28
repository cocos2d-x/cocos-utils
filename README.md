cocos-utils
===========

Cocos utilities for Cocos2d-html5 NPM supporting.

A tool to help developers coding cocos2d-html5 easily.


## 安装
* 安装`nodejs`，该步骤省略。
* 执行命令：
```bash
npm install cocos-utils -g
```

## 安装uglifyjs
```bash
npm install uglify-js -g
```

## 创建cocos2d-html5项目
`cd`到工程所要存放的目录下，例如想建工程名为`HelloWorld`的项目，执行以下命令：
```bash
cd the/dir/you/want/to/put/your/project/
cocos new helloworld
cd helloworld
cocos install
```

## 访问开发版本
* 确保你的工程以部署，访问projects/proj.html5/index.html

## 发布
在`helloworld`文件夹下执行：
```bash
cocos publish
```
* 当前版本还未将混淆完全做好。

## 访问发布版本
* 确保你的工程以部署，访问projects/proj.html5/index.html


## cocos.json
该配置文件存放了执行`cocos`一些列命令的相关配置
* genRes--->资源文件路径配置生成器
```script
{
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