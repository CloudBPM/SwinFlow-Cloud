/**
 *
 */
;
(function ($, window, document, undefined) {
    var pluginName = "inheritedUIPane";
    var defaults = {
        id: "",
        ownerId: "",
        parent: "",
        entity: "",// category object
        topparent: "",
        currOwner: "",
        category : "",
    };

    var InheritedUIPanel = function (element, options) {
        this.element = element;
        this.options = $.extend({
            id: "",
            ownerId: "",
            parent: "",
            entity: "",// category object
            topparent: "",
            currOwner: "",
            category : "",
        }, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.topparent = options.topparent;
        this.tabId = options.tabid;
        this.entity = options.entity;
        this.init(options);
    };

    InheritedUIPanel.prototype.init = function (options) {
        this.entity = options.entity;
        var modalframe = document.createElement("div");
        this.element.appendChild(modalframe);
        if (options.category.categoryType == "136") {// department obj
            var plugin = $(modalframe).departmentCatePane({
                id: "dptuiProp018",
                parent: this,
                entity: options.category,// category object
                topparent: this.topparent,
                tabid: this.tabId,
                ownerId: this.options.ownerId,
            });
            //this.dptCatePanePlugin = plugin.data("departmentCatePane");
        } else if (options.category.categoryType == "137") { // position obj
            var plugin = $(modalframe).positionCatePane({
                id: "posuiProp018",
                parent: this,
                entity: options.category,// category object
                topparent: this.topparent,
                tabid: this.tabId,
                ownerId: this.options.ownerId,
            });
        }

    };

    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, pluginName)) {
                $.data(this, pluginName, new InheritedUIPanel(this, options));
            } else if ($.isFunction(Plugin.prototype[options])) {
                $.data(this, pluginName)[options]();
            }
        });
    };

})(jQuery, window, document);