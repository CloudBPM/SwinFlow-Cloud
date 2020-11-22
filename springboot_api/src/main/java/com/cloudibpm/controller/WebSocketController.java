package com.cloudibpm.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.cloudibpm.blo.websocket.WebSocketBlo;
import com.cloudibpm.core.user.Login;
import com.cloudibpm.core.websocketmodel.ChatMessage;
import com.cloudibpm.core.websocketmodel.WebSocketEntity;
import com.cloudibpm.core.websocketmodel.WebSocketMessage;
import com.cloudibpm.redis.RedisUtil;
import com.model.WebSocketEntityContainer;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import javax.websocket.*;
import javax.websocket.server.PathParam;
import javax.websocket.server.ServerEndpoint;
import java.io.IOException;

@ServerEndpoint("/webSocket/{sessionId}/{userId}/{deviceType}")
@Component
public class WebSocketController {

    public static WebSocketEntityContainer webSocketEntityContainer;

    private Logger logger= LoggerFactory.getLogger(WebSocketController.class);

    public static RedisUtil redisUtil;

    public static WebSocketBlo webSocketBlo;


    /**
     *
     * @Description: 连接方法
     * @param @param userId
     * @param @param session
     * @return void
     * @throws IOException
     * @throws
     * @author 黑暗料理界扛把子
     * @date 2018年5月10日
     */
    @OnOpen
    public synchronized void onOpen(@PathParam("sessionId") String sessionId,@PathParam("deviceType") String deviceType,Session session) throws Exception {
        logger.info("连接进来了");
        logger.info("onopen----------->{}",session.getId());
        String loginStr = redisUtil.get(sessionId);
        if(null==loginStr){
            logger.info("发现未知生物");
            return;
        }
        Login login=JSONObject.parseObject(loginStr,Login.class);
        logger.info("{},{}加入了连接",login.getUser().getFullName(),deviceType);
        webSocketEntityContainer.addUser(login.getUser(), session,deviceType);
    }

    /**
     *
     * @Description: 收到消息执行
     * @param @param userId
     * @param @param message
     * @param @param session
     * @param @throws IOException
     * @return void
     * @throws
     * @author 黑暗料理界扛把子
     * @date 2018年5月10日
     */
    @OnMessage
    public synchronized void onMessage(@PathParam("userId") String userId,@PathParam("deviceType") String deviceType, String message, Session session) throws Exception {
        logger.info(message);
        String key=deviceType+"_"+userId;
        WebSocketMessage socketHeart = JSONObject.parseObject(message, WebSocketMessage.class);
        // 判断是否是   0 心跳    1 正常消息   2 确认消息
        if(StringUtils.equals(socketHeart.getMessageType(),"0")&&StringUtils.equals("pong",socketHeart.getMessageData())){//心跳，暂时定义为heart
            logger.info("接收到心跳了");
            WebSocketEntity entity=webSocketEntityContainer.getEntity(key);
            if(entity!=null){
                entity.setHeart(true);
            }
        } else if(StringUtils.equals(socketHeart.getMessageType(),"1")){//点对点发消息，暂定为message

            ChatMessage chatMessage = JSON.parseObject(socketHeart.getMessageData(), ChatMessage.class);
            String messageId = "";
            //判断是否是重发消息
            if(chatMessage.getCheckTime() == 0){
                //存储到数据库
                messageId = webSocketBlo.saveMessage(chatMessage);
                // 返回给发送人，服务器端收到了消息
            }else {
                //是重发的消息，去数据库查询消息记录，返回给发送人
                ChatMessage newMsg = webSocketBlo.queryMessage(chatMessage.getSenderId(), chatMessage.getSendTime());
                if(newMsg==null){//查询为空，保存消息并发送
                    webSocketBlo.saveMessage(chatMessage);
                }else{//服务端收到消息，直接发送
                    chatMessage=newMsg;
                }
            }
            WebSocketMessage webSocketMessage=new WebSocketMessage();
            webSocketMessage.setMessageType("2");
            webSocketMessage.setMessageData(JSON.toJSONString(chatMessage));
            //发送确认消息
            webSocketEntityContainer.sendMsgToUser(chatMessage.getSenderId(),webSocketMessage);
            webSocketMessage.setMessageType("3");
            //发送新消息
            if (webSocketEntityContainer.sendMsgToUser(chatMessage.getReceiverId(),webSocketMessage)) {
                //true:发送消息成功， false：发送消息失败
                if (!message.equals("")) {
                    webSocketBlo.updateMessageStatus(messageId, "1");
                }
            }
        }
    }

    /**
     *
     * @Description: 链接错误执行
     * @param @param userId
     * @param @param session
     * @param @param error
     * @return void
     * @throws IOException
     * @throws
     * @author 黑暗料理界扛把子
     * @date 2018年5月10日
     */
    @OnError
    public synchronized void onError(@PathParam("userId") String userId,@PathParam("deviceType") String deviceType,Session session, Throwable error) throws IOException {
        logger.info("onError {}:{}",deviceType,userId);
        String key=deviceType+"_"+userId;
        webSocketEntityContainer.removeUser(key,new CloseReason(CloseReason.CloseCodes.NO_EXTENSION, "客户端异常"));
        error.printStackTrace();
    }

    @OnClose
    public synchronized void onClose(@PathParam("userId") String userId,@PathParam("deviceType") String deviceType,Session session,CloseReason reason){
        logger.info("onClose {}:{}",deviceType,userId);
        String key=deviceType+"_"+userId;
        webSocketEntityContainer.removeUser(key,reason);
    }

}
