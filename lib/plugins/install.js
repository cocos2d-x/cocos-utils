var PluginCfg = require("../obj/PluginCfg");
var path = require("path");
var fs = require("fs");
var core4cc = require("../core/core4cc");
var msgCode = require("../../cfg/msgCode");
var consts = require("../../cfg/consts");

var pluginCfg = new PluginCfg(consts.F_INSTALL, msgCode.DESC_INSTALL, {length : "0,1"});
var exec = require("child_process").exec;

/**
 * Desc: Run plugin.
 * @param currDir
 * @param args
 * @param opts
 */
function run(currDir, args, opts){
    pluginCfg.valid(currDir, args, opts);
    var nmPath =currDir;
    if(args.length == 1){
        if(core4cc.isAbsolute(args[0])) nmPath = args[0];
        else nmPath = path.join(currDir, args[0]);
    }
    nmPath = path.join(currDir, "node_modules");
    core4cc.log(msgCode.INSTALLING);
    var pckPath = path.join(currDir, "package.json");
    if(!fs.existsSync(pckPath)){
        var content = fs.readFileSync(path.join(__dirname, "../../", consts.TEMP_INSTALL_PACKAGE_PATH)).toString();
        content = content.replace(/\[\%name\%\]/g, path.basename(currDir).toLowerCase());
        fs.writeFileSync(pckPath, content);
    }
    exec("npm install cocos2d-html5", function(err, stdout, stderr){
        if(stderr) console.log(stderr);
        if(stdout) console.log(stdout);
        if(err) return console.log(err);
        var coreCocos = require(path.join(nmPath, "cocos2d-html5/cocos.json"));
        var modules = coreCocos.modules || [];
        for(var i = 0, li = modules.length; i < li; i++){
            exec("npm install " + modules[i], function(err1, stdout1, stderr1){
                console.log(stderr1);
                console.log(stdout1);
                if(err1) return console.error(err1);
            });
        }
    })
};
exports.run = run;
exports.cfg = pluginCfg;