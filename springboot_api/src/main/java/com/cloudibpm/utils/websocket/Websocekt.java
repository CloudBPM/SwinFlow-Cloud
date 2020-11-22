package com.cloudibpm.utils.websocket;

import javax.websocket.*;
import javax.websocket.server.PathParam;
import javax.websocket.server.ServerEndpoint;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@ServerEndpoint("/websocket/{id}")
public class Websocekt {
    private String id;//记录订单号
    private Session session;//当前的链接

    private static Map<String, Session> allClients = new ConcurrentHashMap<>();//用于存放所有订单和websocket链接的map

    public static Map<String, Session> getAllClients() {
        return allClients;
    }

    @OnOpen
    public void onOpen(@PathParam("id") String id, Session session) {
        this.id = id;
        this.session = session;
        allClients.put(id,session);
    }

    @OnClose
    public void onClose(Session session){
        allClients.remove(id);
    }

    @OnError
    public void onError(Session session, Throwable throwable){
        if(session!=null&&session.isOpen()){
            try {
                session.close();
            }catch (Exception e){
                e.printStackTrace();
            }
        }
        allClients.remove(id);
    }

    /**
     * 客户端给服务端发消息。包括两个用户之间的通信
     * @param session
     * @param content
     */
    @OnMessage
    public void onMessage(Session session, String content){

    }

    /**
     * 发送消息
     * @param session
     * @param message
     */
    public static void sendMessage(Session session, String message){
        if(session!=null){
            session.getAsyncRemote().sendText(message);
        }
    }

    /**
     * 根据id 发送消息
     * @param id
     * @param message
     */
    public static void sendMessage(String id,String message){
        if (id!=null){
            Session session = allClients.get(id);
            sendMessage(session,message);
        }
    }
}
