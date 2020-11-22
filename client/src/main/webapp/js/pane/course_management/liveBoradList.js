/**
 *
 */
;
(function($, window, document, undefined) {
    var pluginName = "liveListEditor";
    var defaults = {
        id : "",
        owner : "",
        userId : "",
        userfullname : "",
        ownername : "",
        basicpropsheet : "",
        propsheet : "",
        ownerId:"",
        width : 0,
        height : 0,
        parent : "",
    };

    var Editor = function(element, options) {
        this.element = element,
        this.options = $.extend({
            id : "",
            owner : "",
            userId : "",
            userfullname : "",
            ownername : "",
            basicpropsheet : "",
            propsheet : "",
            ownerId:"",
            width : 0,
            height : 0,
            parent : "",
        }, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.stack = new CommandStack();
        this.init(options);
        this.loading(1,10, "",options.userId);
    };

    Editor.prototype.init = function(options) {
        // top tool bar
        var topToolbarRow = this.createRow(this.element);
        this.createTopToolbar(options, topToolbarRow);

        var paneRow = this.createRow(this.element);

        var workitemPanel = document.createElement("DIV");
        paneRow.appendChild(workitemPanel);
        workitemPanel.className = "panel panel-default";
        workitemPanel.style.marginBottom = "0px";

        var workitemPanelBody = document.createElement("DIV");
        workitemPanel.appendChild(workitemPanelBody);
        workitemPanelBody.className = "panel-body";
        workitemPanelBody.style.padding = "0px";

        var tableDiv = document.createElement("DIV");
        workitemPanelBody.appendChild(tableDiv);
        tableDiv.id = "items" + options.id;
        tableDiv.className = "table-responsive";
        tableDiv.style.overflowY = "auto";
        tableDiv.style.overflowX = "auto";
        var h = document.documentElement.clientHeight;
        tableDiv.style.height = (h - 230) + "px";
        tableDiv.style.margin = "0px";

        this.workitemlist = document.createElement("table");
        this.workitemlist.className = "table table-striped table-hover";
        tableDiv.appendChild(this.workitemlist);

        // var p4 = $(this.element).liveBroadcastViewEditor({
        //     id : "004",
        //     title:"添加直播",
        //     owner : options.owner,
        //     userId : options.userId,
        //     userfullname : options.userfullname,
        //     ownername : options.ownername,
        //     basicpropsheet : options.basicpropsheet,
        //     propsheet : options.propsheet,
        //     ownerId:options.ownerId,
        //     width : 650,
        //     height : 400,
        //     parent : this,
        // });
        // this.liveEditor = p4.data("liveBroadcastViewEditor")
    };

    // Editor.prototype.createSelection = function(parent) {
    //     var group = this.createGroup(parent);
    //     this.statusSelect = this.createTool(group, "addlive" + this.options.id,
    //         "添加直播", "btn btn-default btn-success", "addlive",
    //         "fa fa-plus fa-lg");
    //     this.statusSelect.addEventListener("change", this, false);
    // };
    Editor.prototype.createTopToolbar = function(options, toolbar) {
        var toolbarForm = document.createElement("form");
        toolbar.appendChild(toolbarForm);
        toolbarForm.className = "form-inline";

        var parent = document.createElement("DIV");
        toolbarForm.appendChild(parent);
        parent.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";
        parent.style.margin = "0px";
        parent.style.padding = "0px";

        var c0 = "btn btn-default btn-sm";
        var c1 = "btn btn-success btn-sm";
        var c2 = "btn btn-primary btn-sm";

        var g0 = this.createGroup(parent);
        this.tRefresh = this.createTool(g0,  "Refresh" + this.options.id, "刷新",
            c1, "i", "fa fa-refresh fa-lg");
        var g1 = this.createGroup(parent);
        this.tFirstPage = this.createTool(g1, "firstPages" + this.options.id,
            "首页", c0, "i", "fa fa-step-backward fa-lg");
        this.tPreviousPage = this.createTool(g1,"previousPageS" + this.options.id,
            "前一页", c0, "i", "fa fa-backward fa-lg");
        this.tNextPage = this.createTool(g1, "nextPages" + this.options.id,
            "后一页", c0, "i", "fa fa-forward fa-lg");
        this.tLastPage = this.createTool(g1, "lastPages" + this.options.id, "末页",
            c0, "i", "fa fa-step-forward fa-lg");


        var g2 = this.createGroup(parent);
        this.tPageno = this.createLabel(g2, "L1" + this.options.id, "");
        this.tTotalpage = this
            .createLabel(g2, "L2" + this.options.id, "");

        // search...
        var g3 = this.crateSGroup(parent);
        this.tSearchInput = document.createElement("input");
        g3.appendChild(this.tSearchInput);
        this.tSearchInput.type = "text";
        this.tSearchInput.addEventListener("keydown",this,false);
        this.tSearchInput.className = "form-control";
        this.tSearchInput.setAttribute("placeholder", "搜索直播名、直播介绍等");

        var searchSpan = document.createElement("span");
        g3.appendChild(searchSpan);
        searchSpan.className = "input-group-btn";

        this.tSearchButton = this.createTool(searchSpan, "search"
            + this.options.id, "搜索", "btn btn-primary", "i",
            "fa fa-search fa-lg");
    };

    Editor.prototype.loading = function(pageno, pagesize, condition, uid) {
        $("#progressbar").show();
        var that = this;
        $.post(service.api(20), {
            userId:uid,
            pn : pageno,
            psz : pagesize,
            cond : condition,
            type :0
        }).complete(function(data) {
            that.loadData(data.responseJSON);
            that.setPropertySheet();
            $("#progressbar").hide();
        });
    };
    Editor.prototype.loadData = function(obj) {
        var currPage = new Page();
        currPage.parseFromJSON(obj);
        this.currpage = currPage;
        $(this.workitemlist).children().remove();
        var objs = currPage.pageEntities;
        if (objs != null && objs.length > 0) {
            for (var i = 0; i < objs.length; i++) {
                var live = new Live();
                live.parseFromJSON(objs[i]);
                var row = this.workitemlist.insertRow(-1);
                row.addEventListener('dblclick', this, false);
                row.addEventListener('click', this, false);
                // row.setAttribute("path", book.bookPath);
                this.createCell(0, live.liveName, row);
                this.createCell(1, live.liveDesc, row);
                this.createCell(2, live.liveType, row);
                this.createCell(3, live.liveDate, row);
                this.createCell(4, live.liveTime, row);
                this.createCell(5, live.liveInfo, row);
                this.createCell(6, live.sellType, row);
                this.createCell(7, live.goodPrise+"元", row);
                this.createCell(8, live.discountPrise+"元", row);
                // this.createCell(6, book.createTime,row);
                var cell = this.createCell(9, null, row);
                cell.setAttribute("path",live.liveImage);
                var b0 = this.createIcon(cell, "live"+this.options.id, "4", "fa fa-file-o fa-lg",
                    "view", "查看", "btn-primary");
                b0.addEventListener("click",this,false);
            }
            this.addHeader();
            this.tPageno.innerHTML = "第" + this.currpage.pageNo + "页";
            this.tTotalpage.innerHTML = "/共" + this.currpage.allPagesCount
                + "页";
            this.tPageno.innerHTML = "第" + this.currpage.pageNo + "页";
            this.tTotalpage.innerHTML = "/共" + this.currpage.allPagesCount
                + "页";
        } else {
            this.initList();
            this.addHeader();
        }
        if (this.currpage.allPagesCount <= 1) {;
            this.tFirstPage.disabled = true;
            this.tPreviousPage.disabled = true;
            this.tNextPage.disabled = true;
            this.tLastPage.disabled = true;
        } else if (this.currpage.allPagesCount > 1) {
            if (this.currpage.pageNo == 1) {
                this.tFirstPage.disabled = true;
                this.tPreviousPage.disabled = true;
                this.tNextPage.disabled = false;
                this.tLastPage.disabled = false;
            } else if (this.currpage.pageNo == this.currpage.allPagesCount) {
                this.tFirstPage.disabled = false;
                this.tPreviousPage.disabled = false;
                this.tNextPage.disabled = true;
                this.tLastPage.disabled = true;
            } else if (this.currpage.pageNo > 1
                && this.currpage.pageNo < this.currpage.allPagesCount) {
                this.tFirstPage.disabled = false;
                this.tPreviousPage.disabled = false;
                this.tNextPage.disabled = false;
                this.tLastPage.disabled = false;
            }
        }

    };

    Editor.prototype.initList = function(options) {
        for (var i = 0; i < 30; i++) {
            var row = this.workitemlist.insertRow(i);
            for (var j = 0; j < 10; j++) {
                var cell1 = row.insertCell(j);
                cell1.innerHTML = "&nbsp;";
            }
        }
    };

    Editor.prototype.doSubmit = function(id, status, comment) {
        var that = this;
        $("#progressbar").show();
        $.post(service.api(8), {
            deprecated : status,
            rid : id,
            lastupdate : new Date().getTime(),
            owner : this.options.owner,
            userId : this.options.userId,
            userfullname : this.options.userfullname,
            ownername : this.options.ownername,
            comment : comment,
        }).complete(function(data) {
            that.submittingDialog.hide();
            that.listViewPane.refresh();
            $("#progressbar").hide();
        });
    };

    Editor.prototype.handleEvent = function(e) {
        switch (e.type) {
            case "change":
                this.doChange(e);
                break;
            case "click":
                this.doClick(e);
                break;
            case "dblclick":
                break;
            case "keydown":
                this.doKeydown(e);
                break;
        }
    };

    Editor.prototype.doClick = function(evt){
        if ((evt.target.id == ("live"+this.options.id))) {
            console.log("正在开发");
        }else if (evt.target.id=="Refresh" + this.options.id||evt.target.id=="iRefresh" + this.options.id){
            this.loading(1,10,"",this.options.userId);
        }else if (evt.target.id == "previousPageS" + this.options.id ||evt.target.id == "ipreviousPageS" + this.options.id) {
            this.loading(this.currpage.pageNo-1,10,this.tSearchInput.value,this.options.ownerId);
        }else if (evt.target.id == "nextPages" + this.options.id||evt.target.id == "inextPages" + this.options.id) {
            this.loading(this.currpage.pageNo+1,10,this.tSearchInput.value,this.options.ownerId);
        }else if(evt.target.id == "searchS"+ this.options.id||evt.target.id == "isearchS"+ this.options.id){
            this.loading(1, 10, this.tSearchInput.value,this.options.ownerId);
        }else if (evt.target.id == "firstPages"+ this.options.id||evt.target.id == "ifirstPages"+ this.options.id){
            this.loading(1, 10, this.tSearchInput.value,this.options.ownerId);
        }else if (evt.target.id == "lastPages" + this.options.id || evt.target.id == "ilastPages" + this.options.id){
            this.loading(this.currpage.allPagesCount, 10, this.tSearchInput.value,this.options.ownerId);
        }else if (evt.target.id == "search" + this.options.id || evt.target.id == "isearch" + this.options.id){
            this.loading(1, 10, this.tSearchInput.value,this.options.ownerId);
        }
    }

    Editor.prototype.doKeydown = function(evt) {
        var e = window.event ? window.event :(evt ? evt : arguments[0]);
        var key = e.keyCode || e.which;
        if (key == 13) {//回车键
            //阻止该事件
            evt.preventDefault();
            if (evt.target.value != "") {
                this.loading(1,10,this.tSearchInput.value,this.options.userId);
            }
            return false;
        }
    };

    Editor.prototype.doChange = function(evt) {

    };

    Editor.prototype.addHeader = function(row) {
        var header = this.workitemlist.createTHead();
        var row = header.insertRow(0);
        this.createHead("直播名称", row);
        this.createHead("直播介绍", row);
        this.createHead("直播形式", row);
        this.createHead("直播时间", row);
        this.createHead("直播时长", row);
        this.createHead("直播详情", row);
        this.createHead("是否免费", row);
        this.createHead("价格", row);
        this.createHead("折扣价格", row);
        this.createHead("操作", row);
    };
    Editor.prototype.createRow = function(parent) {
        var row = document.createElement("DIV");
        parent.appendChild(row);
        row.className = "row";
        row.style.margin = "0px";
        row.style.padding = "0px";
        return row;
    };

    Editor.prototype.createIcon = function(parent, id, num, classname, name,
                                           title, style) {
        var button = document.createElement("BUTTON");
        parent.appendChild(button);
        button.id = id;
        button.className = "btn btn-default " + style+" "+classname;
        button.style.borderRadius = "15px";
        button.style.width = "29px";
        button.style.padding = "3px";
        button.title = title;
        button.name = name;
        return button;
    };
    Editor.prototype.createGroup = function(parent) {
        var group = document.createElement("DIV");
        parent.appendChild(group);
        group.className = "btn-group";
        group.style.padding = "2px";
        group.setAttribute("role", "group");
        group.setAttribute("aria-label", "");
        return group;
    };

    Editor.prototype.crateSGroup = function(parent) {
        var group = document.createElement("DIV");
        parent.appendChild(group);
        group.className = "input-group";
        group.style.padding = "2px";
        group.setAttribute("role", "search");
        group.setAttribute("aria-label", "");
        return group;
    };

    Editor.prototype.createLabel = function(group, id, title) {
        var label = document.createElement("Label");
        label.innerHTML = title;
        label.id = id;
        group.appendChild(label);
        return label;
    };

    Editor.prototype.createTool = function(group, id, title, style, fonttag,
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
        icon.className = fontclass;
        icon.setAttribute("title", title);
        icon.id = "i" + id;
        // icon.addEventListener('click', this, false);
        return button;
    };
    Editor.prototype.createCell = function(no, content, row) {
        var cell = row.insertCell(no);
        cell.setAttribute("nowrap", "true");
        cell.innerHTML = content;
        return cell;
    };

    Editor.prototype.createHead = function(content, row) {
        var th = document.createElement('th');
        th.setAttribute("nowrap", "true");
        th.innerHTML = content;
        row.appendChild(th);
    };

    Editor.prototype.setPropertySheet = function() {
        // // basic property setting
        // if (this.basicpropsheet != null) {
        // this.basicpropsheet.setSheet(this.currObject);
        // }
        // // advanced property setting.
        // if (this.propsheet != null) {
        // this.propsheet.setSheet(this.currObject, this.currObject,
        // this.propsheet
        // .getCurrTabIndex(this.currObject));
        // }
    };

    $.fn[pluginName] = function(options) {
        return this.each(function() {
            if (!$.data(this, pluginName)) {
                $.data(this, pluginName, new Editor(this, options));
            } else if ($.isFunction(Plugin.prototype[options])) {
                $.data(this, pluginName)[options]();
            }
        });
    };

})(jQuery, window, document);
