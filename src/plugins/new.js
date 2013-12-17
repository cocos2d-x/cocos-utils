var fs = require("fs");
var path = require("path");
var msgCode = require("../../cfg/msgCode");
var core4cc = require("../core4cc");

/**
 * Desc: common formatter
 * @param filePath
 * @param info
 */
function pubFrmt(filePath, info, cb){
    var content = fs.readFileSync(filePath).toString();
    content = content.replace(/\[\%name\%\]/g, info.name);
    content = content.replace(/\[\%ccDir\%\]/g, info.ccDir);
    fs.writeFileSync(filePath, content);
    if(cb) cb();
}
/**
 * package formatter.
 * @param filePath
 * @param info
 * @param cb
 */
function packageFrmt(filePath, info, cb){
    var content = fs.readFileSync(filePath).toString();
    content = content.replace(/\[\%name\%\]/g, info.name);
    var fullDepArr = [//full modules
        "cocos2d-html5", "ccaction3d", "ccanimation", "ccbase64toimg", "ccbox2d", "ccchipmunk", "cccliping",
        "cceditbox", "cceffects", "ccinput", "cclabelbmfont", "ccmotionstreak", "ccnotificationcenter", "ccparallax",
        "ccparticle", "ccphysics", "ccpluginx", "ccscrollview", "cctgalib", "cctilemap", "cctransition",
        "ccuserdefault", "ccziputils", "cocosbuilder", "cocosdenshion", "cocoslog", "cocostudio"
    ];
    var dependenciesStr = '"cocos2d-html5" : "*"';//core module
    if(info.full != null){
        dependenciesStr = "";
        for(var i = 0, li = fullDepArr.length; i < li; ++i){
            dependenciesStr += '"' + fullDepArr[i] + '" : "*"';
            if(i < li - 1) dependenciesStr += ",\r\n";
            else dependenciesStr += "\r\n";
            dependenciesStr += "        ";
        }
    }
    content = content.replace(/\[\%dependencies\%\]/g, dependenciesStr);
    fs.writeFileSync(filePath, content);
    if(cb) cb();
}

//file formatter config.
var fileFrmt = {};
fileFrmt["index.html"] = pubFrmt;
fileFrmt["release.html"] = pubFrmt;
fileFrmt["resCfg.js"] = pubFrmt;
fileFrmt["main.js"] = pubFrmt;
fileFrmt["jsRes.js"] = pubFrmt;
fileFrmt["cocos2d.js"] = pubFrmt;


fileFrmt["package.json"] = packageFrmt;

/**
 * Desc: Copy files in srcDir to targetDir, then replace info by config.
 * @param srcDir
 * @param targetDir
 * @param opts
 * @private
 */
function _copyFiles(srcDir, targetDir, opts){
    var files = fs.readdirSync(srcDir);
    for(var i = 0, li = files.length; i < li; i++){
        var file = files[i];
        if(fs.statSync(path.join(srcDir, file)).isDirectory()){//make dir if it`s a dir
            var dir = path.join(targetDir, file + "/");
            fs.mkdirSync(dir);
            _copyFiles(path.join(srcDir, file + "/"), dir, opts);//goes on
        }else{
            var filePath = path.join(targetDir, file);
            fs.writeFileSync(filePath, fs.readFileSync(path.join(srcDir, file)));//copy if it`s a file
            if(fileFrmt[file]) {
                fileFrmt[file](filePath, opts);
            }
        }
    }
}

/**
 * Desc: Run plugin.
 * @param projName
 * @param opts
 * @returns {*}
 */
function runPlugin(projName, opts, cocosCfg){
    var tempDir = path.join(__dirname, "../../templates/", opts.tempName + "/");
    core4cc.assert(fs.existsSync(tempDir), msgCode.TEMPLATE_NOT_EXISTS, {tempDir : tempDir});

    var projDir = path.join("./", opts.dir || projName);
    core4cc.assert(!fs.existsSync(projDir), msgCode.PROJ_EXISTS, {projDir : projDir});
    fs.mkdirSync(projDir);
    opts.ccDir = "node_modules/cocos2d-html5/";
    opts.name = projName.toLowerCase();
    _copyFiles(tempDir, projDir, opts);

    console.log(core4cc.getMsg(msgCode.SUCCESS));
};


module.exports = runPlugin;