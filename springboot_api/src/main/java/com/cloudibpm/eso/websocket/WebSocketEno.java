package com.cloudibpm.eso.websocket;


import com.cloudibpm.core.util.serviceresult.ServiceResult;
import com.cloudibpm.core.websocketmodel.ChatMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Repository;

import java.util.*;

/**
 * @Titel: 标题
 * @Description: mongodb 消息操作
 * @Author: 作者
 * @CreateDate: 2019/1/21 15:06
 * @Version: 1.0
 */
@Repository
public class WebSocketEno {

    private final MongoTemplate mongoTemplate;
    private final String collectionname = "communication_message";

    @Autowired
    public WebSocketEno(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    /**
     * 保存信息
     *
     * @param chatMessage
     */
    public void saveMessage(ChatMessage chatMessage) {
        mongoTemplate.insert(chatMessage, collectionname);
    }

    /**
     * 通过消息ID查询指定消息
     *
     * @param messageId
     * @return
     */
    public ChatMessage queryMessageByMessageId(String messageId) {
        Query query = new Query(Criteria.where("messageId").is(messageId));
        return mongoTemplate.findOne(query, ChatMessage.class, collectionname);
    }

    /**
     * 通过用户ID，和发送时间 查询指定消息
     *
     * @param userId
     * @param sendTime
     * @return
     */
    public ChatMessage queryMessage(String userId, long sendTime) {
        Query query = new Query();
        query.addCriteria(Criteria.where("senderId").is(userId));
        query.addCriteria(Criteria.where("sendTime").ne(sendTime));
        return mongoTemplate.findOne(query, ChatMessage.class, collectionname);
    }


    /**
     * 查询 未读消息数
     *
     * @param senderId   发送人ID
     * @param receiverId 接收人ID
     * @param sendTime   时间
     * @return
     */
    public long queryUnreadMessagesNumber(String senderId, String receiverId, String messageStatus) {
        Query query = new Query();
        Criteria criteria = new Criteria();
        query.addCriteria(criteria.andOperator(Criteria.where("senderId").is(senderId), Criteria.where("receiverId").is(receiverId), Criteria.where("messageStatus").is(messageStatus)));

        return mongoTemplate.count(query, collectionname);
    }

    /**
     * 查询 我和他 的消息记录
     *
     * @param senderId   发送人ID
     * @param receiverId 接收人ID
     * @param sendTime   时间
     * @param size       每页显示数量
     * @return
     */
    public ServiceResult queryTwoMessage(String senderId, String receiverId, long lastTime) {
        Query query = twoQuery(senderId, receiverId);
        query.addCriteria(Criteria.where("sendTime").lt(lastTime));
        query.limit(10);

        //固定查询多少条
        List<ChatMessage> messageList = mongoTemplate.find(query, ChatMessage.class, collectionname);
        if (messageList != null && messageList.size() > 0) {
            return ServiceResult.success(messageList);
        } else {
            return ServiceResult.error(1002, "消息记录为空!");
        }
    }

    //共同方法(查询两人聊天记录)
    public Query twoQuery(String senderId, String receiverId) {
        Query query = new Query();
        Criteria criteria = new Criteria();
        query.addCriteria(criteria.orOperator(
                Criteria.where("senderId").is(senderId).and("receiverId").is(receiverId),
                Criteria.where("senderId").is(receiverId).and("receiverId").is(senderId)
        ));
        query.with(new Sort(Sort.Direction.DESC, "sendTime"));   //根据时间倒叙查询
        return query;
    }

    /**
     * 通过用户ID查询 我发的和发给我的  消息列表
     *
     * @param userId 用户ID
     * @return
     */
    public List<Map> queryConversationList(String userId) {
        Aggregation aggregation1 = Aggregation.newAggregation(
                Aggregation.match(Criteria.where("receiverId").is(userId)),
                Aggregation.group("senderId")
        );
        AggregationResults<Map> receive_message = mongoTemplate.aggregate(aggregation1, collectionname, Map.class);
        List<Map> mappedResults1 = receive_message.getMappedResults();

        Aggregation aggregation2 = Aggregation.newAggregation(
                Aggregation.match(Criteria.where("senderId").is(userId)),
                Aggregation.group("receiverId")
        );
        AggregationResults<Map> send_message = mongoTemplate.aggregate(aggregation2, collectionname, Map.class);
        List<Map> mappedResults2 = send_message.getMappedResults();

        Set<Map> set = new HashSet<>();
        for (Map map : mappedResults1) {
            set.add(map);
        }
        for (Map map : mappedResults2) {
            set.add(map);
        }
        return new ArrayList<>(set);
    }


    /**
     * 查询两人之间的最新的消息(会话列表)
     *
     * @param senderId
     * @param receiverId
     * @return
     */
    public List<ChatMessage> queryLatestNews(String senderId, String receiverId) {
        Query query = twoQuery(senderId, receiverId);
        query.addCriteria(Criteria.where("messageStatus").is("0"));
        List<ChatMessage> messageList = mongoTemplate.find(query, ChatMessage.class, collectionname);
        if (messageList != null && messageList.size() > 0) { //说明有未读消息数
            return messageList;
        } else {//没有未读消息数只查询一条
            Query query1 = twoQuery(senderId,receiverId);
            query1.limit(1);
            List<ChatMessage> messages = mongoTemplate.find(query1, ChatMessage.class, collectionname);
            return messages;
        }
    }

    //messageStatus: 0:服务器接收到消息， 1：服务器发送消息成功
    public void updateMessageStatus(String messageId, String messageStatus) {
        Query query = new Query();
        Criteria criteria = new Criteria();
        query.addCriteria(criteria.andOperator(Criteria.where("messageId").is(messageId)));
        mongoTemplate.updateFirst(query, new Update().set("messageStatus", messageStatus), collectionname);
    }

    //批量修改消息的状态
    public void updateAllMessageStatus(String senderId, String receiverId, String messageStatus) {
        Query query = new Query();
        Criteria criteria = new Criteria();
        query.addCriteria(criteria.andOperator(Criteria.where("senderId").is(senderId), Criteria.where("receiverId").is(receiverId)));
        mongoTemplate.updateMulti(query, new Update().set("messageStatus", messageStatus), collectionname);
    }

    //设置我和他之间的消息状态为已读  (我发出的消息是对方的未读消息数,只设置对方发给我的消息状态)
    public void updateAllMessageStatus(String userId, String receiverId) {
        Query query = new Query();
        Criteria criteria = new Criteria();
        query.addCriteria(criteria.andOperator(Criteria.where("senderId").is(receiverId), Criteria.where("receiverId").is(userId)));
        mongoTemplate.updateMulti(query, new Update().set("messageStatus", "1"), collectionname);
    }

}
