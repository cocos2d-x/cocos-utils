cocos-utils
===========

Cocos utilities for Cocos2d-html5 NPM supporting.

A tool to help developers coding cocos2d-html5 easily.


## 安装
* 安装`nodejs`
* 执行命令：
```bash
npm install cocos-utils -g
```

## 创建cocos2d-html5项目
`cd`到工程所要存放的目录下，例如想建工程名为`HelloWorld`的项目，执行以下命令：
```bash
cd the/dir/you/want/to/put/your/project/
cocos init HelloWorld
```
执行完命令之后，将会在当前文件夹生产一个名为HelloWorld的文件夹。

## 安装依赖包
按照npm规范，在package.json中添加dependencies。默认已经为开发者添加上了`cocos2d-html5`依赖。然后在工程根目录下执行：`npm install`。

## 添加图片等资源文件
将图片资源放在`res`目录下，然后`cd`到`HelloWorld`目录下，执行
```bash
cocos genRes
```
或者如果使用的ide是WebStorm，可以在`tools`文件夹中找到`genRes.js`，右击运行nodejs。

此时，在`src/cfg/res.js`中，将会生成资源路径的配置文件。注意：文件名要唯一，`-`在key中将会被`_`替换掉。

## 添加js代码
在`src`中添加工程代码，`test`文件夹中添加工程测试代码。然后同上，执行
```bash
cocos genJsRes
```
或者右击运行`tools/genJsRes.js`。

此时，在`src/cfg/jsRes.js`中，将会生成js的路径配置文件。生成的对象的命名规则为`js.`+`项目名`。注意：文件名要唯一，`-`在key中将会被`_`替换掉。

## 进行`resCfg`配置
此步骤在 https://github.com/SmallAiTT/ModuleDemo 中有详细介绍，就不重复写了。

## 修改`main.js`，运行工程。
同上。

## 发布
执行以下命令进行工程发布，规则通genRes:
```bash
cocos publish
```
或者右击运行`tools/publish.js`。

* 当前版本还未将混淆完全做好。