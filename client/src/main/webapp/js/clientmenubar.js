/**
 *
 */

;
(function ($, window, document, undefined) {
    var pluginName = "clientTopMenuBar";
    var defaults = {
        title: "",
        user: "",// user ID
        userName: "",// user full name
        websocket : "",
        sessionId : "",
        imgUrl: "",
        ownerId : "",
    };

    var TopMenuBar = function (element, options) {
        this.element = element;
        this.options = $.extend({
            title: "",
            user: "",// user ID
            userName: "",// user full name
            websocket : "",
            sessionId : "",
            imgUrl: "",
            ownerId : "",
        }, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.maincontent = null;
        this.init(options);
        this.manager = null;
    };

    TopMenuBar.prototype.init = function (options) {
        var menuNav = document.createElement("NAV");
        menuNav.className = "navbar navbar-default";
        menuNav.style.marginBottom = "0px";
        menuNav.style.position = "fixed";
        menuNav.style.top = "0px";
        menuNav.style.width = "100%";
        menuNav.style.zIndex = "10";
        menuNav.setAttribute("role", "navigation");
        menuNav.id = "navbar-white";
        this.element.appendChild(menuNav);

        // left
        var barheader = document.createElement("DIV");
        barheader.className = "navbar-header";
        menuNav.appendChild(barheader);

        var headerButton0 = document.createElement("button");
        barheader.appendChild(headerButton0);
        headerButton0.href = "#menu-toggle";
        headerButton0.className = "slidebar-toggle";
        headerButton0.id = "menu-toggle";

        var headerSpan0 = document.createElement("span");
        headerButton0.appendChild(headerSpan0);
        headerSpan0.className = "sr-only";
        headerSpan0.innerHTML = "Toggle sidebar";

        var headerSpan1 = document.createElement("span");
        headerButton0.appendChild(headerSpan1);
        headerSpan1.className = "icon-bar";

        var headerSpan2 = document.createElement("span");
        headerButton0.appendChild(headerSpan2);
        headerSpan2.className = "icon-bar";

        var headerSpan3 = document.createElement("span");
        headerButton0.appendChild(headerSpan3);
        headerSpan3.className = "icon-bar";

        var headerButton1 = document.createElement("button");
        barheader.appendChild(headerButton1);
        headerButton1.type = "button";
        headerButton1.className = "navbar-toggle";
        headerButton1.setAttribute("data-toggle", "collapse");
        headerButton1.setAttribute("data-target", ".navbar-collapse");

        var headerSpan4 = document.createElement("span");
        headerButton1.appendChild(headerSpan4);
        headerSpan4.className = "sr-only";

        var headerSpan5 = document.createElement("span");
        headerButton1.appendChild(headerSpan5);
        headerSpan5.className = "icon-bar";

        var headerSpan6 = document.createElement("span");
        headerButton1.appendChild(headerSpan6);
        headerSpan6.className = "icon-bar";

        var headerSpan7 = document.createElement("span");
        headerButton1.appendChild(headerSpan7);
        headerSpan7.className = "icon-bar";

        var titleA = document.createElement("a");
        titleA.className = "navbar-brand";
        titleA.setAttribute("href", "http://www.xuanqiyun.com");
        titleA.setAttribute("target", "_blank");
        titleA.innerHTML = "<strong>" + options.title + "</strong>";
        barheader.appendChild(titleA);

        var mainmenubar = document.createElement("DIV");
        menuNav.appendChild(mainmenubar);
        mainmenubar.className = "navbar-collapse collapse";

        var barUL = document.createElement("ul");
        barUL.className = "nav navbar-nav";
        mainmenubar.appendChild(barUL);

        this.chatItem = this.createMenuabarItem("chatG", barUL,
            "fa fa-comments fa-lg", "沟通", 2, "javascript:void(0);");

        this.qcodeItem = this.createMenuabarItem("qcodeG", barUL,
            "glyphicon glyphicon-qrcode", "手机端", 1, "javascript:void(0);");

        var fluidbar = document.createElement("DIV");
        mainmenubar.appendChild(fluidbar);
        fluidbar.className = "container-fluid";

        // var searchform = document.createElement("FORM");
        // fluidbar.appendChild(searchform);
        // searchform.className = "navbar-form navbar-left";
        //
        // var formgroup = document.createElement("DIV");
        // searchform.appendChild(formgroup);
        // formgroup.className = "form-group";
        //
        // var inputgroup = document.createElement("DIV");
        // formgroup.appendChild(inputgroup);
        // inputgroup.className = "input-group";
        //
        // this.searchinput = document.createElement("INPUT");
        // inputgroup.appendChild(this.searchinput);
        // this.searchinput.type = "text";
        // this.searchinput.className = "form-control";
        // this.searchinput.id = "searchme";
        // this.searchinput.setAttribute("placeholder", "搜索应用");
        // this.searchinput.addEventListener("keydown", this, false);
        //
        // var searchDiv = document.createElement("DIV");
        // inputgroup.appendChild(searchDiv);
        // searchDiv.className = "input-group-btn";
        //
        // var searchBtn = document.createElement("BUTTON");
        // searchDiv.appendChild(searchBtn);
        // searchBtn.className = "btn btn-primary";
        // searchBtn.type = "button";
        // searchBtn.id = "seachbutton";
        // searchBtn.addEventListener('click', this, false);
        //
        // var searchICON = document.createElement("SPAN");
        // searchBtn.appendChild(searchICON);
        // searchICON.id = "seachicon";
        // searchICON.className = "fa fa-search fa-lg";
        // searchICON.addEventListener('click', this, false);

        var barRightUL = document.createElement("ul");
        fluidbar.appendChild(barRightUL);
        barRightUL.className = "nav navbar-nav navbar-right";

        var barLiItem0 = document.createElement("li");
        barRightUL.appendChild(barLiItem0);

        var barLiItemA0 = document.createElement("A");
        barLiItem0.appendChild(barLiItemA0);
        barLiItemA0.href = "javascript:void(0);";
        barLiItemA0.innerHTML = "<font style='font-size:16px'>您好，" + options.userName
            + "</font>";

        var barLiItem = document.createElement("li");
        barRightUL.appendChild(barLiItem);
        barLiItem.className = "dropdown";

        var barLiItemA = document.createElement("A");
        barLiItem.appendChild(barLiItemA);
        barLiItemA.setAttribute("href", "#");
        barLiItemA.className = "dropdown-toggle";
        barLiItemA.setAttribute("data-toggle", "dropdown");
        barLiItemA.setAttribute("role", "button");
        barLiItemA.setAttribute("aria-haspopup", "true");
        barLiItemA.setAttribute("aria-expanded", "false");

        var otherFont = document.createElement("FONT");
        barLiItemA.appendChild(otherFont);
        otherFont.style.fontSize = "16px";
        otherFont.innerHTML = "其他";

        var otherSPAN = document.createElement("SPAN");
        barLiItemA.appendChild(otherSPAN);
        otherSPAN.className = "caret";

        var barLiItemUl = document.createElement("UL");
        barLiItem.appendChild(barLiItemUl);
        barLiItemUl.className = "dropdown-menu";

        for (var i = 0; i < otherComponents.length; i++) {
            this.createDropdownItem(otherComponents[i].name, barLiItemUl,
                otherComponents[i].url);
        }

        this.createMenuabarItem("logout", barRightUL,
            "glyphicon glyphicon-log-out", "退出", 1,
            "/login/logout.jsp?usr=" + options.user);

        if ($(this.element).qCodeDialog != undefined) {
            var board = $(this.element).qCodeDialog({
                id : "qCodeDialog",
            });
            this.qCodeDialog = board.data("qCodeDialog");
        }

        var p3 = $(this.element).communicationDialog({
            id : "0168",
            parent : this,
            ownerId : this.options.ownerId,
            imgUrl : this.options.imgUrl,
            websocket : this.options.websocket,
            userName : this.options.userName,
            userId : this.options.user,
            sessionId : this.options.sessionId,
        });
        this.communicationDialog = p3.data("communicationDialog");

    };

    TopMenuBar.prototype.createDropdownItem = function (name, parent, url) {
        var barLiItemLi = document.createElement("li");
        parent.appendChild(barLiItemLi);
        var barLiItemLiA = document.createElement("A");
        barLiItemLi.appendChild(barLiItemLiA);
        barLiItemLiA.setAttribute("href", url);
        barLiItemLiA.setAttribute("target", "_blank");
        barLiItemLiA.innerHTML = name;
    };

    TopMenuBar.prototype.createMenuabarItem = function (id, parent, icon, title,
                                                        type, url) {
        var barLiItem = document.createElement("li");
        barLiItem.name = "li" + id;
        parent.appendChild(barLiItem);
        var liA = document.createElement("a");
        liA.setAttribute("href", url);
        barLiItem.appendChild(liA);
        barLiItem.name = "a" + id;

        if (type == 1) { // glyphicon
            var iconSpan = document.createElement("span");
            liA.appendChild(iconSpan);
            iconSpan.className = icon;
            iconSpan.name = "ic" + id;
            iconSpan.addEventListener("click", this, false);
            var itemTitle = document.createElement("span");
            liA.appendChild(itemTitle);
            itemTitle.addEventListener("click", this, false);
            itemTitle.style.fontSize = "16px";
            itemTitle.name = "tl" + id;
            itemTitle.innerHTML = " " + title;
        } else if (type == 2) { // font-awesome icon
            var iconI = document.createElement("i");
            liA.appendChild(iconI);
            iconI.addEventListener("click", this, false);
            iconI.className = icon;
            iconI.name = "ic" + id;
            var itemTitle = document.createElement("span");
            liA.appendChild(itemTitle);
            itemTitle.addEventListener("click", this, false);
            itemTitle.style.fontSize = "16px";
            itemTitle.innerHTML = " " + title;
            itemTitle.name = "tl" + id;

            this.redDot = document.createElement("span");
            liA.appendChild(this.redDot);
            this.redDot.id = "redDot" + id;
            this.redDot.style.position = "absolute";
            this.redDot.style.left = "72px";
            this.redDot.style.top = "12px";
            this.redDot.style.width = "10px";
            this.redDot.style.height = "10px";
            this.redDot.style.background = "#ff4039";
            this.redDot.style.borderRadius = "50%";
            this.redDot.style.display = "none";
        }
        return barLiItem;
    };

    TopMenuBar.prototype.unReadShow = function(isShowCount) {
        if(isShowCount == 0){
            this.redDot.style.display = "none";
        }else{
            this.redDot.style.display = "block";
        }
    };

    var isShow = false;
    TopMenuBar.prototype.allReceiveMsg = function(data) {
        if(isShow){
            this.redDot.style.display = "none";
        }else{
            this.redDot.style.display = "block";
        }
    };

    TopMenuBar.prototype.isShow = function() {
        isShow = false;
    };

    TopMenuBar.prototype.createQCItem = function (id, parent, icon, title,
                                                  type, url) {
        var barLiItem = document.createElement("li");
        barLiItem.id = id;
        parent.appendChild(barLiItem);
        var liA = document.createElement("a");
        liA.setAttribute("href", url);
        barLiItem.appendChild(liA);
        liA.setAttribute("tabindex", "0");
        liA.setAttribute("role", "button");
        liA.setAttribute("data-toggle", "popover");
        liA.setAttribute("data-trigger", "focus");
        liA.setAttribute("title", "扫码同步");
        liA.setAttribute("data-content", "扫一扫");
        liA.innerHTML = "扫码同步";
        return barLiItem;
    }

    TopMenuBar.prototype.doKeydown = function (evt) {
        var e = window.event ? window.event : (evt ? evt : arguments[0]);
        var key = e.keyCode || e.which;
        if (key == 13) {
            evt.preventDefault();
            if (evt.target.value != "") {
                this.maincontent.hiddenAll();
                this.maincontent.searchResultPane.searching(evt.target.value,
                    0, 30);
            }
            return false;
        }
    };

    TopMenuBar.prototype.handleEvent = function (e) {
        switch (e.type) {
            case "click":
                this.doClick(e);
                break;
            case "keydown":
                this.doKeydown(e);
                break;
        }
    };

    TopMenuBar.prototype.doClick = function (evt) {
        var t = evt.target;
        if (t.id == "seachbutton" || t.id == "seachicon") {
            var v = this.searchinput.value;// search...
            this.maincontent.hiddenAll();
            this.maincontent.searchResultPane.searching(this.searchinput.value,
                0, 30);
        } else if (t.tagName == "SPAN") {
            if (t.name == "ic" + "qcodeG" || t.name == "tl" + "qcodeG") {
                this.qCodeDialog.show();
            } else if (t.name == "ic" + "chatG" || t.name == "tl" + "chatG") {
                this.communicationDialog.show(this.options.user);
                isShow = true;
                this.redDot.style.display = "none";
            }
        }
    };

    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, pluginName)) {
                $.data(this, pluginName, new TopMenuBar(this, options));
            } else if ($.isFunction(Plugin.prototype[options])) {
                $.data(this, pluginName)[options]();
            }
        });
    };

})(jQuery, window, document);