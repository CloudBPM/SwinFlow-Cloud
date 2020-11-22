/**
 *
 */
function WebsocketClient(basePath, sessionId, userId, parent) {
    this.basePath = basePath;
    this.sessionId = sessionId;
    this.userId = userId;
    this.socket = null;
    this.parent = parent;
    this.init();
};

WebsocketClient.prototype = {
    init: function () {
        var url = this.basePath.replace("http", "ws").replace("https", "ws") +
            this.sessionId + "/" + this.userId + "/"+"pc";
        if ('WebSocket' in window) {
            this.socket = new WebSocket(url);
        }
        var that = this;
        this.socket.onopen = function (evt) {
        };
        this.socket.onmessage = function (evt) {
            // 处理（显示）接收到的消息
            that.handleMessage(evt.data);
        };
        this.socket.onerror = function (evt) {
        };
        this.socket.onclose = function (evt) {
        };
    },
    sendTextMessage: function (message) {
        this.socket.send(JSON.stringify(message));
    },
    handleMessage: function (data) {
        var d = JSON.parse(data);
        if (d.messageType === "0" && d.messageData === "ping") {
            var pong = {messageType: "0", messageData: "pong"};
            this.socket.send(JSON.stringify(pong));
        } else if (d.messageType === "4") {
             this.parent.menuBar.putMessage(d.messageData)
        } else if(d.messageType == "2"){
            // console.log(d.messageData);
        } else if(d.messageType == "3"){
            this.parent.menuBar.communicationDialog.communicationPanel.rightPane1.showMsg(d.messageData);
        } else if(d.messageType == "5"){
            var s = JSON.parse(d.messageData);
            if (this.parent.main != undefined) {
                if (this.parent.main.leftMenuBar != undefined &&
                    this.parent.main.leftMenuBar.setItem6Badge != undefined) {
                    this.parent.main.leftMenuBar.setItem6Badge(s.count);
                }
                if (this.parent.main.queuePane != undefined &&
                    this.parent.main.queuePane.workItemPane != undefined &&
                    this.parent.main.queuePane.workItemPane.setTabBadges != undefined) {
                    this.parent.main.queuePane.workItemPane.setTabBadges(s);
                }
            }
            if (this.parent.myWorkListPanelforMobile != undefined) {
                this.parent.myWorkListPanelforMobile.setTabBadges(s);
            }
        }
    }
};
