/**
 *
 */
//一开始就创建了这一块区域，只是点击以后再显示而已
;
(function ($, window, document, undefined) {
    var pluginName = "newsDetailPane";
    var defaults = {
        id : "",
        parent : "",
        userId : "",
        userName : ""
    };

    var Board = function (element, options) {
        this.element = element;
        this.options = $.extend({
            id : "",
            parent : "",
            userId : "",
            userName : ""
        }, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init(options);
    };

    Board.prototype.init = function (options) {
        this.board = document.createElement("DIV");
        this.element.appendChild(this.board);
        this.show(false);

        var panel = document.createElement("DIV");
        this.board.appendChild(panel);
        panel.className = "container-fluid";

        // row0
        var panelRow0 = document.createElement("DIV");
        panel.appendChild(panelRow0);
        panelRow0.className = "row";

        var panelCol0 = document.createElement("DIV");
        panelRow0.appendChild(panelCol0);
        panelCol0.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";

        // this.createTitle(panelCol0, "fa fa-newspaper-o fa-lg", "新闻动态>正文");
        var titleSpan = document.createElement("span");
        panelCol0.appendChild(titleSpan);

        var h3 = document.createElement("H3");
        titleSpan.appendChild(h3);
        h3.className = "page-header";

        var span = document.createElement("SPAN");
        h3.appendChild(span);
        span.className = "fa fa-newspaper-o fa-lg";

        var text = document.createTextNode(" " + "新闻动态>正文");
        h3.appendChild(text);

        if ($(panel).newsContentPane != undefined) {
            var board = $(panel).newsContentPane({
                id : "newsContentPane",
                parent : this,
                userId : this.options.userId,
                userName : this.options.userName
            });
            this.newsContentPane = board.data("newsContentPane");
        }

    };

    Board.prototype.show = function (show) {
        if (show) {
            this.board.style.display = "";
        } else {
            this.board.style.display = "none";
        }
    };

    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, pluginName)) {
                $.data(this, pluginName, new Board(this, options));
            } else if ($.isFunction(Plugin.prototype[options])) {
                $.data(this, pluginName)[options]();
            }
        });
    };

})(jQuery, window, document);