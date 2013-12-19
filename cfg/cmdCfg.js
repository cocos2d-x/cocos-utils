var consts = require("./consts");
var msgCode = require("./msgCode");

/**
 * Desc: desc for opt.
 * @param opts
 * @param name
 * @param descs
 * @param validData
 * @constructor
 */
function OptCfg(opts, name, descs, validData){
    this.opts = opts || [];
    this.name = name || "";
    this.descs = descs || "";
    this.validData = validData || {l : 1};
    this.valids = [];
}

function FuncCfg(name, descs, needsCfg, validData){
    this.name = name;
    this.needsCfg = needsCfg || false;
    this.validData = validData || {l : 1};
    this.valids = [];
    this.descs = descs || [];
    this.opts = [];
};


var fVersion = new FuncCfg(consts.F_VERSION, msgCode.DESC_VERSION);

var fHelp = new FuncCfg(consts.F_HELP, msgCode.DESC_HELP);

var fNew = new FuncCfg(consts.F_NEW, msgCode.DESC_NEW);
var fNew_dir = new OptCfg([consts.OPT_P], consts.DIR, msgCode.DESC_NEW_DIR);
var fNew_tempName = new OptCfg([consts.OPT_T], consts.TEMP_NAME, msgCode.DESC_NEW_TEMP_NAME);
fNew.opts = [fNew_dir, fNew_tempName];

var fBuild = new FuncCfg(consts.F_BUILD, msgCode.DESC_BUILD, true, {l : "0,1"});

var fPublish = new FuncCfg(consts.F_PUBLISH, msgCode.DESC_PUBLISH, true, {l : "0,1"});

var fGenRes = new FuncCfg(consts.F_GEN_RES, msgCode.DESC_GEN_RES, true, {l : "0,1"});

var fGenJsRes = new FuncCfg(consts.F_GEN_JS_RES, msgCode.DESC_GEN_JS_RES, true, {l : "0,1"});

var fGenBaseCfg = new FuncCfg(consts.F_GEN_BASE_CFG, msgCode.DESC_GEN_BASE_CFG, true, {l : "0,1"});


var pluginCfg = {};

pluginCfg[fVersion.name] = fVersion;
pluginCfg[fHelp.name] = fHelp;
pluginCfg[fNew.name] = fNew;
pluginCfg[fBuild.name] = fBuild;
pluginCfg[fPublish.name] = fPublish;
pluginCfg[fGenRes.name] = fGenRes;
pluginCfg[fGenJsRes.name] = fGenJsRes;
pluginCfg[fGenBaseCfg.name] = fGenBaseCfg;

function getPluginCfg(funcName){
    var cfg = pluginCfg[funcName];
    return cfg;
}

exports.pluginCfg = pluginCfg;
exports.getPluginCfg = getPluginCfg;