/**
 *
 */

;
(function ($, window, document, undefined) {
    var pluginName = "releasedWfProcessPropsPanel";
    var defaults = {
        id: "",
        parent: "",
        entity: "",
        topparent: "",
        tabid: "",
        currowner: "",
    };

    var PropsPanel = function (element, options) {
        this.element = element;
        this.options = $.extend({
            id: "",
            parent: "",
            entity: "",
            topparent: "",
            tabid: "",
            currowner: "",
        }, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.tabId = options.tabid;
        this.topparent = options.topparent;
        this.ruleditdialog;
        this.entity = options.entity;
        this.init(options);
    };

    PropsPanel.prototype.init = function (options) {
        this.loadPane(options.entity, 0, options.currowner);
    };

    PropsPanel.prototype.loadPane = function (entity, tabindex, owner) {
        this.entity = entity;
        this.currtabindex = tabindex;

        var modalframe = document.createElement("div");
        this.element.appendChild(modalframe);

        var tabDIV = document.createElement("DIV");
        modalframe.appendChild(tabDIV);

        var tabUL = document.createElement("UL");
        tabUL.className = "nav nav-tabs advanceproperty-nav-tabs";
        tabUL.id = "rlpp-props-nav-tabs";
        tabUL.setAttribute("role", "tablist");
        tabDIV.appendChild(tabUL);

       this.newTabHead(tabUL, 0, "数据变量", true);
        //this.newTabHead(tabUL, 1, "应用位置", true);
        this.newTabHead(tabUL, 2, "审核记录", false);

        var that = this;
        $("#rpp-props-nav-tabs").on("click", "a", function (e) {
            e.preventDefault();
            $(this).tab('show');
            that.currtabindex = parseInt($(this).attr('href').substring(7));
        });

        var tabContents = document.createElement("DIV");
        tabDIV.appendChild(tabContents);
        tabContents.className = "tab-content";
        tabContents.id = "advancedproptabs";

        this.tabContent1 = this.newTabContent(tabContents, 0, true);
        if ($(this.tabContent1).processVariablesEditPanel != undefined) {
            var plugin1 = $(this.tabContent1).processVariablesEditPanel({
                id: "rpptab0",
                parent: this,
                entity: this.entity, // process object
                topparent: this.element,
                currowner: this.options.currowner,// process object
            });
            this.processVariablesEditPanel = plugin1.data("processVariablesEditPanel");
        }

        // this.tabContent2 = this.newTabContent(tabContents, 1, true);
        // if ($(this.tabContent2).appProcessIconSettingPane != undefined) {
        //     var plugin2 = $(this.tabContent2).appProcessIconSettingPane({
        //         id: "rpptab1",
        //         entity: this.entity,// process object
        //         parent: this.options.parent,
        //         topparent: this.element,
        //     });
        //     this.appProcessIconSettingPane = plugin2.data("appProcessIconSettingPane");
        // }

        this.tabContent3 = this.newTabContent(tabContents, 2, false);
        if ($(this.tabContent3).approvalLogPane != undefined) {
            var plugin3 = $(this.tabContent3).approvalLogPane({
                id: "rpptab2",
                parent: this,
                entity: this.entity,// process object
                topparent: this.element,
                ownerId: this.options.currowner,// process object
            });
            this.approvalLogPane = plugin3.data("approvalLogPane");
        }
        $('#rlpp-props-nav-tabs a[href="#rlptab' + this.currtabindex + '"]')
            .tab('show');
    };

    PropsPanel.prototype.newTabHead = function (parent, index, caption, active) {
        var tabLi = document.createElement("li");
        parent.appendChild(tabLi);
        if (active)
            tabLi.className = "active";
        tabLi.setAttribute("role", "presentation");
        var tabLink = document.createElement("a");
        tabLi.appendChild(tabLink);
        tabLink.setAttribute("href", "#rpptab" + index);
        tabLink.setAttribute("aria-controls", "rpptab" + index);
        tabLink.setAttribute("role", "tab");
        tabLink.setAttribute("data-toggle", "tab");
        tabLink.innerHTML = caption;
    };

    PropsPanel.prototype.newTabContent = function (parent, index, active) {
        var tabContent = document.createElement("DIV");
        parent.appendChild(tabContent);
        tabContent.setAttribute("data", "rpptab" + index);
        tabContent.setAttribute("role", "tabpanel");
        if (active)
            tabContent.className = "tab-pane active";
        else
            tabContent.className = "tab-pane";
        tabContent.id = "rpptab" + index;
        return tabContent;
    };

    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, pluginName)) {
                $.data(this, pluginName, new PropsPanel(this, options));
            } else if ($.isFunction(Plugin.prototype[options])) {
                $.data(this, pluginName)[options]();
            }
        });
    };

})(jQuery, window, document);