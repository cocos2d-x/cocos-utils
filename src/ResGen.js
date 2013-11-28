var fs = require("fs");
var path = require("path");
var core4cc = require("./core4cc");

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
        if(!fs.existsSync(dir)) {
            console.log(dir + "    not exists!")
            return;
        }
        stats = fs.statSync(dir);
        if(!stats.isDirectory()) {
            console.log(dir + "    is not a directory!")
            return;
        }
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
                if(this.fileTypes.indexOf(type) < 0) continue;//如果不是所需类型，则跳过
                _resArr.push(path.relative(pre, childPath));
                _resKeyArr.push(core4cc.getKeyName(item));
            }
        }
    };

    this.gen = function(){
        console.log("|---------------------------------------|");
        console.log("|        ResGen                         |");
        console.log("|        Author: Zheng.Xiaojun          |");
        console.log("|        Version: 1.0.0                 |");
        console.log("|---------------------------------------|");
        console.log("+++++++++++++++gen starts++++++++++++++++");
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
        if(!fs.existsSync(outputPath)){
            console.log(outputPath + "    not exists!");
            return;
        }

        var content = "";
        content += this.startStr + "{\r\n";
        for(var i = 0, l = _resArr.length; i < l; ++i){
            content += "    " + _resKeyArr[i] + " : '" + this.resPre + _resArr[i] + "'";
            if(i < l - 1) content += ",";
            content += "\r\n";
        }
        content += "};";
//        console.log(content);
        fs.writeFileSync(outputPath, content);
        _resArr = [];
        _resKeyArr = [];
        console.log("Success!---->" + outputPath);
        console.log("+++++++++++++++gen ends++++++++++++++++++");
    };
};

module.exports = ResGen;