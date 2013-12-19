function runPlugin(srcDir, targetDir, opts){
    var packageInfo = require("../../package.json");
    console.log("\033[1;36;1m" + packageInfo.version + "\033[0m");
}

module.exports = runPlugin;