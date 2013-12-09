/**
 * Created by small on 13-11-15.
 */

var self = module.exports = {};
var path = require("path");

//const for key
var CONSTS = {
    F_NEW : "new",
    F_INSTALL : "install",
    F_PUBLISH : "publish",
    F_GEN_RES : "genRes",
    F_GEN_JS_RES : "genJsRes",
    F_GEN_BASE_JS_LIST : "genBaseJsList",

    C_DIR : "-dir",
    C_TN : "-tn",
    C_FULL : "-full",

    TEMP_NAME : "tempName",
    DIR : "dir",
    FULL : "full"
}
var funcMap = {};
funcMap[CONSTS.F_NEW] = true;
funcMap[CONSTS.F_INSTALL] = true;
funcMap[CONSTS.F_PUBLISH] = true;
funcMap[CONSTS.F_GEN_RES] = true;
funcMap[CONSTS.F_GEN_JS_RES] = true;
funcMap[CONSTS.F_GEN_BASE_JS_LIST] = true;

var needToReadCfg = {};
needToReadCfg[CONSTS.F_INSTALL] = true;
needToReadCfg[CONSTS.F_PUBLISH] = true;
needToReadCfg[CONSTS.F_GEN_RES] = true;
needToReadCfg[CONSTS.F_GEN_JS_RES] = true;
needToReadCfg[CONSTS.F_GEN_BASE_JS_LIST] = true;

//config map
var cfgMap = {};
cfgMap[CONSTS.C_DIR] = {name : CONSTS.DIR};
cfgMap[CONSTS.C_TN] = {name : CONSTS.TEMP_NAME};
cfgMap[CONSTS.C_FULL] = {name : CONSTS.FULL};

function validLength(command, value, args){
    if(args.l == null) return null;
    var l = value.length;
    if(typeof args.l == "number"){
        if(l != args.l) return "length of arguments for " + command + "should be " + args.l;
        return null;
    }
    var lArr = args.l.split(",");
    if(lArr.length == 0){
        if(l != lArr[0]) return "length of arguments for " + command + "should be " + lArr[0];
        return null;
    }else if(lArr.length > 1){
        if(l < lArr[0] || l > lArr[1]) return "length of arguments for " + command + "should be [" + lArr[0] + "," + lArr[1] + "]";
    }
    return null;
};

var cfgValid = {};
cfgValid[CONSTS.F_NEW] = {func : validLength, args : {l : 1}};
cfgValid[CONSTS.F_INSTALL] = {func : validLength, args : {l : "0,1"}};
cfgValid[CONSTS.F_PUBLISH] = {func : validLength, args : {l : "0,1"}};
cfgValid[CONSTS.F_GEN_RES] = {func : validLength, args : {l : "0,1"}};
cfgValid[CONSTS.F_GEN_JS_RES] = {func : validLength, args : {l : "0,1"}};
cfgValid[CONSTS.F_GEN_BASE_JS_LIST] = {func : validLength, args : {l : "0,1"}};

cfgValid[CONSTS.DIR] = {func : validLength, args : {l : 1}};
cfgValid[CONSTS.TEMP_NAME] = {func : validLength, args : {l : 1}};
cfgValid[CONSTS.FULL] = {func : validLength, args : {l : 0}};

function valid(command, value){
    var cv = cfgValid[command];
    if(!cv) return null;
    var result = cv.func(command, value, cv.args);
    if(result) throw result;
};

/**
 * Get options for command.
 * @returns {{name: *, args: Array}}
 */
self.getOpts = function(){
    var arr = process.argv.slice(2);
    if(arr.length == 0) throw "args error!";
    var funcName = arr[0];//first element to be the plugin function name.
    if(funcMap[funcName] == null) throw "function [" + funcName + "] not exists!"

    var args4Func = [];
    var i = 1, li = arr.length
    for(; i < li; i++){
        var itemi = arr[i];
        if(cfgMap[itemi] == null) args4Func.push(itemi);
        else break;
    }

    valid(funcName, args4Func);
    var opts = {};
    var args = [];
    var name = null;
    for(; i < li; i++){
        var itemi = arr[i];
        if(cfgMap[itemi]){
            if(name == null && args.length > 0) throw "command error!";
            if(name == null) {//name has not been set.
                name = cfgMap[itemi].name;
                continue;
            }
            valid(name, args);
            opts[name] = args;
            name = cfgMap[itemi].name;
            args = [];
            continue;
        }else{
            args.push(arr[i]);
        }
    }

    valid(name, args);
    if(name) opts[name] = args;//add the latest

    opts[CONSTS.TEMP_NAME] = opts[CONSTS.TEMP_NAME] || ["project"];

    opts[CONSTS.TEMP_NAME] = opts[CONSTS.TEMP_NAME][0];
    opts[CONSTS.DIR] = opts[CONSTS.DIR] ? opts[CONSTS.DIR][0] : null;
    args4Func.push(opts);

    if(needToReadCfg[funcName]){//need to read cocos.json
        var projDir = process.cwd();//the dir to run command must be the project dir.
        try{
            var cocosCfg = require(path.join(projDir, "cocos.json"));
            args4Func.push(cocosCfg);
        }catch(e){
            var cocosCfg = require("../cfg/cocos.json");
            args4Func.push(cocosCfg);
        }
    }else{
        args4Func.push({});
    }
    var opts4Func = {
        name : funcName,
        args : args4Func
    }
    return opts4Func;
};