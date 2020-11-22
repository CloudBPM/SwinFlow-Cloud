package com.xq.myxuanqi.model.contact;

import java.io.Serializable;

/**
 * @Titel: 标题
 * @Description: 描述
 * @Author: 作者  chengkai
 * @CreateDate: 2019/1/21 11:49
 * @Version: 1.0
 */
public class WebSocketHeart implements Serializable {

    private String messageType; //消息类型  0 心跳，2 发送消息成功，3 收到新消息， 4 收到系统消息
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
