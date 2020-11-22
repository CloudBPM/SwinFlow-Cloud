/**
 *
 */

;
(function ($, window, document, undefined) {
    var pluginName = "rightPane1";
    var defaults = {
        id: "", // process ID
        ownerId: "", // organization ID
        imgUrl: "",
        websocket : "",
        userId : "",
        userName : "",
        parent:""
    };

    var RightPanel1 = function (element, options) {
        this.element = element;
        this.options = $.extend({
            id: "", // process ID
            ownerId: "", // organization ID
            imgUrl: "",
            websocket : "",
            userId : "",
            userName : "",
            parent:""
        }, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.rightPane = null;
        this.init(options);
    };

    RightPanel1.prototype.init = function (options) {
        this.commentDiv = document.createElement("div");
        this.element.appendChild(this.commentDiv);
        this.commentDiv.className = "panel panel-default";
        this.commentDiv.style.borderRadius = "0 4px 4px 0";
        this.commentDiv.style.height = "580px";
        this.commentDiv.style.margin = "0";

        var headDiv = document.createElement("div");
        this.commentDiv.appendChild(headDiv);
        headDiv.className = "panel-heading";

        this.headName = document.createElement("h3");
        headDiv.appendChild(this.headName);
        this.headName.className = "panel-title text-center";

        this.contentDiv = document.createElement("div");
        this.commentDiv.appendChild(this.contentDiv);
        this.contentDiv.className = "panel-body";
        this.contentDiv.style.height = "350px";
        this.contentDiv.style.background = "#f5f5f5";
        this.contentDiv.style.overflow = "auto";

        //滚动至顶部加载更多
        var that = this; //下面this指向contentDiv
        $(this.contentDiv).scroll(function () {
            var h = $(this).height();//div可视区域的高度
            var sh = $(this)[0].scrollHeight;//滚动的高度，$(this)指代jQuery对象，而$(this)[0]指代的是dom节点
            var st =$(this)[0].scrollTop;//滚动条的高度，即滚动条的当前位置到div顶部的距离
            if(st <= 0){
                // console.log("滚动到顶部开始加载更多...");
                var thas = this;  //下面this指向post请求
                $.post("/om/OmServices?api=39", {
                    senderId:headNameId,
                    lastTime:chatHistory[0].sendTime
                }).complete(function (data) {
                    if(data.responseJSON.data !== null){
                        var newChatHistory = data.responseJSON.data;
                        for (var i = 0;i<newChatHistory.length;i++){
                            //判断消息类型
                            if(newChatHistory[i].messageType == 0){
                                newChatHistory[i].message = "图片信息暂时无法显示";
                            }else if(newChatHistory[i].messageType == 2){
                                newChatHistory[i].message = "语音信息暂时无法显示";
                            }else if(newChatHistory[i].messageType == 3){
                                newChatHistory[i].message = "视频信息暂时无法显示";
                            }else if(newChatHistory[i].messageType == 4){
                                newChatHistory[i].message = "文件信息暂时无法显示";
                            }
                            if(newChatHistory[i].senderName == that.headName.innerHTML){
                                var leftStr = '';
                                leftStr = '<div style="margin:15px; "><img style="display: inline-block;width: 40px;height: 40px;" src= "http://192.168.1.82:8088/api/js/common/img/pic.jpg"><span  style="display: inline-block;max-width: 400px; background: rgb(255, 255, 255); border: 1px solid rgb(238, 238, 238); border-radius: 5px; padding: 10px;margin-left: 10px">' + newChatHistory[i].message + '</span></div>';
                                thas.innerHTML = leftStr + thas.innerHTML;
                            }else if(newChatHistory[i].senderName == that.options.userName){
                                var rightStr = '';
                                rightStr = '<div style="margin:15px; text-align:right"><span style="display: inline-block;color:#fff;text-align: left;max-width: 400px; background: #6699cc; border: 1px solid #6699cc; border-radius: 5px; padding: 10px;margin-right: 10px">' + newChatHistory[i].message + '</span><img style="display:inline-block;text-align:right;width: 40px;height: 40px;" src= "http://192.168.1.82:8088/api/js/common/img/touxiang.png"></div>';
                                thas.innerHTML = rightStr + thas.innerHTML;
                            }
                            chatHistory.unshift(newChatHistory[i]);
                        }
                    }
                    $("#progressbar").hide();
                });
            }
        });

        var textDiv = document.createElement("div");
        this.commentDiv.appendChild(textDiv);
        textDiv.className = "panel-footer";
        textDiv.style.background = "#fff";

        this.fileIcon = document.createElement("i");
        textDiv.appendChild(this.fileIcon);
        this.fileIcon.className = "fa fa-folder-o";
        this.fileIcon.style.fontSize = "18px";
        this.fileIcon.style.cursor = "pointer";
        this.fileIcon.addEventListener("click",this,false);

        this.fileInput = document.createElement("INPUT");
        this.fileIcon.appendChild(this.fileInput);
        this.fileInput.type = "file";
        this.fileInput.id = "file";
        this.fileInput.className = "hide";
        if (options.multiple == "1") {
            this.fileInput.multiple = true;
        }
        if (options.filter != "") {
            this.fileInput.accept = options.filter;
        }
        if (options.actnow == "1") {
            this.fileInput.addEventListener('change', this, false);
        }

        var icon2 = document.createElement("i");
        textDiv.appendChild(icon2);
        icon2.className = "fa fa-cut";
        icon2.style.fontSize = "18px";
        icon2.style.marginLeft = "10px";
        icon2.style.cursor = "pointer";

        var icon3 = document.createElement("i");
        textDiv.appendChild(icon3);
        icon3.className = "fa fa-video-camera";
        icon3.style.fontSize = "18px";
        icon3.style.marginLeft = "10px";
        icon3.style.cursor = "pointer";

        var icon4 = document.createElement("i");
        textDiv.appendChild(icon4);
        icon4.className = "fa fa-phone";
        icon4.style.fontSize = "18px";
        icon4.style.marginLeft = "10px";
        icon4.style.cursor = "pointer";

        this.inputArea = document.createElement("textarea");
        textDiv.appendChild(this.inputArea);
        this.inputArea.style.width = "100%";
        this.inputArea.style.height = "110px";
        this.inputArea.style.border = "none";
        this.inputArea.style.resize = "none";
        this.inputArea.style.outline = "none";
        this.inputArea.addEventListener('keydown', this, false);//为回车键加监听事件  ps:暂时不做实现

        var closeBtn = document.createElement("button");
        textDiv.appendChild(closeBtn);
        closeBtn.className = "btn btn-default";
        closeBtn.innerHTML = "关闭(C)";
        closeBtn.style.margin = "0 10px 0 340px";
        closeBtn.setAttribute("data-dismiss", "modal");
        closeBtn.addEventListener("click",function (ev) {
            that.options.parent.options.parent.options.parent.isShow();
        });

        this.sendBtn = document.createElement("button");
        textDiv.appendChild(this.sendBtn);
        this.sendBtn.className = "btn btn-default";
        this.sendBtn.innerHTML = "发送(S)";
        this.sendBtn.addEventListener("click", this, false);

        this.uploadAction = new UploadAction(this, options.url, options.extpara);
    };

    //在选择联系人时传过来的个人信息
    RightPanel1.prototype.loaddata = function (psn) {
        if (psn.fname) {
            this.headName.innerHTML = psn.fname
        } else if(psn.senderName == this.options.userName){
            this.headName.innerHTML = psn.receiverName
        }else{
            this.headName.innerHTML = psn.senderName
        }
        this.Psn = psn;
        // this.options.parent.sessionPane.msgDot(this.headName.innerHTML);
    };

    RightPanel1.prototype.show = function (show) {
        if (show) {
            this.commentDiv.style.display = "";
        } else {
            this.commentDiv.style.display = "none";
        }
    };

    RightPanel1.prototype.handleEvent = function (e) {
        switch (e.type) {
            case "click":
                this.doClick(e);
                break;
            case "keydown":
                this.onKeydown(e);
                break;
            case "change":
                this.doChange(e);
                break;
        }
    };

    RightPanel1.prototype.doClick = function (e) {
        if(e.target == this.sendBtn){
            if (this.inputArea.value == "") {
                alert("消息不能为空");
                return;
            }
            var contactMsg = new ChatMessage();
            contactMsg.message = this.inputArea.value;
            contactMsg.senderId = this.options.userId;
            contactMsg.senderName = this.options.userName;
            if(this.Psn.userId){
                contactMsg.receiverId = this.Psn.userId;
            }else if(this.Psn.senderId == this.options.userId){
                contactMsg.receiverId = this.Psn.receiverId
            }else{
                contactMsg.receiverId = this.Psn.senderId;
            }
            if(this.Psn.fname){
                contactMsg.receiverName = this.Psn.fname;
            }else if(this.Psn.senderName == this.options.userName){
                contactMsg.receiverName = this.Psn.receiverName
            }else{
                contactMsg.receiverName = this.Psn.senderName;
            }
            contactMsg.sendTime = new Date().getTime();
            contactMsg.messageType = "1";

            var type = {messageType: "1", messageData: contactMsg};
            // console.log(JSON.stringify(type));
            this.options.websocket.sendTextMessage(type);

            //发送的信息详情传递给左边会话列表
            this.options.parent.sessionPane.inputValue(contactMsg);
            this.inputArea.value = "";
            this.inputArea.focus();
            $(this.contentDiv).animate({scrollTop: $(this.contentDiv).prop('scrollHeight')}, 1000);
        }else if(e.target == this.fileIcon){
            this.fileInput.click();
        }
    };

    RightPanel1.prototype.doChange = function (evt) {
        if (evt.target == this.fileInput) {
            this.uploadAction.opt = this.extpara;
            if (this.fileInput.files.length > 0) {
                this.uploading(evt.target.files); // FileList object
            }
            //生成图片预览路径
            // this.path = window.URL.createObjectURL(evt.target.files[0]);
        }
    };

    RightPanel1.prototype.uploading = function (files) {
        this.uploadAction.opt = this.extpara;
        var total = 0;
        for (var i = 0, f; f = files[i]; i++) {
            total = total + f.size;
        }
        for (var i = 0, f; f = files[i]; i++) {
            this.startProgress(f);
            this.uploadAction.doReadandUpload(f, this.totalloaded, total);
        }
    }

    RightPanel1.prototype.showMsg = function (data) {
        //消息详情
        var obj = JSON.parse(data);
        obj.msgRead = false;//消息未读：false 已读：true
        this.options.parent.sessionPane.receiveMsg(obj);
        this.options.parent.options.parent.options.parent.allReceiveMsg(obj);
        $(this.contentDiv).animate({scrollTop: $(this.contentDiv).prop('scrollHeight')}, 1000);
    };

    //发送或者接收到的消息在contentDiv的显示
    RightPanel1.prototype.messageData = function(receiveArr){
        for (var i = 0;i<receiveArr.length;i++){
            //判断消息类型
            if(receiveArr[i].messageType == 0){
                receiveArr[i].message = "图片信息暂时无法显示";
            }else if(receiveArr[i].messageType == 2){
                receiveArr[i].message = "语音信息暂时无法显示";
            }else if(receiveArr[i].messageType == 3){
                receiveArr[i].message = "视频信息暂时无法显示";
            }else if(receiveArr[i].messageType == 4){
                receiveArr[i].message = "文件信息暂时无法显示";
            }
            if(receiveArr[i].senderName == this.headName.innerHTML && receiveArr[i].receiverName == this.options.userName){
                var leftStr = '';
                leftStr = '<div style="margin:15px; "><img style="display: inline-block;width: 40px;height: 40px;" src= "http://192.168.1.82:8088/api/js/common/img/pic.jpg"><span  style="display: inline-block;max-width: 400px; background: rgb(255, 255, 255); border: 1px solid rgb(238, 238, 238); border-radius: 5px; padding: 10px;margin-left: 10px">' + receiveArr[i].message + '</span></div>';
                this.contentDiv.innerHTML = this.contentDiv.innerHTML + leftStr;
            }else if(receiveArr[i].senderName == this.options.userName && receiveArr[i].receiverName == this.headName.innerHTML){
                var rightStr = '';
                rightStr = '<div style="margin:15px; text-align:right"><span style="display: inline-block;color:#fff;text-align: left;max-width: 400px; background: #6699cc; border: 1px solid #6699cc; border-radius: 5px; padding: 10px;margin-right: 10px">' + receiveArr[i].message + '</span><img style="display:inline-block;text-align:right;width: 40px;height: 40px;" src= "http://192.168.1.82:8088/api/js/common/img/touxiang.png"></div>';
                this.contentDiv.innerHTML = this.contentDiv.innerHTML + rightStr;
            }
        }
    };

    //点击显示聊天记录
    var chatHistory = [];
    var headNameId;
    RightPanel1.prototype.clickMsg = function(receiveArr){
        chatHistory = receiveArr;
        this.contentDiv.innerHTML = "";
        for (var i = 0;i<receiveArr.length;i++){
            //判断消息类型
            if(receiveArr[i].messageType == 0){
                receiveArr[i].message = "图片信息暂时无法显示";
            }else if(receiveArr[i].messageType == 2){
                receiveArr[i].message = "语音信息暂时无法显示";
            }else if(receiveArr[i].messageType == 3){
                receiveArr[i].message = "视频信息暂时无法显示";
            }else if(receiveArr[i].messageType == 4){
                receiveArr[i].message = "文件信息暂时无法显示";
            }
            if(receiveArr[i].senderName == this.headName.innerHTML){
                var leftStr = '';
                leftStr = '<div style="margin:15px; "><img style="display: inline-block;width: 40px;height: 40px;" src= "http://192.168.1.82:8088/api/js/common/img/pic.jpg"><span  style="display: inline-block;max-width: 400px; background: rgb(255, 255, 255); border: 1px solid rgb(238, 238, 238); border-radius: 5px; padding: 10px;margin-left: 10px">' + receiveArr[i].message + '</span></div>';
                this.contentDiv.innerHTML = this.contentDiv.innerHTML + leftStr;
            }else if(receiveArr[i].senderName == this.options.userName){
                var rightStr = '';
                rightStr = '<div style="margin:15px; text-align:right"><span style="display: inline-block;color:#fff;text-align: left;max-width: 400px; background: #6699cc; border: 1px solid #6699cc; border-radius: 5px; padding: 10px;margin-right: 10px">' + receiveArr[i].message + '</span><img style="display:inline-block;text-align:right;width: 40px;height: 40px;" src= "http://192.168.1.82:8088/api/js/common/img/touxiang.png"></div>';
                this.contentDiv.innerHTML = this.contentDiv.innerHTML + rightStr;
            }
        }
        if(receiveArr.length !== 0){
            if(receiveArr[0].senderId == this.options.userId){
                headNameId = receiveArr[0].receiverId
            }else {
                headNameId = receiveArr[0].senderId
            }
        }
        $(this.contentDiv).animate({scrollTop: $(this.contentDiv).prop('scrollHeight')}, 1000);
    };

    RightPanel1.prototype.clearContentDiv = function(evt) {
        this.contentDiv.innerHTML = "";
    };

    RightPanel1.prototype.onKeydown = function(evt) {
        if(evt && evt.keyCode==13){ // enter 键
            evt.preventDefault();
            //要做的事情
            this.doClick(evt);
        }
    };

    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, pluginName)) {
                $.data(this, pluginName, new RightPanel1(this, options));
            } else if ($.isFunction(Plugin.prototype[options])) {
                $.data(this, pluginName)[options]();
            }
        });
    };

})(jQuery, window, document);
