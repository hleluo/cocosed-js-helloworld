/**
 * Created by Administrator on 2017/10/17.
 * 自定义加载进度场景
 */

var loading_res = {
    bg: "res/images/loading_bg.jpg",
    logo: "res/images/loading_logo.png",
    progressBar: "res/images/loading_progress_bar.png",
    progressTrack: "res/images/loading_progress_track.png"
}

var PROGRESS_BAR_RADIUS = 9;    //圆角半径
var PROGRESS_LAYER_BOTTOM = 60; //下边距
var PROGRESS_LAYER_OFFSET = 50; //左右边距
var PROGRESS_LAYER_HEIGHT = 20; //高度

var LoadingScene = cc.Scene.extend({
    _interval: null,
    _length: 0,
    _count: 0,
    _loadingLabel: null,
    _winSize: null,
    _className: "LoadingScene",
    _progressTrack: null,
    init: function () {
        var self = this;
        // 背景颜色
        var baseLayer = self._baseLayer = new cc.LayerColor(cc.color(300, 0, 32, 255));
        baseLayer.setPosition(cc.visibleRect.bottomLeft);
        self.addChild(baseLayer, 0);
        //事件
        /*cc.EventListener.create({
         event: cc.EventListener.TOUCH_ONE_BY_ONE,
         swallowTouches: true,   // 设置是否吞没事件，在 onTouchBegan 方法返回 true 时吞掉事件，不再向下传递
         onTouchBegan: function (touch, event) {     //实现 onTouchBegan 事件处理回调函数
         var rect = this.touchRect();
         var point = touches.getLocation();
         if (cc.rectContainsPoint(this.touchRect(), touches.getLocation())) {
         self._touchBegan = true;
         return true;
         }
         },
         onTouchEnded: function (touch, event) {         // 实现onTouchEnded事件处理回调函数
         var target = event.getCurrentTarget();
         if (target == sprite2) {
         sprite1.setLocalZOrder(100);            // 重新设置 ZOrder，显示的前后顺序将会改变
         } else if (target == sprite1) {
         sprite1.setLocalZOrder(0);
         }
         }
         });*/
        //image move to CCSceneFile.js
        if (cc._loaderImage) {
            cc.loader.load([loading_res.bg, loading_res.logo, loading_res.progressBar, loading_res.progressTrack], function () {
                //背景图片
                var bgSprite = new ccui.Scale9Sprite(loading_res.bg, cc.Rect(0, 0, 60, 64), cc.rect(10, 10, 5, 5));
                bgSprite.attr({
                    x: cc.visibleRect.width / 2,
                    y: cc.visibleRect.height / 2,
                    width: cc.visibleRect.width,
                    height: cc.visibleRect.height
                });
                self._baseLayer.addChild(bgSprite, 0);
                //logo
                var logoSprite = new cc.Sprite(loading_res.logo);
                logoSprite.setAnchorPoint(cc.p(0.5, 1));
                logoSprite.setPosition(cc.pAdd(cc.visibleRect.top, cc.p(0, -100)));
                self._baseLayer.addChild(logoSprite, 1);
                //进度条层
                var progressLayer = new cc.Layer();
                progressLayer.setPosition(cc.pAdd(cc.visibleRect.bottomLeft, cc.p(PROGRESS_LAYER_OFFSET, PROGRESS_LAYER_BOTTOM)));
                progressLayer.setContentSize(cc.size(cc.visibleRect.width - progressLayer.x * 2, PROGRESS_LAYER_HEIGHT));
                self._baseLayer.addChild(progressLayer, 1);

                var progressBar = new ccui.Scale9Sprite(loading_res.progressBar, cc.rect(0, 0, 270, 20),
                    cc.rect(PROGRESS_BAR_RADIUS, 0, 270 - PROGRESS_BAR_RADIUS * 2, 20));
                progressBar.setAnchorPoint(cc.p(0, 0));
                progressBar.setContentSize(progressLayer.getContentSize());
                progressLayer.addChild(progressBar, 0);

                var progressTrack = self._progressTrack = new ccui.Scale9Sprite(loading_res.progressTrack, cc.rect(0, 0, 202, 20),
                    cc.rect(PROGRESS_BAR_RADIUS, 0, 202 - PROGRESS_BAR_RADIUS * 2, 20));
                progressTrack.maxBarWidth = progressLayer.width;
                progressTrack.setAnchorPoint(cc.p(0, 0));
                progressTrack.setContentSize(cc.size(0, 0));
                progressLayer.addChild(progressTrack, 0);
            });
            //进度值
            var loadingLabel = self._loadingLabel = cc.LabelTTF.create("Loading... 0%", "Arial", 14);
            loadingLabel.setAnchorPoint(cc.p(0.5, 0));
            loadingLabel.setPosition(cc.pAdd(cc.visibleRect.bottom, cc.p(0, PROGRESS_LAYER_BOTTOM + PROGRESS_LAYER_HEIGHT)));
            loadingLabel.setColor(cc.color(51, 51, 51));
            self._baseLayer.addChild(loadingLabel, 1);
            return true;
        }
    },
    onEnter: function () {
        var self = this;
        cc.Node.prototype.onEnter.call(self);
        self.schedule(self._startLoading, 0.3);
    },
    onExit: function () {
        cc.Node.prototype.onExit.call(this);
        this._loadingLabel.setString("Loading... 0%");
    },
    initWithResources: function (resources, cb) {
        if (typeof resources == "string") resources = [resources];
        this.resources = resources || [];
        this.cb = cb;
    },
    _startLoading: function () {
        var self = this;
        self.unschedule(self._startLoading);
        var res = self.resources;
        self._length = res.length;
        self._count = 0;
        cc.loader.load(res, function (result, count) {
            self._count = count;
        }, function () {
            if (self.cb)
                self.cb();
        });
        self.schedule(self._updatePercent);
    },
    _updatePercent: function () {
        var self = this;
        var count = self._count;
        var length = self._length;
        var percent = length == 0 ? 100 : (count / length * 100) | 0;
        percent = Math.min(percent, 100);
        // 更新进度条的长度
        cc.log(count + "," + length);
        var width = self._progressTrack.maxBarWidth * percent / 100;
        width = width < PROGRESS_BAR_RADIUS * 2 ? PROGRESS_BAR_RADIUS * 2 : width;
        self._progressTrack.setContentSize(cc.size(width, PROGRESS_LAYER_HEIGHT));
        percent = self._progressTrack.width / self._progressTrack.maxBarWidth * 100;
        self._loadingLabel.setString("Loading... " + percent.toFixed(0) + "%");
        if (count >= length) self.unschedule(self._updatePercent);
    }
});