var exec = require("child_process").exec;
var path = require("path");
var projDir = path.join(__dirname, "../");
exec("cocos publish " + projDir, function(err, data, info){
    if(err) {
        console.log(data);
        console.error(info);
    }
    else console.log(data);
});