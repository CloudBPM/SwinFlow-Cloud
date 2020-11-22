/**
 *
 */

;
(function ($, window, document, undefined) {
    var pluginName = "searchResultPane";
    var defaults = {
        id: "",
        parent: "",
        uid: "",
    };

    var Board = function (element, options) {
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

    Board.prototype.init = function (options) {
        this.board = document.createElement("DIV");
        this.element.appendChild(this.board);
        this.show(false);

        var panel = document.createElement("DIV");
        this.board.appendChild(panel);
        panel.className = "container-fluid";

        var countRow = document.createElement("DIV");
        panel.appendChild(countRow);
        countRow.className = "row";

        this.countDiv = document.createElement("DIV");
        countRow.appendChild(this.countDiv);
        this.countDiv.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";
        this.countDiv.innerHTML = "找到约 XXXX条结果 （用时 xxx 秒） ";


        var toolbarRow = document.createElement("DIV");
        this.board.appendChild(toolbarRow);
        toolbarRow.className = "row";

        var toolbarDiv = document.createElement("DIV");
        toolbarRow.appendChild(toolbarDiv);
        toolbarDiv.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";
        toolbarDiv.style.margin = "0px";
        toolbarDiv.style.padding = "2px";
        this.createNavigationGroup(toolbarDiv);

        var maincontentRow = document.createElement("div");
        this.board.appendChild(maincontentRow);
        maincontentRow.className = "row";

        this.restultDiv = document.createElement("DIV");
        maincontentRow.appendChild(this.restultDiv);
        this.restultDiv.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";
        this.restultDiv.style.overflowY = "auto";
        this.restultDiv.style.overflowX = "auto";
        //this.restultDiv.style.height = "800px";


    };

    Board.prototype.createNavigationGroup = function (parent) {
        var group = this.createGroup(parent);
        this.firstPageBtn = this.createTool(group, "fp" + this.options.id,
            "首页", "btn btn-default", "i", "fa fa-step-backward fa-lg");
        this.previousPageBtn = this.createTool(group, "pp" + this.options.id,
            "前一页", "btn btn-default", "i", "fa fa-backward fa-lg");
        this.nextPageBtn = this.createTool(group, "np" + this.options.id,
            "后一页", "btn btn-default", "i", "fa fa-forward fa-lg");
        this.lastPageBtn = this.createTool(group, "lp" + this.options.id, "末页",
            "btn btn-default", "i", "fa fa-step-forward fa-lg");

        this.disableButton(this.firstPageBtn);
        this.disableButton(this.previousPageBtn);
        this.disableButton(this.nextPageBtn);
        this.disableButton(this.lastPageBtn);

        var group2 = this.createGroup(parent);
        this.pageno = this.createLabel(group2, "l1" + this.options.id, "");
        this.totalpage = this.createLabel(group2, "l2" + this.options.id, "");
    };

    Board.prototype.createGroup = function (parent) {
        var group = document.createElement("DIV");
        group.className = "btn-group";
        group.style.padding = "2px";
        group.setAttribute("role", "group");
        group.setAttribute("aria-label", "");
        parent.appendChild(group);
        return group;
    };

    Board.prototype.createLabel = function (group, id, title) {
        var label = document.createElement("Label");
        label.innerHTML = title;
        label.id = id;
        group.appendChild(label);
        return label;
    };

    Board.prototype.createTool = function (group, id, title, style, fonttag,
                                           fontclass) {
        var button = document.createElement("button");
        group.appendChild(button);
        button.className = style;
        button.setAttribute("title", title);
        button.type = "button";
        button.id = id;
        button.addEventListener('click', this, false);
        var icon = document.createElement(fonttag);
        button.appendChild(icon);
        //icon.addEventListener('click', this, false);
        icon.className = fontclass;
        icon.setAttribute("title", title);
        icon.id = id;
        return button;
    };

    Board.prototype.enableButton = function (button) {
        button.classList.remove("disabled");
    };

    Board.prototype.disableButton = function (button) {
        button.classList.add("disabled");
    };

    Board.prototype.handleEvent = function (e) {
        switch (e.type) {
            case "click":
                this.doClick(e);
                break;
        }
    };

    Board.prototype.searching = function (searchstring, pageno, pagesize) {
        $("#progressbar").show();
        var that = this;
        $.getJSON(service.api(6), {
            uid: this.options.uid, // user id
            cond: searchstring, // search
            pageno: pageno,
            pagesize: pagesize,
        }).complete(function (data) {
            if (pversion == 3) {
                that.loadData(data.responseJSON);
            } else {
                that.loadNewData(data.responseJSON);
            }
            that.show(true);
            $("#progressbar").hide();
        });
    };

    Board.prototype.loadData = function (json) {
        this.countDiv.innerHTML = "找到约0条结果 （用时0秒） ";
        if (json == null) {
            return;
        }
        $(this.restultDiv).children().remove();
        for (var i = 0; i < json.pageEntities.length; i++) {
            if (json.pageEntities[i] != null) {
                //结果显示
                this.countDiv.innerHTML = "找到约"+json.allEntitiesCount+"条结果 （用时"+json.pageEntities[i].spendTime/1000+"秒） ";

                var entiyDiv = document.createElement("DIV");
                this.restultDiv.appendChild(entiyDiv);
                entiyDiv.className = "form-group";
                entiyDiv.style.paddingLeft = "5px";

//				var radioLabel = document.createElement("LABEL");
//				entiyDiv.appendChild(radioLabel);
//				radioLabel.className = "radio";
//
//				var appRadio = document.createElement("input");
//				radioLabel.appendChild(appRadio);
//				appRadio.type = "radio";
//				appRadio.name = "proc";
//				appRadio.id = json.pageEntities[i].id;
//				appRadio
//						.setAttribute("procname", json.pageEntities[i].procName);
//				appRadio.value = json.pageEntities[i].id;
//				appRadio.setAttribute("title", "请点击这里以选择该流程服务。");
//				var that = this;
//				appRadio.addEventListener("click", function() {
//					if (this.checked) {
//						//that.enableButton(that.saveButton);
//					}
//				});

                var titleDiv = document.createElement("DIV");
                //radioLabel.appendChild(titleDiv);
                entiyDiv.appendChild(titleDiv);

                var titleH3 = document.createElement("H4");
                titleDiv.appendChild(titleH3);
                titleH3.style.color = "blue";
                var url = json.pageEntities[i].procName + " ";
                url += (json.pageEntities[i].version != null
                && json.pageEntities[i].version.trim() != "" ? "("
                    + json.pageEntities[i].version + ") " : " ");
                titleH3.style.cursor = "pointer";
                titleH3.setAttribute("pid", json.pageEntities[i].id);
                titleH3.setAttribute("uid", this.options.uid);
                titleH3.setAttribute("wftype", json.pageEntities[i].workflowType);
                titleH3.addEventListener('click', this, false);
                titleH3.innerHTML = url;
                var that = this;
                titleH3.addEventListener("click", function () {
                    var workflowType = this.getAttribute("wftype");
                    if (workflowType == 1) { // single participant workflow
                        that.options.parent.launchSWfPane.loading(this
                            .getAttribute("pid"));
                    } else if (workflowType == 2) {
                        // multiple participant workflow
                        that.options.parent.launchMWfPane.loading(this
                            .getAttribute("pid"));
                    }
                });


                var commentDiv = document.createElement("DIV");
                entiyDiv.appendChild(commentDiv);
                commentDiv.innerHTML = Utils
                        .getDateTime(json.pageEntities[i].lastupdate)
                    + "更新 - 简介："
                    + (json.pageEntities[i].description != null
                    && json.pageEntities[i].description.trim() != "" ? json.pageEntities[i].description
                        : "无");

                var commentDiv1 = document.createElement("DIV");
                entiyDiv.appendChild(commentDiv1);
                commentDiv1.innerHTML = (json.pageEntities[i].releaseDate == null ? ""
                    : (Utils.getDateTime(json.pageEntities[i].releaseDate) + "发布 - 公告："))
                    + (json.pageEntities[i].releaseStatement != null
                    && json.pageEntities[i].releaseStatement.trim() != "" ? json.pageEntities[i].releaseStatement
                        : "无");

                var discussionDiv = document.createElement("DIV");
                entiyDiv.appendChild(discussionDiv);

                // star level
                var starsDiv = document.createElement("SPAN");
                discussionDiv.appendChild(starsDiv);

                var starDiv1 = document.createElement("SPAN");
                starsDiv.appendChild(starDiv1);
                starDiv1.className = "glyphicon glyphicon-star";

                var starDiv2 = document.createElement("SPAN");
                starsDiv.appendChild(starDiv2);
                starDiv2.className = "glyphicon glyphicon-star";

                var starDiv3 = document.createElement("SPAN");
                starsDiv.appendChild(starDiv3);
                starDiv3.className = "glyphicon glyphicon-star";

                var starDiv4 = document.createElement("SPAN");
                starsDiv.appendChild(starDiv4);
                starDiv4.className = "glyphicon glyphicon-star-empty";

                var starDiv5 = document.createElement("SPAN");
                starsDiv.appendChild(starDiv5);
                starDiv5.className = "glyphicon glyphicon-star-empty";

//				var refDiv = document.createElement("SPAN");
//				discussionDiv.appendChild(refDiv);
//				refDiv.innerHTML = " 引用量：" + 1000 + " ";
//
//				var useDiv = document.createElement("SPAN");
//				discussionDiv.appendChild(useDiv);
//				useDiv.innerHTML = " 成功率：" + 99.98 + "% ";

                var likeDiv = document.createElement("SPAN");
                discussionDiv.appendChild(likeDiv);
                likeDiv.innerHTML = " 获赞：" + 2300 + " ";

//				var respDiv = document.createElement("SPAN");
//				discussionDiv.appendChild(respDiv);
//				respDiv.innerHTML = " 售价："
//						+ (parseFloat(json.pageEntities[i].purchasePrice) == 0 ? "免费"
//								: "￥" + json.pageEntities[i].purchasePrice)
//						+ " ";

//				var priceDiv = document.createElement("SPAN");
//				discussionDiv.appendChild(priceDiv);
//				priceDiv.innerHTML = " 使用价格："
//						+ (parseFloat(json.pageEntities[i].usagePrice) == 0 ? "免费"
//								: "￥" + json.pageEntities[i].usagePrice) + " ";

                var devDiv = document.createElement("DIV");
                entiyDiv.appendChild(devDiv);
                devDiv.innerHTML = "发布：" + json.pageEntities[i].orgName;

                if (json.pageEntities[i].appType == "2") {
                    this.loadAPIs(json.pageEntities[i], entiyDiv);
                }
            }
            this.pageno.innerHTML = "第" + json.pageNo + "页";
            this.totalpage.innerHTML = "/共" + json.allPagesCount + "页";
            if (json.allPagesCount <= 1) {
                this.disableButton(this.firstPageBtn);
                this.disableButton(this.previousPageBtn);
                this.disableButton(this.nextPageBtn);
                this.disableButton(this.lastPageBtn);
            } else if (json.allPagesCount > 1) {
                if (json.pageNo == 1) {
                    this.disableButton(this.firstPageBtn);
                    this.disableButton(this.previousPageBtn);
                    this.enableButton(this.nextPageBtn);
                    this.enableButton(this.lastPageBtn);
                } else if (json.pageNo == json.allPagesCount) {
                    this.enableButton(this.firstPageBtn);
                    this.enableButton(this.previousPageBtn);
                    this.disableButton(this.nextPageBtn);
                    this.disableButton(this.lastPageBtn);
                } else if (json.pageNo > 1 && json.pageNo < json.allPagesCount) {
                    this.enableButton(this.firstPageBtn);
                    this.enableButton(this.previousPageBtn);
                    this.enableButton(this.nextPageBtn);
                    this.enableButton(this.lastPageBtn);
                }
            }
        }
    };

    Board.prototype.loadNewData = function (json) {
        $(this.restultDiv).children().remove();
        if (json.pageEntities != null && json.pageEntities.length > 0) {
            var bodyRow1 = document.createElement("DIV");
            this.restultDiv.appendChild(bodyRow1);
            bodyRow1.className = "row";
            var col = 0;
            // colnum can be 1,2,3,4,6,12
            var colnum = 4;
            for (var i = 0; i < json.pageEntities.length; i++) {
                if (json.pageEntities[i] != null) {
                    if (col == colnum + 1) {
                        bodyRow1 = document.createElement("DIV");
                        this.restultDiv.appendChild(bodyRow1);
                        bodyRow1.className = "row";
                        col = 0;
                    }
                    var bodyCol1 = document.createElement("DIV");
                    bodyRow1.appendChild(bodyCol1);
                    //bodyCol1.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";// one for each row
                    //bodyCol1.className = "col-lg-6 col-md-6 col-sm-12 col-xs-12";// two for each row
                    //bodyCol1.className = "col-lg-4 col-md-4 col-sm-12 col-xs-12";// three for each row
                    bodyCol1.className = "col-lg-3 col-md-3 col-sm-12 col-xs-12";// four for each row
                    //bodyCol1.className = "col-lg-2 col-md-2 col-sm-12 col-xs-12";// six for each row
                    //bodyCol1.className = "col-lg-1 col-md-1 col-sm-12 col-xs-12";// twelve for each row

                    var url = json.pageEntities[i].procName + " ";
                    url += (json.pageEntities[i].version != null
                    && json.pageEntities[i].version.trim() != "" ? "("
                        + json.pageEntities[i].version + ") " : " ");
                    var p = (json.pageEntities[i].releaseDate == null ? ""
                        : ("发布时间:" + Utils.getDateTime(json.pageEntities[i].releaseDate)))
                    var pid = json.pageEntities[i].id;
                    var wtype = json.pageEntities[i].workflowType;
                    var uid = this.options.uid;
                    this.createAppIcon(bodyCol1, "fa fa-cubes fa-2x", url, p, pid, wtype, uid);
                    col = col + 1;
                }
            }
        }
    };

    Board.prototype.createAppIcon = function (parent, icon, title, author, pid, wtype, uid) {
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
                that.options.parent.launchSWfPane.loading(pid);
            } else if (workflowType == 2) {
                // multiple participant workflow
                that.options.parent.launchMWfPane.loading(pid);
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

    Board.prototype.show = function (show) {
        if (show) {
            this.board.style.display = "";
        } else {
            this.board.style.display = "none";
        }
    };

    Board.prototype.doClick = function (evt) {

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