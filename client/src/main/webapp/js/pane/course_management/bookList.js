/**
 *
 */
;
(function($, window, document, undefined) {
    var pluginName = "bookListEditor";
    var defaults = {
        id : "",
        owner : "",
        userId : "",
        userfullname : "",
        ownername : "",
        basicpropsheet : "",
        propsheet : "",
        width : 0,
        height : 0,
        parent : "",
    };

    var Editor = function(element, options) {
        this.element = element, this.options = $.extend({
            id : "",
            owner : "",
            userId : "",
            userfullname : "",
            ownername : "",
            basicpropsheet : "",
            propsheet : "",
            width : 0,
            height : 0,
            parent : "",
        }, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.stack = new CommandStack();
        this.basicpropsheet = options.basicpropsheet;
        this.propsheet = options.propsheet;
        this.deprecated = 99;
        this.init(options);
        this.loading(1, 10, "",this.options.userId);
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

        // var p4 = $(this.element).bookViewEditor({
        //     id : "002",
        //     title:"电子书预览",
        //     owner : options.owner,
        //     userId : options.ownerId,
        //     ownerId:options.ownerId,
        //     width : 650,
        //     height : 400,
        //     parent : this,
        // });
        // this.bookEditor = p4.data("bookViewEditor")
            // bottom tool bar
            // var bottomToolbarRow = this.createRow(this.element);
            //
            // this.createBottomToolbar(options, bottomToolbarRow);

            // this.loading(this.options.uid, 1, 30, "");
        };

    Editor.prototype.createRow = function(parent) {
            var row = document.createElement("DIV");
            parent.appendChild(row);
            row.className = "row";
            row.style.margin = "0px";
            row.style.padding = "0px";
            return row;
        };

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
            this.tSearchInput.setAttribute("placeholder", "搜索书名、作者等");

            var searchSpan = document.createElement("span");
            g3.appendChild(searchSpan);
            searchSpan.className = "input-group-btn";

            this.tSearchButton = this.createTool(searchSpan, "search"
                + this.options.id, "搜索", "btn btn-primary", "i",
                "fa fa-search fa-lg");
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

        Editor.prototype.handleEvent = function(e) {
            switch (e.type) {
                case "click":
                    this.doClick(e);
                    break;
                case "dblclick":
                    this.doDblClick(e);
                    break;
                case "keydown":
                    this.doKeydown(e);
                    break;
            }
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

        Editor.prototype.doDblClick = function(evt) {

        };

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

        Editor.prototype.doClick = function(evt) {
                if ((evt.target.id == ("book"+this.options.id))) {
                    var url = evt.target.parentElement.getAttribute("path");
                    window.open("/file"+url);  //虚拟路径  windows
                    // window.open("/upload"+url);  //虚拟路径  windows
                    // window.open(nginxHost+url);  //nginx路径
                    Utils.stopBubble(evt);
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
        };

        Editor.prototype.reloading = function() {

        };

        Editor.prototype.clearSelection = function(table) {
            if (table.rows.length > 0) {
                for (i = 0; i < table.rows.length; i++) {
                    table.rows[i].style.background = "";
                }
            }
        };

        Editor.prototype.loading = function(pageno, pagesize, condition,uid) {
            $("#progressbar").show();
            var that = this;
            $.post(service.api(17), {
                userId : uid,// user id;
                pn : pageno,
                psz : pagesize,
                cond : condition,
                type :0
            }).complete(function(data) {
                that.loadData(data.responseJSON);
                $("#progressbar").hide();
            });
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

        Editor.prototype.addHeader = function() {
            var header = this.workitemlist.createTHead();
            var row = header.insertRow(0);
            this.createHead("书籍名称", row);
            this.createHead("书籍作者", row);
            this.createHead("上传时间", row);
            this.createHead("是否免费", row);
            this.createHead("价格", row);
            this.createHead("折扣价格", row);
            this.createHead("操作", row);
        };

        Editor.prototype.loadData = function(obj) {
            var currPage = new Page();
            currPage.parseFromJSON(obj);
            this.currpage = currPage;
            $(this.workitemlist).children().remove();
            var objs = currPage.pageEntities;
            if (objs != null && objs.length > 0) {
                for (var i = 0; i < objs.length; i++) {
                    var book = new Book();
                    book.parseFromJSON(objs[i])
                    var row = this.workitemlist.insertRow(-1);
                    row.addEventListener('dblclick', this, false);
                    row.addEventListener('click', this, false);
                    // row.setAttribute("path", book.bookPath);
                    this.createCell(0, book.bookName, row);
                    this.createCell(1, book.bookAuthor, row);
                    this.createCell(2, book.createTime,row);
                    this.createCell(3, book.sellType, row);
                    this.createCell(4, book.goodPrise+"元", row);
                    this.createCell(5, book.discountPrise+"元",row);
                    // this.createCell(6, book.createTime,row);
                    var cell = this.createCell(6, null, row);
                    cell.setAttribute("path",book.bookPath);
                    var b0 = this.createIcon(cell, "book"+this.options.id, "4", "fa fa-file-o fa-lg",
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
        Editor.prototype.initList = function() {
            // // document.createElement('tbody');
            // for (var i = 0; i < 30; i++) {
            //     var row = this.workitemlist.insertRow(i);
            //     for (var j = 0; j < 11; j++) {
            //         var cell1 = row.insertCell(j);
            //         cell1.innerHTML = "&nbsp;";
            //     }
            // }
            // this.addHeader();
            //
            // this.bFirstPage.disabled = true;
            // this.bPreviousPage.disabled = true;
            // this.bNextPage.disabled = true;
            // this.bLastPage.disabled = true;
            // this.bPageno.innerHTML = "第0页";
            // this.bTotalpage.innerHTML = "/共0页";
            //
            // this.tFirstPage.disabled = true;
            // this.tPreviousPage.disabled = true;
            // this.tNextPage.disabled = true;
            // this.tLastPage.disabled = true;
            // this.tPageno.innerHTML = "第0页";
            // this.tTotalpage.innerHTML = "/共0页";
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
