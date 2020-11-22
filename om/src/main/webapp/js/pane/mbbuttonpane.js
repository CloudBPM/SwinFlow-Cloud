/**
 *
 */
;
(function ($, window, document, undefined) {
    var pluginName = "buttonPane";
    var defaults = {
        id: "",
        ownerId: "",
        parent: "",
        entity: "",// mobile button object
        topparent: "",
        currOwner: "",
    };

    var ButtonPanel = function (element, options) {
        this.element = element;
        this.options = $.extend({
            id: "",
            ownerId: "",
            parent: "",
            entity: "",// category object
            topparent: "",
            currOwner: "",
        }, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.topparent = options.topparent;
        this.tabId = options.tabid;
        this.entity = options.entity;
        this.currOwner = options.currOwner;
        this.init(options);
    };

    ButtonPanel.prototype.init = function (options) {
        this.entity = options.entity;
        var modalframe = document.createElement("div");
        this.element.appendChild(modalframe);

        var form = document.createElement("form");
        modalframe.appendChild(form);
        form.className = "form-horizontal";
        form.style.padding = "4px";

        var group00 = document.createElement("div");
        form.appendChild(group00);
        group00.className = "form-group";

        var label00 = document.createElement("label");
        group00.appendChild(label00);
        label00.className = "col-sm-2 control-label";
        label00.innerHTML = "前景图片";

        var img00 = document.createElement("div");
        group00.appendChild(img00);
        img00.className = "col-sm-10";

        this.fgImageInput = document.createElement("INPUT");
        img00.appendChild(this.fgImageInput);
        this.fgImageInput.type = "Text";
        this.fgImageInput.className = "form-control";
        this.fgImageInput.setAttribute("placeholder", "按钮前景图片的URL");
        this.fgImageInput.addEventListener("change", this, false);

        var group01 = document.createElement("div");
        form.appendChild(group01);
        group01.className = "form-group";

        var label01 = document.createElement("label");
        group01.appendChild(label01);
        label01.className = "col-sm-2 control-label";
        label01.innerHTML = "背景图片";

        var img01 = document.createElement("div");
        group01.appendChild(img01);
        img01.className = "col-sm-10";

        this.bgImageInput = document.createElement("INPUT");
        img01.appendChild(this.bgImageInput);
        this.bgImageInput.type = "Text";
        this.bgImageInput.className = "form-control";
        this.bgImageInput.setAttribute("placeholder", "按钮背景图片的URL");
        this.bgImageInput.addEventListener("change", this, false);

        // ------------------------------------------
        // 点击操作设置

        // button props
        var group1 = document.createElement("div");
        form.appendChild(group1);
        group1.className = "checkbox";

        var groupLabel1 = document.createElement("label");
        group1.appendChild(groupLabel1);

        this.clickmeInput = document.createElement("input");
        this.clickmeInput.name = "clickme" + options.id;
        this.clickmeInput.type = "checkbox";
        groupLabel1.appendChild(this.clickmeInput);
        this.clickmeInput.addEventListener("click", this, false);

        var node1 = document.createTextNode("点击操作设置");
        groupLabel1.appendChild(node1);

        // ----

        var frmgroup2 = document.createElement("div");
        form.appendChild(frmgroup2);
        frmgroup2.className = "form-group";

        // radio props1
        var group2 = document.createElement("div");
        frmgroup2.appendChild(group2);
        group2.className = "radio";

        var webdiv2 = document.createElement("div");
        webdiv2.className = "col-lg-4 col-md-4 col-sm-12 col-xs-12";
        group2.appendChild(webdiv2);

        var groupLabel2 = document.createElement("label");
        webdiv2.appendChild(groupLabel2);

        this.optionInput1 = document.createElement("input");
        this.optionInput1.name = "optionme1" + options.id;
        this.optionInput1.type = "radio";
        webdiv2.appendChild(this.optionInput1);
        this.optionInput1.addEventListener("click", this, false);

        var node2 = document.createTextNode("打开Web应用微服务");
        webdiv2.appendChild(node2);

        var websettingdiv2 = document.createElement("div");
        group2.appendChild(websettingdiv2);
        websettingdiv2.className = "col-lg-8 col-md-8 col-sm-12 col-xs-12";


        var inputgroup2 = document.createElement("DIV");
        websettingdiv2.appendChild(inputgroup2);
        inputgroup2.className = "input-group";
        inputgroup2.style.padding = "2px";
        inputgroup2.setAttribute("role", "search");
        inputgroup2.setAttribute("aria-label", "");

        this.websettingInput1 = document.createElement("input");
        inputgroup2.appendChild(this.websettingInput1);
        this.websettingInput1.name = "websettingInput1" + options.id;
        this.websettingInput1.type = "text";
        this.websettingInput1.className = "form-control";
        this.websettingInput1.setAttribute("placeholder", "选择可用的Web应用微服务插件");
        this.websettingInput1.addEventListener("change", this, false);

        var searchSpan2 = document.createElement("span");
        inputgroup2.appendChild(searchSpan2);
        searchSpan2.className = "input-group-btn";

        this.searchBtn2 = this.createTool(searchSpan2, "searchAppBtn2"
            + options.id, "打开微服务商店查找可用的微服务", "btn btn-primary", "i",
            "fa fa-search fa-lg");

        // ----

        var frmgroup3 = document.createElement("div");
        form.appendChild(frmgroup3);
        frmgroup3.className = "form-group";

        // radio props2
        var group3 = document.createElement("div");
        frmgroup3.appendChild(group3);
        group3.className = "radio";

        var appdiv3 = document.createElement("div");
        appdiv3.className = "col-lg-4 col-md-4 col-sm-12 col-xs-12";
        group3.appendChild(appdiv3);

        var groupLabel3 = document.createElement("label");
        appdiv3.appendChild(groupLabel3);

        this.optionInput2 = document.createElement("input");
        this.optionInput2.name = "optionme1" + options.id;
        this.optionInput2.type = "radio";
        groupLabel3.appendChild(this.optionInput2);
        this.optionInput2.addEventListener("click", this, false);

        var node3 = document.createTextNode("打开手机APP微服务插件");
        groupLabel3.appendChild(node3);

        var appsettingdiv3 = document.createElement("div");
        group3.appendChild(appsettingdiv3);
        appsettingdiv3.className = "col-lg-8 col-md-8 col-sm-12 col-xs-12";


        var inputgroup3 = document.createElement("DIV");
        appsettingdiv3.appendChild(inputgroup3);
        inputgroup3.className = "input-group";
        inputgroup3.style.padding = "2px";
        inputgroup3.setAttribute("role", "search");
        inputgroup3.setAttribute("aria-label", "");

        this.appsettingInput2 = document.createElement("input");
        inputgroup3.appendChild(this.appsettingInput2);
        this.appsettingInput2.name = "appsettingInput2" + options.id;
        this.appsettingInput2.type = "text";
        this.appsettingInput2.className = "form-control";
        this.appsettingInput2.setAttribute("placeholder", "选择可用的手机APP微服务插件");
        this.appsettingInput2.addEventListener("change", this, false);

        var searchSpan3 = document.createElement("span");
        inputgroup3.appendChild(searchSpan3);
        searchSpan3.className = "input-group-btn";

        this.searchBtn3 = this.createTool(searchSpan3, "searchAppBtn3"
            + options.id, "打开微服务商店查找可用的微服务", "btn btn-primary", "i",
            "fa fa-search fa-lg");

        // ------------------------------------------------
        // 长按操作设置


        // button props
        var group4 = document.createElement("div");
        form.appendChild(group4);
        group4.className = "checkbox";

        var groupLabel4 = document.createElement("label");
        group4.appendChild(groupLabel4);

        this.longPressMeInput = document.createElement("input");
        this.longPressMeInput.name = "longpress" + options.id;
        this.longPressMeInput.type = "checkbox";
        groupLabel4.appendChild(this.longPressMeInput);
        this.longPressMeInput.addEventListener("click", this, false);

        var node4 = document.createTextNode("长按操作设置");
        groupLabel4.appendChild(node4);


        // ----

        var frmgroup5 = document.createElement("div");
        form.appendChild(frmgroup5);
        frmgroup5.className = "form-group";

        // radio props1
        var group5 = document.createElement("div");
        frmgroup5.appendChild(group5);
        group5.className = "radio";

        var webdiv5 = document.createElement("div");
        webdiv5.className = "col-lg-4 col-md-4 col-sm-12 col-xs-12";
        group5.appendChild(webdiv5);

        var groupLabel5 = document.createElement("label");
        webdiv5.appendChild(groupLabel5);

        this.optionInput3 = document.createElement("input");
        this.optionInput3.name = "optionme2" + options.id;
        this.optionInput3.type = "radio";
        webdiv5.appendChild(this.optionInput3);
        this.optionInput3.addEventListener("click", this, false);

        var node5 = document.createTextNode("打开Web应用微服务");
        webdiv5.appendChild(node5);

        var websettingdiv5 = document.createElement("div");
        group5.appendChild(websettingdiv5);
        websettingdiv5.className = "col-lg-8 col-md-8 col-sm-12 col-xs-12";

        var inputgroup5 = document.createElement("DIV");
        websettingdiv5.appendChild(inputgroup5);
        inputgroup5.className = "input-group";
        inputgroup5.style.padding = "2px";
        inputgroup5.setAttribute("role", "search");
        inputgroup5.setAttribute("aria-label", "");

        this.websettingInput3 = document.createElement("input");
        inputgroup5.appendChild(this.websettingInput3);
        this.websettingInput3.name = "websettingInput3" + options.id;
        this.websettingInput3.type = "text";
        this.websettingInput3.className = "form-control";
        this.websettingInput3.setAttribute("placeholder", "选择可用的Web应用微服务插件");
        this.websettingInput3.addEventListener("change", this, false);

        var searchSpan5 = document.createElement("span");
        inputgroup5.appendChild(searchSpan5);
        searchSpan5.className = "input-group-btn";

        this.searchBtn5 = this.createTool(searchSpan5, "searchAppBtn5"
            + options.id, "打开微服务商店查找可用的微服务", "btn btn-primary", "i",
            "fa fa-search fa-lg");

        // -----

        var frmgroup6 = document.createElement("div");
        form.appendChild(frmgroup6);
        frmgroup6.className = "form-group";

        // radio props2
        var group6 = document.createElement("div");
        frmgroup6.appendChild(group6);
        group6.className = "radio";

        var appdiv6 = document.createElement("div");
        appdiv6.className = "col-lg-4 col-md-4 col-sm-12 col-xs-12";
        group6.appendChild(appdiv6);

        var groupLabel6 = document.createElement("label");
        appdiv6.appendChild(groupLabel6);

        this.optionInput4 = document.createElement("input");
        this.optionInput4.name = "optionme2" + options.id;
        this.optionInput4.type = "radio";
        groupLabel6.appendChild(this.optionInput4);
        this.optionInput4.addEventListener("click", this, false);

        var node6 = document.createTextNode("打开手机APP微服务插件");
        groupLabel6.appendChild(node6);

        var appsettingdiv6 = document.createElement("div");
        group6.appendChild(appsettingdiv6);
        appsettingdiv6.className = "col-lg-8 col-md-8 col-sm-12 col-xs-12";

        var inputgroup6 = document.createElement("DIV");
        appsettingdiv6.appendChild(inputgroup6);
        inputgroup6.className = "input-group";
        inputgroup6.style.padding = "2px";
        inputgroup6.setAttribute("role", "search");
        inputgroup6.setAttribute("aria-label", "");

        this.appsettingInput4 = document.createElement("input");
        inputgroup6.appendChild(this.appsettingInput4);
        this.appsettingInput4.name = "appsettingInput4" + options.id;
        this.appsettingInput4.type = "text";
        this.appsettingInput4.className = "form-control";
        this.appsettingInput4.setAttribute("placeholder", "选择可用的手机APP微服务插件");
        this.appsettingInput4.addEventListener("change", this, false);

        var searchSpan6 = document.createElement("span");
        inputgroup6.appendChild(searchSpan6);
        searchSpan6.className = "input-group-btn";

        this.searchBtn6 = this.createTool(searchSpan6, "searchAppBtn6"
            + options.id, "打开微服务商店查找可用的微服务", "btn btn-primary", "i",
            "fa fa-search fa-lg");

        // application store
        var plugin3 = $(this.topparent).processServiceStoreDialog({
            id: options.id,
            title: vendor + " - 应用商店",
            parent: this,
            topparent: this.topparent,
        });
        this.procstoredialog = plugin3.data("processServiceStoreDialog");
        // micro service store
        var plugin4 = $(this.topparent).microServiceStoreDialog({
            id: options.id,
            title: vendor + " - 微服务商店",
            parent: this,
            topparent: this.topparent,
        });
        this.mstoredialog = plugin4.data("microServiceStoreDialog");

        this.initialize();
    };

    ButtonPanel.prototype.initialize = function () {
        // initialized status
        this.websettingInput1.disabled = true;
        this.appsettingInput2.disabled = true;
        this.websettingInput3.disabled = true;
        this.appsettingInput4.disabled = true;

        this.fgImageInput.value = this.entity.frontgroundIcon;
        this.bgImageInput.value = this.entity.backgroundImage;

        if (this.entity.clickMeOption == 0) {
            this.websettingInput1.value = this.entity.clickMeUrl;
        } else if (this.entity.clickMeOption == 1) {
            this.appsettingInput2.value = this.entity.clickMeUrl;
        }
        if (this.entity.longPressMeOption == 0) {
            this.websettingInput3.value = this.entity.longPressMeUrl;
        } else if (this.entity.longPressMeOption == 1) {
            this.appsettingInput4.value = this.entity.longPressMeUrl;
        }

        this.searchBtn2.disabled = true;
        this.searchBtn3.disabled = true;
        this.searchBtn5.disabled = true;
        this.searchBtn6.disabled = true;
        // setting status
        if (this.entity != null) {
            if (this.entity.clickMe == 0) {
                this.clickmeInput.checked = false;
                this.optionInput1.disabled = true;
                this.optionInput2.disabled = true;
            } else {
                this.clickmeInput.checked = true;
                this.optionInput1.disabled = false;
                this.optionInput2.disabled = false;
            }
            if (this.entity.longPressMe == 0) {
                this.longPressMeInput.checked = false;
                this.optionInput3.disabled = true;
                this.optionInput4.disabled = true;
            } else {
                this.longPressMeInput.checked = true;
                this.optionInput3.disabled = false;
                this.optionInput4.disabled = false;
            }
            if (this.entity.clickMe == 1) {
                if (this.entity.clickMeOption == 0) {
                    this.optionInput1.checked = true;
                    this.optionInput2.checked = false;
                    this.searchBtn2.disabled = false;
                    this.searchBtn3.disabled = true;
                } else {
                    this.optionInput1.checked = false;
                    this.optionInput2.checked = true;
                    this.searchBtn2.disabled = true;
                    this.searchBtn3.disabled = false;
                }
            } else {
                this.optionInput1.disabled = true;
                this.optionInput2.disabled = true;
                this.searchBtn2.disabled = true;
                this.searchBtn3.disabled = true;
            }
            if (this.entity.longPressMe == 1) {
                if (this.entity.longPressMeOption == 0) {
                    this.optionInput3.checked = true;
                    this.optionInput4.checked = false;
                    this.searchBtn5.disabled = false;
                    this.searchBtn6.disabled = true;
                } else {
                    this.optionInput3.checked = false;
                    this.optionInput4.checked = true;
                    this.searchBtn5.disabled = true;
                    this.searchBtn6.disabled = false;
                }
            } else {
                this.optionInput3.disabled = true;
                this.optionInput4.disabled = true;
                this.searchBtn5.disabled = true;
                this.searchBtn6.disabled = true;
            }
        }
    };

    ButtonPanel.prototype.createTool = function (group, id, title, style, fonttag, fontclass) {
        var button = document.createElement("button");
        group.appendChild(button);
        button.className = style;
        button.setAttribute("title", title);
        button.type = "button";
        button.id = id;
        button.addEventListener('click', this, false);
        var icon = document.createElement(fonttag);
        button.appendChild(icon);
        icon.addEventListener('click', this, false);
        icon.className = fontclass;
        icon.setAttribute("title", title);
        icon.id = id;
        return button;
    };

    ButtonPanel.prototype.handleEvent = function (e) {
        switch (e.type) {
            case "click":
                this.doClick(e);
                break;
            case "change":
                this.doChange(e);
                break;
        }
    };

    ButtonPanel.prototype.doChange = function (evt) {
        if (evt.target == this.fgImageInput) {
            map[this.currOwner.id].stack.execute(new OMMbPropChangedCmd(this.entity,
                "frontgroundIcon", this.fgImageInput.value, this.currOwner.id));
        } else if (evt.target == this.bgImageInput) {
            map[this.currOwner.id].stack.execute(new OMMbPropChangedCmd(this.entity,
                "backgroundImage", this.bgImageInput.value, this.currOwner.id));
        }
    };

    ButtonPanel.prototype.doClick = function (evt) {
        if (evt.target == this.clickmeInput) {
            if (this.clickmeInput.checked) {
                map[this.currOwner.id].stack.execute(new OMMbPropChangedCmd(this.entity,
                    "clickMe", 1, this.currOwner.id));
            } else {
                map[this.currOwner.id].stack.execute(new OMMbPropChangedCmd(this.entity,
                    "clickMe", 0, this.currOwner.id));
            }
            return;
        }
        if (evt.target == this.longPressMeInput) {
            if (this.longPressMeInput.checked) {
                map[this.currOwner.id].stack.execute(new OMMbPropChangedCmd(this.entity,
                    "longPressMe", 1, this.currOwner.id));
            } else {
                map[this.currOwner.id].stack.execute(new OMMbPropChangedCmd(this.entity,
                    "longPressMe", 0, this.currOwner.id));
            }
            return;
        }
        if (evt.target == this.optionInput1) {
            map[this.currOwner.id].stack.execute(new OMMbPropChangedCmd(this.entity,
                "clickMeOption", 0, this.currOwner.id));
            return;
        }
        if (evt.target == this.optionInput2) {
            map[this.currOwner.id].stack.execute(new OMMbPropChangedCmd(this.entity,
                "clickMeOption", 1, this.currOwner.id));
            return;
        }
        if (evt.target == this.optionInput3) {
            map[this.currOwner.id].stack.execute(new OMMbPropChangedCmd(this.entity,
                "longPressMeOption", 0, this.currOwner.id));
            return;
        }
        if (evt.target == this.optionInput4) {
            map[this.currOwner.id].stack.execute(new OMMbPropChangedCmd(this.entity,
                "longPressMeOption", 1, this.currOwner.id));
            return;
        }
        if (evt.target == this.searchBtn2
            || (evt.target.id == ("searchAppBtn2" + this.options.id))) {
            this.procstoredialog.show(1);
        } else if (evt.target == this.searchBtn3
            || (evt.target.id == ("searchAppBtn3" + this.options.id))) {
            this.mstoredialog.show(2);
        } else if (evt.target == this.searchBtn5
            || (evt.target.id == ("searchAppBtn5" + this.options.id))) {
            this.procstoredialog.show(3);
        } else if (evt.target == this.searchBtn6
            || (evt.target.id == ("searchAppBtn6" + this.options.id))) {
            this.mstoredialog.show(4);
        }
    };

    // apn: micro service name; t: 1: micro service; 2:java(not use)
    // pw: micro service security key; v: micro service ID; ap: micro service ID;
    // src : source
    ButtonPanel.prototype.setAppSearchResult = function (apn, t, v, ap, pw, src) {
        $("progressbar").show();
        var that = this;
        $.getJSON(service.api(43, this.options.ownerId), {
            id: v,
        }).complete(function (data) {
            var data = JSON.parse(data.responseText);
            if (src == 2) {
                map[that.currOwner.id].stack.execute(
                    new OMMbDblPropChangedCmd(
                        that.entity, "clickMeUrl", data.id, "alias",
                        data.alias, that.currOwner.id));
            } else if (src == 4) {
                map[that.currOwner.id].stack.execute(
                    new OMMbDblPropChangedCmd(
                        that.entity, "longPressMeUrl", data.id, "alias",
                        data.alias, that.currOwner.id));
            }
            $("#progressbar").hide();
        });
    };

    // id: process application ID, name: process application name, src : source
    ButtonPanel.prototype.setProcSearchResult = function (id, name, src) {
        if (src == 1) {
            map[this.currOwner.id].stack.execute(new OMMbPropChangedCmd(this.entity,
                "clickMeUrl", id, this.currOwner.id));
        } else if (src == 3) {
            map[this.currOwner.id].stack.execute(new OMMbPropChangedCmd(this.entity,
                "longPressMeUrl", id, this.currOwner.id));
        }
    };

    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, pluginName)) {
                $.data(this, pluginName, new ButtonPanel(this, options));
            } else if ($.isFunction(Plugin.prototype[options])) {
                $.data(this, pluginName)[options]();
            }
        });
    };

})(jQuery, window, document);