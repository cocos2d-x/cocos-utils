module.exports = {
    ERR_PRE : "\033[1;31;1mERROR:\033[0m ",
    WARN_PRE : "\033[1;33;1mWARN:\033[0m ",
    VERSION : "\033[1;36;1m[%version%]\033[0m",

    BUILDING : "\033[1;36;1mBuilding...\033[0m",
    PUBLISHING : "\033[1;36;1mPublishing...\033[0m",

    CMD_ERR : "command error, please check!",
    CMD_OPTS_ERR : "options for command error, please check!",
    CMD_HAS_NO_OPT : "command \033[36m[%command%]\033[0m has no option \033[31m[%opt%]\033[0m, please check!",
    CMD_ARGS_ERR : "command args error, please check!",
    FUNC_NAME_NULL : "function can not be null, please check!",
    PLUGIN_NOT_EXISTS : "plugin \033[31m[%name%]\033[0m not exists, please check!",
    CMD_LENGTH : "length of arguments for \033[36m[%cmd%]\033[0m should be \033[31m[%length%]\033[0m, please check!",
    PUBLISH_FAILED : "publish failed, please check!",
    SUCCESS : "\033[32mSuccess!\033[0m",
    SUCCESS_PATH : "\033[32mSuccess! ---->\033[0m [%path%]",
    TEMPLATE_NOT_EXISTS : "[%tempDir%] not exists, please check!",
    PROJ_EXISTS : "[%projDir%] exists! Can not create again!",
    PATH_NOT_EXISTS : "[%path%] not exists!",
    NOT_A_DIR : "[%dir%] is not a directory!",
    GENERATING : "\033[36m[%target%]\033[0m generating...",


    PROJ_NAME_NULL : "Project name can not be null, please check!",


    DESC_VERSION : ["Show the version of cocos-utils."],
    DESC_HELP : ["Show help for commands of cocos-utils."],
    DESC_NEW : [
        "Create a project.",
        "e.g. \033[43;1;1mcocos new helloworld\033[0m.",
        "The project name should not be null and have blank."
    ],
    DESC_BUILD : [
        "Build the project.",
        "When the current path is your project path, type \033[43;1;1mcocos build\033[0m.",
        "Otherwise, \033[43;1;1mcocos build your/project/path/\033[0m.",
        "Or, \033[43;1;1mcocos build \"your project/path/\"\033[0m."
    ],
    DESC_PUBLISH : [
        "Publish the project.",
        "When the current path is your project path, type \033[43;1;1mcocos publish\033[0m.",
        "Otherwise, \033[43;1;1mcocos publish your/project/path/\033[0m.",
        "Or, \033[43;1;1mcocos publish \"your project/path/\"\033[0m."
    ],
    DESC_GEN_RES : [
        "Generate resources config for the project.",
        "When the current path is your project path, type \033[43;1;1mcocos genRes\033[0m.",
        "Otherwise, \033[43;1;1mcocos genRes your/project/path/\033[0m.",
        "Or, \033[43;1;1mcocos genRes \"your project/path/\"\033[0m."
    ],
    DESC_GEN_JS_RES : [
        "Generate js resources config for the project.",
        "When the current path is your project path, type \033[43;1;1mcocos genJsRes\033[0m.",
        "Otherwise, \033[43;1;1mcocos genJsRes your/project/path/\033[0m.",
        "Or, \033[43;1;1mcocos genJsRes \"your project/path/\"\033[0m."
    ],
    DESC_GEN_BASE_CFG : [
        "Generate base js list for the project.",
        "When the current path is your project path, type \033[43;1;1mcocos genBaseCfg\033[0m.",
        "Otherwise, \033[43;1;1mcocos genBaseCfg your/project/path/\033[0m.",
        "Or, \033[43;1;1mcocos genBaseCfg \"your project/path/\"\033[0m."
    ],

    DESC_NEW_DIR : [
        "Folder to put the project.",
        "e.g. \033[43;1;1mcocos new helloworld -p a/b/c\033[0m.",
        "Or \033[43;1;1mcocos new helloworld -p \"a/b/c cc\"\033[0m."
    ],
    DESC_NEW_ENGINE_MODULES : [
        "Path of engine modules.",
        "e.g. \033[43;1;1mcocos new helloworld -em ../../a/b/node_modules\033[0m.",
        "Or \033[43;1;1mcocos new helloworld -em \"../../a/b/node_modules\"\033[0m."
    ],
    DESC_NEW_TEMP_NAME : [
        "Template name which you want to use to create project.",
        "e.g. \033[43;1;1mcocos new helloworld -t myTemp\033[0m."
    ]
};
