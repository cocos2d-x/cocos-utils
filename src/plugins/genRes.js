var fs = require("fs");
var path = require("path");
var ResGen = require("../ResGen");
var cfg = require("../../cfg/cfg");

function gen(projDir, opts){
    if(arguments.length == 1){
        opts = projDir;
        projDir = process.cwd();
    }
    //Config your resources directorys here.
    var cfg4Res = cfg.genRes;
    var resGen = new ResGen(cfg4Res.dirCfgs, cfg4Res.output);
    resGen.fileTypes = cfg4Res.fileTypes;
    resGen.startStr = "var res = ";
    resGen.projDir = projDir;
    resGen.gen();
};
module.exports = gen;