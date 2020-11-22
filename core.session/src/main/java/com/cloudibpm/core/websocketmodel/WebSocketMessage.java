package com.cloudibpm.core.websocketmodel;

import java.io.Serializable;

/**
 * @Titel: 标题
 * @Description: 描述
 * @Author: 作者
 * @CreateDate: 2019/1/21 11:49
 * @Version: 1.0
 */
public class WebSocketMessage implements Serializable {
    /**
     * 0:心跳
     * 1:用户A发送消息至用户B
     * 2:服务端像发送者返回消息Id
     * 3:服务端向接收方发送消息
     * 4:服务端发送系统通知
     * 5:服务端发送待办事项数量
     */
    private String messageType; //消息类型
    private String messageData; //消息数据

    public String getMessageType() {
        return messageType;
    }

    public void setMessageType(String messageType) {
        this.messageType = messageType;
    }

    public String getMessageData() {
        return messageData;
    }

    public void setMessageData(String messageData) {
        this.messageData = messageData;
    }
}
