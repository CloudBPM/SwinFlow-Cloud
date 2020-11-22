;
(function ($, window, document, undefined) {
    var pluginName = "departmentEditPanel";
    var defaults = {
        id: "",
        ownerId: "",
        parent: "",
        topparent: "",
        currOwner: "",
    };

    var DepartmentEditPanel = function (element, options) {
        this.element = element;
        this.options = $.extend({
            id: "",
            ownerId: "",
            parent: "",
            topparent: "",
            currOwner: "",
        }, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.topparent = options.topparent;
        this.init(options);
    };

    DepartmentEditPanel.prototype.init = function (options) {
        this.loadPane(options.entity, options.currOwner);
    };

    DepartmentEditPanel.prototype.loadPane = function (entity, currOwner) {
        this.entity = entity;
        this.currOwner = currOwner;
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
        categoryLabel.innerHTML = "所属部门类别";

        var categorydiv = document.createElement("div");
        categorydiv.className = "col-sm-9 col-xs-12";
        categroup.appendChild(categorydiv);

        this.dptCateSelect = document.createElement("select");
        this.dptCateSelect.name = "orgCateSelect" + this.options.id;
        this.dptCateSelect.className = "form-control";
        categorydiv.appendChild(this.dptCateSelect);
        this.addOptions(this.dptCateSelect, "-- 请选择部门分类 --", "-1", 0);
        this.dptCateSelect.addEventListener("change", this, false);

        this.loading(this.options);
    };

    DepartmentEditPanel.prototype.loading = function (options) {
        var that = this;
        $("#progressbar").show();
        $.getJSON(service.api(39, options.ownerId), {
            catetype: "136",
            owner: options.ownerId,
        }).complete(function (data) {
            var dat = JSON.parse(data.responseText);
            for (var i = 0; i < dat.length; i++) {
                if (that.entity.categoryId == dat[i].id) {
                    that.addOptions(that.dptCateSelect, dat[i].name, dat[i].id, i + 1, true);
                } else {
                    that.addOptions(that.dptCateSelect, dat[i].name, dat[i].id, i + 1, false);
                }
            }
            $("#progressbar").hide();
        });
    };

    DepartmentEditPanel.prototype.addOptions = function (parent, title, value, index, selected) {
        var option = document.createElement("option");
        option.text = title;
        option.value = value;
        if (selected) {
            option.selected = true;
        }
        parent.options.add(option, index);
    };

    DepartmentEditPanel.prototype.handleEvent = function (e) {
        switch (e.type) {
            case "change":
                this.doChange(e);
                break;
        }
    };

    DepartmentEditPanel.prototype.doChange = function (evt) {
        if (this.dptCateSelect.value != "-1") {
            map[this.currOwner.id].stack.execute(new OMDepartPropChangedCmd(
                this.entity, "categoryId", this.dptCateSelect.value, this.currOwner));
        } else {
            map[this.currOwner.id].stack.execute(new OMDepartPropChangedCmd(
                this.entity, "categoryId", null, this.currOwner));
        }
    };

    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, pluginName)) {
                $.data(this, pluginName, new DepartmentEditPanel(this,
                    options));
            } else if ($.isFunction(Plugin.prototype[options])) {
                $.data(this, pluginName)[options]();
            }
        });
    };

})(jQuery, window, document);