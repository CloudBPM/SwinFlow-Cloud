/**
 *
 */
;
(function ($, window, document, undefined) {
    var pluginName = "positionCatePane";
    var defaults = {
        id: "",
        ownerId: "",
        parent: "",
        entity: "",
        topparent: "",
    };

    var PositionCategoryPanel = function (element, options) {
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

    PositionCategoryPanel.prototype.init = function (options) {
        this.entity = options.entity;
        var modalframe = document.createElement("div");
        this.element.appendChild(modalframe);

        var form = document.createElement("form");
        modalframe.appendChild(form);
        form.className = "form-horizontal";

        // department category
        var categroup1 = document.createElement("div");
        form.appendChild(categroup1);
        categroup1.style.padding = "2px";
        categroup1.className = "form-group";

        var categoryLabel1 = document.createElement("label");
        categroup1.appendChild(categoryLabel1);
        categoryLabel1.className = "col-sm-3 control-label";
        categoryLabel1.innerHTML = "所属部门/项目组类别";

        var categorydiv1 = document.createElement("div");
        categorydiv1.className = "col-sm-9 col-xs-12";
        categroup1.appendChild(categorydiv1);

        this.dptCateSelect = document.createElement("select");
        this.dptCateSelect.name = "dptCateSelect" + options.id;
        this.dptCateSelect.className = "form-control";
        categorydiv1.appendChild(this.dptCateSelect);
        this.addOptions(this.dptCateSelect, "-- 请选择部门分类 --", "-1", 0);
        this.dptCateSelect.addEventListener("change", this, false);

        this.loading(options);

    };

    PositionCategoryPanel.prototype.loading = function (options) {
        var that = this;
        $("#progressbar").show();
        $.getJSON(service.api(39, options.ownerId), {
            catetype: "136",
            owner: options.ownerId,
        }).complete(function (data) {
            var dat =  JSON.parse(data.responseText);
            for (var i = 0; i < dat.length; i++) {
                that.addOptions(that.dptCateSelect, dat[i].name, dat[i].id, i + 1);
            }
            if (that.entity.assignCategoryId != null &&
                that.entity.assignCategoryId != undefined &&
                that.entity.id != that.entity.assignCategoryId) {
                that.dptCateSelect.value = that.entity.assignCategoryId;
            } else {
                that.dptCateSelect.value = "-1";
            }
            $("#progressbar").hide();
        });
    };

    PositionCategoryPanel.prototype.addOptions = function (parent, title, value, index) {
        var option = document.createElement("option");
        option.text = title;
        option.value = value;
        parent.options.add(option, index);
    };

    PositionCategoryPanel.prototype.handleEvent = function (e) {
        switch (e.type) {
            case "change":
                this.doChange(e);
                break;
        }
    };

    PositionCategoryPanel.prototype.doChange = function (evt) {
        if (this.dptCateSelect.value != "-1") {
            var that = this;
            $("#progressbar").show();
            $.getJSON(service.api(38, this.entity.owner), {
                cateid : this.dptCateSelect.value,
            }).complete(function(data) {
                if (data.responseText != "") {
                    var c = JSON.parse(data.responseText);
                    var cate = new Category();
                    cate.parseFromJSON(c);
                    map[that.entity.id].stack.execute(new OMCategoryTopCategoryChangedCmd(
                        that.entity, that.dptCateSelect.value, cate.mbUIContent));
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
                $.data(this, pluginName, new PositionCategoryPanel(this, options));
            } else if ($.isFunction(Plugin.prototype[options])) {
                $.data(this, pluginName)[options]();
            }
        });
    };

})(jQuery, window, document);