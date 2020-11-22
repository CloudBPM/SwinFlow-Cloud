/**
 *
 */

function ChatMessage() {
    this.messageId = null;//消息ID
    this.message = null;  //消息正文
    this.senderId = null; //发送者的id
    this.senderAvatarUrl = null;  //发送者头像url
    this.senderName = null; //发送者姓名
    this.receiverId = null;  //接受者的id
    this.receiverAvatarUrl = null;  //接受者的头像url
    this.receiverName = null;  //接受者的姓名
    this.sendTime = 0;  //消息的发送时间
    this.checkTime = 0; //消息的重发时间
    this.receiveTime = 0; //消息的接收时间
    this.messageStatus = null; // 消息状态  0 服务器端收到, 1 消息已被接收人接收
    this.messageType = null;//  消息类型  0 图片 ,1 文本,2 语音,3 视频,4 文件

};

ChatMessage.prototype.parsefromJSON = function(json) {
    this.messageId = json.messageId;
    this.message = json.message;
    this.senderId = json.senderId;
    this.senderAvatarUrl = json.senderAvatarUrl;
    this.senderName = json.senderName;
    this.receiverId = json.receiverId;
    this.receiverAvatarUrl = json.receiverAvatarUrl;
    this.receiverName = json.receiverName;
    this.sendTime = json.sendTime;
    this.checkTime = json.checkTime;
    this.receiveTime = json.receiveTime;
    this.messageStatus = json.messageStatus;
    this.messageType = json.messageType;
}
