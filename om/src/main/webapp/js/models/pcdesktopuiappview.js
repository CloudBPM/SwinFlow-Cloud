/**
 * This is an application shell to load UI application
 *
 * @author Dahai Cao created at 13:11 on 2019-05-14
 *
 */
;
(function ($, window, document, undefined) {
    var pluginName = "desktopUIAppView";
    var defaults = {
        id: "",
        parent: "",
        height: "",
    };

    var Board = function (element, options) {
        this.element = element;
        this.options = $.extend({
            id: "",
            parent: "",
            height: "",
        }, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.stack = new CommandStack();
        this.init(options);
    };

    Board.prototype.init = function (options) {
       // this.board = document.createElement("DIV");
        //this.element.appendChild(this.board);
    };

    // loading firstly.
    Board.prototype.loading = function (fid) {
        $("#progressbar").show();
        var that = this;
        $.get(service.api("LL1"), {
            id: fid,// UI Form application id;
        }).complete(function (data) {
            if (data.responseJSON != null) {
                // if (that.options.parent.hiddenAll != undefined) {
                //     that.options.parent.hiddenAll();
                // }
                that.loadData(data.responseJSON);
                //that.show(true);
            }
            $("#progressbar").hide();
        });
    };

    // launch: 1:first page;2:secondary page
    Board.prototype.loadData = function (obj) {
        while (this.element.hasChildNodes()) { // clear dom
            this.element.removeChild(this.element.firstChild);
        }
        this.form = new ReleasedForm();
        //this.form.parseFromJSON(obj, launch);
        this.form.parseJSONforRuntime(obj.formContent);
        //this.form = this.form.clone();
        this.form.toDomForHTML(this.element);
        map[this.form.id] = this;
        // this.formbody.appendChild(this.form.dom);
    };

    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, pluginName)) {
                $.data(this, pluginName, new Board(this, options));
            } else if ($.isFunction(Plugin.prototype[options])) {
                $.data(this, pluginName)[options]();
            }
        });
    };

})(jQuery, window, document);