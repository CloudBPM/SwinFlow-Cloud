package com.config;

import com.cloudibpm.blo.websocket.WebSocketBlo;
import com.cloudibpm.controller.WebSocketController;
import com.cloudibpm.redis.RedisUtil;
import com.model.WebSocketEntityContainer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringBootConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.web.socket.server.standard.ServerEndpointExporter;


/**
 * 开启webSocket支持
 */
@SpringBootConfiguration
public class WebSocketConfiguration {
    /**
     * ServerEndpointExporter 用于扫描和注册所有携带 ServerEndPoint 注解的实例，
     * 若部署到外部容器 则无需提供此类。
     *
     * @return
     */
    @Bean
    public ServerEndpointExporter serverEndpointExporter() {
        return new ServerEndpointExporter();
    }

//    /**
//     * 因 SpringBoot WebSocket 对每个客户端连接都会创建一个 WebSocketServer（@ServerEndpoint 注解对应的） 对象，Bean 注入操作会被直接略过，因而手动注入一个全局变量
//     *
//     * @param redisUtil
//     */
    @Autowired
    public void setMessageService(RedisUtil redisUtil, WebSocketBlo webSocketBlo, WebSocketEntityContainer webSocketEntityContainer) {

        WebSocketController.webSocketEntityContainer=webSocketEntityContainer;
        WebSocketController.redisUtil=redisUtil;
        WebSocketController.webSocketBlo = webSocketBlo;
    }


}
