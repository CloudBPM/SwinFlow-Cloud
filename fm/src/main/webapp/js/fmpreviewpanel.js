/**
 *
 */

;
(function($, window, document, undefined) {
    var pluginName = "formPreviewPanel";
    var defaults = {
        id : "",
        fid : "",
        r : "",
    };

    var FormPreviewPanel = function(element, options) {
        this.element = element;
        this.options = $.extend({
            id : "",
            fid : "",
            r : "",
        }, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init(options);
    };

    FormPreviewPanel.prototype.init = function(options) {
        var modalframe = document.createElement("DIV");
        this.element.appendChild(modalframe);
        modalframe.className = "container-fluid";

        var row = document.createElement("DIV");
        modalframe.appendChild(row);
        row.className = "row";

        this.createToolbar(options, row);

        var row1 = document.createElement("DIV");
        modalframe.appendChild(row1);
        row1.className = "row";

        var previewPane = document.createElement("div");
        row1.appendChild(previewPane);
        previewPane.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";
        previewPane.style.overflow = "scroll";
        previewPane.style.height = "748px";
        previewPane.style.boxSizing = "border-box";

        var mainPane = document.createElement("div");
        previewPane.appendChild(mainPane);

        mainPane.style.background = "#a6a6a6";
        mainPane.style.background = "linear-gradient(#8c8c8c, #bfbfbf)";
        mainPane.style.boxSizing = "border-box";
        mainPane.style.minWidth = "1080px";
        mainPane.style.minHeight = "748px";

        this.devicePane = document.createElement("div");
        mainPane.appendChild(this.devicePane);
        this.devicePane.className = "preview";
        this.devicePane.style.border = "2px solid black";
        this.devicePane.style.boxSizing = "border-box";
        this.devicePane.style.width = "1920px";
        this.devicePane.style.height = "1080px";
        this.devicePane.style.backgroundColor = "white";
        this.devicePane.style.boxShadow = "10px 10px 10px black";
        this.devicePane.style.overflow = "scroll";

        var dialog = $(this.element).alertBox({
            id : this.options.id,
        });
        this.messageBox = dialog.data("alertBox");

        this.loadingObject(options, this.devicePane);

    };

    FormPreviewPanel.prototype.createToolbar = function(options, parentPane) {
        var parent = document.createElement("DIV");
        parentPane.appendChild(parent);
        parent.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";
        parent.style.backgroundColor = "#fff";
        parent.style.margin = "0px";
        parent.style.padding = "2px";

        var c = "btn btn-default";
        var c2 = "btn btn-primary";

        var g3 = this.createGroup(parent);
        this.printbutton = this.createTool(g3, "print" + this.options.id, "打印",
            c2, "i", "fa fa-print fa-lg");

        var g5 = this.createGroup(parent);
        this.mobile = this.createTool(g5, "mobile" + this.options.id, "智能手机",
            c, "i", "fa fa-mobile fa-lg");
        this.tablet = this.createTool(g5, "tablet" + this.options.id, "平板电脑",
            c, "i", "fa fa-tablet fa-lg");
        this.laptop = this.createTool(g5, "laptop" + this.options.id, "手提电脑",
            c, "i", "fa fa-laptop fa-lg");
        this.desktop = this.createTool(g5, "desktop" + this.options.id, "台式电脑",
            c, "i", "fa fa-desktop fa-lg");
        this.desktop.classList.add("active");

        var g4 = this.createGroup(parent);
        this.landscape = this.createTool(g4, "landscape" + this.options.id,
            "设备横放的界面效果", c, "i", "fa fa-arrows-h fa-lg");
        this.portrait = this.createTool(g4, "portrait" + this.options.id,
            "设备竖放的界面效果", c, "i", "fa fa-arrows-v fa-lg");
        this.landscape.classList.add("active");
        this.lp = 0;// 0: landscape; 1: portrait

    };

    FormPreviewPanel.prototype.createGroup = function(parent) {
        var group = document.createElement("DIV");
        parent.appendChild(group);
        group.className = "btn-group";
        group.style.padding = "2px";
        group.setAttribute("role", "group");
        group.setAttribute("aria-label", "");
        return group;
    };

    FormPreviewPanel.prototype.createTool = function(group, id, title, style,
                                                fonttag, fontclass) {
        var button = document.createElement("button");
        group.appendChild(button);
        button.className = style;
        button.setAttribute("title", title);
        button.type = "button";
        button.id = id;
        button.addEventListener('click', this, false);
        var icon = document.createElement(fonttag);
        button.appendChild(icon);
        icon.className = fontclass;
        icon.setAttribute("title", title);
        icon.id = id;
        return button;
    };

    FormPreviewPanel.prototype.addOptions = function(parent, title, value, index) {
        var option = document.createElement("option");
        option.text = title;
        option.value = value;
        parent.options.add(option, index);
    };

    FormPreviewPanel.prototype.loadingObject = function(options, pane) {
        var that = this;
        $("#progressbar").show();
        $.getJSON(service.api(5), {
            id : options.fid,
            r : options.r,
        }).complete(function(data) {
            that.currObject = new Form();
            that.currObject.parseFromJSON(data.responseJSON, 1);
            //that.currObject = that.currObject.clone(); // this clone is for preview
            while (pane.hasChildNodes()) { // clear dom
                pane.removeChild(pane.firstChild);
            }
            that.currObject.toDomForHTML(pane);
        });
    };

    FormPreviewPanel.prototype.handleEvent = function(e) {
        switch (e.type) {
            case "click":
                this.doClick(e);
                break;
        }
    };

    FormPreviewPanel.prototype.doClick = function(evt) {
        evt.preventDefault();
        if (evt.target == this.printbutton
            || evt.target.id == ("print" + this.options.id)) {
        } else if (evt.target == this.mobile
            || evt.target.id == ("mobile" + this.options.id)) {
            this.mobile.classList.add("active");
            this.tablet.classList.remove("active");
            this.laptop.classList.remove("active");
            this.desktop.classList.remove("active");
            this.deveiceType = 3;
            this.setScreen();
        } else if (evt.target == this.tablet
            || evt.target.id == ("tablet" + this.options.id)) {
            this.tablet.classList.add("active");
            this.mobile.classList.remove("active");
            this.laptop.classList.remove("active");
            this.desktop.classList.remove("active");
            this.deveiceType = 2;
            this.setScreen();
        } else if (evt.target == this.laptop
            || evt.target.id == ("laptop" + this.options.id)) {
            this.laptop.classList.add("active");
            this.mobile.classList.remove("active");
            this.tablet.classList.remove("active");
            this.desktop.classList.remove("active");
            this.deveiceType = 1;
            this.setScreen();
        } else if (evt.target == this.desktop
            || evt.target.id == ("desktop" + this.options.id)) {
            this.desktop.classList.add("active");
            this.mobile.classList.remove("active");
            this.tablet.classList.remove("active");
            this.laptop.classList.remove("active");
            this.deveiceType = 0;
            this.setScreen();
        } else if (evt.target == this.landscape
            || evt.target.id == ("landscape" + this.options.id)) {
            this.landscape.classList.add("active");
            this.portrait.classList.remove("active");
            this.lp = 0;
            this.setScreen();
        } else if (evt.target == this.portrait
            || evt.target.id == ("portrait" + this.options.id)) {
            this.portrait.classList.add("active");
            this.landscape.classList.remove("active");
            this.lp = 1;
            this.setScreen();
        }
        Utils.stopBubble(evt);
    };

    FormPreviewPanel.prototype.setScreen = function() {
        if (this.lp == 0) {// landscape
            if (this.deveiceType == 0) {
                this.devicePane.style.width = "1920px";
                this.devicePane.style.height = "1080px";
            } else if (this.deveiceType == 1) {
                this.devicePane.style.width = "1366px";
                this.devicePane.style.height = "768px";
            } else if (this.deveiceType == 2) {
                this.devicePane.style.width = "1024px";
                this.devicePane.style.height = "768px";
            } else if (this.deveiceType == 3) {// iPhone 5 size
                this.devicePane.style.width = "568px";
                this.devicePane.style.height = "320px";
            }
        } else if (this.lp == 1) {// portrait
            if (this.deveiceType == 0) {
                this.devicePane.style.width = "1080px";
                this.devicePane.style.height = "1920px";
            } else if (this.deveiceType == 1) {
                // main stream size 136px x 768px
                this.devicePane.style.width = "768px";
                this.devicePane.style.height = "1366px";
            } else if (this.deveiceType == 2) {
                // iPad 768px x 1024px
                this.devicePane.style.width = "768px";
                this.devicePane.style.height = "1024px";
            } else if (this.deveiceType == 3) {
                // iPhone 5 size 320px x 568px
                // iPhone 6 size 375px x 667px
                // iPhone 6 plump size 414px x 736px
                // Android (Nexus 4) 384px x 600px
                // Android (Nexus 4) 600px x 384px
                this.devicePane.style.width = "320px";
                this.devicePane.style.height = "568px";
            }
        }
    };

    $.fn[pluginName] = function(options) {
        return this.each(function() {
            if (!$.data(this, pluginName)) {
                $.data(this, pluginName, new FormPreviewPanel(this, options));
            } else if ($.isFunction(Plugin.prototype[options])) {
                $.data(this, pluginName)[options]();
            }
        });
    };

})(jQuery, window, document);