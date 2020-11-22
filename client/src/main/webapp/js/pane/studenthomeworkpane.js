/**
 *
 */

;
(function ($, window, document, undefined) {
    var pluginName = "studentHomeworkPane";
    var defaults = {
        id: "",
        mypos: "",
        parent: "",
    };

    var Board = function (element, options) {
        this.element = element;
        this.options = $.extend({
            id: "",
            mypos: "",
            parent: "",
        }, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init(options);
    };

    Board.prototype.init = function (options) {
        this.board = document.createElement("DIV");
        this.element.appendChild(this.board);
        this.show(false);

        var panel = document.createElement("DIV");
        this.board.appendChild(panel);
        panel.className = "container-fluid";

        // row0
        var panelRow0 = document.createElement("DIV");
        panel.appendChild(panelRow0);
        panelRow0.className = "row";

        var panelCol0 = document.createElement("DIV");
        panelRow0.appendChild(panelCol0);
        panelCol0.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";

        this.createTitle(panelCol0, "fa fa-file-text", "学生习作", "#1a8931");

        var panelRow1 = document.createElement("DIV");
        panel.appendChild(panelRow1);
        panelRow1.className = "row";

        var panelCol1 = document.createElement("DIV");
        panelRow1.appendChild(panelCol1);
        panelCol1.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";

        this.createHomeworkPane(panelCol1, options);

    };

    Board.prototype.createHomeworkPane = function (parent, options) {
        var painterRow = document.createElement("DIV");
        parent.appendChild(painterRow);
        painterRow.className = "row";
        painterRow.style.margin = "0px";
        painterRow.style.marginTop = "10px";
        painterRow.style.padding = "0px";

        var tableDivPane = document.createElement("DIV");
        painterRow.appendChild(tableDivPane);
        tableDivPane.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";
        tableDivPane.id = "listPane" + this.options.id;
        tableDivPane.className = "table-responsive";
        tableDivPane.style.margin = "0px";
        tableDivPane.style.padding = "0px";
        tableDivPane.style.border = "1px solid #ddd";
        var h = document.documentElement.clientHeight;
        tableDivPane.style.height = (h - 160) + "px";
        tableDivPane.style.overflowY = "auto";
        tableDivPane.style.borderRadius = "4px";

        this.tableList = document.createElement("table");
        tableDivPane.appendChild(this.tableList);
        this.tableList.id = "safflist";
        this.tableList.className = "table table-striped table-hover";

        this.loading(options);
    };

    Board.prototype.loading = function (options) {
        if (options.mypos != "") {
            $("progressbar").show();
            var that = this;
            $.getJSON(service.api(28), {
                posid: options.mypos,
            }).complete(function (data) {
                that.loadData(data.responseJSON);
                $("#progressbar").hide();
            });
        }
    };

    Board.prototype.loadData = function (jsonobj) {
        $(this.tableList).children().remove();
        if (jsonobj != null && jsonobj.length > 0) {
            for (var i = 0; i < jsonobj.length; i++) {
                var row = this.tableList.insertRow(i);
                this.createCell(0, jsonobj[i].staffCode, row);
                this.createCell(1, jsonobj[i].user.fullName, row);
                this.createCell(2, jsonobj[i].user.nation, row);
                var cell = this.createCell(3, "", row);
                this.createIcon(cell, jsonobj[i].user.id, jsonobj[i].user.fullName,
                    "fa fa-file-o fa-lg","view", "查看", "btn-primary");
            }
            if (jsonobj.length < 40) {
                for (var i = jsonobj.length; i < 40; i++) {
                    var row = this.tableList.insertRow(i);
                    for (var j = 0; j < 4; j++) {
                        this.createCell(j, "&nbsp;", row);
                    }
                }
            }
        } else {
            this.initList(this.options);
        }
        this.addListHeader(this.options);
    };

    Board.prototype.createIcon = function (parent, id, fname, classname, name,
                                           title, style) {
        var button = document.createElement("BUTTON");
        parent.appendChild(button);
        button.id = name + id;
        button.className = "btn btn-default " + style;
        button.style.borderRadius = "15px";
        button.style.width = "29px";
        button.style.padding = "3px";
        button.title = title;
        button.setAttribute("userid", id); // user id
        button.setAttribute("username", fname);// user full name
        button.name = name;
        var that = this;
        button.addEventListener("click", function (evt) {
            if (this.name == "view") {
                if (that.options.parent != undefined) {
                    that.options.parent.hiddenAll();
                    that.options.parent.homeworkAppPane.loadHomework(
                        this.getAttribute("userid"), this.getAttribute("username"));
                }
            }
            Utils.stopBubble(evt);
        });
        var rmspan = document.createElement("SPAN");
        button.appendChild(rmspan);
        rmspan.className = classname;
        rmspan.name = name;
        rmspan.setAttribute("aria-hidden", "true");
        rmspan.setAttribute("data-toggle", "modal");
        rmspan.setAttribute("data-target", "myModal");
        rmspan.title = title;
        rmspan.id = id + "i";
        return button;
    };

    Board.prototype.initList = function (options) {
        for (var i = 0; i < 40; i++) {
            var row = this.tableList.insertRow(i);
            for (var j = 0; j < 4; j++) {
                var cell1 = row.insertCell(j);
                cell1.innerHTML = "&nbsp;";
            }
        }
    };

    Board.prototype.addListHeader = function (options) {
        var header = this.tableList.createTHead();
        var row = header.insertRow(0);
        this.createHead("学号", row);
        this.createHead("姓名", row);
        this.createHead("已完成", row);
        this.createHead("操作", row);
    };

    Board.prototype.createHead = function (content, row) {
        var th = document.createElement('th');
        th.setAttribute("nowrap", "true");
        th.innerHTML = content;
        row.appendChild(th);
    };

    Board.prototype.createCell = function (no, cellname, row) {
        var cell = row.insertCell(no);
        cell.setAttribute("nowrap", "true");
        if (cellname != null && cellname != "") {
            cell.innerHTML = cellname;
        }
        return cell;
    };

    Board.prototype.handleEvent = function (e) {
        switch (e.type) {
            case "click":
                this.doClick(e);
                break;
        }
        Utils.stopBubble(e);
    };

    Board.prototype.show = function (show) {
        if (show) {
            this.board.style.display = "";
        } else {
            this.board.style.display = "none";
        }
    };

    Board.prototype.doDblClick = function (evt) {
        if (evt.target.tagName == "TD") {
            this.tableList.focus();
        }
    };

    Board.prototype.createTitle = function (parent, icon, title, color) {
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

    Board.prototype.doClick = function (evt) {
        if (evt.target.tagName == "TD") {
            var table = evt.target.parentElement.parentElement;
            this.clearProcessSheet(table);
            evt.target.parentElement.style.background = "#d1d1e0";
            var r = evt.target.parentElement;
            this.selectRow(r.getAttribute("key"));
        }
    };

    Board.prototype.selectRow = function (id) {
        if (this.tableList.rows.length > 1) {
            for (var i = 0; i < this.tableList.rows.length; i++) {
                if (this.tableList.rows[i].getAttribute("key") == id) {
                    this.tableList.rows[i].style.background = "#d1d1e0";
                    this.selectIndex = id;
                    break;
                }
            }
        }
    };

    Board.prototype.clearProcessSheet = function (table) {
        if (table.rows.length > 0) {
            for (var i = 0; i < table.rows.length; i++) {
                table.rows[i].style.background = "";
            }
            this.selectIndex = -1;
        }
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