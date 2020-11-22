/**
 *
 */
;
(function ($, window, document, undefined) {
    var pluginName = "departmentCatePane";
    var defaults = {
        id: "",
        ownerId: "",
        parent: "",
        entity: "",
        topparent: "",
    };

    var DepartmentCategoryPanel = function (element, options) {
        this.element = element;
        this.options = $.extend({
            id: "",
            ownerId: "",
            parent: "",
            entity: "",
            topparent: "",
        }, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.topparent = options.topparent;
        this.tabId = options.tabid;
        this.entity = options.entity;
        this.init(options);
    };

    DepartmentCategoryPanel.prototype.init = function (options) {
        this.entity = options.entity;
        var modalframe = document.createElement("div");
        this.element.appendChild(modalframe);

        var form = document.createElement("form");
        modalframe.appendChild(form);
        form.className = "form-horizontal";

        // organization category
        var categroup = document.createElement("div");
        form.appendChild(categroup);
        categroup.style.padding = "2px";
        categroup.className = "form-group";

        var categoryLabel = document.createElement("label");
        categroup.appendChild(categoryLabel);
        categoryLabel.className = "col-sm-3 control-label";
        categoryLabel.innerHTML = "所属组织类别";

        var categorydiv = document.createElement("div");
        categorydiv.className = "col-sm-9 col-xs-12";
        categroup.appendChild(categorydiv);

        this.orgCateSelect = document.createElement("select");
        this.orgCateSelect.name = "orgCateSelect" + options.id;
        this.orgCateSelect.className = "form-control";
        categorydiv.appendChild(this.orgCateSelect);
        this.addOptions(this.orgCateSelect, "-- 请选择组织分类 --", "-1", 0);
        this.orgCateSelect.addEventListener("change", this, false);

        this.loading(options);

    };

    DepartmentCategoryPanel.prototype.loading = function (options) {
        var that = this;
        $("#progressbar").show();
        $.getJSON(service.api(39, options.ownerId), {
            catetype: "135",
            owner: options.ownerId,
        }).complete(function (data) {
            var dat =  JSON.parse(data.responseText);
            for (var i = 0; i < dat.length; i++) {
                that.addOptions(that.orgCateSelect, dat[i].name, dat[i].id, i + 1);
            }
            if (that.entity.assignCategoryId != null &&
                that.entity.assignCategoryId != undefined &&
                that.entity.id != that.entity.assignCategoryId) {
                that.orgCateSelect.value = that.entity.assignCategoryId;
            } else {
                that.orgCateSelect.value = "-1";
            }
            $("#progressbar").hide();
        });
    };


    DepartmentCategoryPanel.prototype.addOptions = function (parent, title, value, index) {
        var option = document.createElement("option");
        option.text = title;
        option.value = value;
        parent.options.add(option, index);
    };

    DepartmentCategoryPanel.prototype.handleEvent = function (e) {
        switch (e.type) {
            case "change":
                this.doChange(e);
                break;
        }
    };

    DepartmentCategoryPanel.prototype.doChange = function (evt) {
        if (this.orgCateSelect.value != "-1") {
            var that = this;
            $("#progressbar").show();
            $.getJSON(service.api(38, this.entity.owner), {
                cateid : this.orgCateSelect.value,
            }).complete(function(data) {
                if (data.responseText != "") {
                    var c = JSON.parse(data.responseText);
                    var cate = new Category();
                    cate.parseFromJSON(c);
                    map[that.entity.id].stack.execute(new OMCategoryTopCategoryChangedCmd(
                        that.entity, that.orgCateSelect.value, cate.mbUIContent));
                }
                $("#progressbar").hide();
            });
        } else {
            this.currObject = new Category();
            map[this.entity.id].stack.execute(new OMCategoryTopCategoryChangedCmd(
                this.entity, null, this.currObject.mbUIContent));
        }
    };

    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, pluginName)) {
                $.data(this, pluginName, new DepartmentCategoryPanel(this, options));
            } else if ($.isFunction(Plugin.prototype[options])) {
                $.data(this, pluginName)[options]();
            }
        });
    };

})(jQuery, window, document);