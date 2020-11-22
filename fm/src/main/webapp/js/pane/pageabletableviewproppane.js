/**
 *
 */

;
(function ($, window, document, undefined) {
    var pluginName = "pageableTableViewPropPane";
    var defaults = {
        id: "",
        parent: "",
        entity: "",
        topparent: "",
        currowner: "",
    };

    var BasicPropPanel = function (element, options) {
        this.element = element;
        this.options = $.extend({
            id: "",
            parent: "",
            entity: "",
            topparent: "",
            currowner: "",
        }, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.entity = options.entity;
        this.init(options);
    };

    BasicPropPanel.prototype.loadPane = function (entity) {
        this.entity = entity;
        this.init(this.options);
    };

    BasicPropPanel.prototype.init = function (options) {
        var modalframe = document.createElement("DIV");
        modalframe.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";
        modalframe.style.padding = "4px";
        this.element.appendChild(modalframe);

        var form1 = document.createElement("form");
        form1.className = "form-horizontal";
        modalframe.appendChild(form1);

        // option/value
        var group3 = document.createElement("div");
        group3.className = "form-group";
        form1.appendChild(group3);

        var titlelabel = document.createElement("LABEL");
        titlelabel.className = "col-sm-2 control-label";
        group3.appendChild(titlelabel);
        titlelabel.setAttribute("for", "datasource" + options.id);
        var titleNode = document.createTextNode("数据源");
        titlelabel.appendChild(titleNode);

        var selDiv5 = document.createElement("div");
        group3.appendChild(selDiv5);
        selDiv5.className = "col-sm-10";

        this.optionsRef = document.createElement("SELECT");
        selDiv5.appendChild(this.optionsRef);
        this.optionsRef.className = "form-control";
        this.optionsRef.addEventListener("change", this, false);

        this.loadData(this.entity);

        if (options.currowner instanceof ReleasedForm) {
            this.optionsRef.disabled = true;
        }
    };

    BasicPropPanel.prototype.loadData = function (entity) {
        $("#progressbar").show();
        var that = this;
        $.getJSON(service.api(24), {
            owner: this.options.currowner.owner,
            types: "1",
        }).complete(function (data) {
            var dataresult = data.responseJSON;
            that.loadReferences(that, dataresult);
            $("#progressbar").hide();
        });
    };

    BasicPropPanel.prototype.loadReferences = function (parent, data) {
        parent.addOptions(parent.optionsRef, "- 请选择 -", "-1", 0);
        if (data != null && data.length > 0) {
            for (var i = 0; i < data.length; i++) {
                parent.addOptions(parent.optionsRef, data[i].name, data[i].id,
                    i+1);
            }
        }
        if (this.entity.rptId != null) {
            parent.optionsRef.value = this.entity.rptId;
        }
    };

    BasicPropPanel.prototype.addOptions = function (parent, title, value, index) {
        var option = document.createElement("option");
        option.text = title;
        option.value = value;
        parent.options.add(option, index);
    };

    BasicPropPanel.prototype.handleEvent = function (e) {
        switch (e.type) {
            case "change":
                this.doChange(e);
                break;
        }
    };

    BasicPropPanel.prototype.doChange = function (evt) {
        if (evt.target == this.optionsRef) {
            map[this.options.currowner.id].stack.execute(new FMValueChangedCmd(
                this.entity, "rptId", this.optionsRef.value,
                this.options.currowner));
        }
    };

    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, pluginName)) {
                $.data(this, pluginName, new BasicPropPanel(this, options));
            } else if ($.isFunction(Plugin.prototype[options])) {
                $.data(this, pluginName)[options]();
            }
        });
    };

})(jQuery, window, document);