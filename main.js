/**
 * Created by Administrator on 2017/10/16.
 */

$(function () {
    cc.game.onStart = function () {
        cc.view.adjustViewPort(true);
        var viewSize = cc.size(document.documentElement.clientWidth, document.documentElement.clientHeight);
        if (!cc.sys.isMobile) {
            var ratio = 5 / 8;  //宽高比
            viewSize.width = viewSize.width > viewSize.height * ratio ? viewSize.height * ratio : viewSize.width;
        }
        cc.view.setDesignResolutionSize(viewSize.width, viewSize.height, cc.ResolutionPolicy.SHOW_ALL);
        cc.view.resizeWithBrowserSize(true);
        //自定义资源加载界面
        cc.LoaderScene.preload = function (resources, cb) {
            var _cc = cc;
            //如果_cc.loaderScene不存在的话，就创建一个cc.LoaderScene，并调用其init函数
            if (!_cc.loadingScene) {
                _cc.loadingScene = new LoadingScene();
                _cc.loadingScene.init();
            }
            //加载resources里面的资源文件，也就是在resource.js里面定义的加载资源
            _cc.loadingScene.initWithResources(resources, cb);
            //显示加载界面给玩家
            cc.director.runScene(_cc.loadingScene);
            return _cc.loadingScene;
        };
        //预加载资源
        cc.LoaderScene.preload(g_resources, function () {
            var MenuScene = cc.Scene.extend({
                onEnter: function () {
                    this._super();
                    /*var size = cc.director.getWinSize();
                     var sprite = cc.Sprite.create(res.menu_bg);
                     sprite.setPosition(size.width / 2, size.height / 2);
                     sprite.setScale(0.8);
                     this.addChild(sprite, 0);

                     var label = cc.LabelTTF.create("Hello World", "Arial", 40);
                     label.setPosition(size.width / 2, size.height / 2);
                     this.addChild(label, 1);*/
                }
            });
            // cc.director.runScene(new MenuScene());
        });
    };
    cc.game.run();
})