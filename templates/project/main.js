var cocos2dApp = cc.Application.extend({
    config : document["ccConfig"],
    ctor : function(){
        this._super();
        cc.COCOS2D_DEBUG = this.config["COCOS2D_DEBUG"];
        cc.initDebugSetting();
        cc.setup(this.config["tag"]);
        cc.AppController.shareAppController().didFinishLaunchingWithOptions();
    },

    applicationDidFinishLaunching : function(){
        var config = this.config;
        // initialize director
        var director = cc.Director.getInstance();

        var eglView = cc.EGLView.getInstance();
        eglView._adjustSizeToBrowser();
        var screenSize = eglView.getFrameSize();
        var resourceSize = cc.size(480, 800);
        var designSize = cc.size(480, 800);

        var searchPaths = [];
        var resDirOrders = [];

        searchPaths.push(config["resDir"]);
        var fileUtils = cc.FileUtils.getInstance();
        fileUtils.setSearchPaths(searchPaths);

        var platform = cc.Application.getInstance().getTargetPlatform();
        if (platform == cc.TARGET_PLATFORM.MOBILE_BROWSER) {
            resDirOrders.push("HD");
        }
        else if (platform == cc.TARGET_PLATFORM.PC_BROWSER) {
            if (screenSize.height >= 800) {
                resDirOrders.push("HD");
            }
            else {
                resourceSize = cc.size(320, 480);
                designSize = cc.size(320, 480);
                resDirOrders.push("Normal");
            }
        }

        fileUtils.setSearchResolutionsOrder(resDirOrders);

        if(cc.AudioEngine) cc.AudioEngine.getInstance().setResPath(config["audioDir"]);

        director.setContentScaleFactor(resourceSize.width / designSize.width);

        eglView.setDesignResolutionSize(designSize.width, designSize.height, cc.RESOLUTION_POLICY.SHOW_ALL);

        // turn on display FPS
        director.setDisplayStats(config['showFPS']);

        // set FPS. the default value is 1.0/60 if you don't call this
        director.setAnimationInterval(1.0 / config['frameRate']);

//        config.test = js.[%name%].MyTest_js;//config which js you want to test

        if(config["test"]) cc.test(config["test"]);//
        else{
            //TODO enter point for game
            cc.log("++++++++++++++++entry for game++++++++++++");
            cc.loadGameModule(js.[%name%].myApp_js, function(resArr){
                cc.LoaderScene.preload(resArr, function(){
                    cc.Director.getInstance().replaceScene(new MyScene());
                });
            });
        }
        return true;
    }

});

new cocos2dApp();