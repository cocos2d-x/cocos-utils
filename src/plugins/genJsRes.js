var path = require("path");
var ResGen = require("../ResGen");

function gen(projDir, opts, cocosCfg){
    if(arguments.length == 2){
        cocosCfg = opts;
        opts = projDir;
        projDir = process.cwd();
    }
    var packageInfo = require(path.join(projDir, "package.json"));//读取模块package配置信息
    var cfg4JsRes = cocosCfg.genJsRes;
    var resGen = new ResGen(cfg4JsRes.dirCfgs, cfg4JsRes.output);
    resGen.fileTypes = cfg4JsRes.fileTypes;
    resGen.startStr = "var js = js || {};\r\njs." + packageInfo.name.replace(/-/g, "_") + " = ";
    resGen.projDir = projDir;
    resGen.resPre = "[%" + packageInfo.name + "%]"
    resGen.gen();
};
module.exports = gen;