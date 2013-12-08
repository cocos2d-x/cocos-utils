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
```script
{
    "output" : "cfg/jsRes.js",//生成的js名称
    "fileTypes" : ["js"],//扫描的文件类型
    "dirCfgs" : ["src", "test"]//扫描的文件夹
}
```

* install--->项目安装
```script
{
    "delTemp" : true //是否删除临时文件
}
```

* publish--->发布配置
```script
{
    "output" : "projects/proj.html5/mini.js",//mini文件路径
    "delTemp" : true //是否删除临时文件
}
```

## 工程结构
```script
- helloworld
    - cfg
        - res.js (资源文件路径的映射文件，通过cocos genRes生成)
        - jsRes.js (js文件路径的映射文件，通过cocos genJsRes生成)
        - resCfg.js (项目资源依赖配置)
    - res (资源根路径)
        -Normal (普通版本资源)
        -HD (高清版本资源)
    - src (工程代码)
    - test  (测试代码)
    - projects  (项目发布的地方)
        - proj.html5
            - cocos2d.js (Game启动配置)
            - main.js (Game启动入口)
            - baseJsList.js (基础的js列表)
            - index.html (开发是的访问地址)
            - mini.js (执行cocos publish后生成)
            - build.xml (执行cocos publish后生成，进行混淆压缩时是用的)
            - release.html (混淆压缩版本的访问地址)
    - cocos.json (对应cocos命令的各种相关配置)
    - package.json
```

## resCfg
这个是工程资源依赖的核心。其中，`resCfg["模块名字"]...`这块将作为对应模块的基础加载列表。先看下大致结构，假设模块就叫m1：
```script
var resCfg = cc.resCfg || {};
var jsRes = js.m1;
resCfg["m1"] = {
    ref : [jsRes.code01_js, jsRes.code02_js],
    res : [jsRes.a_png, jsRes.b_png]
};
```

`ref`为`reference`的缩写，表示该部分引用了那些部分的配置。`res`为`resource`的缩写，表示需要的资源。

那么在工程启动的时候，`resCfg["m1"]`这部分的配置就被认为是默认需要加载的。也就是说会加载`code01.js`以及`code02.js`，
资源默认会加载`a.png`和`b.png`。

```script
resCfg[jsRes.code03_js] = {
    res : [res.c_png],
    sprite : "MySprite",
    args : {a : "AAA"}
};
```

可以看出，`code03.js`没有依赖其他的js，只用到了`c.png`这个资源而已。

`sprite`字段的意思是为`code03.js`提供测试用例。需要确保`code03.js`中，有一个名为`MySprite`的Sprite类，
并且有：`MySprite.create = function(args)...`方法。配置中的`args`就将作为参数传递给`MySprite.create`方法。
然后在`main.js`中写上`ccConfig.test = js.m1.code03_js`，则访问index.html时，将直接对`MySprite`进行单例测试。
注释掉ccConfig.test配置则恢复游戏入口。

同理，还有`layer`、`scene`等，也提供给用户编写自定义测试用例的方法。

通过添加测试用例，可以在不改动游戏代码的情况下对某一单一模块进行测试，而不需要通过游戏入口一层一层的点击，直到测试目的地。
这样做可以很好的提高开发效率，同时在对其进行性能测试的时候，也能较好的实现排除外因的功能。

```script
resCfg[jsRes.code04_js] = {
    ref : [jsRes.code03_js]
};
resCfg[jsRes.code05_js] = {
    ref : [jsRes.code04_js]
};
```

这里，`code04.js`引用了`code03.js`，只要`code03.js`对外提供的接口不变，那么不管`code03.js`里面做了什么改动，
都将不会影响到`code04.js`的原来的实现。同时，`code04.js`也不需要担心它所引用的js到底用了哪些资源。
例如`code05.js`又引用了`code04.js`，那么他是不需要关心`code04.js`是否还有引用什么js，或者需要什么资源的。
这么做可以很好的解耦，提高团队的工作效率——调用者只关心提供者提供的接口。

```script
resCfg.gameModules = [jsRes.code05_js, ...];
```

该配置的作用是配置游戏项目的各个子模块，例如：主页、出征、战斗、活动等等。
开发时引擎将会提供分模块加载资源、js的功能（递归方式）。
同时在发布的时候，发布脚本将会根据该配置生成相应模块的资源列表，去除了递归方式，提高了效率。

`resCfg.js`配置看起来比较凌乱，难免会让人产生抵触心理。
但是在工程一步一步进行的时候，却是很容易配置的，因为开发者只要关心当前的js文件需要的东西即可，反而能提高开发效率。

## package.json
该文件的书写规范同npm的要求一直。`cocos install`或者`cocos genBaseJsList`命令，将会根据其中的`dependencies`中，
到对应的依赖模块中，根据其package.json的依赖配置，递归获取依赖的列表，
同时到`cfg/resCfg.js`中，根据其base的配置（也就是key为模块名称的那个配置）获取列表。
最终获取的列表将保存到`baseJsList.js`中。

如果需要引入某一模块，则在`package.json`的`dependencies`中加入即可，不需要时删除，
然后执行下`cocos install`或者`cocos genBaseJsList`命令重新生成baseJsList列表即可。

## 发布逻辑
执行`cocos publish`时，将会根据上述逻辑，结合`resCfg.gameModules`的配置，获取到所有的js列表。
同时，由于jsRes.js在此时已经不需要了，将被基本剔除掉（除了`resCfg.gameModules`中的几个会被额外处理）。
所有的`resCfg.js`将会被统一处理后放在`temp4Publish/resCfg4Publish.js`中。

（注意：temp4Publish默认是设置为发布完毕即删除的，在cocos.json中将publish的delTemp设置为false即可）

然后会通过去除log的脚本，将去除后的结果重新保存到`temp4Publish/build`中（为了不破坏源码）。

接着生成Closure Compiler需要用到的`build.xml`。最后调用`ant`命令进行混淆压缩。