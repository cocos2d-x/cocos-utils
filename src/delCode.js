var fs = require("fs");
var path = require("path");

var delStart = -1;
var stack = [];//用来记录小括号的栈
var strStack = [];


/*

 function delBlank(content, startIndex, cb){
 if(startIndex >= content.length) cb(startIndex);
 var c = content.substring(startIndex, startIndex+1);
 if(c == " " || c == "\n") return delBlank(content, startIndex+1, cb);
 cb(startIndex);
 }
 function doIf(content, startIndex, pre, cb){
 //    console.log("doIf");
 delStart = startIndex - pre.length;
 doStack(content, startIndex, function(index){
 delBlank(content, index, function(index){
 //            console.log(index);
 //            console.log(content.substring(delStart, index));
 var c = content.substring(index, index+1);
 if(c == "{"){//有带大括号的不管
 delStart = -1;//重新开始
 }
 delCode(content, index, "", cb);
 });
 });
 }
 function doStrStack(content, startIndex, cb){
 var c = content.substring(startIndex, startIndex+1);
 if(c == strStack[0]) {
 return cb(startIndex + 1);
 }
 if(c == "\\") return doStrStack(content, startIndex + 2, cb);
 doStrStack(content, startIndex+1, cb);
 }
 function doStack(content, startIndex, cb){
 delBlank(content, startIndex, function(index){
 var c = content.substring(index, index+1);
 if(c == "'" || c == '"') {
 strStack.push(c);
 return doStrStack(content, index + 1, function(index){
 strStack.pop();
 doStack(content, index, cb);
 })
 }
 if(c == "(") {
 stack.push(c);
 doStack(content, index+1, cb);
 }else if(c == ")"){
 stack.pop();
 if(stack.length == 0) return cb(index+1);
 doStack(content, index+1, cb);
 }else if(c == "\\"){
 doStack(content, index+2, cb);
 }else {
 doStack(content, index+1, cb);
 }
 });
 }


function doConsole(content, startIndex, pre, cb){
 //    console.log("doConsole");
 delStart = delStart >= 0 ? delStart : startIndex - pre.length;
 doStack(content, startIndex, function(index){
 delBlank(content, index, function(index){
 //            console.log(index);
 //            console.log(content.substring(delStart, index));
 var c = content.substring(index, index+1);
 index = c == ";" ? index + 1 : index;
 content = content.substring(0, delStart) + content.substring(index);
 var tempIndex = delStart;
 delStart = -1;
 delCode(content, tempIndex, "", cb);
 });
 });
 };*/
function _delBlank(content, startIndex){
    var index = startIndex;
    var l = content.length;
    while(index < l){
        var c = content.substring(index, index + 1);
        if(c != " " && c != "\n") return index;
        index++;
    }
    return l;
};
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
function _doStack(content, startIndex){
    var index = _delBlank(content, startIndex);
    var c = content.substring(index, index+1);
    if(c == "'" || c == '"') {
        strStack.push(c);
        index = _doStrStack(content, index + 1);
        index = _doStack(content, index);
        strStack.pop();
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

function _doIf(content, startIndex, pre){
//    console.log("doIf");
    delStart = startIndex - pre.length;
    var index = _doStack(content, startIndex);
    index = _delBlank(content, index);
    var c = content.substring(index, index+1);
    if(c == "{"){//有带大括号的不管
        delStart = -1;//重新开始
    }
    return index;
}

function _doConsole(content, startIndex, pre){
    delStart = delStart >= 0 ? delStart : startIndex - pre.length;
    var index = _doStack(content, startIndex);
    index = _delBlank(content, index);
    var c = content.substring(index, index+1);
    index = c == ";" ? index + 1 : index;
    return index;
}

var funcMap = {
    "if" : _doIf,
    "console.log" : _doConsole,
    "cc.log" : _doConsole
};

function delCommon(content, startIndex){
    var c = content.substring(startIndex, 2);
    var l = content.length;
    if(c == "//"){
        var index = content.substring(startIndex).search(/\n/);
        return index >= 0 ? startIndex + index : l;
    }else if(c == "/*"){
        var index = startIndex + 2;
        while(index < l - 1){
            if(content.substring(index, index+2) == "*/") return index + 2;
            index++;
        }
        return l;
    }
    return startIndex;
}

function _delCode(content, startIndex, pre, cb){
    var index = 0, l = content.length;
    while(index < l){
        index = _delBlank(content, index);
        if(index >= l) break;
        index = delCommon(content, index);
        if(index >= l) break;
        var index2 = content.substring(index).search(/[ \n\(\{]/);
        if(index2 == 0){
            index ++;
            continue;
        }
        if(index2 >= l || index2 < 0) break;
        var key = content.substring(index, index + index2);
//        console.log(index + "   " + index2 + "->" + content.substring(index, index+1))
        if(funcMap[key]) {
            console.log("--->" + key);
            index = funcMap[key](content, index+index2, key);
        }else{
//            console.log("+++>" + key)
        }
        index += index2;
    }
}
function delCode(content, startIndex, pre, cb){
    if(content.length <= startIndex) return cb(content, startIndex, pre);
    console.log(content.length + "   " + startIndex);
    var c = content.substring(startIndex, startIndex+1);
//    console.log("pre->" + pre);
    if(c == " " || c == "\n" || c == "("){
//        console.log("FFF   ->" + pre)
        if(pre == "") return delCode(content, startIndex+1, "", cb);
        for(var key in funcMap){
            if(key == pre) return funcMap[key](content, startIndex, pre, cb);
        }
        return delCode(content, startIndex+1, "",  cb);
    }
    delCode(content, startIndex+1, pre+c, cb);
}

module.exports = function(file){
    console.log("delCode--->" + file);
    _delCode(fs.readFileSync(file).toString(), 0, "", function(content, startIndex, pre){
        fs.writeFileSync(file, content);
    });
};

_delCode(fs.readFileSync(path.join(__dirname, "test/files/t1.js")).toString())