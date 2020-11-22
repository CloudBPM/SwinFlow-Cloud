/**
 *
 */

;
(function ($, window, document, undefined) {
    var pluginName = "sessionPane";
    var defaults = {
        id: "", // process ID
        ownerId: "",
        userId: "",
        userName: "",
        imgUrl: "",
        parent:""
    };

    var SessionPanel = function (element, options) {
        this.element = element;
        this.options = $.extend({
            id: "", // process ID
            ownerId: "",
            userId: "",
            userName: "",
            imgUrl: "",
            parent:""
        }, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.rightpane = null;
        this.init(options);
    };

    SessionPanel.prototype.msgRecords = function (time,recordsId) {
        $("#progressbar").show();
        var that = this;
        $.post("/om/OmServices?api=39&sessionId="+this.options.sessionId, {
            senderId:recordsId,
            lastTime:time
        }).complete(function (data) {
            if(data.responseJSON.data !== null){
                that.rightpane.clickMsg(data.responseJSON.data.reverse());
            }else{
                that.rightpane.clearContentDiv();
            }
            $("#progressbar").hide();
        });
    };



    SessionPanel.prototype.init = function () {
        this.editorPanel = document.createElement("DIV");
        this.element.appendChild(this.editorPanel);
        this.editorPanel.className = "parentTab";
        this.editorPanel.style.height = "465px";
        this.editorPanel.style.overflow = "auto";
    };

    var arrId = [];
    SessionPanel.prototype.test = function (data) {
        console.log(data);
        var msg = [];
        if (arrId.indexOf(data.userId) !== -1) {
            //不再插入
        } else {
            // 插入
            msg.push(data);
            for (var i = 0; i < msg.length; i++) {
                this.contact(this.editorPanel, msg[i],msg[i].userId);
            }
            arrId.push(data.userId);
        }
    };

    SessionPanel.prototype.contact = function (parent, msg, id) {
        var sessionLi = document.createElement("DIV");
        sessionLi.className = "panel panel-default";
        sessionLi.id = id;
        parent.insertBefore(sessionLi,parent.childNodes[0]);
        sessionLi.style.margin = "0";
        sessionLi.style.borderRadius = "0";
        sessionLi.style.border = "none";
        sessionLi.style.boxShadow = "none";
        sessionLi.onmouseover = function () {
            sessionLi.style.background = "#ddd";
            sessionLi.style.cursor = "pointer";
        };
        sessionLi.onmouseleave = function () {
            sessionLi.style.background = "#fff";
        };
        // sessionLi.addEventListener("click", this, false);

        var sessionLink = document.createElement("DIV");
        sessionLi.appendChild(sessionLink);
        sessionLink.className = "panel-body";
        sessionLink.style.padding = "5px 10px";
        sessionLink.style.position = "relative";

        var personImg = document.createElement("img");
        sessionLink.appendChild(personImg);
        personImg.src = this.options.imgUrl + "/pic.jpg";
        personImg.style.width = "45px";
        personImg.style.height = "45px";
        personImg.style.textAlign = "left";
        personImg.style.marginTop = "10px";

        var redDot = document.createElement("span");
        sessionLink.appendChild(redDot);
        redDot.id = "redDot" + id;
        redDot.style.position = "absolute";
        redDot.style.left = "45px";
        redDot.style.top = "10px";
        redDot.style.width = "17px";
        redDot.style.height = "17px";
        redDot.style.background = "red";
        redDot.style.color = "#fff";
        redDot.style.fontSize = "12px";
        redDot.style.textAlign = "center";
        redDot.style.borderRadius = "50%";
        redDot.style.lineHeight = "17px";
        if(unReadMsgCount[id] > 0){
            redDot.style.display = "block";
            redDot.innerHTML = unReadMsgCount[id];
        }else{
            redDot.style.display = "none";
        }

        var pText = document.createElement("div");
        sessionLink.appendChild(pText);
        pText.style.textAlign = "left";
        pText.style.paddingLeft = "55px";

        var pName = document.createElement("h5");
        pText.appendChild(pName);
        if (msg.fname) {
            pName.innerHTML = msg.fname
        } else if(msg.senderName == this.options.userName){
            pName.innerHTML = msg.receiverName
        } else{
            pName.innerHTML = msg.senderName
        }

        this.pTime = document.createElement("small");
        pName.appendChild(this.pTime);
        this.pTime.id = "pTime"+ id;
        this.pTime.style.fontSize = "12px";
        this.pTime.style.textAlign = "right";
        function add0(m) {
            return m < 10 ? '0' + m : m
        }
        function formatDate(now) {
            var year = now.getFullYear();
            var month = now.getMonth() + 1;
            var date = now.getDate();
            var hour = now.getHours();
            var minute = now.getMinutes();

            var nowYear = new Date().getFullYear();
            var nowDate = new Date().getDate();
            if(year !== nowYear){
                return year + "-" + month + "-"+ add0(date)
            }else if(date !==nowDate){
                return add0(month) + "-"+ add0(date)
            }else {
                return add0(hour) + ":" + add0(minute)
            }
        }
        var time = new Date(msg.sendTime);
        // console.log(time);
        if (msg.time) {
            this.pTime.innerHTML = msg.time;
        } else {
            this.pTime.innerHTML = formatDate(time);
        }

        this.pContent = document.createElement("p");
        pText.appendChild(this.pContent);
        this.pContent.id = "pContent" + id;
        this.pContent.style.fontSize = "11px";
        this.pContent.style.marginTop = "15px";
        this.pContent.style.overflow = "hidden";
        this.pContent.style.color = "#999999";
        this.pContent.style.whiteSpace = "nowrap";
        this.pContent.style.textOverflow = "ellipsis";
        if(msg.message){
            //判断消息类型
            if(msg.messageType == 0){
                msg.message = "[图片]";
            }else if(msg.messageType == 2){
                msg.message = "[语音]";
            }else if(msg.messageType == 3){
                msg.message = "[视频]";
            }else if(msg.messageType == 4){
                msg.message = "[文件]";
            }
            this.pContent.innerHTML = msg.message;
        }

        var that = this;
        sessionLi.addEventListener("click", function (evt) {
            var recordsId;
            if(msg.userId){
                recordsId = msg.userId;
            }else if(msg.senderId == that.options.userId){
                recordsId = msg.receiverId;
            }else{
                recordsId = msg.senderId;
            }
            that.msgRecords(new Date().getTime(),recordsId);
            that.rightpane.loaddata(msg);
            unReadMsgCount[id] = 0;
            redDot.style.display = "none";
        });
    };

    var unReadMsgCount = []; //未读消息数量
    SessionPanel.prototype.receiveMsg = function (data) {
        //来新消息小红点出现
        if(unReadMsgCount[data.senderId] == undefined){
            unReadMsgCount[data.senderId] = 1;
        }else{
            unReadMsgCount[data.senderId]++
        }
        //判断会话列表是否有最近联系人，没有的话右边对话框直接显示接收到消息的第一个联系人的聊天信息
        if(this.editorPanel.getElementsByTagName('div').length == 0){
            this.options.parent.rightPane1.loaddata(data);
        }
        var msg = [];
        msg.push(data);
        if (arrId.indexOf(data.senderId) !== -1) {
            //不再插入  但是更改最新的时间和最新的消息内容
            function add0(m) {
                return m < 10 ? '0' + m : m
            }
            function formatDate(now) {
                // var year = now.getFullYear();
                // var month = now.getMonth() + 1;
                // var date = now.getDate();
                var hour = now.getHours();
                var minute = now.getMinutes();
                return add0(hour) + ":" + add0(minute);
            }
            var time = new Date(data.sendTime);
            var sessionLiPtime = document.getElementById("pTime" + data.senderId);
            var sessionLiPContent = document.getElementById("pContent" + data.senderId);
            var sessionLiRedDot = document.getElementById("redDot" + data.senderId);
            var sessionLiId = document.getElementById(data.senderId);

            sessionLiPtime.innerHTML = formatDate(time);
            sessionLiPContent.innerHTML = data.message;
            sessionLiRedDot.style.display = "block";
            sessionLiRedDot.innerHTML = unReadMsgCount[data.senderId];
            this.editorPanel.insertBefore(sessionLiId,this.editorPanel.childNodes[0]);


        } else {
            // 插入
            for (var i = 0; i < msg.length; i++) {
                this.contact(this.editorPanel, msg[i],msg[i].senderId);
            }
            var sessionLiRedDot = document.getElementById("redDot" + data.senderId);

            sessionLiRedDot.style.display = "block";
            sessionLiRedDot.innerHTML = unReadMsgCount[data.senderId];
            arrId.push(data.senderId);
        }
        this.options.parent.rightPane1.messageData(msg);
    };

    //消息发出时会话列表的改变
    SessionPanel.prototype.inputValue = function (data) {
        var msg = [];
        if (arrId.indexOf(data.receiverId) !== -1) {
            //不再插入  但是更改最新的时间和最新的消息内容
            function add0(m) {
                return m < 10 ? '0' + m : m
            }
            function formatDate(now) {
                // var year = now.getFullYear();
                // var month = now.getMonth() + 1;
                // var date = now.getDate();
                var hour = now.getHours();
                var minute = now.getMinutes();
                return add0(hour) + ":" + add0(minute);
            }
            var time = new Date(data.sendTime);
            var sessionLiPtime = document.getElementById("pTime" + data.receiverId);
            var sessionLiPcontent = document.getElementById("pContent" + data.receiverId);
            var sessionLiId = document.getElementById(data.receiverId);

            sessionLiPtime.innerHTML = formatDate(time);
            sessionLiPcontent.innerHTML = data.message;
            this.editorPanel.insertBefore(sessionLiId,this.editorPanel.childNodes[0]);
        } else {
            // 插入
            msg.push(data);
            for (var i = 0; i < msg.length; i++) {
                this.contact(this.editorPanel, msg[i],msg[i].receiverId);
            }
            arrId.push(data.receiverId);
        }
        msg.push(data);
        this.options.parent.rightPane1.messageData(msg);
    };

    //localstorage的应用
    SessionPanel.prototype.storageMsg = function(data){
        if(typeof(Storage)!=="undefined"){
            var localStorage = window.localStorage;
            // localStorage.clear();
            //看local里面数据
            if(data.senderId == this.options.userId){
                var s = JSON.parse(localStorage.getItem(data.receiverId));
                if(s == null){
                    s = [];
                    s.push(data);
                }
                localStorage.setItem(data.receiverId,JSON.stringify(s));
            }else{
                var s = JSON.parse(localStorage.getItem(data.senderId));
                if(s == null){
                    s = [];
                    s.push(data);
                }
                localStorage.setItem(data.senderId,JSON.stringify(s));
            }
        }
    };

    //会话列表的显示
    SessionPanel.prototype.huiHuaList = function(data){
        var sessionList = [];
        var isShowCount = 0; // 所有人的未读消息总数
        if(data == null){
            return
        }
        for (var i = 0; i<data.length; i++){
            sessionList.push(data[i].pageEntities[0]);
            isShowCount = isShowCount + data[i].allEntitiesCount;
            if(data[i].pageEntities[0].senderId == this.options.userId){
                unReadMsgCount[data[i].pageEntities[0].receiverId] = data[i].allEntitiesCount;
            }else{
                unReadMsgCount[data[i].pageEntities[0].senderId] = data[i].allEntitiesCount;
            }
        }
        this.options.parent.options.parent.options.parent.unReadShow(isShowCount);//传递给menubar判断是否显示消息提醒

        sessionList.sort(function(a, b) {
            return b.sendTime< a.sendTime ? 1 : -1;
        });
        for (var j = 0; j<sessionList.length;j++){
            if(sessionList[j].senderName == this.options.userName){
                if(arrId.indexOf(sessionList[j].receiverId) == -1){
                    arrId.push(sessionList[j].receiverId)
                }
            }else{
                if(arrId.indexOf(sessionList[j].senderId) == -1){
                    arrId.push(sessionList[j].senderId)
                }
            }
            var sessionId;
            if(sessionList[j].receiverId == this.options.userId){
                sessionId = sessionList[j].senderId
            }else if(sessionList[j].senderId == this.options.userId){
                sessionId = sessionList[j].receiverId;
            }
            this.contact(this.editorPanel, sessionList[j],sessionId);
        }
    };

    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, pluginName)) {
                $.data(this, pluginName, new SessionPanel(this, options));
            } else if ($.isFunction(Plugin.prototype[options])) {
                $.data(this, pluginName)[options]();
            }
        });
    };

})(jQuery, window, document);
