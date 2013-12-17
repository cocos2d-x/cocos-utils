module.exports = {
    ERR_PRE : "\033[1;31;1mERROR:\033[0m ",
    WARN_PRE : "\033[1;33;1mWARN:\033[0m ",

    CMD_ERR : "mcommand error, please check!",
    CMD_ARGS_ERR : "command args error, please check!",
    FUNC_NAME_NULL : "function can not be null, please check!",
    FUNC_NOT_EXISTS : "function \033[31m[%func%]\033[0m not exists, please check!",
    CMD_LENGTH : "length of arguments for \033[36m[%cmd%]\033[0m should be \033[31m[%length%]\033[0m, please check!",
    PUBLISH_FAILED : "publish failed, please check!",
    SUCCESS : "\033[32mSuccess!\033[0m",
    SUCCESS_PATH : "\033[32mSuccess! ---->\033[0m [%path%]",
    TEMPLATE_NOT_EXISTS : "[%tempDir%] not exists, please check!",
    PROJ_EXISTS : "[%projDir%] exists! Can not create again!",
    BUILDING : "\033[1;36;1mBuilding...\033[0m",
    PATH_NOT_EXISTS : "[%path%] not exists!",
    NOT_A_DIR : "[%dir%] is not a directory!",
    GENERATING : "\033[36m[%target%]\033[0m generating..."
};
