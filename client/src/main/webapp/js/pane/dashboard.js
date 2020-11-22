/**
 *
 */

;
(function ($, window, document, undefined) {
    var pluginName = "dashboard";
    var defaults = {
        id: "",
        parent: "",
        uid: "",
        userName: "",
        mycate: "",
        title: "",
    };

    var Dashboard = function (element, options) {
        this.element = element;
        this.options = $.extend({
            id: "",
            parent: "",
            uid: "",
            userName: "",
            mycate: "",
        }, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init(options);
    };

    Dashboard.prototype.init = function (options) {
        this.dashboard = document.createElement("DIV");
        this.element.appendChild(this.dashboard);

        var panel = document.createElement("DIV");
        this.dashboard.appendChild(panel);
        panel.className = "container-fluid";


        var panelRow1 = document.createElement("DIV");
        panel.appendChild(panelRow1);
        panelRow1.className = "row";

        var panelCol4 = document.createElement("DIV");
        panelRow1.appendChild(panelCol4);
        panelCol4.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";

        if (options.title != "") {
            this.createTitle(panelCol4, "fa fa-home", options.title, "#0d4b09");
        }

        if (options.mycate == "学生") {
            if ($(panelCol4).appShortcutPane != undefined) {
                var board = $(panelCol4).appShortcutPane({
                    id: "shortcutApp" + options.uid,
                    parent: this,
                    uid: options.uid,
                    topparent: options.parent,
                    source: 0,
                });
                this.appShortcutPane = board.data("appShortcutPane");
                this.appShortcutPane.searchingApp(options.uid, 0, 100);
            }
        } else {
            if ($(panelCol4).authorizedAppShortcutPane != undefined) {
                var board = $(panelCol4).authorizedAppShortcutPane({
                    id: "shortcut" + options.uid,
                    parent: this.options.parent,
                    uid: options.uid,
                    topparent: options.parent,
                    source: 0,
                });
                this.authAppShortcutPane = board.data("authorizedAppShortcutPane");
            }
        }

        this.show(true);

    };


    Dashboard.prototype.createTitle = function (parent, icon, title, color) {
        var titleSpan = document.createElement("SPAN");
        parent.appendChild(titleSpan);

        var h3 = document.createElement("H3");
        titleSpan.appendChild(h3);
        h3.className = "page-header";
        h3.style.margin = "0";

        var span = document.createElement("SPAN");
        h3.appendChild(span);
        span.className = icon;
        span.setAttribute("aria-hidden", "true");
        span.style.color = color;

        var text = document.createTextNode(" " + title);
        h3.appendChild(text);

        return titleSpan;
    };


    Dashboard.prototype.show = function (show) {
        if (show) {
            //this.workItemPane.reloading();
            this.dashboard.style.display = "";
        } else {
            this.dashboard.style.display = "none";
        }
    };

    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, pluginName)) {
                $.data(this, pluginName, new Dashboard(this, options));
            } else if ($.isFunction(Plugin.prototype[options])) {
                $.data(this, pluginName)[options]();
            }
        });
    };

})(jQuery, window, document);