/**
 *
 */

;
(function ($, window, document, undefined) {
    var pluginName = "pcDesktopUIIconPropsPanel";
    var defaults = {
        id: "",
        ownerId: "",
        parent: "",
        entity: "",
        topparent: "",
        tabid: "",
    };

    var DesktopIconPropsPanel = function (element, options) {
        this.element = element;
        this.options = $.extend({
            id: "",
            ownerId: "",
            parent: "",
            entity: "",
            topparent: "",
            tabid: "",
        }, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.tabId = options.tabid;
        this.topparent = options.topparent;
        this.ruleditdialog;
        this.currtabindex = 0;
        this.entity = options.entity;
        this.init(options);
    };

    DesktopIconPropsPanel.prototype.init = function (options) {
        this.loadPane(options.entity, 0, null);
    };

    DesktopIconPropsPanel.prototype.loadPane = function (entity, tabindex, currOwner) {
        this.currtabindex = tabindex;
        this.entity = entity;
        var modalframe = document.createElement("div");
        this.element.appendChild(modalframe);

        var tabDIV = document.createElement("DIV");
        modalframe.appendChild(tabDIV);
        tabDIV.style.margin = "1px";

        var tabUL = document.createElement("UL");
        tabUL.className = "nav nav-tabs advanceproperty-nav-tabs";
        tabUL.id = "iconprop-nav-tabs" + this.entity.id;
        tabUL.setAttribute("role", "tablist");
        tabDIV.appendChild(tabUL);

        this.newTabHead(tabUL, 0, "显示方式", true);
        this.newTabHead(tabUL, 1, "应用设置", false);

        var that = this;
        $("#iconprop-nav-tabs" + this.entity.id).on("click", "a", function (e) {
            e.preventDefault();
            $(this).tab('show');
            var i = $(this).attr('href').substring(8, 9);
            that.currtabindex = i;
            that.setCurrTabIndex(that.currtabindex, currOwner);
        });

        var tabContents = document.createElement("DIV");
        tabContents.className = "tab-content";
        tabContents.id = "advancedproptabs";
        tabDIV.appendChild(tabContents);


        this.tabContent1 = this.newTabContent(tabContents, 0, true);
        if ($(this.tabContent1).desktopAppIconSettingPane != undefined) {
            var plugin1 = $(this.tabContent1).desktopAppIconSettingPane({
                id: "icontab1" + this.entity.id,
                parent: this,
                entity: this.entity,
                topparent: this.element,
                tabid: this.tabId,
                ownerId: this.options.ownerId,
            });
            this.desktopAppIconSettingPane = plugin1.data("desktopAppIconSettingPane");
        }
        this.desktopAppIconSettingPane.loading(entity);

        this.tabContent2 = this.newTabContent(tabContents, 1, false);
        if ($(this.tabContent2).desktopAppSettingPane != undefined) {
            var plugin2 = $(this.tabContent2).desktopAppSettingPane({
                id: "icontab2" + this.entity.id,
                parent: this,
                entity: this.entity,
                topparent: this.element,
                tabid: this.tabId,
                ownerId: this.options.ownerId,
            });
            this.desktopAppSettingPane = plugin2.data("desktopAppSettingPane");
        }
        this.desktopAppSettingPane.loading(entity);

        $('#iconprop-nav-tabs'+this.entity.id+' a[href="#icontab' +
            this.currtabindex + this.entity.id + '"]').tab('show');
        this.setCurrTabIndex(this.currtabindex, currOwner);
    };

    DesktopIconPropsPanel.prototype.newTabHead = function (parent, index, caption, active) {
        var tabLi = document.createElement("li");
        parent.appendChild(tabLi);
        if (active)
            tabLi.className = "active";
        tabLi.setAttribute("role", "presentation");
        var tabLink = document.createElement("a");
        tabLi.appendChild(tabLink);
        tabLink.setAttribute("href", "#icontab" + index + this.entity.id);
        tabLink.setAttribute("aria-controls", "icontab" + index + this.entity.id);
        tabLink.setAttribute("role", "tab");
        tabLink.setAttribute("data-toggle", "tab");
        tabLink.innerHTML = caption;
    };

    DesktopIconPropsPanel.prototype.newTabContent = function (parent, index, active) {
        var tabContent = document.createElement("DIV");
        parent.appendChild(tabContent);
        tabContent.setAttribute("data", "icontab" + index + this.entity.id);
        tabContent.setAttribute("role", "tabpanel");
        if (active)
            tabContent.className = "tab-pane active";
        else
            tabContent.className = "tab-pane";
        tabContent.id = "icontab" + index + this.entity.id;
        return tabContent;
    };

    DesktopIconPropsPanel.prototype.setCurrTabIndex = function (index, owner) {
        // if (index == 4) {
        //     this.options.parent.enableAddButton();
        //     this.options.parent.disabledModifyButton();
        //     this.options.parent.disabledRemoveButton();
        // } else {
        //     this.options.parent.disabledAddButton();
        //     this.options.parent.disabledModifyButton();
        //     this.options.parent.disabledRemoveButton();
        // }
    };

    DesktopIconPropsPanel.prototype.addRow = function (evt) {
        // if (this.currtabindex == 4) {
        //     this.overtimeWorkEditPane.addRow(evt);
        // }
    };

    DesktopIconPropsPanel.prototype.modifyRow = function (evt) {
        // if (this.currtabindex == 4) {
        //     this.overtimeWorkEditPane.modifyRow(evt);
        // }
    };

    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, pluginName)) {
                $.data(this, pluginName, new DesktopIconPropsPanel(this, options));
            } else if ($.isFunction(Plugin.prototype[options])) {
                $.data(this, pluginName)[options]();
            }
        });
    };

})(jQuery, window, document);