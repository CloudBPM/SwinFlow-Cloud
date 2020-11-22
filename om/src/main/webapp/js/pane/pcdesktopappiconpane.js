;
(function ($, window, document, undefined) {
    var pluginName = "desktopAppIconSettingPane";
    var defaults = {
        id: "",
        parent: "",
        entity : "",
        topparent: "",
        ownerId: "",
        tabid : "",
    };

    var AppIconEditPanel = function (element, options) {
        this.element = element;
        this.options = $.extend({
            id: "",
            parent: "",
            entity : "",
            topparent: "",
            ownerId: "",
            tabid : "",
        }, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.topparent = options.topparent;
        this.init(options);
    };

    AppIconEditPanel.prototype.init = function (options) {
        this.loadPane(options.entity);
    };

    AppIconEditPanel.prototype.loadPane = function (entity) {
        this.entity = entity;// PCDesktopIcon
        var mainmodalframeDiv = document.createElement("div");
        mainmodalframeDiv.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";
        mainmodalframeDiv.style.padding = "4px";
        this.element.appendChild(mainmodalframeDiv);

        var form = document.createElement("form");
        form.className = "form-horizontal";
        mainmodalframeDiv.appendChild(form);

        // 图标方式显示
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
        this.optionInput1.name = "icontype" + entity.id;
        this.optionInput1.value = "icon";
        this.optionInput1.checked = true;
        this.optionInput1.addEventListener("click", this, false);
        label3.appendChild(document.createTextNode("显示为图标"));

        var label1 = document.createElement("label");
        group1.appendChild(label1);
        label1.setAttribute("for", "prepend" + entity.id);
        label1.className = "col-sm-2 control-label";
        label1.innerHTML = "选择图标";

        var selDiv1 = document.createElement("div");
        selDiv1.className = "col-sm-10";
        group1.appendChild(selDiv1);

        var prependIconDiv = document.createElement("div");
        selDiv1.appendChild(prependIconDiv);
        prependIconDiv.className = "input-group";

        this.iconInput = document.createElement("input");
        prependIconDiv.appendChild(this.iconInput);
        this.iconInput.className = "form-control icp1 icp-auto1";
        this.iconInput.addEventListener("change", this, false);
        this.iconInput.type = "text";

        var iconSpan = document.createElement("span");
        prependIconDiv.appendChild(iconSpan);
        iconSpan.className = "input-group-addon";

        if (this.entity.type == "icon") {
            var that = this;
            $(".icp-auto1").iconpicker();
            $('.icp-auto1').on('iconpickerSelected', function(e) {
                that.doInput1(e.iconpickerValue);
            });
        }

        // 视图方式显示
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
        this.optionInput2.name = "icontype" + entity.id;
        this.optionInput2.value = "view";
        this.optionInput2.addEventListener("click", this, false);
        label4.appendChild(document.createTextNode("显示为视图"));

        this.loading(entity);
    };

    AppIconEditPanel.prototype.loading = function (entity) {
        this.entity = entity;// PCDesktopIcon
        if (this.entity.type == "icon") {
            this.optionInput1.checked = true;
            this.optionInput2.checked = false;
            this.iconInput.disabled = false;
        } else if (this.entity.type == "view") {
            this.optionInput1.checked = false;
            this.optionInput2.checked = true;
            this.iconInput.disabled = true;
        }
        this.iconInput.value = this.entity.textIcon;
    };

    AppIconEditPanel.prototype.addOptions = function (parent, title, value, index) {
        var option = document.createElement("option");
        option.text = title;
        option.value = value;
        parent.options.add(option, index);
    };

    AppIconEditPanel.prototype.handleEvent = function (e) {
        switch (e.type) {
            case "change":
                this.doChange(e);
                break;
            case "click":
                this.doClick(e);
                break;
        }
    };

    AppIconEditPanel.prototype.doClick = function (evt) {
        if (evt.target == this.optionInput1) {// ICON
            map[this.entity.cateId].stack.execute(new FMDesktopUIValueChangeCmd(
                this.entity, "type", evt.target.value));
        } else if (evt.target == this.optionInput2) { // VIEW
            map[this.entity.cateId].stack.execute(new FMDesktopUIValueChangeCmd(
                this.entity, "type", evt.target.value));
        }
    };

    AppIconEditPanel.prototype.doChange = function (evt) {
        if (evt.target == this.iconInput) {
            map[this.entity.cateId].stack.execute(new FMDesktopUIValueChangeCmd(
                this.entity, "textIcon", evt.target.value));
        }
    };

    AppIconEditPanel.prototype.doInput1 = function(v) {
        map[this.entity.cateId].stack.execute(new FMDesktopUIValueChangeCmd(
            this.entity, "textIcon", v));
    };

    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, pluginName)) {
                $.data(this, pluginName, new AppIconEditPanel(this,
                    options));
            } else if ($.isFunction(Plugin.prototype[options])) {
                $.data(this, pluginName)[options]();
            }
        });
    };

})(jQuery, window, document);