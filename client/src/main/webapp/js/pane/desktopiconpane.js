/**
 *
 */

;
(function ($, window, document, undefined) {
    var pluginName = "appShortcutPane";
    var defaults = {
        id: "", // plugin Id
        parent: "", // parent pane
        uid: "",// current logged in user Id
        topparent : "", // client main content pane
    };

    var BoardPanel = function (element, options) {
        this.element = element;
        this.options = $.extend({
            id: "",
            parent: "",
            uid: "",
            topparent : "", // client main content pane
        }, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init(options);
    };

    BoardPanel.prototype.init = function (options) {
        this.board = document.createElement("DIV");
        this.element.appendChild(this.board);
        this.board.style.marginTop = "10px";

        var maincontentRow = document.createElement("div");
        this.board.appendChild(maincontentRow);
        maincontentRow.className = "row";

        this.restultDiv = document.createElement("DIV");
        maincontentRow.appendChild(this.restultDiv);
        this.restultDiv.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";
        this.restultDiv.style.overflowY = "auto";
        this.restultDiv.style.overflowX = "auto";
    };

    BoardPanel.prototype.createAppIcon = function (parent, icon, title, author, pid, wtype, uid) {
        var appPane = document.createElement("DIV");
        parent.appendChild(appPane);
        appPane.className = "panel panel-default";

        var appBodyPane = document.createElement("DIV");
        appPane.appendChild(appBodyPane);
        appBodyPane.className = "panel-body";
        appBodyPane.setAttribute("pid", pid);
        appBodyPane.setAttribute("uid", uid);
        appBodyPane.setAttribute("wftype", wtype);
        var that = this;
        appBodyPane.addEventListener('click', function () {
            var workflowType = this.getAttribute("wftype");
            var pid = this.getAttribute("pid");
            if (workflowType == 1) {
                // single participant workflow
                that.options.topparent.launchSWfPane.loading(pid);
            } else if (workflowType == 2) {
                // multiple participant workflow
                that.options.topparent.launchMWfPane.loading(pid);
            }
        });

        var bodyRow1 = document.createElement("DIV");
        appBodyPane.appendChild(bodyRow1);
        bodyRow1.className = "row";

        var bodyCol1 = document.createElement("DIV");
        bodyRow1.appendChild(bodyCol1);
        bodyCol1.className = "col-lg-2 col-md-2 col-sm-2 col-xs-2";

        var appIcon = document.createElement("I");
        bodyCol1.appendChild(appIcon);
        appIcon.className = icon;
        appIcon.style.color = "#006699";
        appIcon.style.margin = "15px";

        var bodyCol2 = document.createElement("DIV");
        bodyRow1.appendChild(bodyCol2);
        bodyCol2.className = "col-lg-10 col-md-10 col-sm-10 col-xs-10";

        var appnInfo1 = document.createElement("DIV");
        bodyCol2.appendChild(appnInfo1);

        var appnName = document.createElement("h4");
        appnInfo1.appendChild(appnName);
        appnName.style.color = "#006699";
        appnName.style.textAlign = "center";
        appnName.innerHTML = title;

        var appnInfo2 = document.createElement("DIV");
        bodyCol2.appendChild(appnInfo2);

        var appnAuthor = document.createElement("h6");
        appnInfo2.appendChild(appnAuthor);
        appnAuthor.style.color = "#006699";
        appnAuthor.innerHTML = author;
        appnAuthor.style.textAlign = "right";
    };

    BoardPanel.prototype.searchingApp = function (id, pageno, pagesize) {
        $("#progressbar").show();
        var that = this;
        $.getJSON(service.api(29), {
            uid: id, // student user id
            pageno: pageno, // 0
            pagesize: pagesize, // 100
        }).complete(function (data) {
            that.loadNewData(data.responseJSON);
            $("#progressbar").hide();
        });
    };

    BoardPanel.prototype.loadNewData = function (json) {
        $(this.restultDiv).children().remove();
        if (json.pageEntities != null && json.pageEntities.length > 0) {
            var bodyRow1 = document.createElement("DIV");
            this.restultDiv.appendChild(bodyRow1);
            bodyRow1.className = "row";
            var col = 0;
            // column can be 1,2,3,4,6,12
            var colnum = 4;
            for (var i = 0; i < json.pageEntities.length; i++) {
                if (json.pageEntities[i] != null) {
                    col = col + 1;
                    var bodyCol1 = document.createElement("DIV");
                    bodyRow1.appendChild(bodyCol1);
                    //bodyCol1.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";// one for each row
                    //bodyCol1.className = "col-lg-6 col-md-6 col-sm-12 col-xs-12";// two for each row
                    //bodyCol1.className = "col-lg-4 col-md-4 col-sm-12 col-xs-12";// three for each row
                    bodyCol1.className = "col-lg-3 col-md-3 col-sm-12 col-xs-12";// four for each row
                    //bodyCol1.className = "col-lg-2 col-md-2 col-sm-12 col-xs-12";// six for each row
                    //bodyCol1.className = "col-lg-1 col-md-1 col-sm-12 col-xs-12";// twelve for each row

                    var url = json.pageEntities[i].procName + " ";
                    // url += (json.pageEntities[i].version != null
                    // && json.pageEntities[i].version.trim() != "" ? "("
                    //     + json.pageEntities[i].version + ") " : " ");
                    var p = "";
                    //(json.pageEntities[i].releaseDate == null ? ""
                    //    : ("发布时间:" + Utils.getDateTime(json.pageEntities[i].releaseDate)))
                    var pid = json.pageEntities[i].id;
                    var wtype = json.pageEntities[i].workflowType;
                    var uid = this.options.uid;
                    this.createAppIcon(bodyCol1, "fa fa-cubes fa-2x", url, p, pid, wtype, uid);

                    if (col == colnum) {
                        bodyRow1 = document.createElement("DIV");
                        this.restultDiv.appendChild(bodyRow1);
                        bodyRow1.className = "row";
                        col = 0;
                    }
                }
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