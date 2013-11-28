var path = require("path");
var exec = require("child_process").exec;
var genJsRes = require("./genJsRes");
var genRes = require("./genRes");
var core4cc = require("../core4cc");
var fs = require("fs");

var coreName = "cocos2d-html5", cfgDir = "cfg/", mergeCache4Dependencies = {}, sortArr;

/**
 * Desc: 合并依赖。
 * @param modulesDir
 * @param dependencies
 * @param jsToMergeArr
 */
function mergeDependencies(dependencies, jsToMergeArr){
    for(var i = 0, li = dependencies.length; i < li; i++){
        var dependency = dependencies[i];
        var moduleName = dependency.name;
        var pInfo = require(path.join(modulesDir, moduleName, "package.json"));
        mergeDependencies(core4cc.getDependencies(pInfo.dependencies), jsToMergeArr);
        if(mergeCache4Dependencies[moduleName]) continue;
        mergeCache4Dependencies[moduleName] = true;
        sortArr.push(moduleName);
        jsToMergeArr.push(path.join(modulesDir, moduleName, cfgDir, "jsRes.js"));
        jsToMergeArr.push(path.join(modulesDir, moduleName, cfgDir, "resCfg.js"));
    }
}

/**
 * Desc: 创建temp文件夹以及temp内容。
 */
function createTemp(){
    if(!fs.existsSync(tempBaseDir)) fs.mkdirSync(tempBaseDir);//创建temp目录
    if(!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);//创建temp目录

    var jsToMergeArr = [];
    jsToMergeArr.push(path.join(projDir, cfgDir, "res.js"));
    mergeDependencies(core4cc.getDependencies(cocosInfo.dependencies), jsToMergeArr);

    jsToMergeArr.push(path.join(projDir, cfgDir, "jsRes.js"));
    jsToMergeArr.push(path.join(projDir, cfgDir, "resCfg.js"));
    core4cc.merge2Module(jsToMergeArr, path.join(tempDir, "resCfg.js"), [], "resCfg");
};

function install(opts, cocosCfg){
    console.log("installing modules...");
    exec("npm install", function(err, data, info){
        if(err) {
            console.error(err);
            console.error(data);
            console.error(info);
            return;
        }
        console.log(data);
        console.log(info);

        projDir = process.cwd();
        genJsRes(projDir, {}, cocosCfg);
        genRes(projDir, {}, cocosCfg);


        //初始化基础目录路径
        cocosInfo = require(path.join(projDir, "package.json"));//读取cocos配置信息
        modulesDir = path.join(projDir, "node_modules/");
        tempBaseDir = path.join(projDir, "temp");
        tempDir = path.join(tempBaseDir, "dev");

        projName = cocosInfo.name;


        sortArr = [];
        createTemp();//创建temp文件夹
        resCfg = require(path.join(tempDir, "resCfg.js"));//获取整合后的资源配置
        sortArr.push(projName);
        var baseJsList = [];
        for(var i = 0, li = sortArr.length; i < li; ++i){
            var moduleName = sortArr[i];
            var jsList = resCfg[moduleName].ref;
            var modulePath = moduleName == projName ? "../../" : path.join("../../", "node_modules", moduleName) + "/";
            baseJsList.push(modulePath + "cfg/jsRes.js");
            baseJsList.push(modulePath + "cfg/resCfg.js");
            for(var j = 0, lj = jsList.length; j < lj; ++j){
                baseJsList.push(jsList[j].replace("[%" + moduleName + "%]", modulePath));
            }
        }
        var baseJsListContent = "var baseJsList = [\r\n";;
        for(var i = 0, li = baseJsList.length; i < li; ++i){
            baseJsListContent += "    " + JSON.stringify(baseJsList[i]);
            if(i < li - 1) baseJsListContent += ",\r\n";
            else baseJsListContent += "\r\n";
        }
        baseJsListContent += "];";
        fs.writeFileSync(path.join(projDir, "projects/proj.html5/baseJsList.js"), baseJsListContent);
//        fs.rmdirSync(tempDir);
    });
};
module.exports = install;