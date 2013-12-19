var path = require("path");
var core4cc = require("../core4cc");
var fs = require("fs");
var msgCode = require("../../cfg/msgCode");
var consts = require("../../cfg/consts");

function runPlugin(dir, opts, cocosCfg){
    core4cc.log(msgCode.GENERATING, {target : "genBaseCfg"});
    if(arguments.length == 2){
        cocosCfg = opts;
        opts = dir;
        dir = process.cwd();
    }
    dir = core4cc.getStr4Cmd(dir);
    projDir = core4cc.isAbsolute(dir) ? dir : path.join(process.cwd(), dir);

    var cfgSearcher = require("../cfgSearcher");
    cfgSearcher.init(projDir, false);
    var arr = cfgSearcher.getBaseJsList();
    var content = "var " + consts.BASE_CFG + " = {\r\n";
    content += '    projName : "' + cfgSearcher.getProjName() + '",\r\n';
    content += '    resPath : "' + consts.RES_JS_PATH + '",\r\n';
    //modulesPathMap
    var modulePath2Html = cfgSearcher.modulePath2Html;
    content += "    " + consts.MODULES_PATH_MAP + " : {\r\n"
    for (var key in modulePath2Html) {
        content += '        "' + key + '" : "' + modulePath2Html[key] + '",\r\n';
    }
    if(content.substring(content.length-3, content.length-2) == ","){
        content = content.substring(0, content.length-3) + "\r\n";
    }
    content += "    },\r\n";
    //baseJsList
    content += "    " + consts.BASE_JS_LIST + " : [\r\n";
    for(var i = 0, li = arr.length; i < li; ++i){
        content += "        " + JSON.stringify(arr[i]);
        if(i < li - 1) content += ",\r\n";
        else content += "\r\n";
    }
    content += "    ]\r\n";
    content += "};"
    var baseResList = cfgSearcher.getBaseResList();
    var cfg = cocosCfg.genBaseCfg;
    var path4BaseJsList = path.join(projDir, cfg.output || consts.BASE_CFG_PATH);
    fs.writeFileSync(path4BaseJsList, content);
    core4cc.log(msgCode.SUCCESS_PATH, {path : path4BaseJsList});
//    if(cocosCfg.genBaseCfg && cocosCfg.genBaseCfg.delTemp) core4cc.rmdirRecursive(tempDir);
}
module.exports = runPlugin;