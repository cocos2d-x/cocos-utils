var PluginCfg = require("../obj/PluginCfg");
var path = require("path");
var fs = require("fs");
var ResGen = require("../core/ResGen");
var core4cc = require("../core/core4cc");
var msgCode = require("../../cfg/msgCode");
var consts = require("../../cfg/consts");

var pluginCfg = new PluginCfg(consts.F_GEN_JS_RES, msgCode.DESC_GEN_JS_RES, {length : "0,1"});

/**
 * Desc: Run plugin.
 * @param currDir
 * @param args
 * @param opts
 */
function run(currDir, args, opts){
    pluginCfg.valid(currDir, args, opts);
    var projDir = currDir;
    if(args.length > 0){
        var str = args[0];
        projDir = core4cc.isAbsolute(str) ? str : path.join(currDir, str);
    }
    core4cc.log(msgCode.GENERATING, {target : "jsRes"});

    var projCocosPath = path.join(projDir, "cocos.json");
    var defCocos = require("../../cfg/cocos.json");
    var projCocos = fs.existsSync(projCocosPath) ? require(projCocosPath) : {};
    var pkgJson = require(path.join(projDir, "package.json"));
    var pluginName = path.basename(__filename, ".js");
    var cfg = core4cc.mergeData(projCocos[pluginName] ,defCocos[pluginName]);

    var resGen = new ResGen(cfg.dirCfgs, cfg.output);
    resGen.fileTypes = cfg.fileTypes;
    resGen.startStr = "var js = js || {};\r\njs." + pkgJson.name.replace(/-/g, "_") + " = ";
    resGen.projDir = projDir;
    resGen.resPre = "[%" + pkgJson.name + "%]"
    resGen.gen();
};
exports.run = run;
exports.cfg = pluginCfg;