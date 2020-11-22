package com.model;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.cloudibpm.core.user.User;
import com.cloudibpm.core.websocketmodel.WebSocketEntity;
import com.cloudibpm.core.websocketmodel.WebSocketMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import javax.websocket.CloseReason;
import javax.websocket.Session;
import java.io.IOException;
import java.util.Calendar;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class WebSocketEntityContainer {

    public WebSocketEntityContainer(){
        startHeart();
    }

    private static Logger logger= LoggerFactory.getLogger(WebSocketEntityContainer.class);

    private static ConcurrentHashMap<String, WebSocketEntity> connections = new ConcurrentHashMap<>();

    public ConcurrentHashMap<String, WebSocketEntity> getConnections() {
        return connections;
    }

    public WebSocketEntity getEntity(String userId){
        return connections.get(userId);
    }

    public void addUser(User user, Session session,String type){
        String key= type + "_" + user.getId();
        WebSocketEntity webSocketEntity=connections.get(key);
        try {
            if(webSocketEntity==null){
                connections.put(key,new WebSocketEntity(user, session,type));
    //            if(connections.size()==1&&!isHeart){
    //                startHeart();
    //                isHeart=true;
    //            }
            }else{
                webSocketEntity.getSession().close();
                webSocketEntity.setSession(session);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    /**
     *
     * @Description: 用户下线
     * @param @param userId
     * @param @param reason
     * @return void
     * @throws
     * @author 黑暗料理界扛把子
     * @date 2018年5月23日
     */
    public void removeUser(String key, CloseReason reason) {
        WebSocketEntity entity=getUserEntity(key);
        if(null!=entity){
            try {
                if(entity.getSession().isOpen()){
                    entity.getSession().close(reason);
                }
                connections.remove(key);
            } catch (IOException e) {
                logger.info(e.toString());
                e.printStackTrace();
            }
        }
        logger.info("当前人数:"+connections.size());

    }



    /**
     *
     * @param 发送心跳包
     * @Description: 服务端群发消息
     * @param @param message
     * @param @throws IOException
     * @return void
     * @throws
     * @author 黑暗料理界扛把子
     * @date 2018年5月10日
     */
    private synchronized void sendPing(String message){
        if(connections.size()<=0)
            return;

        connections.forEach((k,v)->{
            v.setTimeStr(getTimeInMillis());
            v.setHeart(false);
            try {
                logger.info("当前发送心跳用户为：{},设备类型为：{}",v.getMemberName(),v.getType());
                v.getSession().getBasicRemote().sendText(message);
            } catch (IOException e) {
                e.printStackTrace();
            }
        });
    }

    /**
     *
     * @Description: 发消息
     * @param @param message
     * @param @throws IOException
     * @return void
     * @throws
     * @author 黑暗料理界扛把子
     * @date 2018年5月11日
     */
    public boolean sendMsgToUser(String userId, WebSocketMessage webSocketMessage) throws IOException {
        String appKey = "app" + "_" + userId;
        String pcKey="pc"+"_"+userId;
        WebSocketEntity appEntity=connections.get(appKey);
        boolean appState=appEntity != null && appEntity.getSession().isOpen();
        if(appState){
            appEntity.getSession().getBasicRemote().sendText(JSON.toJSONString(webSocketMessage));
        }
        WebSocketEntity pcEntity=connections.get(pcKey);
        boolean pcState=pcEntity!=null&&pcEntity.getSession().isOpen();
        if(pcState){
            pcEntity.getSession().getBasicRemote().sendText(JSON.toJSONString(webSocketMessage));
        }
        return pcState||appState;
    }

    /**
     * 群发消息
     * @param userId
     * @param msg
     * @throws IOException
     */
    public void sendMsgToUsers(List<String> userId,WebSocketMessage webSocketMessage)throws IOException {
        //TODO 暂时不用，需要向多个设备群发
        userId.forEach(item->{
            try {
                sendMsgToUser(item,webSocketMessage);
            } catch (IOException e) {
                e.printStackTrace();
            }
        });
    }

    /**
     * 广播消息
     * @param webSocketHeart
     */
    public void broadcast(WebSocketMessage webSocketMessage){
        connections.forEach((k,v)->{
            try {
                if(v.getSession().isOpen())
                v.getSession().getBasicRemote().sendText(JSON.toJSONString(webSocketMessage));
            } catch (IOException e) {
                e.printStackTrace();
            }
        });
    }



    /**
     *
     * @Description: 启动心跳包
     * @param
     * @return void
     * @throws
     * @author 黑暗料理界扛把子
     * @date 2018年5月10日
     */
    private synchronized void startHeart(){
        ExamineHeartThread examineHeart =new ExamineHeartThread();
        Thread examineThread=new Thread(examineHeart);

        KeepHeartThread keepHeart=new KeepHeartThread();
        Thread keepThread=new Thread(keepHeart);
        logger.info("线程开启啦");
        keepThread.start();
        examineThread.start();

    }

    /**
     *
     * @Description: 获取时间戳
     * @param @return
     * @return long
     * @throws
     * @author 黑暗料理界扛把子
     * @date 2018年5月22日
     */
    private static long getTimeInMillis(){
        Calendar c = Calendar.getInstance();
        c.set(Calendar.SECOND,c.get(Calendar.SECOND)+8);
        return c.getTimeInMillis();
    }

    /**
     *
     * @Description: 根据userId获取实体类
     * @param @param userId
     * @param @return
     * @return WebSocketEntity
     * @throws
     * @author 黑暗料理界扛把子
     * @date 2018年5月22日
     */
    private static WebSocketEntity getUserEntity(String key){
        return connections.get(key);
    }

    private static int getUserOnlineNum(){
        return connections.size();
    }

    /**
     *
     * @author 黑暗料理界扛把子
     *
     * @Description server发送心跳包 10秒一次
     */
    private class KeepHeartThread implements Runnable {

        @Override
        public void run() {
            JSONObject heartJson=new JSONObject();
            heartJson.put("messageType", "0");
            heartJson.put("messageData", "ping");
            while (true) {
                try {
                    Thread.sleep(10000);
                    logger.info("发送心跳包当前人数为:"+getUserOnlineNum());
                    sendPing(heartJson.toString());
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        }
    }

    /**
     *
     * @author 黑暗料理界扛把子
     *
     * @Description 检测是否收到client心跳 每秒一次
     */
    private class ExamineHeartThread implements Runnable {
        @Override
        public void run() {
            while (true) {
                try {
                    Thread.sleep(1000);
                    long timeMillins = System.currentTimeMillis();
                    connections.forEach((key, entity) -> {
                        if (!entity.isHeart() && entity.getTimeStr() != 0 && timeMillins > entity.getTimeStr()) {
                            logger.info(entity.getMemberName() + "连接中断");
                            removeUser(key, new CloseReason(CloseReason.CloseCodes.NORMAL_CLOSURE, "没有收到心跳"));
                        }
                    });
                } catch (InterruptedException e) {
                    logger.error("websocket",e);
                    e.printStackTrace();
                }
            }
        }
    }
}
