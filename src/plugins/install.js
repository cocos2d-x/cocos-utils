var path = require("path");
var exec = require("child_process").exec;
var core4cc = require("../core4cc");
var genJsRes = require("./genJsRes");
var genRes = require("./genRes");
var genBaseJsList = require("./genBaseJsList");
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
    if(!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);//创建temp目录

    var jsToMergeArr = [];
    jsToMergeArr.push(path.join(projDir, cfgDir, "res.js"));
    mergeDependencies(core4cc.getDependencies(packageInfo.dependencies), jsToMergeArr);

    jsToMergeArr.push(path.join(projDir, cfgDir, "jsRes.js"));
    jsToMergeArr.push(path.join(projDir, cfgDir, "resCfg.js"));
    core4cc.merge2Module(jsToMergeArr, path.join(tempDir, "resCfg.js"), [], "resCfg");
};

function runPlugin(dir, opts, cocosCfg){
    console.log("installing...");
    if(arguments.length == 2){
        cocosCfg = opts;
        opts = dir;
        dir = process.cwd();
    }
    projDir = core4cc.isAbsolute(dir) ? dir : path.join(process.cwd(), dir);
    genJsRes(projDir, {}, cocosCfg);
    genRes(projDir, {}, cocosCfg);
    genBaseJsList(projDir, {}, cocosCfg);
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

        genAllRes(opts, cocosCfg);
    });
};
module.exports = runPlugin;