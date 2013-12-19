/**
 * Created by small on 13-11-14.
 */

var path = require("path");
var core4cc = require("./../core4cc.js");
var exec = require('child_process').exec;
var fs = require("fs");
var delCode = require("../delCode");
var msgCode = require("../../cfg/msgCode");

var cfgDir = "cfg";
var projName, projDir, modulesDir, tempDir, resCfg, publishJs;
var jsCache = {};
var jsIgnoreMap = {
};
var mergeCache4Dependencies = {};

/**
 * Desc: merge base js list of dependencies to a single one.
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
        jsToMergeArr.push(path.join(modulesDir, moduleName, cfgDir, "jsRes.js"));
        jsToMergeArr.push(path.join(modulesDir, moduleName, cfgDir, "resCfg.js"));
    }
}

/**
 * Desc: Create temp.
 */
function createTemp(){
    if(!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

    var jsToMergeArr = [];
    jsToMergeArr.push(path.join(projDir, cfgDir, "res.js"));
    mergeDependencies(core4cc.getDependencies(packageInfo.dependencies), jsToMergeArr);

    jsToMergeArr.push(path.join(projDir, cfgDir, "jsRes.js"));
    jsToMergeArr.push(path.join(projDir, cfgDir, "resCfg.js"));
    core4cc.merge2Module(jsToMergeArr, path.join(tempDir, "resCfg.js"), [], "resCfg");
};

/**
 * Desc: get resources by dependencies
 * @param resCfg
 * @param cfgName
 * @param result
 * @returns {Array|*}
 */
function getLoadRes(resCfg, cfgName, result){
    result = result || [];
    var cfg = resCfg[cfgName];
    if(cfg){
        if(cfg.ref){
            for(var i = 0, li = cfg.ref.length; i < li; i++){
                var itemi = cfg.ref[i];
                getLoadRes(resCfg, itemi, result);
            }
        }
        if(cfg.res){
            for(var i = 0, li = cfg.res.length; i < li; i++){
                var itemi = cfg.res[i];
                result.push(itemi);
            }
        }
    };
    return result;
}
/**
 * Desc: Create resCfg for publishing.
 * @param resCfg
 */
function createResCfg4Publish(resCfg){
    var content = "";
    var jsResTemp = {};
    for(var i = 0, li = resCfg.gameModules.length; i < li; i++){
        var itemi = resCfg.gameModules[i];
        var results = itemi.match(/\[\%[\w_\d\-]+\%\]/);
        var moduleName = results[0].substring(2, results[0].length - 2);
        var map = jsResTemp[moduleName];
        if(!map) {
            map = jsResTemp[moduleName] = [];
        }
        map.push(core4cc.getKeyName(path.basename(itemi)));
    }
    var jsResCount = 0;
    for (var key in jsResTemp) {
        if(!key) continue;
        var arr = jsResTemp[key];
        if(!arr) continue;
        content += "js." + key + "={";
        for(var i = 0, li = arr.length; i < li; i++){
            content += arr[i] + ":'_" + jsResCount + "'";
            if(i < li - 1) content += ",";
            jsResCount++;
        }
        content += "};\r\n";
    }
    content += "cc.res4GameModules = {};\r\n";
    for(var i = 0, li = resCfg.gameModules.length; i < li; i++){
        var itemi = resCfg.gameModules[i];
        var result = getLoadRes(resCfg, itemi);
        var results = itemi.match(/\[\%[\w_\d]+\%\]/);
        var moduleName = results[0].substring(2, results[0].length - 2);
        content += "cc.res4GameModules[js." + moduleName + "." + core4cc.getKeyName(path.basename(itemi)) + "]=[\r\n";
        for(var j = 0, lj = result.length; j < lj; j++){
            var itemj = result[j];
            content += "res." + core4cc.getKeyName(path.basename((itemj)));
            if(j < lj - 1) content += ","
            content += "\r\n"
        }
        content += "]\r\n";
    }
    fs.writeFileSync(path.join(tempDir, "resCfg4Publish.js"), content);
};

/**
 * Desc: Load resource config.
 * @param cfgName
 * @param jsArr
 */
function loadResCfg(cfgName, jsArr){
    if(jsCache[cfgName]) return;
    var cfg = resCfg[cfgName];
    if(cfg && cfg.ref){
        for(var i = 0, li = cfg.ref.length; i < li; i++){
            var itemi = cfg.ref[i];
            loadResCfg(itemi, jsArr);
        }
    }
    if(typeof  cfgName == "string" && cfgName.length > 3 && cfgName.indexOf(".js") == cfgName.length - 3){
        if(jsArr.indexOf(cfgName) < 0) jsArr.push(cfgName);
    }
    jsCache[cfgName] = true;
}

/**
 * Desc: Load base for modules.
 * @param dependencies
 * @param jsArr
 */
function loadModuleBase(dependencies, jsArr){
    for(var i = 0, li = dependencies.length; i < li; i++){
        var itemi = dependencies[i];
        var moduleName = itemi.name;
        var pInfo = require(path.join(modulesDir, moduleName, "package.json"));
        loadModuleBase(core4cc.getDependencies(pInfo.dependencies), jsArr);
        loadResCfg(moduleName, jsArr);
    }
}

/**
 * Desc: Load game modules.
 * @param gameModules
 * @param jsArr
 */
function loadGameModules(gameModules, jsArr){
    for(var i = 0, li = gameModules.length; i < li; i++){
        var itemi = gameModules[i];
        loadResCfg(itemi, jsArr);
    }
};

/**
 * Desc: Get js list for publishing.
 * @returns {Array}
 */
function getJsArr(){
    var jsArr = [];
    jsArr.push('[%' + projName + '%]/cfg/res.js');
    jsArr.push(path.join("[%cocos2d-html5%]/src/cc4publish.js"));
    jsArr.push(path.join(tempDir, "resCfg4Publish.js"));
    loadModuleBase(core4cc.getDependencies(packageInfo.dependencies), jsArr);//current dependencies
    loadResCfg(projName, jsArr);//base for project
    loadGameModules(resCfg.gameModules, jsArr);//game modules
    jsArr.push('[%' + projName + '%]/projects/proj.html5/main.js');
    return jsArr;
};


/**
 * Desc: Build.
 * @param jsArr
 */
function build(jsArr, cb){
    var buildDir = path.join(tempDir, "build");
    if(fs.existsSync(buildDir)) core4cc.rmdirRecursive(buildDir);
    fs.mkdirSync(buildDir);
    var jsListStr = "";
    for(var i = 0, li = jsArr.length; i < li; i++){
        var itemi = jsArr[i];
        if(jsIgnoreMap[itemi]) continue;//ignore current js
        var results = itemi.match(/\[\%[\w_\d\-]+\%\]/);
        var moduleName = "_";
        if(results && results.length > 0){//replace width module path
            moduleName = results[0].substring(2, results[0].length - 2);
            var dir = moduleName == projName ? projDir : path.join(modulesDir, moduleName);
            dir = path.normalize(dir + "/");
            itemi = itemi.replace(/\[\%[\w_\d\-]+\%\]/, dir);
        }
        if(cfg4Publish.delLog){//to delete log
            var tempFile = path.join(buildDir , moduleName + "_" + path.basename(itemi));
            delCode(path.normalize(itemi), tempFile);//src file to temp file
            itemi = tempFile;
        }
        var str = path.relative(projDir, itemi).replace(/\\/g, "/");
        jsListStr += '<file name="' + str + '"></file>\r\n                ';
    }

    //generate build.xml by template.
    var buildStr = fs.readFileSync(path.join(__dirname, "../temp/build.xml")).toString();
    buildStr = buildStr.replace(/\[\%projDir\%\]/g, projDir.replace(/\\/g, "/"));
    buildStr = buildStr.replace(/\[\%utilsDir\%\]/g, path.join(__dirname, "../../").replace(/\\/g, "/"));
    buildStr = buildStr.replace(/\[\%jsList\%\]/g, jsListStr.replace(/\\/g, "/"));
    buildStr = buildStr.replace(/\[\%output\%\]/g, path.join(projDir, cfg4Publish.output).replace(/\\/g, "/"));
    buildStr = buildStr.replace(/\[\%compilationLevel\%\]/g, cfg4Publish.compilationLevel);
    buildStr = buildStr.replace(/\[\%warning\%\]/g, cfg4Publish.warning);
    buildStr = buildStr.replace(/\[\%debug\%\]/g, cfg4Publish.debug);
    var buildPath = path.join(projDir, path.dirname(cfg4Publish.output));

    fs.writeFileSync(path.join(buildPath, "build.xml"), buildStr);
    exec("cd " + buildPath + " && ant", function(err, data, info){
        console.log(data);
        if(err) {
            console.error(err);
            core4cc.assert(false, msgCode.PUBLISH_FAILED);
        }
        cb(err);
    });
}

/**
 * Desc: Run plugin.
 * @param dir
 * @param opts
 * @param cocosCfg
 */
function runPlugin(dir, opts, cocosCfg){
    core4cc.log(msgCode.PUBLISHING);
    if(arguments.length == 2){
        cocosCfg = opts;
        opts = dir;
        dir = process.cwd();//dir of project
    }
    dir = core4cc.getStr4Cmd(dir);
    projDir = core4cc.isAbsolute(dir) ? dir : path.join(process.cwd(), dir);
    cfg4Publish = cocosCfg.publish;
    //init base path of project
    packageInfo = require(path.join(projDir, "package.json"));//get package config of project
    modulesDir = path.join(projDir, "node_modules/");
    tempDir = path.join(projDir, "temp4Publish");

    projName = packageInfo.name;
    publishJs = path.join(projDir, cfg4Publish.output);//js path for publishing
    if(fs.existsSync(publishJs)) fs.unlinkSync(publishJs);

    createTemp();//create temp dir
    resCfg = require(path.join(tempDir, "resCfg.js"));//get resources config
    createResCfg4Publish(resCfg);//create resCfg.js for publishing

    var jsArr = getJsArr();//get js array for publishing

    build(jsArr, function(err){
        if(cfg4Publish.delTemp) core4cc.rmdirRecursive(tempDir);
    });
};

module.exports = runPlugin;