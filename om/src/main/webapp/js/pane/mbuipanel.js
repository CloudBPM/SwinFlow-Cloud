/**
 *
 */

;
(function($, window, document, undefined) {
    var pluginName = "mbUIPropsPanel";
    var defaults = {
        id : "",
        ownerId : "",
        parent : "",
        entity : "",// mbui object
        tabid : "",
        topparent : "",
        category : "",
    };

    var MbUIPropsPanel = function(element, options) {
        this.element = element;
        this.options = $.extend({
            id : "",
            ownerId : "",
            parent : "",
            entity : "",// mbui object
            tabid : "",
            topparent : "",
            currOwner : "",
            category : "",
        }, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.entity = options.entity;
        this.init(options);
    };

    MbUIPropsPanel.prototype.init = function(options) {
        this.loadPane(options.entity, options.category);
    };

    MbUIPropsPanel.prototype.loadPane = function(entity, cate) {
        var modalframe = document.createElement("div");
        this.element.appendChild(modalframe);

        var tabDIV = document.createElement("DIV");
        modalframe.appendChild(tabDIV);
        tabDIV.style.margin = "1px";

        var tabUL = document.createElement("UL");
        tabUL.className = "nav nav-tabs advanceproperty-nav-tabs";
        tabUL.id = "mbuidp-input-props-nav-tabs";
        tabUL.setAttribute("role", "tablist");
        tabDIV.appendChild(tabUL);
        this.newTabHead(tabUL, 0, "界面设置", true);
        //this.newTabHead(tabUL, 1, "设定", false);
        var that = this;
        $("#mbuidp-input-props-nav-tabs").on("click", "a", function(e) {
            e.preventDefault();
            $(this).tab('show');
        });

        var tabContents = document.createElement("DIV");
        tabDIV.appendChild(tabContents);
        tabContents.className = "tab-content";
        tabContents.id = "advancedproptabs";

        this.tabContent1 = this.newTabContent(tabContents, 0, true);
        if ($(this.tabContent1).inheritedUIPane != null) {
            var plugin1 = $(this.tabContent1).inheritedUIPane({
                id : "adptab0",
                ownerId : this.options.ownerId,
                parent : this.options.parent,
                entity : entity,// mbui object
                topparent : this.element,
                category: cate,
            });
            this.inheritedUIPane = plugin1.data("inheritedUIPane");
        }

    };

    MbUIPropsPanel.prototype.newTabHead = function(parent, index, caption, active) {
        var tabLi = document.createElement("li");
        parent.appendChild(tabLi);
        if (active)
            tabLi.className = "active";
        tabLi.setAttribute("role", "presentation");
        var tabLink = document.createElement("a");
        tabLi.appendChild(tabLink);
        tabLink.setAttribute("href", "#tab" + index);
        tabLink.setAttribute("aria-controls", "tab" + index);
        tabLink.setAttribute("role", "tab");
        tabLink.setAttribute("data-toggle", "tab");
        tabLink.innerHTML = caption;
    };

    MbUIPropsPanel.prototype.newTabContent = function(parent, index, active) {
        var tabContent = document.createElement("DIV");
        parent.appendChild(tabContent);
        tabContent.setAttribute("data", "tab" + index);
        tabContent.setAttribute("role", "tabpanel");
        if (active)
            tabContent.className = "tab-pane active";
        else
            tabContent.className = "tab-pane";
        tabContent.id = "tab" + index;
        return tabContent;
    };

    $.fn[pluginName] = function(options) {
        return this.each(function() {
            if (!$.data(this, pluginName)) {
                $.data(this, pluginName, new MbUIPropsPanel(this, options));
            } else if ($.isFunction(Plugin.prototype[options])) {
                $.data(this, pluginName)[options]();
            }
        });
    };

})(jQuery, window, document);