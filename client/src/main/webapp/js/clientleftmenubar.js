/**
 *
 */

;
(function ($, window, document, undefined) {
    var pluginName = "clientLeftMenuBar";
    var defaults = {
        id: "",
        parent: "",
        sessionId : "",
        mycate : "",
    };

    var LeftMenuBar = function (element, options) {
        this.element = element;
        this.options = $.extend({
            id: "",
            parent: "",
            sessionId : "",
            mycate : "",
        }, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init(options);
    };

    LeftMenuBar.prototype.init = function (options) {
        this.createSrOnly();
        // .sidebar-nav
        var sidebar = document.createElement("DIV");
        this.element.appendChild(sidebar);
        sidebar.id = "slidebar-white";
        sidebar.className = "slidebar-nav";
        sidebar.style.top = "50px";

        var sidebarNav = document.createElement("NAV");
        sidebar.appendChild(sidebarNav);
        sidebarNav.id = "navbar-white";
        sidebarNav.className = "navbar navbar-default";
        //sidebarNav.className = "";
        sidebarNav.setAttribute("role", "navigation");

        var ul = document.createElement("UL");
        sidebarNav.appendChild(ul);
        ul.id = options.id + "leftBar";
        ul.className = "nav navbar-nav";
        ul.style.cursor = "pointer";

        this.item1 = this.createMenuItem(options.id + "home", ul,
            "fa fa-home fa-lg", "首页", "", "#0d4b09");
        this.item2 = this.createMenuItem(options.id + "news", ul,
            "fa fa-newspaper-o", "新闻动态", "", "#f3331e");
        this.item6 = this.createMenuItem(options.id + "queue", ul,
            "fa fa-briefcase", "待办事宜", "", "#652514");
        this.item3 = this.createMenuItem(options.id + "service", ul,
            "fa fa-book", "课程资料", "","#992d96");
        this.item4 = this.createMenuItem(options.id + "alarm", ul,
            "fa fa-file-text-o", "文件管理", "","#1a8931");
        this.createSeperate(ul);
        if (options.mycate == "教师") {
            this.item7 = this.createMenuItem(options.id + "alarm", ul,
                "fa fa-file-text", "学生习作", "","#1a8931");
            this.createSeperate(ul);
        } else if (options.mycate == "学生") {
            this.item10 = this.createMenuItem(options.id + "mypayment", ul,
                "fa fa-credit-card", "服务订购", "", "#1129dc");
            this.item16 = this.createMenuItem(options.id + "myshoppingcart", ul,
                "fa fa-shopping-cart", "我的订单", "", "#5f65b3");
            this.item15 = this.createMenuItem(options.id + "myorder", ul,
                "fa fa-bars", "我的订购", "", "#b32d11");
            this.item17 = this.createMenuItem(options.id + "myinvoice", ul,
                "fa fa-file-o", "我的发票", "", "#5f65b3");
            this.createSeperate(ul);
        }
        this.item8 = this.createMenuItem(options.id + "profile", ul,
            "fa fa-user", "个人资料", "", "#006699");
        this.item11 = this.createMenuItem(options.id + "updatepassword", ul,
            "fa fa-key", "更改密码", "", "#ffb045");
        this.item13 = this.createMenuItem(options.id + "feedback", ul,
            "fa fa-commenting-o", "反馈", "", "#ab9208");

        this.select(this.item1);

        // this.item7 = this.createMenuItem(options.id + "chat", ul,
        //     "fa fa-comments-o fa-lg", "工作沟通", "", "#006699");
        // this.item5 = this.createMenuItem(options.id + "pricing", ul,
        // 	"fa fa-jpy fa-lg", "套餐选择", "");
        // this.item9 = this.createMenuItem(options.id + "favor", ul,
        // 		"glyphicon glyphicon-heart", "我的收藏", "","#006699");
        // this.item10 = this.createMenuItem(options.id + "payment", ul,
        // 	"fa fa-credit-card", "付款账号", "","#006699");
        // this.item12 = this.createMenuItem(options.id + "setting", ul,
        //     "fa fa-cogs", "设置", "", "#006699");
        // this.item14 = this.createMenuItem(options.id + "help", ul,
        // 		"glyphicon glyphicon-question-sign", "求助", "","#006699");
        // this.item1 = this.createMenuItem(options.id + "home", ul,
        // 		"glyphicon glyphicon-home", "首页", "");
        // this.item2 = this.createMenuItem(options.id + "news", ul,
        // 		"glyphicon glyphicon-fire", "新闻", "");
        // this.item3 = this.createMenuItem(options.id + "notice", ul,
        // 		"glyphicon glyphicon-bullhorn", "通知", "");
        // this.item4 = this.createMenuItem(options.id + "alarm", ul,
        // 		"glyphicon glyphicon-bell", "提醒", "");
        // this.createSeperate(ul);
        // this.item5 = this.createMenuItem(options.id + "new", ul,
        // 		"glyphicon glyphicon-plus", "开始", "");
        // this.item6 = this.createMenuItem(options.id + "queue", ul,
        // 		"glyphicon glyphicon-hourglass", "待办", "");
        // this.item7 = this.createMenuItem(options.id + "chat", ul,
        // 		"glyphicon glyphicon-earphone", "沟通", "");
        // this.createSeperate(ul);
        // this.item8 = this.createMenuItem(options.id + "profile", ul,
        // 		"glyphicon glyphicon-user", "个人资料", "");
        // this.item9 = this.createMenuItem(options.id + "favor", ul,
        // 		"glyphicon glyphicon-heart", "我的收藏", "");
        // this.item10 = this.createMenuItem(options.id + "payment", ul,
        // 		"glyphicon glyphicon-credit-card", "付款账号", "");
        // this.item11 = this.createMenuItem(options.id + "updatepassword", ul,
        // 		"glyphicon glyphicon-plus", "更改密码", "");
        // this.item12 = this.createMenuItem(options.id + "setting", ul,
        // 		"glyphicon glyphicon-cog", "设置", "");
        // this.item13 = this.createMenuItem(options.id + "feedback", ul,
        // 		"glyphicon glyphicon-headphones", "反馈", "");
        // this.item14 = this.createMenuItem(options.id + "help", ul,
        // 		"glyphicon glyphicon-question-sign", "求助", "");

    };

    LeftMenuBar.prototype.createSrOnly = function () {
        this.sronly = document.createElement("SPAN");
        this.sronly.className = "sr-only";
        this.sronly.innerHTML = "(current)";
    };

    LeftMenuBar.prototype.createMenuItem = function (id, parent, icon, title,
                                                     url, color) {
        var item = document.createElement("LI");
        parent.appendChild(item);
        item.name = "item" + id;
        item.addEventListener('click', this, false);

        var a = document.createElement("A");
        item.appendChild(a);

        var span = document.createElement("SPAN");
        a.appendChild(span);
        span.className = icon;
        span.style.color = color;

        var text = document.createElement("FONT");
        a.appendChild(text);
        //text.style.color = color;
        text.innerHTML = "&nbsp;&nbsp;" + title;

        var span1 = document.createElement("SPAN");
        a.appendChild(span1);
        span1.className = "badge";
        span1.style.padding = "4px";
        span1.style.width = "10px";
        span1.style.height = "10px";
        span1.style.backgroundColor = "#DE3434";
        span1.style.color = "#DE3434";
        span1.style.borderRadius = "50%";
        span1.innerHTML = "";

        return item;
    };

    LeftMenuBar.prototype.loadPane = function (item) {
        this.options.parent.hiddenAll();
        if (item == this.item1) {
            this.options.parent.dashboard.show(true);
        } else if (item == this.item2) {
            this.options.parent.newsBoard.show(true);
        } else if (item == this.item3) {
            this.options.parent.contentServicePane.show(true);
        } else if (item == this.item4) {
            this.options.parent.fileManagerPane.show(true);
        } else if (item == this.item5) {
            this.options.parent.addBoard.show(true);
        } else if (item == this.item6) {
            this.setBadge(this.item6, 0);
            this.options.parent.queuePane.show(true);
        } else if (item == this.item7) {
            this.options.parent.studentHomeworkPane.show(true);
        } else if (item == this.item8) {
            this.options.parent.personalDetailPane.show(true);
        } else if (item == this.item9) {
            this.options.parent.myFavorPane.show(true);
        } else if (item == this.item10) {
            this.options.parent.myPaymentPane.show(true);
        } else if (item == this.item11) {
            this.options.parent.updatePasswordPane.show(true);
        } else if (item == this.item12) {
            this.options.parent.mySettingPane.show(true);
        } else if (item == this.item13) {
            this.options.parent.myFeedbackPane.show(true);
        } else if (item == this.item14) {
            this.options.parent.getHelpPane.show(true);
        } else if (item == this.item15) {
            this.options.parent.myOrderPane.show(true);
        } else if (item == this.item16) {
            this.options.parent.myShoppingCartPane.show(true);
        } else if (item == this.item17) {
            this.options.parent.myInvoicePane.show(true);
        }
    };

    LeftMenuBar.prototype.createSeperate = function (parent) {
        var item = document.createElement("LI");
        parent.appendChild(item);
        item.name = "seperateline";
        item.className = "divider";
        item.setAttribute("role", "separator");
        return item;
    };

    LeftMenuBar.prototype.handleEvent = function (e) {
        switch (e.type) {
            case "click":
                this.doClick(e);
                break;
        }
    };

    LeftMenuBar.prototype.setItem6Badge = function (num) {
        var c = this.item6.childNodes[0].lastChild.textContent;
        if (c != "") {
            c = parseInt(c) + parseInt(num);
        } else {
            c = num;
        }
        this.setBadge(this.item6, c);
    };

    LeftMenuBar.prototype.cancelBadge = function () {
        this.setBadge(this.item6, 0);
    };

    LeftMenuBar.prototype.setBadge = function (parent, num) {
        if (num != 0 && num != "0" && num != "") {
            parent.childNodes[0].lastChild.innerHTML = " ";
        } else {
            parent.childNodes[0].lastChild.innerHTML = "";
        }
    };

    LeftMenuBar.prototype.select = function (item) {
        var ul = document.getElementById(this.options.id + "leftBar");
        if (ul.childNodes.length > 0) {
            for (var i = 0; i < ul.childNodes.length; i++) {
                if (ul.childNodes[i].name != "seperateline") {
                    ul.childNodes[i].className = "";
                    // ul.childNodes[i] is <li>;
                    // ul.childNodes[i].childNodes[0] is <a>;
                    if (ul.childNodes[i].childNodes[0].contains(this.sronly)) {
                        ul.childNodes[i].childNodes[0].removeChild(this.sronly);
                    }
                }
            }
        }
        item.className = "active";
        // item.childNodes[0].appendChild(this.sronly);
        item.childNodes[0].insertBefore(this.sronly,
            item.childNodes[0].childNodes[1]);
    };

    LeftMenuBar.prototype.addBadge = function (item, number) {
        if (number == "") {
            return;
        }
        var ul = document.getElementById(this.options.id + "leftBar");
        if (ul.childNodes.length > 0) {
            for (var i = 0; i < ul.childNodes.length; i++) {
                if (ul.childNodes[i].name != "seperateline") {
                    if (item == ul.childNodes[i]
                        && ul.childNodes[i].childNodes[0].lastChild.className == "badge") {
                        ul.childNodes[i].childNodes[0].lastChild.innerHTML = number;
                    }
                }
            }
        }
    };

    LeftMenuBar.prototype.doClick = function (evt) {
        var t = evt.target;
        if (t.nodeName == "LI") {
            this.select(t);
            // show panel plugin
            this.loadPane(t);
        } else if (t.nodeName = "A" && t.parentNode.nodeName == "LI") {
            this.select(t.parentNode);
            // show panel plugin
            this.loadPane(t.parentNode);
        } else if (t.nodeName = "SPAN" && t.parentNode.nodeName == "A"
            && t.parentNode.parentNode.nodeName == "LI") {
            this.select(t.parentNode.parentNode);
            // show panel plugin
            this.loadPane(t.parentNode.parentNode);
        }
        if (evt && evt.stopPropagation)
            evt.stopPropagation();
        else
            window.event.cancelBubble = true;

    };

    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, pluginName)) {
                $.data(this, pluginName, new LeftMenuBar(this, options));
            } else if ($.isFunction(Plugin.prototype[options])) {
                $.data(this, pluginName)[options]();
            }
        });
    };

})(jQuery, window, document);