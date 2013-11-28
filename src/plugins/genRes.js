var ResGen = require("../ResGen");

function gen(projDir, opts, cocosCfg){
    if(arguments.length == 2){
        cocosCfg = opts;
        opts = projDir;
        projDir = process.cwd();
    }
    //Config your resources directorys here.
    var cfg4Res = cocosCfg.genRes;
    var resGen = new ResGen(cfg4Res.dirCfgs, cfg4Res.output);
    resGen.fileTypes = cfg4Res.fileTypes;
    resGen.startStr = "var res = ";
    resGen.projDir = projDir;
    resGen.gen();
};
module.exports = gen;