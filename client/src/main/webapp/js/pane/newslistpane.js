;
(function ($, window, document, undefined) {
    var pluginName = "newsListPane";
    var defaults = {
        id: "",
        parent: "",
        owner : "",
    };

    var NewsBoard = function (element, options) {
        this.element = element;
        this.options = $.extend({
            id: "",
            parent: "",
            owner : "",
        }, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.news = [];
        this.init(options);
    };

    NewsBoard.prototype.init = function (options) {
        this.board = document.createElement("DIV");
        this.element.appendChild(this.board);

        this.panelCol0 = document.createElement("DIV");
        this.board.appendChild(this.panelCol0);
        this.panelCol0.className = "container-fluid";
        this.panelCol0.style.marginTop = "4px";
        var windowHeight = document.documentElement.clientHeight
        this.panelCol0.style.height = (windowHeight - 200) + "px";
    };

    NewsBoard.prototype.loading = function (cond, category, userid,
                                            pageno, pagesize) {
        $("#progressbar").show();
        var that = this;
        $.get(service.api(15), {
            cond: cond,
            cates: category, // process definition id;
            userid: userid,
            pageno: pageno,
            pagesize: pagesize,
        }).complete(function (data) {
            if (data.responseJSON != null) {
                that.loadData(data.responseJSON.pageEntities);
            }
            $("#progressbar").hide();
        });
    };

    //滚动条滚动至底部加载更多
    NewsBoard.prototype.getMoreNews = function (cond, category, userid,
                                            pagesize) {
        var that = this;
        var n = 1;
        $(this.panelCol0).scroll(function () {
            var h = $(this).height();//div可视区域的高度
            var sh = $(this)[0].scrollHeight;//滚动的高度，$(this)指代jQuery对象，而$(this)[0]指代的是dom节点
            var st =$(this)[0].scrollTop;//滚动条的高度，即滚动条的当前位置到div顶部的距离
            if(st + h >= sh){
                console.log("滚动到低部开始加载更多...");
                $.get(service.api(15), {
                    cond: cond,
                    cates: category, // process definition id;
                    userid: userid,
                    pagesize:pagesize,
                    pageno: ++n
                }).complete(function (data) {
                    if (data.responseJSON != null) {
                        that.moreData(data.responseJSON.pageEntities);
                    }
                });
            }
        });
    };

    NewsBoard.prototype.loadData = function (data) {
        $(this.panelCol0).children().remove();
        for(var i = 0; i < data.length;i++){
            this.createNewsEntry(this.panelCol0, data[i].id, data[i]);
        }
    };

    NewsBoard.prototype.moreData = function (data) {
        for(var i = 0; i < data.length;i++){
            this.createNewsEntry(this.panelCol0, data[i].id, data[i]);
        }
    };

    NewsBoard.prototype.createNewsEntry = function (p, id, data) {
        // row0
        var row = document.createElement("DIV");
        p.appendChild(row);
        row.className = "row";

        var cols = document.createElement("DIV");
        row.appendChild(cols);
        cols.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";

        var panel = document.createElement("DIV");
        cols.appendChild(panel);
        panel.className = "panel panel-default";

        var bodyPanel = document.createElement("DIV");
        panel.appendChild(bodyPanel);
        bodyPanel.className = "panel-body";
        // bodyPanel.addEventListener("click", this, true);
        bodyPanel.setAttribute("key", id);

        var row1 = document.createElement("DIV");
        bodyPanel.appendChild(row1);
        row1.className = "row";
        row1.setAttribute("key", id);

        var col1 = document.createElement("DIV");
        row1.appendChild(col1);
        col1.className = "col-lg-2 col-md-2 col-sm-12 col-xs-12";
        col1.setAttribute("key", id);

        var img = document.createElement("img");
        col1.appendChild(img);
        img.src = "img/titleimage.png"
        img.setAttribute("key", id);

        var col2 = document.createElement("DIV");
        row1.appendChild(col2);
        col2.className = "col-lg-10 col-md-10 col-sm-12 col-xs-12";
        col2.setAttribute("key", id);

        var h3 = document.createElement("H3");
        col2.appendChild(h3);
        h3.innerHTML = data.title;
        h3.setAttribute("key", id);
        h3.style.marginTop = "10px";
        h3.style.marginBottom = "50px";
        h3.onmouseover = function () {
            h3.style.color = "#337ab7";
            h3.style.cursor = "pointer";
        };
        h3.onmouseleave = function () {
            h3.style.color = "inherit";
        };
        h3.addEventListener("click", this, true);

        var bottomDiv = document.createElement("div");
        col2.appendChild(bottomDiv);

        var authorSpan = document.createElement("span");
        bottomDiv.appendChild(authorSpan);
        authorSpan.innerHTML = data.author;
        authorSpan.style.cursor = "pointer";
        authorSpan.style.marginRight = "10px";

        var timeSpan = document.createElement("span");
        bottomDiv.appendChild(timeSpan);
        //时间戳的转换
        function add0(m){return m<10?'0'+m:m }
        function format(shijianchuo)
        {
            //shijianchuo是整数，否则要parseInt转换
            var time = new Date(shijianchuo);
            var y = time.getFullYear();
            var m = time.getMonth()+1;
            var d = time.getDate();
            var h = time.getHours();
            var mm = time.getMinutes();
            var s = time.getSeconds();
            return y+'-'+add0(m)+'-'+add0(d)+' '+add0(h)+':'+add0(mm)+':'+add0(s);
        }
        var newsTime = data.lastUpdate;
        timeSpan.innerHTML = format(newsTime);

        var commentSpan = document.createElement("span");
        bottomDiv.appendChild(commentSpan);
        commentSpan.style.float = "right";
        commentSpan.style.marginRight = "100px";
        commentSpan.style.cursor = "pointer";

        var commentIcon = document.createElement("i");
        commentSpan.appendChild(commentIcon);
        commentIcon.className = "fa fa-commenting-o";
        commentIcon.style.paddingRight = "5px";
        commentSpan.appendChild(document.createTextNode("20"));

        var shareSpan = document.createElement("span");
        bottomDiv.appendChild(shareSpan);
        shareSpan.style.float = "right";
        shareSpan.style.marginRight = "10px";
        shareSpan.style.cursor = "pointer";

        var shareIcon = document.createElement("i");
        shareSpan.appendChild(shareIcon);
        shareIcon.className = "fa fa-share-square-o";
        shareIcon.style.paddingRight = "5px";
        shareSpan.appendChild(document.createTextNode("分享"));
    };
    NewsBoard.prototype.handleEvent = function (e) {
        switch (e.type) {
            case "click":
                this.doClick(e);
                break;
        }
    };

    NewsBoard.prototype.doClick = function (evt) {
        var target = evt.target;
        var key = target.getAttribute("key");
        if (key != undefined && key != null) {
            this.options.parent.newsDetailPane.newsContentPane.detailData(key);
            if (this.options.parent != undefined) {
                this.options.parent.hiddenAll();
                this.options.parent.newsDetailPane.show(true, key);
            }
        }
    };

    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, pluginName)) {
                $.data(this, pluginName, new NewsBoard(this, options));
            } else if ($.isFunction(Plugin.prototype[options])) {
                $.data(this, pluginName)[options]();
            }
        });
    };

})(jQuery, window, document);