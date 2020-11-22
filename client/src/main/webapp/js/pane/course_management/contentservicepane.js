/**
 *
 */

;
(function($, window, document, undefined) {
    var pluginName = "contentServicePane";
    var defaults = {
        id : "",
        parent : "",
        userId : "",
        userName : ""
    };

    var Board = function(element, options) {
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

    Board.prototype.init = function(options) {
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

        this.createTitle(panelCol0, "fa fa-book", "课程资料", "#992d96");

        // row1
        var panelRow1 = document.createElement("DIV");
        panel.appendChild(panelRow1);
        panelRow1.className = "row";

        var panelCol1 = document.createElement("DIV");
        panelRow1.appendChild(panelCol1);
        panelCol1.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";

        var tabDIV = document.createElement("DIV");
        panelCol1.appendChild(tabDIV);
        tabDIV.style.marginTop = "4px";

        var tabUL = document.createElement("UL");
        tabUL.className = "nav nav-tabs nav-justified cnts-nav-tabs";
        tabUL.id = "cnts-nav-tabs";
        tabUL.setAttribute("role", "tablist");
        tabDIV.appendChild(tabUL);

        this.newTabHead(tabUL, 0, "电子书", true);
        this.newTabHead(tabUL, 1, "视频", false);
        this.newTabHead(tabUL, 2, "音频", false);
        this.newTabHead(tabUL, 3, "直播", false);

        var that = this;
        $("#cnts-nav-tabs").on("click", "a", function(e) {
            e.preventDefault();
            $(this).tab('show');
            that.currtabindex = parseInt($(this).attr('href').substring(8));
            if (that.currtabindex == 0) {
                // that.bookListEditor.loading("", "0", options.userId, 0, 6);
                // that.bookListEditor.getMoreNews("","0",options.userId,6);
            } else if (that.currtabindex == 1) {
                //that.videoListEditor.loading("", "1", options.userId, 0, 6);
                //that.videoListEditor.getMoreNews("","1",options.userId,6);
            } else if (that.currtabindex == 2) {
                //that.audioListEditor.loading("", "2", options.userId, 0, 6);
                //that.audioListEditor.getMoreNews("","2",options.userId,6);
            } else if (that.currtabindex == 3) {
                //that.liveListEditor.loading("", "3", options.userId, 0, 6);
                //that.liveListEditor.getMoreNews("","3",options.userId,6);
            }
        });

        var tabContents = document.createElement("DIV");
        tabDIV.appendChild(tabContents);
        tabContents.className = "tab-content";
        tabContents.id = "cntstabs";

        this.tabContent1 = this.newTabContent(tabContents, 0, true);
        if ($(this.tabContent1).bookListEditor != undefined) {
            var plugin1 = $(this.tabContent1).bookListEditor({
                id : "course1",
                userId:options.userId,
                parent : options.parent,
                owner : options.owner,
            });
            this.bookListEditor = plugin1.data("bookListEditor");
        }

        this.tabContent2 = this.newTabContent(tabContents, 1, false);
        if ($(this.tabContent2).videoListEditor != undefined) {
            var plugin2 = $(this.tabContent2).videoListEditor({
                id: "course2",
                userId:options.userId,
                parent : options.parent,
                owner : options.owner,
            });
            this.videoListEditor = plugin2.data("videoListEditor");
        }

        this.tabContent3 = this.newTabContent(tabContents, 2, false);
        if ($(this.tabContent3).audioListEditor != undefined) {
            var plugin3 = $(this.tabContent3).audioListEditor({
                id: "course3",
                userId:options.userId,
                parent : options.parent,
                owner : options.owner,
            });
            this.audioListEditor = plugin3.data("audioListEditor");
        }

        this.tabContent4 = this.newTabContent(tabContents, 3, false);
        if ($(this.tabContent4).liveListEditor != undefined) {
            var plugin4 = $(this.tabContent4).liveListEditor({
                id: "course4",
                userId:options.userId,
                parent : options.parent,
                owner : options.owner,
            });
            this.liveListEditor = plugin4.data("liveListEditor");
        }
    };


    Board.prototype.createTitle = function(parent, icon, title, color) {
        var titleSpan = document.createElement("SPAN");
        parent.appendChild(titleSpan);

        var h3 = document.createElement("H3");
        titleSpan.appendChild(h3);
        h3.className = "page-header";
        h3.style.margin = "0";

        var span = document.createElement("SPAN");
        h3.appendChild(span);
        span.className = icon;
        span.setAttribute("aria-hidden","true");
        span.style.color = color;

        var text = document.createTextNode(" " + title);
        h3.appendChild(text);

        return titleSpan;
    };

    Board.prototype.newTabHead = function(parent, index, caption, active) {
        var tabLi = document.createElement("li");
        parent.appendChild(tabLi);
        if (active)
            tabLi.className = "active";
        tabLi.setAttribute("role", "presentation");
        var tabLink = document.createElement("a");
        tabLi.appendChild(tabLink);
        tabLink.setAttribute("href", "#course" + index);
        tabLink.setAttribute("aria-controls", "course" + index);
        tabLink.setAttribute("role", "tab");
        tabLink.setAttribute("data-toggle", "tab");
        tabLink.innerHTML = caption;
    };

    Board.prototype.newTabContent = function(parent, index, active) {
        var tabContent = document.createElement("DIV");
        parent.appendChild(tabContent);
        tabContent.setAttribute("data", "course" + index);
        tabContent.setAttribute("role", "tabpanel");
        if (active)
            tabContent.className = "tab-pane active";
        else
            tabContent.className = "tab-pane";
        tabContent.id = "course" + index;
        return tabContent;
    };

    Board.prototype.handleEvent = function(e) {
        switch (e.type) {
            case "click":
                this.doClick(e);
                break;
        }
    };

    Board.prototype.show = function(show) {
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