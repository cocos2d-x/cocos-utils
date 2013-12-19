var cmdCfg = require("../../cfg/cmdCfg");

var blank1 = "                ";
var blank2 = "                ";

/**
 * Desc: Run plugin.
 * @param projName
 * @param opts
 * @param cocosCfg
 */
function runPlugin(projName, opts, cocosCfg){
    var pluginCfg = cmdCfg.pluginCfg;
    for (var key in pluginCfg) {
        var cfg = pluginCfg[key];
        var str1 = "\033[1;36;1m" + key + "\033[0m";
        str1 += blank1.substring(key.length);
        var descs = cfg.descs;
        for(var i = 0, li = descs.length; i < li; i++){
            var desc = descs[i];
            var c = i == 0 ? str1 : blank1;
            c += blank2 + desc;
            console.log(c);
        }
        console.log();
        var opts = cfg.opts;
        for(var i = 0, li = opts.length; i < li; i++){
            var opt = opts[i];
            var os = opt.opts;
            var descs = opt.descs;
            var lj = Math.max(os.length, descs.length);
            for(var j = 0; j < lj; j++){
                var c = blank1 + blank2;
                if(j < os.length){
                    c = blank1 + "\033[1;32;1m" + os[j] + "\033[0m" + blank2.substring(os[j].length);
                }
                c += descs[j] || "";
                console.log(c);
            }
            console.log();
        }
        console.log(blank1 + "--------------------------------------------------");
    }
};

module.exports = runPlugin;