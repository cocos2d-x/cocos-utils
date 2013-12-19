/**
 * Created by small on 13-11-15.
 */

var self = module.exports = {};
var path = require("path");
var core4cc = require("./core4cc");
var msgCode = require("../cfg/msgCode");

//const for key
var CONSTS = {
    F_VERSION : "version",
    F_HELP : "help",
    F_NEW : "new",
    F_BUILD : "build",
    F_PUBLISH : "publish",
    F_GEN_RES : "genRes",
    F_GEN_JS_RES : "genJsRes",
    F_GEN_BASE_CFG : "genBaseCfg",

    OPT_P : "-p",
    OPT_T : "-t",
    OPT_FULL : "-full",

    TEMP_NAME : "tempName",
    DIR : "dir",
    FULL : "full"
}


//function map
var funcMap = {};
funcMap[CONSTS.F_VERSION] = true;
funcMap[CONSTS.F_HELP] = true;
funcMap[CONSTS.F_NEW] = true;
funcMap[CONSTS.F_BUILD] = true;
funcMap[CONSTS.F_PUBLISH] = true;
funcMap[CONSTS.F_GEN_RES] = true;
funcMap[CONSTS.F_GEN_JS_RES] = true;
funcMap[CONSTS.F_GEN_BASE_CFG] = true;

//whether need to read config of cocos.json
var needToReadCfg = {};
needToReadCfg[CONSTS.F_BUILD] = true;
needToReadCfg[CONSTS.F_PUBLISH] = true;
needToReadCfg[CONSTS.F_GEN_RES] = true;
needToReadCfg[CONSTS.F_GEN_JS_RES] = true;
needToReadCfg[CONSTS.F_GEN_BASE_CFG] = true;

//config map. map command to the key of args
var cfgMap = {};
cfgMap
cfgMap[CONSTS.OPT_P] = {name : CONSTS.DIR};
cfgMap[CONSTS.OPT_T] = {name : CONSTS.TEMP_NAME};
cfgMap[CONSTS.OPT_FULL] = {name : CONSTS.FULL};

/**
 * Desc: validate the length of command.
 * @param command
 * @param value
 * @param args
 * @returns {*}
 */
function validLength(command, value, args){
    if(args.l == null) return null;
    var l = value.length;
    if(typeof args.l == "number"){
        return core4cc.assert(l == args.l, msgCode.CMD_LENGTH, {cmd : command, length : args.l});
    }
    var lArr = args.l.split(",");
    if(lArr.length == 1){
        core4cc.assert(l == lArr[0], msgCode.CMD_LENGTH, {cmd : command, length : lArr[0]});
    }else if(lArr.length > 1){
        core4cc.assert(l >= lArr[0] && l <=lArr[1], msgCode.CMD_LENGTH, {cmd : command, length : "[" + lArr[0] + "," + lArr[1] + "]"});
    }
};

//config for validation
var cfgValid = {};
cfgValid[CONSTS.F_NEW] = {func : validLength, args : {l : 1}};
cfgValid[CONSTS.F_BUILD] = {func : validLength, args : {l : "0,1"}};
cfgValid[CONSTS.F_PUBLISH] = {func : validLength, args : {l : "0,1"}};
cfgValid[CONSTS.F_GEN_RES] = {func : validLength, args : {l : "0,1"}};
cfgValid[CONSTS.F_GEN_JS_RES] = {func : validLength, args : {l : "0,1"}};
cfgValid[CONSTS.F_GEN_BASE_CFG] = {func : validLength, args : {l : "0,1"}};

cfgValid[CONSTS.DIR] = {func : validLength, args : {l : 1}};
cfgValid[CONSTS.TEMP_NAME] = {func : validLength, args : {l : 1}};
cfgValid[CONSTS.FULL] = {func : validLength, args : {l : 0}};

/**
 * Desc: validate command.
 * @param command
 * @param value
 * @returns {null}
 */
function valid(command, value){
    var cv = cfgValid[command];
    if(!cv) return null;
    cv.func(command, value, cv.args);
};

/**
 * Desc: Get options for command.
 * @returns {{name: *, args: Array}}
 */
self.getOpts = function(){
    var arr = process.argv.slice(2);
    core4cc.assert(arr.length > 0, msgCode.CMD_ARGS_ERR);
    var funcName = arr[0];//first element to be the plugin function name.
    core4cc.assert(funcMap[funcName], msgCode.FUNC_NOT_EXISTS, {func : funcName});

    var args4Func = [];
    var i = 1, li = arr.length
    for(; i < li; i++){
        var itemi = arr[i];
        if(cfgMap[itemi] == null) args4Func.push(itemi);
        else break;
    }//args 4 function ends

    valid(funcName, args4Func);
    var opts = {};
    var args = [];
    var name = null;
    //handle options
    for(; i < li; i++){
        var itemi = arr[i];
        if(cfgMap[itemi]){
            core4cc.assert(name || args.length == 0, msgCode.CMD_ERR);
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

    //options for the plugin function
    var opts4Func = {
        name : funcName,
        args : args4Func
    }
    return opts4Func;
};