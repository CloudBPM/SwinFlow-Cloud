/**
 *
 */

;
(function ($, window, document, undefined) {
    var pluginName = "authorizedAppShortcutPane";
    var defaults = {
        id: "",
        parent: "",
        uid: "",
    };

    var BoardPanel = function (element, options) {
        this.element = element;
        this.options = $.extend({
            id: "",
            parent: "",
            uid: "",
        }, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init(options);
    };

    BoardPanel.prototype.init = function (options) {
        this.board = document.createElement("DIV");
        this.element.appendChild(this.board);

        var panel = document.createElement("DIV");
        this.board.appendChild(panel);
        panel.className = "container-fluid";

        var maincontentRow = document.createElement("div");
        this.board.appendChild(maincontentRow);
        maincontentRow.className = "row";

        this.restultDiv = document.createElement("DIV");
        maincontentRow.appendChild(this.restultDiv);
        this.restultDiv.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";
        this.restultDiv.style.marginTop = "20px";

        this.loadUI();
    };

    BoardPanel.prototype.loadUI = function () {
        $("#progressbar").show();
        var that = this;
        $.getJSON(service.api(18), {
            uid: this.options.uid, // user id
        }).complete(function (data) {
            that.loadNewData(data.responseJSON);
            $("#progressbar").hide();
        });
    };

    BoardPanel.prototype.loadNewData = function (json) {
        $(this.restultDiv).children().remove();
        if (json != null && json.length > 0) {
            for (var i=0;i<json.length;i++) {
                var ui = new PCDesktopUI();
                ui.parseFromJSON(JSON.parse(json[i]), 1);
                //console.log(this.restultDiv.clientWidth);
                //console.log(this.restultDiv.clientHeight);
                ui.toDomForHTML(this.restultDiv);
                map[ui.id] = this;
            }
        }
    };

    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, pluginName)) {
                $.data(this, pluginName, new BoardPanel(this, options));
            } else if ($.isFunction(Plugin.prototype[options])) {
                $.data(this, pluginName)[options]();
            }
        });
    };

})(jQuery, window, document);