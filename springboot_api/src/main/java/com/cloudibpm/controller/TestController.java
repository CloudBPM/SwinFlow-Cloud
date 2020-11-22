package com.cloudibpm.controller;

import com.cloudibpm.core.websocketmodel.WebSocketMessage;
import com.model.WebSocketEntityContainer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
public class TestController {
    private final WebSocketEntityContainer webSocketEntityContainer;

    @Autowired
    public TestController(WebSocketEntityContainer webSocketEntityContainer) {
        this.webSocketEntityContainer = webSocketEntityContainer;
    }

    @RequestMapping("/testSendMsg")
    public String testSendMsg() throws IOException {
        WebSocketMessage webSocketHeart=new WebSocketMessage();
        webSocketHeart.setMessageType("1");
        webSocketHeart.setMessageData("哈哈哈哈");
        webSocketEntityContainer.sendMsgToUser("00000000000001b", webSocketHeart);
        return "ok";
    }

    @PostMapping("/test")
    public String test(){
        return "ok";
    }

}
