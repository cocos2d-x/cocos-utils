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

## 访问发布版本
* 确保你的工程以部署，访问projects/proj.html5/index.html

* 当前版本还未将混淆完全做好。