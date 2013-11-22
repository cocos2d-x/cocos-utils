/**
 * Created by small on 13-11-15.
 */

var self = module.exports = {};
self.TYPE_FUNC = "func";
self.TYPE_STRING = "string";
self.TYPE_INT = "int";

var funcMap = {
    "init" : 1,
    "publish" : 1,
    "genJsRes" : 1,
    "genRes" : 1
};
//const for key
var KEY = {
    TEMP_NAME : "tempName",
    DIR : "dir"
}
//config map
var cfgMap = {
    "-dir" : {name : KEY.DIR},
    "-tn" : {name : KEY.TEMP_NAME}
};

/**
 * Get options for command.
 * @returns {{name: *, args: Array}}
 */
self.getOpts = function(){
    var arr = process.argv.slice(2);
    if(arr.length == 0) throw "args error!";
    var funcName = arr[0];//first element to be the plugin function name.
    if(funcMap[funcName] == null) throw "function [" + funcName + "] not exists!"

    var args4Func = [];
    var i = 1, li = arr.length
    for(; i < li; i++){
        var itemi = arr[i].toLowerCase();;
        if(cfgMap[itemi] == null) args4Func.push(itemi);
        else break;
    }
    var opts = {};
    var args = [];
    var name = null;
    for(; i < li; i++){
        var itemi = arr[i].toLowerCase();
        if(cfgMap[itemi]){
            if(name == null && args.length > 0) throw "command error!";
            if(name == null) {//name has not been set.
                name = cfgMap[itemi].name;
                continue;
            }
            opts[name] = args;
            name = cfgMap[itemi].name;
            args = [];
            continue;
        }else{
            args.push(arr[i]);
        }
    }

    if(name) opts[name] = args;//add the latest

    opts[KEY.TEMP_NAME] = opts[KEY.TEMP_NAME] || ["project"];
    opts[KEY.CC_DIR] = opts[KEY.CC_DIR] || ["cocos"]

    opts[KEY.TEMP_NAME] = opts[KEY.TEMP_NAME][0];
    opts[KEY.CC_DIR] = opts[KEY.CC_DIR][0];
    opts[KEY.DIR] = opts[KEY.DIR] ? opts[KEY.DIR][0] : null;
    args4Func.push(opts);
    var opts4Func = {
        name : funcName,
        args : args4Func
    }
    return opts4Func;
};