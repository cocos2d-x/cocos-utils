var path = require("path");
var core4cc = require("../core4cc");
var genJsRes = require("./genJsRes");
var genRes = require("./genRes");
var genBaseCfg = require("./genBaseCfg");
var msgCode = require("../../cfg/msgCode");

/**
 * Desc: Run plugin.
 * @param dir
 * @param opts
 * @param cocosCfg
 */
function runPlugin(dir, opts, cocosCfg){
    core4cc.log(msgCode.BUILDING);
    if(arguments.length == 2){
        cocosCfg = opts;
        opts = dir;
        dir = process.cwd();
    }
    dir = core4cc.getStr4Cmd(dir);
    projDir = core4cc.isAbsolute(dir) ? dir : path.join(process.cwd(), dir);
    genJsRes(projDir, {}, cocosCfg);
    genRes(projDir, {}, cocosCfg);
    genBaseCfg(projDir, {}, cocosCfg);
};
module.exports = runPlugin;