var fs = require("fs");
var path = require("path");
var msgCode = require("../../cfg/msgCode");
var core4cc = require("../core4cc");
var OptCfg = require("../obj").OptCfg;
var PluginCfg = require("../obj").PluginCfg;
var consts = require("../../cfg/consts");


/**
 * Desc: common formatter
 * @param filePath
 * @param info
 */
function pubFrmt(filePath, info, cb){
    var content = fs.readFileSync(filePath).toString();
    content = content.replace(/\[\%name\%\]/g, info.name);
    content = content.replace(/\[\%emPath\%\]/g, info.emPath);
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
fileFrmt["cocos.json"] = pubFrmt;


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

var pluginCfg = new PluginCfg(consts.F_NEW, msgCode.DESC_NEW);
var dirOptCfg = new OptCfg(consts.OPT_P, msgCode.DESC_NEW_DIR);
var emOptCfg = new OptCfg(consts.OPT_EM, msgCode.DESC_NEW_ENGINE_MODULES);
var tempNameOptCfg = new OptCfg(consts.OPT_T, msgCode.DESC_NEW_TEMP_NAME);
pluginCfg.opts = [dirOptCfg, emOptCfg, tempNameOptCfg];

/**
 * Desc: Run plugin.
 * @param currDir
 * @param args
 * @param opts
 */
function run(currDir, args, opts){
    pluginCfg.valid(currDir, args, opts);
    var projName = args[0];
    var projDir = path.join(currDir, projName);
    var dir = opts[consts.OPT_P] ? opts[consts.OPT_P][0] : null;
    if(dir){
        if(core4cc.isAbsolute(dir)) projDir = path.join(dir, projName);
        else projDir = path.join(currDir, dir, projName);
    }
    var tempName = (opts[consts.OPT_T] ? opts[consts.OPT_T][0] : null) || consts.DEFAULT_PROJ_TEMP;
    var tempDir = path.join(__dirname, "../../templates", tempName, "./");
    core4cc.assert(fs.existsSync(tempDir), msgCode.TEMPLATE_NOT_EXISTS, {tempDir : tempDir});

    core4cc.assert(!fs.existsSync(projDir), msgCode.PROJ_EXISTS, {projDir : projDir});
    fs.mkdirSync(projDir);

    var projCocosPath = path.join(projDir, "cocos.json");
    var defCocos = require("../../cfg/cocos.json");
    var projCocos = fs.existsSync(projCocosPath) ? require(projCocosPath) : {};
    var pluginName = path.basename(__filename, ".js");
    var cfg = core4cc.mergeData(projCocos[pluginName] ,defCocos[pluginName]);

    var enginModues = (opts[consts.OPT_EM] ? opts[consts.OPT_EM][0] : null) || consts.DEFAULT_ENGINE_MODULES_PATH;

    opts.emPath = path.join(enginModues, "./").replace(/\\/g, "/");
    opts.ccDir = path.join(enginModues, "cocos2d-html5", "./").replace(/\\/g, "/");
    opts.name = projName.toLowerCase();
    _copyFiles(tempDir, projDir, opts);

    core4cc.log(msgCode.SUCCESS);
};

exports.run = run;
exports.cfg = pluginCfg;