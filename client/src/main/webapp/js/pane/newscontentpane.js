/**
 *
 */

;
(function($, window, document, undefined) {
    var pluginName = "newsContentPane";
    var defaults = {
        id : "",
        parent : "",
        userId : "",
        userName : ""
    };

    var Board = function(element, options) {
        this.element = element;
        this.options = $.extend({
            id : "",
            parent : "",
            userId : "",
            userName : ""
        }, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init(options);
    };

    Board.prototype.detailData = function (id) {
        this.options.newsId = id;
        $("#progressbar").show();
        var that = this;
        $.get(service.api(16), {
            newsId: id
        }).complete(function (data) {
            that.loadDetails(data);
            $("#progressbar").hide();
        });
    };

    Board.prototype.init = function(options) {
        //下面是吴曼
        // row1
        var panelRow1 = document.createElement("DIV");
        this.element.appendChild(panelRow1);
        panelRow1.className = "row";

        var leftDiv = document.createElement("DIV");
        panelRow1.appendChild(leftDiv);
        leftDiv.className = "col-lg-2 col-md-2 col-sm-1 col-xs-1";

        this.middlePanel = document.createElement("DIV");
        panelRow1.appendChild(this.middlePanel);
        this.middlePanel.className = "col-lg-8 col-md-8 col-sm-10 col-xs-10";

        var rightDiv = document.createElement("DIV");
        panelRow1.appendChild(rightDiv);
        rightDiv.className = "col-lg-2 col-md-2 col-sm-1 col-xs-1";

        this.createNewsDetail(this.middlePanel);

        this.publishCommentArea(this.middlePanel);

        this.createTitle(this.middlePanel, "fa fa-commenting", "最新评论");

        this.listCommentsArea(this.middlePanel);

        var alertDiv = document.createElement("div");
        this.middlePanel.appendChild(alertDiv);
        // alertDiv.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";
        alertDiv.style.position = "fixed";
        alertDiv.style.top = "0";
        alertDiv.style.bottom = "0";
        alertDiv.style.left = "0";
        alertDiv.style.right = "0";
        alertDiv.style.width = "200px";
        alertDiv.style.height = "100px";
        alertDiv.style.margin = "auto";

        var dialog = $(alertDiv).alertBox({
            id : "alert" + this.options.id,
        });
        this.messageBox = dialog.data("alertBox");

    };

    Board.prototype.createTitle = function (parent, icon, title) {
        this.titleSpan = document.createElement("div");
        parent.appendChild(this.titleSpan);
        this.titleSpan.id = "headTitle";

        var h3 = document.createElement("H3");
        this.titleSpan.appendChild(h3);
        h3.className = "page-header";

        var span = document.createElement("SPAN");
        h3.appendChild(span);
        span.className = icon;

        var text = document.createTextNode(" " + title);
        h3.appendChild(text);

        return this.titleSpan;
    };

    Board.prototype.createNewsDetail = function (middlePanel) {
        // title row
        var titleRowDiv = document.createElement("DIV");
        middlePanel.appendChild(titleRowDiv);
        titleRowDiv.className = "row";

        var titleCol = document.createElement("DIV");
        titleRowDiv.appendChild(titleCol);
        titleCol.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";

        this.titleHead = document.createElement("H1");
        titleCol.appendChild(this.titleHead);
        this.titleHead.style.fontWeight = "bold";
        this.titleHead.style.marginBottom = "20px";


        // news time row
        var newsTimeRowDiv = document.createElement("DIV");
        middlePanel.appendChild(newsTimeRowDiv);
        newsTimeRowDiv.className = "row";

        this.timeCol = document.createElement("DIV");
        newsTimeRowDiv.appendChild(this.timeCol);
        this.timeCol.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";

        // title image row
        var titleImageRowDiv = document.createElement("DIV");
        middlePanel.appendChild(titleImageRowDiv);
        titleImageRowDiv.className = "row";

        var imgCol = document.createElement("DIV");
        titleImageRowDiv.appendChild(imgCol);
        imgCol.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";

        var pCol = document.createElement("P");
        imgCol.appendChild(pCol);
        pCol.className = "text-center";

        this.img = document.createElement("IMG");
        pCol.appendChild(this.img);

        // content row
        var contentRowDiv = document.createElement("DIV");
        middlePanel.appendChild(contentRowDiv);
        contentRowDiv.className = "row";

        this.contentCol = document.createElement("DIV");
        contentRowDiv.appendChild(this.contentCol);
        this.contentCol.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";
        this.contentCol.style.fontSize = "16px";

        // author row
        var authorRowDiv = document.createElement("DIV");
        middlePanel.appendChild(authorRowDiv);
        authorRowDiv.className = "row";

        this.authorCol = document.createElement("DIV");
        authorRowDiv.appendChild(this.authorCol);
        this.authorCol.style.fontSize = "14px";
        this.authorCol.style.textAlign = "right";
        this.authorCol.style.fontWeight = "700";
        this.authorCol.style.color = "#666";
        this.authorCol.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";

    };

    Board.prototype.publishCommentArea = function (middlePanel) {
        var commentRowDiv = document.createElement("DIV");
        middlePanel.appendChild(commentRowDiv);
        commentRowDiv.style.marginTop = "40px";
        commentRowDiv.className = "row";
        commentRowDiv.id = "publishComment";

        var commentCol = document.createElement("DIV");
        commentRowDiv.appendChild(commentCol);
        commentCol.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";

        var contentPanel = document.createElement("DIV");
        commentCol.appendChild(contentPanel);
        contentPanel.className = "panel panel-default";

        var headerPanel = document.createElement("DIV");
        contentPanel.appendChild(headerPanel);
        contentPanel.style.paddingTop = "5px";
        contentPanel.style.paddingBottom = "5px";

        var leftcol = document.createElement("DIV");
        headerPanel.appendChild(leftcol);
        leftcol.className = "col-lg-3 col-md-3 col-sm-12 col-xs-12";
        leftcol.style.marginBottom = "15px";


        var header = document.createElement("H4");
        leftcol.appendChild(header);

        var headerIcon = document.createElement("I");
        header.appendChild(headerIcon);
        headerIcon.className = "fa fa-commenting-o";
        header.appendChild(document.createTextNode(" 网友评论"));

        var rightcol = document.createElement("DIV");
        headerPanel.appendChild(rightcol);
        rightcol.className = "col-lg-9 col-md-9 col-sm-12 col-xs-12";

        var stats = document.createElement("DIV");
        rightcol.appendChild(stats);
        stats.className = "text-right";
        stats.innerHTML = "200条评论 | 40人参与";
        stats.style.paddingTop = "10px";
        stats.style.paddingBottom = "10px";

        var bodyPanel = document.createElement("DIV");
        contentPanel.appendChild(bodyPanel);
        bodyPanel.className = "panel-body";

        var formgroup1 = document.createElement("DIV");
        formgroup1.className = "form-group";
        bodyPanel.appendChild(formgroup1);

        this.commentTextarea = document.createElement("TextArea");
        formgroup1.appendChild(this.commentTextarea);
        this.commentTextarea.className = "form-control";
        this.commentTextarea.style.resize = "none";
        // this.commentTextarea.style.outline = "none";
        this.commentTextarea.setAttribute("placeholder", "文明理性发表评论，严禁发表不当言论！")

        var formgroup2 = document.createElement("DIV");
        formgroup2.className = "form-group text-right";
        formgroup2.style.margin = "0";
        bodyPanel.appendChild(formgroup2);

        this.subButton = document.createElement("Button");
        formgroup2.appendChild(this.subButton);
        this.subButton.type = "button";
        this.subButton.className = "btn btn-primary";
        this.subButton.innerHTML = "发表评论";
        this.subButton.addEventListener("click", this, false);
    };

    Board.prototype.listCommentsArea = function (middlePanel) {
        this.commentRowDiv = document.createElement("DIV");
        middlePanel.appendChild(this.commentRowDiv);
        this.commentRowDiv.className = "row";
        this.commentRowDiv.id = "listComments";

        var commentCol = document.createElement("DIV");
        this.commentRowDiv.appendChild(commentCol);
        commentCol.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";

    };

    Board.prototype.nullCommentMsg = function (parent) {
      var div = document.createElement("div");
      parent.appendChild(div);
      div.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";
      div.innerHTML = "暂无评论哦，快来评论一下吧！";
    };

    Board.prototype.listCommentsMsg = function (parent, data) {
        this.commentCol1 = document.createElement("DIV");
        parent.appendChild(this.commentCol1);
        this.commentCol1.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";
        this.commentCol1.id = "111";

        var contentPanel = document.createElement("DIV");
        this.commentCol1.appendChild(contentPanel);
        contentPanel.className = "panel panel-default";
        contentPanel.style.border = "none";
        contentPanel.style.borderBottom = "solid 1px #eee";
        contentPanel.style.borderRadius = "0px";
        contentPanel.style.boxShadow = "none";

        var bodyPanel = document.createElement("DIV");
        contentPanel.appendChild(bodyPanel);
        bodyPanel.className = "panel-body";
        // bodyPanel.addEventListener("click", this, true);


        var commenter = document.createElement("DIV");
        bodyPanel.appendChild(commenter);
        commenter.className = "col-lg-2 col-md-4 col-sm-12 col-xs-12";
        commenter.style.textAlign = "center";

        var commenterphoto = document.createElement("img");
        commenter.appendChild(commenterphoto);
        commenterphoto.src = "img/100.jpg";
        commenterphoto.style.width = "60px";
        commenterphoto.style.height = "60px";
        commenterphoto.style.borderRadius = "50%";

        var comment = document.createElement("DIV");
        bodyPanel.appendChild(comment);
        comment.className = "col-lg-10 col-md-8 col-sm-12 col-xs-12";

        this.commenterName = document.createElement("span");
        comment.appendChild(this.commenterName);
        this.commenterName.className = data.senderId;
        this.commenterName.id = "oneCom" + data.commentId;
        this.commenterName.style.color = "#37a6ee";
        this.commenterName.style.fontSize = "13px";
        this.commenterName.style.fontWeight = "600";
        this.commenterName.style.margin = "5px 0 0 0";
        this.commenterName.innerHTML = data.senderName;

        var commenterTime = document.createElement("span");
        comment.appendChild(commenterTime);
        commenterTime.style.color = "#999999";
        commenterTime.style.fontSize = "10px";
        commenterTime.style.fontWeight = "normal";
        commenterTime.style.marginLeft = "20px";
        commenterTime.innerHTML = this.timeAgo(data.sendTime);

        var comments = document.createElement("DIV");
        comment.appendChild(comments);
        comments.className = "row";
        comments.style.padding = "10px 15px";
        // comments.style.paddingBottom = "15px";
        comments.innerHTML = data.content;

        //二级评论显示
        this.secondComments = document.createElement("div");
        comment.appendChild(this.secondComments);
        this.secondComments.className = "row";
        this.secondComments.style.background = "#f7f7f7";
        this.secondComments.style.marginLeft = "0";
        this.secondComments.style.marginBottom = "10px";

        var iconRow = document.createElement("DIV");
        comment.appendChild(iconRow);
        iconRow.className = "text-right";
        iconRow.style.color = "#999999";

        var likeIcon = document.createElement("i");
        iconRow.appendChild(likeIcon);
        likeIcon.className = "fa fa-thumbs-up";
        likeIcon.style.fontSize = "16px";
        likeIcon.onmouseover = function () {
            likeIcon.style.color = "#37a6ee";
            likeIcon.style.cursor = "pointer";
        };
        likeIcon.onmouseleave = function () {
            likeIcon.style.color = "#999999";
        };

        iconRow.appendChild(document.createTextNode("100"));

        var answerButton = document.createElement("span");
        iconRow.appendChild(answerButton);
        answerButton.className = "fa fa-commenting";
        answerButton.id = data.commentId;
        answerButton.style.color = "#999999";
        answerButton.style.marginLeft = "16px";
        answerButton.onmouseover = function () {
            answerButton.style.color = "#37a6ee";
            answerButton.style.cursor = "pointer";
        };
        answerButton.onmouseleave = function () {
            answerButton.style.color = "#999999";
        };
        answerButton.innerHTML = "&nbsp;回复";
        answerButton.addEventListener("click", this, false);

        this.answerInputDiv = document.createElement("div");
        contentPanel.appendChild(this.answerInputDiv);
        this.answerInputDiv.id = "input" + data.commentId;
        this.answerInputDiv.style.position = "relative";
        this.answerInputDiv.style.border = "solid 1px #ccc";
        this.answerInputDiv.style.height = "58px";
        this.answerInputDiv.style.padding = "4px 63px 4px 8px";
        this.answerInputDiv.style.display = "none";

        this.answerTextarea = document.createElement("TextArea");
        this.answerInputDiv.appendChild(this.answerTextarea);
        this.answerTextarea.id = "text" + data.commentId;
        this.answerTextarea.style.width = "100%";
        this.answerTextarea.style.height = "100%";
        this.answerTextarea.style.borderRadius = "4px 0 0 4px";
        this.answerTextarea.style.border = "none";
        this.answerTextarea.style.resize = "none";
        this.answerTextarea.style.outline = "none";
        this.answerTextarea.setAttribute("placeholder", "文明理性发表评论，严禁发表不当言论！")

        this.answerBtn = document.createElement("div");
        this.answerInputDiv.appendChild(this.answerBtn);
        this.answerBtn.innerHTML = "回复";
        this.answerBtn.id = "reply" + data.commentId;
        this.answerBtn.style.right = "0px";
        this.answerBtn.style.top = "0px";
        this.answerBtn.style.height = "56px";
        this.answerBtn.style.width = "56px";
        this.answerBtn.style.lineHeight = "56px";
        this.answerBtn.style.textAlign = "center";
        this.answerBtn.style.cursor = "pointer";
        this.answerBtn.style.zIndex = "1";
        this.answerBtn.style.position = "absolute";
        this.answerBtn.style.background = "#337ab7";
        this.answerBtn.style.color = "#fff";
        this.answerBtn.style.border = "solid 1px #337ab7";
        this.answerBtn.addEventListener("click", this, false);

    };

    //二级评论显示
    Board.prototype.twoListComments = function (parent,twoData) {
        var replyBlock = document.createElement("div");
        parent.appendChild(replyBlock);
        replyBlock.style.position = "relative";
        replyBlock.style.fontSize = "13px";
        replyBlock.style.margin = "10px";

        var replyContent = document.createElement("div");
        replyBlock.appendChild(replyContent);
        replyContent.style.marginBottom = "5px";

        var replyName = document.createElement("span");
        replyContent.appendChild(replyName);

        var replyName1 = document.createElement("b");
        replyName.appendChild(replyName1);
        replyName1.innerHTML = twoData.senderName;

        var replyReply = document.createElement("i");
        replyName.appendChild(replyReply);
        replyReply.style.fontStyle = "normal";
        replyReply.style.color = "#a3a3a3";
        replyReply.style.margin = "0 5px";
        replyReply.innerHTML = "回复";

        var replyName2 = document.createElement("b");
        replyName.appendChild(replyName2);
        replyName2.innerHTML = twoData.receiverName + "&nbsp;:&nbsp;";

        var replyComment = document.createElement("span");
        replyContent.appendChild(replyComment);
        replyComment.innerHTML = twoData.content;

        var replyOperate = document.createElement("div");
        replyBlock.appendChild(replyOperate);
        replyOperate.style.marginBottom = "10px";
        replyOperate.style.color = "#adadad";

        var replyLike = document.createElement("span");
        replyOperate.appendChild(replyLike);
        replyLike.innerHTML = "赞";
        replyLike.style.marginLeft = "5px";
        replyLike.onmouseover = function () {
            replyLike.style.color = "#37a6ee";
            replyLike.style.cursor = "pointer";
        };
        replyLike.onmouseleave = function () {
            replyLike.style.color = "#999999";
        };

        var replyLikeCount = document.createElement("text");
        replyOperate.appendChild(replyLikeCount);
        replyLikeCount.style.marginRight = "7px";
        replyLikeCount.innerHTML = "10";

        var replyTime = document.createElement("span");
        replyOperate.appendChild(replyTime);
        replyTime.innerHTML = this.timeAgo(twoData.sendTime);
    };

    Board.prototype.handleEvent = function (e) {
        switch (e.type) {
            case "click":
                this.doClick(e);
                break;
        }
    };

    Board.prototype.doClick = function (evt) {
        // 返回新闻动态列表
        if (evt.target == this.backButton) {
            this.options.parent.hiddenAll();
            this.options.parent.dashboard.show(true);
        } else if (evt.target == this.subButton) {
            if (this.commentTextarea.value == "") {
                // alert("消息不能为空");
                this.messageBox.show(4, "消息不能为空", false);
                return;
            }
            var commentMessage = new CommentMsg();
            commentMessage.content = this.commentTextarea.value;  //评论正文
            commentMessage.senderId = this.options.userId;//评论人的id
            commentMessage.senderName = this.options.userName; //评论人姓名
            commentMessage.articleId = this.options.newsId;  //被评论的文章id
            commentMessage.sendTime = new Date().getTime();  //评论的发送时间
            commentMessage.messageType = "1";//  评论类型  0 图片 ,1 文本

            $("#progressbar").show();
            var that = this;
            $.post(service.api(12), {
                newsId: this.options.newsId,
                comment: JSON.stringify(commentMessage)
            }).complete(function (data) {
                // alert("评论成功")
                that.messageBox.show(2, "评论成功", false);
                that.commentsShow(data.responseJSON);
                $("#progressbar").hide();
            });
            this.commentTextarea.value = "";
        } else {
            var id = evt.target.id.substr(0, 5);
            if (id == "reply") {
                var textId = "text" + evt.target.id.substr(5);
                var textDiv = document.getElementById(textId);

                var oneComment = "oneCom" + evt.target.id.substr(5);
                var oneCommentDiv = document.getElementById(oneComment);
                if (textDiv.value == "") {
                    // alert("消息不能为空");
                    this.messageBox.show(4, "消息不能为空", false);
                    return;
                }
                var twoCommentMessage = new TwoCommentMsg();
                twoCommentMessage.content = textDiv.value;  //评论正文
                twoCommentMessage.senderId = this.options.userId;//评论人的id
                twoCommentMessage.senderName = this.options.userName; //评论人姓名
                twoCommentMessage.receiverId = oneCommentDiv.className; //被评论人的id
                twoCommentMessage.receiverName = oneCommentDiv.innerHTML; //被评论人姓名
                twoCommentMessage.articleId = this.options.newsId;  //被评论的文章id
                twoCommentMessage.sendTime = new Date().getTime();  //评论的发送时间
                twoCommentMessage.messageType = "1";//  评论类型  0 图片 ,1 文本

                // console.log(evt.target.id); //当前被评论的评论ID
                $("#progressbar").show();
                var that = this;
                $.post(service.api(15), {
                    newsId:this.options.newsId,
                    commentId:evt.target.id.substr(5),
                    secondaryComment:JSON.stringify(twoCommentMessage)
                }).complete(function (data) {
                    // alert("评论成功");
                    that.messageBox.show(2, "评论成功", false);
                    that.commentsShow(data.responseJSON);
                    $("#progressbar").hide();
                });
                textDiv.value = "";
            } else {
                var div = document.getElementById("input" + evt.target.id);
                if (div.style.display == "none") {
                    div.style.display = "block";
                } else {
                    div.style.display = "none";
                }
            }

        }
    };

    Board.prototype.loadDetails = function (data) {
        var news = data.responseJSON;
        this.titleHead.innerHTML = news.title;

        //时间戳的转换
        function add0(m) {
            return m < 10 ? '0' + m : m
        }

        function format(shijianchuo) {
            //shijianchuo是整数，否则要parseInt转换
            var time = new Date(shijianchuo);
            var y = time.getFullYear();
            var m = time.getMonth() + 1;
            var d = time.getDate();
            var h = time.getHours();
            var mm = time.getMinutes();
            var s = time.getSeconds();
            return y + '年' + add0(m) + '月' + add0(d) + '日' + ' ' + add0(h) + ':' + add0(mm);
        }

        var newsTime = news.lastUpdate;
        this.timeCol.innerHTML = format(newsTime);
        this.contentCol.innerHTML = news.content;
        this.authorCol.innerHTML = '【' + "作者" + ' ' + news.author + '】';

        this.commentsShow(news.comments);

        if (news.commentAllowable == 1) {
            $("#publishComment").hide();
            $("#headTitle").hide();
            $("#listComments").hide()
        } else {
            $("#publishComment").show();
            $("#headTitle").show();
            $("#listComments").show()
        }
    };

    //评论显示
    Board.prototype.commentsShow = function (data) {
        //评论显示
        while (this.commentRowDiv.hasChildNodes()) {
            this.commentRowDiv.removeChild(this.commentRowDiv.firstChild);
        }
        if(data.length == 0){
            this.nullCommentMsg(this.commentRowDiv);
        }else{
            // 对数组按时间排序
            if (data.length !== 1) {
                data.sort(function (a, b) {
                    return b.sendTime > a.sendTime ? 1 : -1;
                });
            }
            for (var i = 0; i < data.length; i++) {
                //一级评论显示
                this.listCommentsMsg(this.commentRowDiv, data[i]);

                //二级评论显示
                var twoCommentsShow = data[i].twoComments;
                // console.log(twoCommentsShow);//这是每个评论下面的二级评论数组
                if (twoCommentsShow.length !== 1) {
                    twoCommentsShow.sort(function (a, b) {
                        return b.sendTime > a.sendTime ? 1 : -1;
                    });
                }
                for(var j = 0;j < twoCommentsShow.length;j++){
                    this.twoListComments(this.secondComments,twoCommentsShow[j]);
                }
            }
        }

    };

    // 计算获取的那个时间距离现在多久
    Board.prototype.timeAgo = function (dateTimeStamp) {
        //dateTimeStamp是一个时间毫秒，注意时间戳是秒的形式，在这个毫秒的基础上除以1000，就是十位数的时间戳。13位数的都是时间毫秒。
        var minute = 1000 * 60;      //把分，时，天，周,一个月，年用毫秒表示
        var hour = minute * 60;
        var day = hour * 24;
        var week = day * 7;
        var month = day * 30;
        var year = month * 12;

        var now = new Date().getTime();   //获取当前时间毫秒
        var diffValue = now - dateTimeStamp; //时间差

        if (diffValue < 0) {
            return;
        }

        var minC = diffValue / minute;  //计算时间差的分，时，天，周，月，年
        var hourC = diffValue / hour;
        var dayC = diffValue / day;
        var weekC = diffValue / week;
        var monthC = diffValue / month;
        var yearC = diffValue / year;

        if (minC >= 1 && minC < 60) {
            result = " " + parseInt(minC) + "分钟前"
        } else if (hourC >= 1 && hourC < 24) {
            result = " " + parseInt(hourC) + "小时前"
        } else if (dayC >= 1 && dayC < 7) {
            result = " " + parseInt(dayC) + "天前"
        } else if (weekC >= 1 && weekC < 4) {
            result = " " + parseInt(weekC) + "周前"
        } else if (monthC >= 1 && monthC < 12) {
            result = " " + parseInt(monthC) + "月前"
        } else if (yearC >= 1) {
            result = " " + parseInt(yearC) + "年前"
        } else {
            result = "刚刚";
        }
        return result;
    };

    $.fn[pluginName] = function(options) {
        return this.each(function() {
            if (!$.data(this, pluginName)) {
                $.data(this, pluginName, new Board(this, options));
            } else if ($.isFunction(Plugin.prototype[options])) {
                $.data(this, pluginName)[options]();
            }
        });
    };

})(jQuery, window, document);