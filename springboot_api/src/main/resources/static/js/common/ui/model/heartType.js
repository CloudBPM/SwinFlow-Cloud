/**
 *
 */

function HeartType() {
    /**
     * 0:心跳
     * 1:正常消息
     * 2:服务端像发送者返回消息Id
     * 3:服务端向接收方发送消息
     */
    this.messageType = null;//消息类型
    this.messageData = null;  //消息数据

};

HeartType.prototype.parsefromJSON = function(json) {
    this.messageType = json.messageType;
    this.messageData = json.messageData;
}
