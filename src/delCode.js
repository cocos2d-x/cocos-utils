var fs = require("fs");
var path = require("path");

var delStart = -1;
var stack = [];//用来记录小括号的栈
var strStack = [];

/**
 * Desc: 跳过空格
 * @param content
 * @param startIndex
 * @returns {Number|number|length|*|Buffer.length}
 * @private
 */
function _delBlank(content, startIndex){
    var l = content.length;
    if(startIndex >= l) return l
    var index = content.substring(startIndex).search(/\S/);
    if(index < 0){
        console.log(content.substring(startIndex));
    }
    return index < 0 ? l : startIndex + index;
};
/**
 * Desc: 跳过字符串
 * @param content
 * @param startIndex
 * @returns {*}
 * @private
 */
function _doStrStack(content, startIndex){
    var index = startIndex, l = content.length;
    while(index < l){
        var c = content.substring(index, index+1);
        if(c == strStack[0]) {
            return index + 1;
        }
        index += c=="\\" ? 2 : 1;
    }
    return l;
}
/**
 * Desc: 处理小括号，使index到")"后面
 * @param content
 * @param startIndex
 * @returns {*}
 * @private
 */
function _doStack(content, startIndex){
    var index = _delBlank(content, startIndex);
    if(index >= content.length) return content.length;
    var c = content.substring(index, index+1);
    if(c == "'" || c == '"') {
        strStack.push(c);
        index = _doStrStack(content, index + 1);
        strStack.pop();
        index = _doStack(content, index);
        return index;
    }
    if(c == "(") {
        stack.push(c);
        index = _doStack(content, index+1);
        return index;
    }else if(c == ")"){
        stack.pop();
        if(stack.length == 0) return index+1;
        return _doStack(content, index+1);
    }else if(c == "\\"){
        return _doStack(content, index+2);
    }else {
        return _doStack(content, index+1);
    }
}
/**
 * Desc: 处理if，目前没用
 * @param content
 * @param startIndex
 * @param pre
 * @returns {Number|number|length|*|Buffer.length}
 * @private
 */
function _doIf(content, startIndex, pre){
//    console.log("doIf");
    var index = _delBlank(content, startIndex);
    if(content.substring(index, index+1) != "(") return index;
    delStart = startIndex - pre.length;
    index = _doStack(content, startIndex);
    index = _delBlank(content, index);
    if(index >= content.length) return content.length;
    var c = content.substring(index, index+1);
    if(c == "{"){//有带大括号的不管
        delStart = -1;//重新开始
    }
    return index;
}
/**
 * Desc: 处理else，目前没用
 * @param content
 * @param startIndex
 * @param pre
 * @returns {Number|number|length|*|Buffer.length}
 * @private
 */
function _doElse(content, startIndex, pre){
//    console.log("_doElse");
    var index = _delBlank(content, startIndex);
    if(content.substring(index).search(/if/) == 0){
        index = _delBlank(content, index + 2);
    }
    if(content.substring(index, index+1) != "(") return index;
    delStart = startIndex - pre.length;
    index = _doStack(content, startIndex);
    index = _delBlank(content, index);
    if(index >= content.length) return content.length;
    var c = content.substring(index, index+1);
    if(c == "{"){//有带大括号的不管
        delStart = -1;//重新开始
    }
    return index;
}
/**
 * Desc: 处理for，目前没用。
 * @param content
 * @param startIndex
 * @param pre
 * @returns {*}
 * @private
 */
function _doFor(content, startIndex, pre){
//    console.log("_doFor");
    delStart = startIndex - pre.length;
    var index = _doStack(content, startIndex);
    index = _delBlank(content, index);
    if(index >= content.length) return content.length;
    var c = content.substring(index, index+1);
    if(c == "{"){//有带大括号的不管
        delStart = -1;//重新开始
    }
    return index;
}
/**
 * Desc: 处理log
 * @param content
 * @param startIndex
 * @param pre
 * @returns {*}
 * @private
 */
function _doLog(content, startIndex, pre){
//    console.log("_doConsole");
    delStart = delStart >= 0 ? delStart : startIndex - pre.length;
    var index = _doStack(content, startIndex);
    index = _delBlank(content, index);
    if(index >= content.length) return content.length;
    var c = content.substring(index, index+1);
    index = c == ";" ? index + 1 : index;
    return index;
}
var funcMap = {
//    "if" : _doIf,
//    "else" : _doElse,
//    "for" : _doFor,
    "console.log" : _doLog,
    "cc.log" : _doLog
};
/**
 * Desc: 跳过注释
 * @param content
 * @param startIndex
 * @returns {*}
 */
function delCommon(content, startIndex){
    var c = content.substring(startIndex, startIndex + 2);
    var l = content.length;
    if(c == "//"){
        var index = content.substring(startIndex).search(/\n/);
        return index >= 0 ? startIndex + index + 3 : l;
    }else if(c == "/*"){
        var index = content.substring(startIndex + 2).search(/\*\//);
        return index >= 0 ? startIndex + index + 4 : l;
    }
    return startIndex;
}

function _delCode(content){
    var index = 0, l = content.length;
    while(index < l){
        index = _delBlank(content, index);
        if(index >= l) break;
        index = delCommon(content, index);
//        console.log(content.length + "  " + index + content.substring(0,index));
//        console.log(content.substring(index))
        if(index >= l) break;
        var index2 = content.substring(index).search(/[ \n\(\{]/);
        if(index2 == 0){
            index ++;
            continue;
        }
        if(index + index2 >= l-1 || index2 < 0) break;
//        index = index + index2;
        var key = content.substring(index, index + index2);
//        console.log(index + "   " + index2 + "->" + content.substring(index, index+1))
        if(funcMap[key]) {
            var tempIndex = funcMap[key](content, index+index2, key);
//            console.log("--->" + key + ":" + delStart + "  " + tempIndex);
            if(delStart >= 0){
                content = content.substring(0, index) + ";" + content.substring(tempIndex);
                continue;
            }
        }
        index += index2;
    }
//    console.log(content)
    return content;
}

module.exports = function(file, tempFile){
    console.log("delCode--->" + file + "--->" + tempFile);
    var content = _delCode(fs.readFileSync(file).toString());
    tempFile = tempFile || file;
    fs.writeFileSync(tempFile, content);
//    fs.writeFileSync(path.join(__dirname, "test/files/temp.js"), content);
};
