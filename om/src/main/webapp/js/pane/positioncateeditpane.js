;
(function ($, window, document, undefined) {
    var pluginName = "positionEditPane";
    var defaults = {
        id: "",
        parent: "",
        entity : "",
        topparent: "",
        ownerId: "",
        tabid : "",
    };

    var PositionEditPanel = function (element, options) {
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

    PositionEditPanel.prototype.init = function (options) {
        this.loadPane(options.entity);
    };

    PositionEditPanel.prototype.loadPane = function (entity) {
        this.entity = entity;
        var mainmodalframeDiv = document.createElement("div");
        mainmodalframeDiv.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";
        mainmodalframeDiv.style.padding = "4px";
        this.element.appendChild(mainmodalframeDiv);

        // API access security key
        var mainmodalframe1 = document.createElement("div");
        mainmodalframe1.className = "panel panel-default";
        mainmodalframeDiv.appendChild(mainmodalframe1);

        // var modalframehead1 = document.createElement("div");
        // modalframehead1.className = "panel-heading";
        // mainmodalframe1.appendChild(modalframehead1);
        // modalframehead1.innerHTML = "外部应用API访问秘钥信息";

        var panelbody1 = document.createElement("div");
        panelbody1.className = "panel-body";
        mainmodalframe1.appendChild(panelbody1);

        var form = document.createElement("form");
        form.className = "form-horizontal";
        panelbody1.appendChild(form);

        // organization category
        var categroup = document.createElement("div");
        form.appendChild(categroup);
        categroup.style.padding = "2px";
        categroup.className = "form-group";

        var categoryLabel = document.createElement("label");
        categroup.appendChild(categoryLabel);
        categoryLabel.className = "col-sm-3 control-label";
        categoryLabel.innerHTML = "所属岗位/项目角色类别";

        var categorydiv = document.createElement("div");
        categorydiv.className = "col-sm-9 col-xs-12";
        categroup.appendChild(categorydiv);

        this.posCateSelect = document.createElement("select");
        this.posCateSelect.name = "orgCateSelect" + this.options.id;
        this.posCateSelect.className = "form-control";
        categorydiv.appendChild(this.posCateSelect);
        this.addOptions(this.posCateSelect, "-- 请选择岗位/项目角色分类 --", "-1", 0);
        this.posCateSelect.addEventListener("change", this, false);

        this.loading(this.options);
    };

    PositionEditPanel.prototype.loading = function (options) {
        var that = this;
        $("#progressbar").show();
        $.getJSON(service.api(39, options.ownerId), {
            catetype: "137",
            owner: options.ownerId,
        }).complete(function (data) {
            var dat = JSON.parse(data.responseText);
            for (var i = 0; i < dat.length; i++) {
                that.addOptions(that.posCateSelect, dat[i].name, dat[i].id, i + 1);
            }
            if (that.entity.categoryId != null &&
                that.entity.categoryId != undefined) {
                that.posCateSelect.value = that.entity.categoryId;
            } else {
                that.posCateSelect.value = "-1";
            }
            $("#progressbar").hide();
        });
    };

    PositionEditPanel.prototype.addOptions = function (parent, title, value, index) {
        var option = document.createElement("option");
        option.text = title;
        option.value = value;
        parent.options.add(option, index);
    };

    PositionEditPanel.prototype.handleEvent = function (e) {
        switch (e.type) {
            case "change":
                this.doChange(e);
                break;
        }
    };

    PositionEditPanel.prototype.doChange = function (evt) {
        if (this.posCateSelect.value != "-1") {
            map[this.entity.currOwner].stack.execute(new OMPositionPropChangedCmd(
                this.entity, "categoryId", this.posCateSelect.value));
        } else {
            map[this.entity.currOwner].stack.execute(new OMPositionPropChangedCmd(
                this.entity, "categoryId", null));
        }
    };

    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, pluginName)) {
                $.data(this, pluginName, new PositionEditPanel(this,
                    options));
            } else if ($.isFunction(Plugin.prototype[options])) {
                $.data(this, pluginName)[options]();
            }
        });
    };

})(jQuery, window, document);