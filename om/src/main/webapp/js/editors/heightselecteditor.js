/**
 *
 */
;
(function ($, window, document, undefined) {
    var pluginName = "heightSelectCellEditor";
    var defaults = {
        parent: "",
        msg: "",
    };

    var SelectCellEditor = function (element, options) {
        this.element = element;
        this.options = $.extend({
            parent: "",
            msg: "",
        }, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
    };

    SelectCellEditor.prototype.loadEditor = function (tabid, tag, entity,
                                                      prop, isnull) {
        var that = this;
        this.tabId = tabid;
        if ($(tag).attr("type") == "h") {
            return;
        }
        var oldvalue = $(tag).html();
        $(tag).html("");
        var selection = $("<select name='selection' class='form-control'/></select>");
        selection.appendTo($(tag));
        $("<option value='100'>100</option>").appendTo($(selection));
        $("<option value='120'>120</option>").appendTo($(selection));
        $("<option value='150'>150</option>").appendTo($(selection));
        $("<option value='200'>200</option>").appendTo($(selection));
        $("<option value='250'>250</option>").appendTo($(selection));
        $("<option value='300'>300</option>").appendTo($(selection));
        $("<option value='350'>350</option>").appendTo($(selection));
        $("<option value='400'>400</option>").appendTo($(selection));
        $("<option value='450'>450</option>").appendTo($(selection));
        $("<option value='500'>500</option>").appendTo($(selection));
        $("<option value='550'>550</option>").appendTo($(selection));
        $("<option value='600'>600</option>").appendTo($(selection));
        $("<option value='650'>650</option>").appendTo($(selection));
        $("<option value='700'>700</option>").appendTo($(selection));

        var nextTR = selection.closest('tr').next();
        while (nextTR != undefined) {
            var nextTD = nextTR.find("td")[1];
            if (nextTD != undefined) {
                if (nextTD.getAttribute("type") != "-1") {
                    break;
                }
            } else {
                break;
            }
            nextTR = $(nextTR).next();
        }

        selection.keydown(function (event) {
            var keyvalue = event.which;
            if (keyvalue == 9) { // Tab key
                event.preventDefault();
                if (that.changeValue(tag, entity, prop, oldvalue, isnull)) {
                    selection.remove();
                    if (nextTD != undefined) {
                        that.options.parent.startToEdit(nextTD);
                    }
                } else {
                    selection.focus();
                    return false;
                }
            }
        }).keyup(function (event) {
            var keyvalue = event.which;
            if (keyvalue == 13) {// enter key
                event.preventDefault();
                if (that.changeValue(tag, entity, prop, oldvalue, isnull)) {
                    selection.remove();
                    if (nextTD != undefined) {
                        that.options.parent.startToEdit(nextTD);
                    }
                } else {
                    selection.focus();
                    return false;
                }
            } else if (keyvalue == 27) {
                $(tag).html(oldvalue);
            }
        }).blur(function () {
            if (that.changeValue(tag, entity, prop, oldvalue, isnull)) {
                selection.remove();
            } else {
                selection.focus();
                return false;
            }
        })
    };

    SelectCellEditor.prototype.changeValue = function (tag, entity, prop,
                                                       oldvalue, isnull) {
        var newvalue = $(tag).children("select").val();
        if (newvalue != oldvalue) {
            for (x in entity) {
                if (x == prop) {
                    map[this.tabId].stack.execute(new FMDesktopUIValueChangeCmd(
                        entity, prop, newvalue));
                    break;
                }
            }
        } else {
            $(tag).html(oldvalue);
        }
        return true;
    };


    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, pluginName)) {
                $.data(this, pluginName, new SelectCellEditor(this, options));
            } else if ($.isFunction(Plugin.prototype[options])) {
                $.data(this, pluginName)[options]();
            }
        });
    };

})(jQuery, window, document);