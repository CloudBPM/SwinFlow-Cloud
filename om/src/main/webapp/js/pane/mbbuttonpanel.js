/**
 *
 */

;
(function($, window, document, undefined) {
    var pluginName = "mbButtonPropsPanel";
    var defaults = {
        id : "",
        ownerId : "",
        parent : "",
        entity : "",// mbui object
        tabid : "",
        topparent : "",
        currOwner : "",
    };

    var MbButtonPropsPanel = function(element, options) {
        this.element = element;
        this.options = $.extend({
            id : "",
            ownerId : "",
            parent : "",
            entity : "",// mbui object
            tabid : "",
            topparent : "",
            currOwner : "",
        }, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.entity = options.entity;
        this.currOwner = options.currOwner;
        this.init(options);
    };

    MbButtonPropsPanel.prototype.init = function(options) {
        this.loadPane(options.entity, options.currOwner);
    };

    MbButtonPropsPanel.prototype.loadPane = function(entity, currOwner) {
        this.currOwner = currOwner;
        var modalframe = document.createElement("div");
        this.element.appendChild(modalframe);

        var tabDIV = document.createElement("DIV");
        modalframe.appendChild(tabDIV);
        tabDIV.style.margin = "1px";

        var tabUL = document.createElement("UL");
        tabUL.className = "nav nav-tabs advanceproperty-nav-tabs";
        tabUL.id = "mbbtndp-input-props-nav-tabs";
        tabUL.setAttribute("role", "tablist");
        tabDIV.appendChild(tabUL);
        this.newTabHead(tabUL, 0, "界面设置", true);
        //this.newTabHead(tabUL, 1, "设定", false);
        var that = this;
        $("#mbbtndp-input-props-nav-tabs").on("click", "a", function(e) {
            e.preventDefault();
            $(this).tab('show');
        });

        var tabContents = document.createElement("DIV");
        tabDIV.appendChild(tabContents);
        tabContents.className = "tab-content";
        tabContents.id = "advancedproptabs";

        this.tabContent1 = this.newTabContent(tabContents, 0, true);
            var plugin1 = $(this.tabContent1).buttonPane({
                id : "adptab0",
                ownerId : this.options.ownerId,
                parent : this.options.parent,
                entity : entity,// mbui object
                topparent : this.element,
                currOwner : this.currOwner,
            });
            this.buttonPane = plugin1.data("buttonPane");

    };

    MbButtonPropsPanel.prototype.newTabHead = function(parent, index, caption, active) {
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

    MbButtonPropsPanel.prototype.newTabContent = function(parent, index, active) {
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
                $.data(this, pluginName, new MbButtonPropsPanel(this, options));
            } else if ($.isFunction(Plugin.prototype[options])) {
                $.data(this, pluginName)[options]();
            }
        });
    };

})(jQuery, window, document);