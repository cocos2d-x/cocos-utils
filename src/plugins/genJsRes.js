var path = require("path");
var ResGen = require("../ResGen");
var core4cc = require("../core4cc");
var msgCode = require("../../cfg/msgCode");

function runPlugin(projDir, opts, cocosCfg){
    core4cc.log(msgCode.GENERATING, {target : "jsRes"});
    if(arguments.length == 2){
        cocosCfg = opts;
        opts = projDir;
        projDir = process.cwd();
    }
    projDir = core4cc.getStr4Cmd(projDir);
    projDir = core4cc.isAbsolute(projDir) ? projDir : path.join(process.cwd(), projDir);
    var packageInfo = require(path.join(projDir, "package.json"));//读取模块package配置信息
    var cfg4JsRes = cocosCfg.genJsRes;
    var resGen = new ResGen(cfg4JsRes.dirCfgs, cfg4JsRes.output);
    resGen.fileTypes = cfg4JsRes.fileTypes;
    resGen.startStr = "var js = js || {};\r\njs." + packageInfo.name.replace(/-/g, "_") + " = ";
    resGen.projDir = projDir;
    resGen.resPre = "[%" + packageInfo.name + "%]"
    resGen.gen();
};
module.exports = runPlugin;