;
(function ($, window, document, undefined) {
    var pluginName = "queryVersionRangePane";
    var defaults = {
        id: "",
        pid: "",// report service ID
        basicpropsheet: "",
        propsheet: "",
        width: 0,
        height: 0,
        parent: "",
        currObject: "",
        owner: "",
    };

    var Editor = function (element, options) {
        this.element = element;
        this.options = $.extend({
            id: "",
            pid: "",// report service ID
            basicpropsheet: "",
            propsheet: "",
            width: 0,
            height: 0,
            parent: "",
            currObject: "",
            owner: "",
        }, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.stack = options.parent.stack;
        this.pagesize = 30;
        this.delfileid = null;

        this.initMainPanel(options);
    };

    Editor.prototype.initMainPanel = function (options) {
        var editorPanel = document.createElement("DIV");
        this.element.appendChild(editorPanel);
        editorPanel.style.margin = "0px";
        editorPanel.style.padding = "0px";
        editorPanel.style.overflow = "auto";

        var painterRow = document.createElement("DIV");
        editorPanel.appendChild(painterRow);
        painterRow.className = "row";
        painterRow.style.margin = "0px";
        painterRow.style.marginTop = "2px";
        painterRow.style.padding = "0px";

        var tableDivPane = document.createElement("DIV");
        painterRow.appendChild(tableDivPane);
        tableDivPane.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12 table-responsive";
        tableDivPane.id = "versionstable" + options.pid;
        tableDivPane.style.margin = "0px";
        tableDivPane.style.padding = "0px";
        tableDivPane.style.border = "1px solid #ddd";
        tableDivPane.style.height = (options.height) + "px";
        tableDivPane.style.borderRadius = "4px";
        tableDivPane.style.overflowY = "auto";
        this.list = document.createElement("table");
        tableDivPane.appendChild(this.list);
        this.list.className = "table table-striped table-hover";
    };

    Editor.prototype.refresh = function () {
        this.loadData(this.options, "");
    };

    Editor.prototype.initialize = function () {
        this.loadData(this.options, "");
    };

    Editor.prototype.loadData = function (options, condition) {
        var that = this;
        this.currObject = options.currObject;// report service object
        $("#progressbar").show();
        $.getJSON(service.api(13, options.owner), {
            proccode: options.currObject.parentCode,// report service parentCode: process code
        }).complete(function (data) {
            that.loadReport(data.responseJSON);
            $("#progressbar").hide();
        });
    };

    Editor.prototype.loadReport = function (obj) {
        $(this.list).children().remove();
        if (obj != null && obj.length > 0) {
            for (var i = 0; i < obj.length; i++) {
                var r = obj[i];
                var ary = r.split("#");
                var row = this.list.insertRow(-1);
                row.setAttribute("key", ary[0] + this.options.pid);
                row.addEventListener("click", this, false);
                var cell = this.createCell(0, null, row);
                this.createCheckbox(cell, ary[0], "versions" + this.options.pid);
                this.createCell(1, ary[0], row);
                this.createCell(2, ary[1], row);
                this.createCell(3, (ary[2] == 0 ? "" : ary[2]), row);
            }
            if (obj.length < this.pagesize) {
                for (var i = obj.length; i < this.pagesize; i++) {
                    var row = this.list.insertRow(i);
                    for (var j = 0; j < 4; j++) {
                        this.createCell(j, "&nbsp;", row);
                    }
                }
            }
        } else {
            this.initList();
        }
        this.addListHeader(this.options);
    };

    Editor.prototype.createCheckbox = function (parent, id, name) {
        var button = document.createElement("Input");
        parent.appendChild(button);
        button.name = name;
        button.type = "checkbox";
        button.value = id;
        button.title = id;
        var d = this.options.edata;
        var ary = d.split("|");
        if (this.currObject.parentVersion.length) {
            for (var i = 0; i < this.currObject.parentVersion.length; i++) {
                if (ary[3] == id) {
                    button.disabled = true;
                }
                if (id == this.currObject.parentVersion[i]) {
                    button.checked = true;
                    break;
                }
            }
        }
        var rid = this.options.pid;
        var that = this;
        button.addEventListener("click", function (e) {
            var row = this.parentNode.parentNode;
            //var key = row.getAttribute("key");
            var selects = []
            if (this.name == "all" + rid) {
                var ch = document.getElementsByName("versions" + rid);
                var sels = [];
                if (document.getElementsByName("all" + rid)[0].checked == true) {
                    for (var i = 0; i < ch.length; i++) {
                        ch[i].checked = true;
                        sels.push(ch[i].value);
                    }
                } else {
                    for (var i = 0; i < ch.length; i++) {
                        if (ary[3] != ch[i].value) {
                            ch[i].checked = false;
                        }
                    }
                    sels = [ary[3]];
                }
                selects = sels;
            } else if (this.name == "versions" + rid) {
                var sels = [];
                // clone one for the reference.
                for (var k = 0; k < that.currObject.parentVersion.length; k++) {
                    sels.push(that.currObject.parentVersion[k]);
                }
                if (this.checked) {
                    sels.push(this.value);
                } else {
                    for (var i = 0; i < sels.length; i++) {
                        if (this.value == sels[i]) {
                            sels.splice(i, 1);
                            break;
                        }
                    }
                }
                selects = sels;
            }
            that.stack.execute(new BDMChangeVersionsCmd(that.currObject, selects));
        }, false);
        return button;
    };

    Editor.prototype.refreshList = function (list) {
        var ary = this.options.edata.split("|");
        if (list.length > 0) {
            // initializing...
            var ch = document.getElementsByName("versions" + this.options.pid);
            for (var j = 0; j < ch.length; j++) {
                ch[j].checked = false;
                if (ary[3] == ch[j].value) {
                    ch[j].disabled = true;
                }
            }
            // evaluating...
            for (var i = 0; i < list.length; i++) {
                for (var j = 0; j < ch.length; j++) {
                    if (ch[j].value == list[i]) {
                        ch[j].checked = true;
                    }
                }
            }
            var f = false;
            for (var j = 0; j < ch.length; j++) {
                if (ch[j].checked == false) {
                    f = true;
                    break;
                }
            }
            if (f) {
                document.getElementsByName("all" + this.options.pid)[0].checked = false;
            } else {
                document.getElementsByName("all" + this.options.pid)[0].checked = true;
            }
        } else {
            document.getElementsByName("all" + this.options.pid)[0].checked = false;
        }
    };

    Editor.prototype.addListHeader = function (options) {
        var header = this.list.createTHead();
        var row = header.insertRow(0);
        var th = this.createHead("全选&nbsp;&nbsp;", row);
        this.createCheckbox(th, "all", "all" + options.pid);
        this.createHead("版本", row);
        this.createHead("运行量", row);
        this.createHead("发布时间", row);
    };

    Editor.prototype.createCell = function (no, content, row) {
        var cell = row.insertCell(no);
        cell.setAttribute("nowrap", "true");
        if (content != null || content != "")
            cell.innerHTML = content;
        return cell;
    };

    Editor.prototype.createHead = function (content, row) {
        var th = document.createElement('th');
        th.setAttribute("nowrap", "true");
        th.innerHTML = content;
        row.appendChild(th);
        return th;
    };

    Editor.prototype.initList = function () {
        // document.createElement('tbody');
        for (var i = 0; i < this.pagesize; i++) {
            var row = this.list.insertRow(i);
            for (var j = 0; j < 4; j++) {
                var cell1 = row.insertCell(j);
                cell1.innerHTML = "&nbsp;";
            }
        }
    };

    Editor.prototype.handleEvent = function (e) {
        switch (e.type) {
            case "click":
                this.doClick(e);
                break;
        }
        Utils.stopBubble(e);
    };

    Editor.prototype.doClick = function (evt) {
        if (evt.target.tagName == "TD") {
            var table = evt.target.parentElement.parentElement;
            this.clearProcessSheet(table);
            evt.target.parentElement.style.background = "#d1d1e0";
            var r = evt.target.parentElement;
            this.selectRow(r.getAttribute("key"));
        }
    };

    Editor.prototype.selectRow = function (id) {
        if (this.list.rows.length > 1) {
            for (var i = 0; i < this.list.rows.length; i++) {
                if (this.list.rows[i].getAttribute("key") == id) {
                    this.list.rows[i].style.background = "#d1d1e0";
                    break;
                }
            }
        }
    };

    Editor.prototype.clearProcessSheet = function (table) {
        if (table.rows.length > 0) {
            for (var i = 0; i < table.rows.length; i++) {
                table.rows[i].style.background = "";
            }
        }
    };

    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, pluginName)) {
                $.data(this, pluginName, new Editor(this, options));
            } else if ($.isFunction(Plugin.prototype[options])) {
                $.data(this, pluginName)[options]();
            }
        });
    };

})(jQuery, window, document);