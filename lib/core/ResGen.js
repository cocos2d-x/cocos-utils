var fs = require("fs");
var path = require("path");
var core4cc = require("./core4cc");
var msgCode = require("../../cfg/msgCode");

function ResGen(dirCfgList, outputPath){
    var _dirCfgList = dirCfgList || [];
    var _outputPath = outputPath || "cfg/res.js";

    var _resArr = [];
    var _resKeyArr = [];

    this.fileTypes = [];
    this.projDir;
    this.startStr;
    this.resPre = "";;

    this._walkDir = function(dir, pre){
        core4cc.assert(fs.existsSync(dir), msgCode.PATH_NOT_EXISTS, {path : dir});
        core4cc.assert(fs.statSync(dir).isDirectory(), msgCode.NOT_A_DIR, {dir : dir});
        var dirList = fs.readdirSync(dir);
        for(var i = 0, l = dirList.length; i < l; ++i){
            var item = dirList[i];
            var childPath = path.join(dir, item);
            if(fs.statSync(childPath).isDirectory())
                this._walkDir(childPath, pre);
            else{
                var index = item.lastIndexOf(".");
                if(index < 0) continue;
                var type = item.substring(index + 1).toLowerCase();
                if(this.fileTypes.indexOf(type) < 0) continue;//continue if it`s not a type in fileTypes
                var key = core4cc.getKeyName(item);
                _resArr.push(path.relative(pre, childPath));
                if(_resKeyArr.indexOf(key) >= 0) core4cc.warn(msgCode.RES_KEY_EXISTS, {key : key})
                _resKeyArr.push(key);
            }
        }
    };

    this.gen = function(){
//        console.log("|---------------------------------------|");
//        console.log("|        ResGen                         |");
//        console.log("|        Author: Zheng.Xiaojun          |");
//        console.log("|        Version: 1.0.0                 |");
//        console.log("|---------------------------------------|");
//        console.log("+++++++++++++++gen starts++++++++++++++++");
        for(var i = 0, l = _dirCfgList.length; i < l; ++i){
            var cfg = _dirCfgList[i];
            var dir = cfg, pre = "";
            var strs = cfg.split("->");
            if(strs.length == 2){
                dir = strs[0];
                pre = strs[1];
            }
            this._walkDir(path.join(this.projDir, dir), path.join(this.projDir, pre));
        }

        var outputPath = path.join(this.projDir, _outputPath);
        var content = "";
        content += this.startStr + "{\r\n";
        for(var i = 0, l = _resArr.length; i < l; ++i){
            content += "    " + _resKeyArr[i] + " : '" + this.resPre + _resArr[i].replace(/\\/g, "/") + "'";
            if(i < l - 1) content += ",";
            content += "\r\n";
        }
        content += "};";
        fs.writeFileSync(outputPath, content);
        _resArr = [];
        _resKeyArr = [];
        core4cc.log(msgCode.SUCCESS_PATH, {path : outputPath});
//        console.log("+++++++++++++++gen ends++++++++++++++++++");
    };
};

module.exports = ResGen;

