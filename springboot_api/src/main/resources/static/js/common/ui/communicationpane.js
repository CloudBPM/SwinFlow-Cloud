//沟通

(function($, window, document, undefined) {
    var pluginName = "communicationPanel";
    var defaults = {
        id : "",
        parent : "",
        ownerId: "",
        imgUrl: "",
        websocket : "",
        userId : "",
        userName : ""
    };

    var CommunicatePanel = function(element, options) {
        this.element = element;
        this.options = $.extend({
            id : "",
            parent : "",
            ownerId: "",
            imgUrl: "",
            websocket : "",
            userId : "",
            userName : ""
        }, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init(options);
        this.rightpane = null;
        this.entity = null;
        this.owner = "";
        this.ownerId = "";
    };

    //获取联系人列表
    CommunicatePanel.prototype.loading = function () {
        $("#progressbar").show();
        var that = this;
        $.post("/om/OmServices?api=38&sessionId="+this.options.sessionId, {
            orgId: this.options.ownerId,
            userId:this.options.userId
        }).complete(function (data) {
            that.contactsPane.loadData(data.responseJSON);
            $("#progressbar").hide();
        });
    };

    //获取会话列表
    CommunicatePanel.prototype.huiHua = function () {
        $("#progressbar").show();
        var that = this;
        $.post("/om/OmServices?api=40&sessionId="+this.options.sessionId, {

        }).complete(function (data) {
            var sessionMsg = data.responseJSON.data;
            // console.log(sessionMsg);
            // for (var i = 0;i<sessionMsg.length;i++){
            //     that.sessionPane.storageMsg(sessionMsg[i].pageEntities[0])
            // }
            that.sessionPane.huiHuaList(sessionMsg);
            $("#progressbar").hide();
        });
    };

    CommunicatePanel.prototype.init = function(options) {
        var chatsDiv = document.createElement("div");
        this.element.appendChild(chatsDiv);
        chatsDiv.className = "row";
        chatsDiv.style.width = "818px";
        chatsDiv.style.margin = "0";

        var listsDiv = document.createElement("div");
        chatsDiv.appendChild(listsDiv);
        listsDiv.className = "col-lg-4 col-md-4 col-sm-4 col-xs-4";
        listsDiv.style.padding = "0";

        // 左边部分
        var listDiv = document.createElement("div");
        listsDiv.appendChild(listDiv);
        listDiv.className = "panel panel-default";
        listDiv.style.borderRadius = "4px 0 0 4px";
        listDiv.style.borderRight = "none";
        listDiv.style.height = "580px";
        listDiv.style.margin = "0"

        var headDiv = document.createElement("div");
        listDiv.appendChild(headDiv);
        headDiv.className = "panel-heading";

        var ownerImg = document.createElement("Img");
        headDiv.appendChild(ownerImg);
        ownerImg.src = this.options.imgUrl + "/touxiang.png";
        ownerImg.style.width = "50px";
        ownerImg.style.height = "50px";

        var ownerName = document.createElement("span");
        headDiv.appendChild(ownerName);
        ownerName.innerHTML = this.options.userName;

        var bodyDiv = document.createElement("div");
        listDiv.appendChild(bodyDiv);
        bodyDiv.className = "panel-body";
        bodyDiv.style.padding = "0";

        ///-----------------
        var tabDIV = document.createElement("DIV");
        bodyDiv.appendChild(tabDIV);
        this.currtabindex = 0;

        var tabname = "chat";
        var tabUL = document.createElement("UL");
        tabUL.className = "nav nav-tabs chat-nav-tabs";
        tabUL.id = "chat-props-nav-tabs";
        tabUL.setAttribute("role", "tablist");
        tabDIV.appendChild(tabUL);
        this.newTabHead(tabUL, 0, "消息", tabname, true);
        this.newTabHead(tabUL, 1, "联系人", tabname, false);
        var that = this;
        $("#chat-props-nav-tabs").on("click", "a", function (e) {
            e.preventDefault();
            $(this).tab('show');
            that.currtabindex = parseInt($(this).attr('href').substring(8));
            that.showPane(that.currtabindex);
        });

        var tabContents = document.createElement("DIV");
        tabDIV.appendChild(tabContents);
        tabContents.className = "tab-content";
        tabContents.id = "chatptabs";

        that.loading();
        var messageRcv = JSON.parse(localStorage.getItem("message"));
        if(localStorage.getItem("message") !== null){
            that.huiHua(messageRcv.sendTime);
        }else{
            that.huiHua(new Date().getTime());
        }

        this.tabContent1 = this.newTabContent(tabContents, 0, tabname, true);
        if ($(this.tabContent1).sessionPane != undefined) {
            var plugin1 = $(this.tabContent1).sessionPane({
                id: tabname + "tab0",
                ownerId: this.options.ownerId,
                userId:this.options.userId,
                userName : this.options.userName,
                imgUrl: this.options.imgUrl,
                parent:this,
                sessionId : this.options.sessionId,
            });
            this.sessionPane = plugin1.data("sessionPane");
        }

        this.tabContent2 = this.newTabContent(tabContents, 1, tabname, false);
        if ($(this.tabContent2).contactsPane != undefined) {
            var plugin2 = $(this.tabContent2).contactsPane({
                id: tabname + "tab1",
                ownerId: this.options.ownerId,
                userName : this.options.userName,
                imgUrl: this.options.imgUrl,
                sessionId : this.options.sessionId,
            });
            this.contactsPane = plugin2.data("contactsPane");
        }

        $('#chat-props-nav-tabs a[href="#' + tabname + 'tab' + this.currtabindex + '"]').tab('show');

        // 右边部分
        var chatComments = document.createElement("div");
        chatsDiv.appendChild(chatComments);
        chatComments.className = "col-lg-8 col-md-8 col-sm-8 col-xs-8";
        chatComments.style.padding = "0";

        this.chatComment1 = this.newChatComment(chatComments, 0, tabname, true);
        if ($(this.chatComment1).rightPane1 != undefined) {
            var plugin1 = $(this.chatComment1).rightPane1({
                id: tabname + "tab0",
                ownerId: this.options.ownerId,
                imgUrl: this.options.imgUrl,
                websocket : this.options.websocket,
                userId : this.options.userId,
                userName : this.options.userName,
                parent:this,
                sessionId : this.options.sessionId,
            });
            this.rightPane1 = plugin1.data("rightPane1");
        }
        this.rightPane1.show(true);

        this.chatComment2 = this.newChatComment(chatComments, 1, tabname, false);
        if ($(this.chatComment2).rightPane2 != undefined) {
            var plugin2 = $(this.chatComment2).rightPane2({
                id: tabname + "tab1",
                ownerId: this.options.ownerId,
                imgUrl: this.options.imgUrl,
                parent : this,
                sessionId : this.options.sessionId,
            });
            this.rightPane2 = plugin2.data("rightPane2");
        }
        this.rightPane2.show(false);

        this.sessionPane.rightpane = this.rightPane1;
        this.contactsPane.rightpane = this.rightPane2;
    };

    CommunicatePanel.prototype.showPane = function (index) {
        if (index == 0) {
            this.rightPane1.show(true);
            this.rightPane2.show(false);
        } else {
            this.rightPane1.show(false);
            this.rightPane2.show(true);
        }
    };

    CommunicatePanel.prototype.showTab = function (index) {
        var tabname = "chat";
        $('#chat-props-nav-tabs a[href="#' + tabname + 'tab' + index + '"]').tab('show');
    };

    CommunicatePanel.prototype.newTabHead = function (parent, index, caption, name, active) {
        var tabLi = document.createElement("li");
        parent.appendChild(tabLi);
        tabLi.style.width = "50%";
        tabLi.style.textAlign = "center";
        if (active)
            tabLi.className = "active";
        tabLi.setAttribute("role", "presentation");
        var tabLink = document.createElement("a");
        tabLi.appendChild(tabLink);
        tabLink.setAttribute("href", "#" + name + "tab" + index);
        tabLink.setAttribute("aria-controls", name + "tab" + index);
        tabLink.setAttribute("role", "tab");
        tabLink.setAttribute("data-toggle", name + "tab");
        tabLink.innerHTML = caption;

    };

    CommunicatePanel.prototype.newTabContent = function (parent, index, name, active) {
        var tabContent = document.createElement("DIV");
        parent.appendChild(tabContent);
        tabContent.setAttribute("data", name + "tab" + index);
        tabContent.setAttribute("role", "tabpanel");
        if (active)
            tabContent.className = "tab-pane active";
        else
            tabContent.className = "tab-pane";
        tabContent.id = name + "tab" + index;
        return tabContent;
    };

    CommunicatePanel.prototype.newChatComment = function (parent, index, name, active) {
        var chatComment = document.createElement("DIV");
        parent.appendChild(chatComment);
        chatComment.setAttribute("data", name + "chat" + index);
        chatComment.id = name + "chat" + index;
        return chatComment;
    };

    $.fn[pluginName] = function(options) {
        return this.each(function() {
            if (!$.data(this, pluginName)) {
                $.data(this, pluginName, new CommunicatePanel(this, options));
            } else if ($.isFunction(Plugin.prototype[options])) {
                $.data(this, pluginName)[options]();
            }
        });
    };

})(jQuery, window, document);