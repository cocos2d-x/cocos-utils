var path = require("path");
var ResGen = require("../ResGen");
var core4cc = require("../core4cc");

function runPlugin(projDir, opts, cocosCfg){
    console.log("res generating...");
    if(arguments.length == 2){
        cocosCfg = opts;
        opts = projDir;
        projDir = process.cwd();
    }
    projDir = core4cc.isAbsolute(projDir) ? projDir : path.join(process.cwd(), projDir);
    //Config your resources directorys here.
    var cfg4Res = cocosCfg.genRes;
    var resGen = new ResGen(cfg4Res.dirCfgs, cfg4Res.output);
    resGen.fileTypes = cfg4Res.fileTypes;
    resGen.startStr = "var res = ";
    resGen.projDir = projDir;
    resGen.gen();
};
module.exports = runPlugin;