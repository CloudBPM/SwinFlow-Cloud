package com.cloudibpm.core.websocketmodel;

import java.io.Serializable;
import java.util.List;

public class BroadcastModel implements Serializable {

    private WebSocketMessage webSocketMessage;
    /**
     * 发送人ID,全部发送置为null
     */
    private List<String> userIdList;


    public WebSocketMessage getWebSocketMessage() {
        return webSocketMessage;
    }

    public void setWebSocketMessage(WebSocketMessage webSocketMessage) {
        this.webSocketMessage = webSocketMessage;
    }

    public List<String> getUserIdList() {
        return userIdList;
    }

    public void setUserIdList(List<String> userIdList) {
        this.userIdList = userIdList;
    }

}
