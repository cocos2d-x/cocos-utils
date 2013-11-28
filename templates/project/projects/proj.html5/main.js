
var cocos2dApp = cc.Application.extend({
    config : document["ccConfig"],
    ctor : function(){
        this._super();
        cc.COCOS2D_DEBUG = this.config.COCOS2D_DEBUG;
        cc.setup(this.config.tag);    //设置ID相当于
        cc.AppController.shareAppController().didFinishLaunchingWithOptions();
    },

    applicationDidFinishLaunching : function(){
        //初始化导演
        var director = cc.Director.getInstance();

        var searchPaths = [];
        searchPaths.push("../../res/Normal");
        cc.FileUtils.getInstance().setSearchPaths(searchPaths);
        //设置分辨率
        //cc.EGLView.getInstance().setDesignResolutionSize(320, 480, cc.RESOLUTION_POLICY.SHOW_ALL);

        //打开FPS的显示
        director.setDisplayStats(this.config.showFPS);
        //设置FPS，默认为 1.0/60
        director.setAnimationInterval(1.0 / this.config.frameRate);


        if(!__PUBLISH && this.config.test) cc.test(this.config.test);//
        else{
            //TODO enter point for game
            cc.log("++++++++++++++++entry for game++++++++++++");
            cc.loadGameModule(js.[%name%].MyLayer_js, function(resArr){
                cc.LoaderScene.preload(resArr, function(){
                    var scene = cc.Scene.create();
                    scene.addChild(MyLayer.create({}));
                    cc.Director.getInstance().replaceScene(scene);
                });
            });
        }
        return true;
    }

});

new cocos2dApp();