var resCfg = cc.resCfg;

resCfg["[%name%]"] = {
    ref : []
};
resCfg.gameModules = [js.[%name%].MyLayer_js];

resCfg[js.[%name%].MyLayer_js] = {
    res : [res.CloseNormal_png, res.CloseSelected_png, res.HelloWorld_jpg],
    layer : "MyLayer" //this is for test unit.
};