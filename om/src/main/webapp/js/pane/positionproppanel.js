/**
 *
 */

;
(function ($, window, document, undefined) {
    var pluginName = "positionPropsPanel";
    var defaults = {
        id: "",
        ownerId: "",
        parent: "",
        entity: "",
        topparent: "",
        tabid: "",
    };

    var PositionPropsPanel = function (element, options) {
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

    PositionPropsPanel.prototype.init = function (options) {
        this.loadPane(options.entity, 0, null);
    };

    PositionPropsPanel.prototype.loadPane = function (entity, tabindex, currOwner) {
        this.currtabindex = tabindex;
        this.entity = entity;
        var modalframe = document.createElement("div");
        this.element.appendChild(modalframe);

        var tabDIV = document.createElement("DIV");
        modalframe.appendChild(tabDIV);
        tabDIV.style.margin = "1px";

        var tabUL = document.createElement("UL");
        tabUL.className = "nav nav-tabs advanceproperty-nav-tabs";
        tabUL.id = "positionprop-nav-tabs" + this.entity.id;
        tabUL.setAttribute("role", "tablist");
        tabDIV.appendChild(tabUL);

        this.newTabHead(tabUL, 0, "职员", true);
        this.newTabHead(tabUL, 1, "职位绩效", false);
        this.newTabHead(tabUL, 2, "职位分类", false);
        this.newTabHead(tabUL, 3, "工作时间", false);
        this.newTabHead(tabUL, 4, "值班加班", false);

        var that = this;
        $("#positionprop-nav-tabs" + this.entity.id).on("click", "a", function (e) {
            e.preventDefault();
            $(this).tab('show');
            that.currtabindex = $(this).attr('href').substring(7, 8);
            that.setCurrTabIndex(that.currtabindex, currOwner);
        });

        var tabContents = document.createElement("DIV");
        tabContents.className = "tab-content";
        tabContents.id = "advancedproptabs";
        tabDIV.appendChild(tabContents);

        this.tabContent = this.newTabContent(tabContents, 0, true);
        var plugin1 = $(this.tabContent).jobAssignmentPane({
            id: "postab0" + this.entity.id,
            parent: this,
            entity: this.entity,
            topparent: this.element,
            tabid: this.tabId,
            ownerId: this.options.ownerId,
        });
        this.jobAssignmentPane = plugin1.data("jobAssignmentPane");

        this.tabContent1 = this.newTabContent(tabContents, 1, false);
        var plugin2 = $(this.tabContent1).positionKPIPane({
            id: "postab1" + this.entity.id,
            parent: this,
            entity: this.entity,
            topparent: this.element,
            tabid: this.tabId,
            ownerId: this.options.ownerId,
        });
        this.positionKPIPane = plugin2.data("positionKPIPane");

        this.tabContent2 = this.newTabContent(tabContents, 2, false);
        var plugin3 = $(this.tabContent2).positionEditPane({
            id: "postab2" + this.entity.id,
            parent: this,
            entity: this.entity,
            topparent: this.element,
            tabid: this.tabId,
            ownerId: this.options.ownerId,
        });
        this.positionEditPane = plugin3.data("positionEditPane");

        this.tabContent3 = this.newTabContent(tabContents, 3, false);
        var plugin4 = $(this.tabContent3).positionCalendarSettingPane({
            id: "postab3" + this.entity.id,
            parent: this,
            entity: this.entity,
            topparent: this.element,
            tabid: this.tabId,
            ownerId: this.options.ownerId,
        });
        this.calendarEditPane = plugin4.data("positionCalendarSettingPane");

        this.tabContent4 = this.newTabContent(tabContents, 4, false);
        var plugin5 = $(this.tabContent4).positionOvertimeWorkSettingPane({
            id: "postab4" + this.entity.id,
            parent: this,
            entity: this.entity,
            topparent: this.element,
            tabid: this.tabId,
            ownerId: this.options.ownerId,
        });
        this.overtimeWorkEditPane = plugin5.data("positionOvertimeWorkSettingPane");

        $('#positionprop-nav-tabs' + this.entity.id + ' a[href="#postab' + this.currtabindex + +this.entity.id + '"]')
            .tab('show');
        this.setCurrTabIndex(this.currtabindex, currOwner);
    };

    PositionPropsPanel.prototype.newTabHead = function (parent, index, caption, active) {
        var tabLi = document.createElement("li");
        parent.appendChild(tabLi);
        if (active)
            tabLi.className = "active";
        tabLi.setAttribute("role", "presentation");
        var tabLink = document.createElement("a");
        tabLi.appendChild(tabLink);
        tabLink.setAttribute("href", "#postab" + index + this.entity.id);
        tabLink.setAttribute("aria-controls", "postab" + index + this.entity.id);
        tabLink.setAttribute("role", "tab");
        tabLink.setAttribute("data-toggle", "tab");
        tabLink.innerHTML = caption;
    };

    PositionPropsPanel.prototype.newTabContent = function (parent, index, active) {
        var tabContent = document.createElement("DIV");
        parent.appendChild(tabContent);
        tabContent.setAttribute("data", "postab" + index + this.entity.id);
        tabContent.setAttribute("role", "tabpanel");
        if (active)
            tabContent.className = "tab-pane active";
        else
            tabContent.className = "tab-pane";
        tabContent.id = "postab" + index + this.entity.id;
        return tabContent;
    };

    PositionPropsPanel.prototype.setCurrTabIndex = function (index, owner) {
        if (index == 4) {
            this.options.parent.enableAddButton();
            this.options.parent.disabledModifyButton();
            this.options.parent.disabledRemoveButton();
        } else {
            this.options.parent.disabledAddButton();
            this.options.parent.disabledModifyButton();
            this.options.parent.disabledRemoveButton();
        }
    };

    PositionPropsPanel.prototype.addRow = function (evt) {
        if (this.currtabindex == 4) {
            this.overtimeWorkEditPane.addRow(evt);
        }
    };

    PositionPropsPanel.prototype.modifyRow = function (evt) {
        if (this.currtabindex == 4) {
            this.overtimeWorkEditPane.modifyRow(evt);
        }
    };

    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, pluginName)) {
                $.data(this, pluginName, new PositionPropsPanel(this, options));
            } else if ($.isFunction(Plugin.prototype[options])) {
                $.data(this, pluginName)[options]();
            }
        });
    };

})(jQuery, window, document);