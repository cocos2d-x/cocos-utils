var PluginCfg = require("../obj/PluginCfg");
var OptCfg = require("../obj/OptCfg");
var path = require("path");
var fs = require("fs");
var ResGen = require("../core/ResGen");
var core4cc = require("../core/core4cc");
var msgCode = require("../../cfg/msgCode");
var consts = require("../../cfg/consts");

var pluginCfg = new PluginCfg(consts.F_GEN_RES, msgCode.DESC_GEN_RES, {length : "0,1"});
var dirCfgOptCfg = new OptCfg(consts.OPT_DC, msgCode.DESC_OPT_DIR_CFGS, {length : "+"});
var outputOptCfg = new OptCfg(consts.OPT_O, msgCode.DESC_OPT_O);
pluginCfg.opts = [dirCfgOptCfg, outputOptCfg];

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
    core4cc.log(msgCode.GENERATING, {target : "res"});

    var projCocosPath = path.join(projDir, "cocos.json");
    var defCocos = require("../../cfg/cocos.json");
    var projCocos = fs.existsSync(projCocosPath) ? require(projCocosPath) : {};
    var pluginName = path.basename(__filename, ".js");
    var cfg = core4cc.mergeData(projCocos[pluginName] ,defCocos[pluginName]);

    var output = opts[consts.OPT_O] ? opts[consts.OPT_O][0] : cfg.output;

    var resGen = new ResGen(opts[consts.OPT_DC] || cfg.dirCfgs, output);
    resGen.fileTypes = cfg.fileTypes;
    resGen.startStr = "var res = ";
    resGen.projDir = projDir;
    resGen.gen();
};
exports.run = run;
exports.cfg = pluginCfg;