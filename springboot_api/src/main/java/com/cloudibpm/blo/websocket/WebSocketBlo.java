package com.cloudibpm.blo.websocket;

import com.cloudibpm.blo.buildtime.id.BuildtimeIDGenerator;
import com.cloudibpm.core.PageObject;
import com.cloudibpm.core.repository.BusinessLogicObject;
import com.cloudibpm.core.util.serviceresult.ServiceResult;
import com.cloudibpm.core.websocketmodel.ChatMessage;
import com.cloudibpm.eso.websocket.WebSocketEno;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * @Titel: 标题
 * @Description: WebSocket  mongodb 操作
 * @Author: 作者
 * @CreateDate: 2019/1/21 15:04
 * @Version: 1.0
 */
@Service
@Transactional
public class WebSocketBlo extends BusinessLogicObject {
    private final WebSocketEno webSocketEso;
    private final BuildtimeIDGenerator buildtimeIDGenerator;

    @Autowired
    public WebSocketBlo(WebSocketEno webSocketEso, BuildtimeIDGenerator buildtimeIDGenerator) {
        this.webSocketEso = webSocketEso;
        this.buildtimeIDGenerator = buildtimeIDGenerator;
    }

    /**
     * 保存消息
     *
     * @param messageFormat
     */
    public String saveMessage(ChatMessage chatMessage) throws Exception {
        chatMessage.setMessageId(buildtimeIDGenerator.getNewRunTimeID());
        chatMessage.setMessageStatus("0");
        webSocketEso.saveMessage(chatMessage);
        return chatMessage.getMessageId();
    }

    /**
     * 通过消息ID查询指定消息
     *
     * @param messageId
     * @return
     */
    public ChatMessage queryMessageByMessageId(String messageId) {
        return webSocketEso.queryMessageByMessageId(messageId);
    }


    /**
     * 通过用户ID和发送时间 查询指定消息
     *
     * @param userId
     * @param sendTime
     * @return
     */
    public ChatMessage queryMessage(String userId, long sendTime) {
        return webSocketEso.queryMessage(userId, sendTime);
    }


    /**
     * 条件查询
     *
     * @param senderId   发送人ID
     * @param receiverId 接收人ID
     * @param sendTime   时间
     * @return
     */
    public ServiceResult queryTwoMessage(String senderId, String receiverId,long lastTime) {
        //查询两人之间的消息，每次查固定数量，以时间为条件
        if (StringUtils.isNotBlank(receiverId) && StringUtils.isNotBlank(senderId)) {
            return webSocketEso.queryTwoMessage(senderId, receiverId,lastTime);
        }else {
            return ServiceResult.error(1001,"发送人或接收人ID为空");
        }
    }


    /**
     * 查询会话列表
     *
     * @param receiverId
     * @param lastTime
     * @return
     */
    public List<PageObject> queryConversationList(String userId) {
        List<PageObject> list = new ArrayList<>();
        List<Map> maps = webSocketEso.queryConversationList(userId);
        for (Map map : maps) {
            //获取每个人的ID
            String senderId = (String) map.get("_id");
            //查询两人间的最新的消息
            List<ChatMessage> messages = webSocketEso.queryLatestNews(senderId, userId);
            //查询未读消息数 即messageStatus为0
            long unreadMessagesNumber = webSocketEso.queryUnreadMessagesNumber(senderId, userId, "0");
            //将我收到的某人的消息的状态置“1”
            webSocketEso.updateAllMessageStatus(senderId, userId, "1");
            PageObject pageObject = new PageObject();
            pageObject.setAllEntitiesCount(unreadMessagesNumber);
            pageObject.setPageEntities(messages.toArray());
            list.add(pageObject);
        }
        return list;
    }

    //修改消息的状态
    public void updateMessageStatus(String messageId, String messageStatus) {
        webSocketEso.updateMessageStatus(messageId, messageStatus);
    }

    //设置我和他之间的消息状态为已读  (我发出的消息是对方的未读消息数,只设置对方发给我的消息状态)
    public void updateAllMessageStatus(String userId, String receiverId) {
        webSocketEso.updateAllMessageStatus(userId, receiverId);
    }
}
