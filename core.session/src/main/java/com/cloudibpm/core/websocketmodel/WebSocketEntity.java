package com.cloudibpm.core.websocketmodel;

import com.cloudibpm.core.user.User;

import javax.websocket.Session;


public class WebSocketEntity {

    private String userId;//用户id
    private Session session;
    private String memberName;//用户姓名
    private long timeStr;//记录下次发送时间的时间戳
    private boolean isHeart=false;//是否收到了心跳
    private String type;

    public WebSocketEntity(User user, Session session,String type){
        this.userId=user.getId();
        this.session=session;
        this.memberName=user.getFullName();
        this.type = type;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public Session getSession() {
        return session;
    }

    public void setSession(Session session) {
        this.session = session;
    }

    public String getMemberName() {
        return memberName;
    }

    public void setMemberName(String memberName) {
        this.memberName = memberName;
    }

    public long getTimeStr() {
        return timeStr;
    }

    public void setTimeStr(long timeStr) {
        this.timeStr = timeStr;
    }

    public boolean isHeart() {
        return isHeart;
    }

    public void setHeart(boolean heart) {
        isHeart = heart;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    @Override
    public int hashCode() {
        return this.userId.length();
    }

    @Override
    public boolean equals(Object obj) {
        if(!(obj instanceof WebSocketEntity)){
            return false;
        }
        if(obj==this){
            return true;
        }
        return this.userId.equals(((WebSocketEntity)obj).userId);
    }
}

