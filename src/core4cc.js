/**
 * Created with JetBrains WebStorm.
 * User: Administrator
 * Date: 13-10-13
 * Time: 下午8:06
 * To change this template use File | Settings | File Templates.
 */

var fs = require("fs");
var path = require("path");
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;
var url = require('url');
var msgCode = require("../cfg/msgCode");

var core4cc = {};
module.exports = core4cc;

/**
 * Desc:将前端的js代码转换成nodejs可用模块。
 * @param src               前端js文件
 * @param targetDir         目标模块目录
 * @param requireArr        模块文件的依赖
 * @param name
 */
core4cc.trans2Module = function(src, targetDir, requireArr, name){
    if(!fs.existsSync(targetDir)) fs.mkdirSync(targetDir);
    var srcBaseName = path.basename(src);
    name = name || path.basename(src, ".js");
    var content = fs.readFileSync(src).toString();
    var requireStr = "";
    for(var i = 0, li = requireArr.length; i < li; ++i){
        var strs = requireArr[i].split("->");
        requireStr = requireStr + "var " + strs[0] + " = require('" + strs[1] + "');\r\n";
    }
    fs.writeFileSync(targetDir + srcBaseName, requireStr + content + "\r\nmodule.exports = " + name + ";");
};

/**
 * Desc:将多个前端的js代码合并并且转换成nodejs可用的模块。
 * @param srcs          前端js列表
 * @param target        目标模块文件
 * @param requireArr    模块文件的依赖
 * @param name
 */
core4cc.merge2Module = function(srcs, target, requireArr, name){
    var targetDir = path.dirname(target);
    if(!fs.existsSync(targetDir)) fs.mkdirSync(targetDir);
    var content = "";
    for(var i = 0, li = srcs.length; i < li; ++i){
        content += fs.readFileSync(srcs[i]).toString() + "\r\n";
    }
    var requireStr = "";
    for(var i = 0, li = requireArr.length; i < li; ++i){
        var strs = requireArr[i].split("->");
        requireStr = requireStr + "var " + strs[0] + " = require('" + strs[1] + "');\r\n";
    }
    fs.writeFileSync(target, requireStr + content + "\r\nmodule.exports = " + name + ";");
};

/**
 * dESC: Get key name by the file name.
 * @param name
 * @returns {String}
 */
core4cc.getKeyName = function(name){
    var key = name.replace(/[.]/g, "_");
    key = key.replace(/[\-\(\)]/g, "_");
    var r = key.match(/^[0-9]/);
    if(r != null) key = "_" + key;
    return key;
};
/**
 * Desc: Returns array for dependencies.
 * @param temp
 * @returns {Array}
 * @private
 */
core4cc.getDependencies = function(temp){
    var dependencies = [];
    for(var key in temp){
        dependencies.push({name : key, version : temp[key]});
    };
    return dependencies;
};

/**
 * Desc: unzip
 * @param srcZip
 * @param targetDir
 * @param cb
 */
core4cc.unzip = function(srcZip, targetDir, cb){
    var execCode = "unzip " + srcZip + " -d " + targetDir;
    exec(execCode, function(err, data, info){
        if(err) return cb(err);
        else cb(null);
    });
};



/**
 * Desc: Download resources.
 * @param downLoadDir
 * @param fileUrl
 * @param cb
 */
core4cc.download = function(downLoadDir, fileUrl, cb) {
    // extract the file name
    var fileName = url.parse(fileUrl).pathname.split('/').pop();
    // create an instance of writable stream
    var file = fs.createWriteStream(path.join(downLoadDir, fileName));
    // execute curl using child_process' spawn function
    var curl = spawn('curl', [fileUrl]);
    // add a 'data' event listener for the spawn instance
    curl.stdout.on('data', function(data) { file.write(data); });
    // add an 'end' event listener to close the writeable stream
    curl.stdout.on('end', function(data) {
        file.end();
        console.log(fileName + ' downloaded to ' + downLoadDir);
        cb(null);
    });
    // when the spawn child process exits, check if there were any errors and close the writeable stream
    curl.on('exit', function(code) {
        if (code != 0) {
            console.error('Failed: ' + code);
            cb("error")
        }
    });
};

/**
 * Desc: Remove dir recursively.
 * @param path
 */
core4cc.rmdirRecursive = function(path) {
    var files = [];
    if( fs.existsSync(path) ) {
        files = fs.readdirSync(path);
        files.forEach(function(file,index){
            var curPath = path + "/" + file;
            if(fs.statSync(curPath).isDirectory()) { // recurse
                core4cc.rmdirRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};

/**
 * Desc: Create dir recursively.
 * @param arr
 * @param index
 * @param cb
 * @returns {*}
 */
core4cc.mkdirRecursive = function(arr, index, cb){
    if(index >= arr.length) cb();
    var dir = path.join(process.cwd(), arr.slice(0, index +1).join(path.sep));
    if(fs.existsSync(dir)) return core4cc.mkdirRecursive(arr, index+1, cb);
    fs.mkdir(dir, function(){
        core4cc.mkdirRecursive(arr, index+1, cb);
    });
}

/**
 * Desc: Returns true if the filePath is absolute.
 * @param filePath
 * @returns {boolean}
 */
core4cc.isAbsolute = function(filePath){
    filePath = path.normalize(filePath);
    if(filePath.substring(0, 1) == "/") return true;
    if(filePath.search(/[\w]+:/) == 0) return true;
    return false;
};

/**
 * Desc: if(!flag), then throw the message.
 * @param {Boolean} flag          true to pass
 * @param {String} msgCode       code for msg
 * @param [{}] args          replacer for msg
 * @returns {*}
 */
core4cc.assert = function(flag, msgCode, args){
    if(flag) return;
    throw core4cc.getMsg(msgCode, args);
};

/**
 * Desc: Get message.
 * @param {String} msgCode
 * @param [{}] args
 * @returns {*}
 */
core4cc.getMsg = function(msgCode, args){
    if(!args) return msgCode;
    for(var key in args){
        if(!key) continue;
        if(!args[key]) continue;
        msgCode = msgCode.replace(new RegExp("\\[\\%" + key + "\\%\\]", "g"), args[key]);
    }
    return msgCode;
};
/**
 * Desc: Log message.
 * @param {String} msgCode
 * @param [{}] args
 * @returns {*}
 */
core4cc.log = function(msgCode, args){
    console.log(core4cc.getMsg(msgCode, args));
};
/**
 * Desc: Warn message.
 * @param msgCode
 * @param args
 */
core4cc.warn = function(msgCode, args){
    console.log(msgCode.WARN_PRE + core4cc.getMsg(msgCode, args));
};

/**
 * Desc: Get string for command.
 * e.g. aaaa ---> aaaa
 *      "a a" ---> a a
 * @param str
 * @returns {*}
 */
core4cc.getStr4Cmd = function(str){
    if(!str) return null;
    if(str.length < 2) return str;
    return str.substring(0, 1) == '"' && str.substring(str.length - 1) == '"' ? str.substring(1, str.length - 1) : str;
}