;
(function ($, window, document, undefined) {
    var pluginName = "desktopAppSettingPane";
    var defaults = {
        id: "",
        parent: "",
        entity: "",
        topparent: "",
        ownerId: "",
        tabid: "",
    };

    var AppSettingEditPanel = function (element, options) {
        this.element = element;
        this.options = $.extend({
            id: "",
            parent: "",
            entity: "",
            topparent: "",
            ownerId: "",
            tabid: "",
        }, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.topparent = options.topparent;
        this.init(options);
    };

    AppSettingEditPanel.prototype.init = function (options) {
        this.loadPane(options.entity);
    };

    AppSettingEditPanel.prototype.loadPane = function (entity) {
        this.entity = entity;// PCDesktopIcon
        var maindiv = document.createElement("div");
        maindiv.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";
        maindiv.style.padding = "4px";
        this.element.appendChild(maindiv);

        var form = document.createElement("form");
        form.className = "form-horizontal";
        maindiv.appendChild(form);

        // 应用设置；分为外部应用和内部应用设置
        var group1 = document.createElement("div");
        form.appendChild(group1);
        group1.className = "form-group";

        var div1 = document.createElement("div");
        group1.appendChild(div1);
        div1.className = "col-sm-12 radio";

        var label3 = document.createElement("label");
        div1.appendChild(label3);

        this.optionInput1 = document.createElement("INPUT");
        label3.appendChild(this.optionInput1);
        this.optionInput1.type = "radio";
        this.optionInput1.name = "apptype" + entity.id;
        this.optionInput1.value = "0";
        this.optionInput1.checked = true;
        this.optionInput1.addEventListener("click", this, false);
        label3.appendChild(document.createTextNode("创意轩应用"));

        var label1 = document.createElement("label");
        group1.appendChild(label1);
        label1.setAttribute("for", "prepend" + entity.id);
        label1.className = "col-sm-2 control-label";
        label1.innerHTML = "搜索应用";

        var selDiv1 = document.createElement("div");
        group1.appendChild(selDiv1);
        selDiv1.className = "col-sm-10";

        var group7 = document.createElement("DIV");
        selDiv1.appendChild(group7);
        group7.className = "input-group";
        group7.style.padding = "2px";
        group7.setAttribute("role", "search");
        group7.setAttribute("aria-label", "");

        this.internalAppInput = document.createElement("input");
        group7.appendChild(this.internalAppInput);
        this.internalAppInput.className = "form-control";
        this.internalAppInput.setAttribute("placeholder", "选择并设置应用...");
        this.internalAppInput.readOnly = true;

        // open application service market
        var searchSpan = document.createElement("span");
        group7.appendChild(searchSpan);
        searchSpan.className = "input-group-btn";

        this.searchBtn = this.createTool(searchSpan, "searchAppBtn"
            + entity.id, "打开应用仓库查找", "btn btn-primary", "i",
            "fa fa-search");

        // 外部应用的URL
        var group2 = document.createElement("div");
        form.appendChild(group2);
        group2.className = "form-group";

        var div2 = document.createElement("div");
        group2.appendChild(div2);
        div2.className = "col-sm-12 radio";

        var label4 = document.createElement("label");
        div2.appendChild(label4);

        this.optionInput2 = document.createElement("INPUT");
        label4.appendChild(this.optionInput2);
        this.optionInput2.type = "radio";
        this.optionInput2.name = "apptype" + entity.id;
        this.optionInput2.value = "1";
        this.optionInput2.addEventListener("click", this, false);
        label4.appendChild(document.createTextNode("外部应用"));

        var label5 = document.createElement("label");
        group2.appendChild(label5);
        label5.className = "col-sm-2 control-label";
        label5.innerHTML = "URL";

        var label6 = document.createElement("div");
        group2.appendChild(label6);
        label6.className = "col-sm-10";

        this.externalAppInput = document.createElement("input");
        label6.appendChild(this.externalAppInput);
        this.externalAppInput.name = "appInput" + this.entity.id;
        this.externalAppInput.className = "form-control";
        this.externalAppInput.addEventListener("change", this, false);

        // application store
        var plugin3 = $(maindiv).processServiceStoreDialog({
            id: "appstore0000000000000",
            title: vendor + " - 应用商店",
            parent: this,
            topparent: this.topparent,
        });
        this.procstoredialog = plugin3.data("processServiceStoreDialog");

        this.loading(entity);
    };

    AppSettingEditPanel.prototype.loading = function (entity) {
        this.entity = entity;// PCDesktopIcon
        if (this.entity.bindType == "0") {// internal application setting
            this.optionInput1.checked = true;
            this.optionInput2.checked = false;
            this.externalAppInput.disabled = true;
            this.searchBtn.disabled = false;
        } else if (this.entity.bindType == "1") {// external application setting
            this.optionInput1.checked = false;
            this.optionInput2.checked = true;
            this.externalAppInput.disabled = false;
            this.searchBtn.disabled = true;
        }
        this.internalAppInput.value = this.entity.applicationName;
        this.externalAppInput.value = this.entity.externalUrl;
    };

    AppSettingEditPanel.prototype.addOptions = function (parent, title, value, index) {
        var option = document.createElement("option");
        option.text = title;
        option.value = value;
        parent.options.add(option, index);
    };

    AppSettingEditPanel.prototype.handleEvent = function (e) {
        switch (e.type) {
            case "change":
                this.doChange(e);
                break;
            case "click":
                this.doClick(e);
                break;
        }
    };

    AppSettingEditPanel.prototype.doClick = function (evt) {
        if (evt.target == this.optionInput1) {// ICON
            map[this.entity.cateId].stack.execute(new FMDesktopUIValueChangeCmd(
                this.entity, "bindType", evt.target.value));
        } else if (evt.target == this.optionInput2) { // VIEW
            map[this.entity.cateId].stack.execute(new FMDesktopUIValueChangeCmd(
                this.entity, "bindType", evt.target.value));
        } else if (evt.target == this.searchBtn ||
            evt.target.id == "searchAppBtn" + this.entity.id ||
            evt.target.id == "isearchAppBtn" + this.entity.id) { // button
            this.procstoredialog.show(1);
        }
    };

    AppSettingEditPanel.prototype.doChange = function (evt) {
        if (evt.target == this.externalAppInput) {
            map[this.entity.cateId].stack.execute(new FMDesktopUIValueChangeCmd(
                this.entity, "externalUrl", evt.target.value));
        }
    };


    // id: process application ID,
    // name: process application name,
    // src : source
    AppSettingEditPanel.prototype.setProcSearchResult = function (id, name, src, type) {
        map[this.entity.cateId].stack.execute(new FMDesktopUIValuesChangeCmd(this.entity,
                "applicationId", id, "applicationName", name, "applicationType", type));
    };

    AppSettingEditPanel.prototype.createTool = function (group, id, title,
                                                         style, fonttag, fontclass) {
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
        icon.setAttribute("aria-hidden", "true");
        icon.id = "i" + id;
        return button;
    };

    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, pluginName)) {
                $.data(this, pluginName, new AppSettingEditPanel(this,
                    options));
            } else if ($.isFunction(Plugin.prototype[options])) {
                $.data(this, pluginName)[options]();
            }
        });
    };

})(jQuery, window, document);