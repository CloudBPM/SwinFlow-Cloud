package com.xq.myxuanqi.model.contact;

import org.litepal.crud.LitePalSupport;

import java.io.Serializable;

public class ContactMessage extends LitePalSupport implements Serializable, Comparable<ContactMessage> {

    public static String MESSAGE_PHOTO = "0";  //图片信息
    public static String MESSAGE_TEXT = "1"; //文本信息
    public static String MESSAGE_AUDIO = "2";  //语音信息
    public static String MESSAGE_VIDEO = "3";  //视频信息
    public static String MESSAGE_File = "4";  //视频信息
    //聊天的信息
    private String messageId = "";//消息ID
    private String message = "";  //消息正文
    private String senderId = ""; //发送者的id
    private String senderAvatarUrl = "";  //发送者头像url
    private String senderName = "";  //发送者姓名
    private String receiverId = "";  //接受者的id
    private String receiverAvatarUrl = "";  //接受者的头像url
    private String receiverName = "";  //接受者的姓名
    private long sendTime = 0;  //消息的发送时间
    private long checkTime = 0; //消息的重发时间
    private long receiveTime = 0; //消息的接收时间
    private String messageStatus; // 消息状态  0 服务器端收到, 1 消息已被接收人接收
    private String messageType;//  消息类型  0 图片 ,1 文本， 2 语音

    private boolean read = true;  //本地记录信息是否已经阅读，默认为已读
    private int toReadCount = 0;  //未读信息的数量

    public ContactMessage() {

    }

    public ContactMessage(String senderId, String senderName, String receiverId, String receiverName, String message, String messageType) {
        this.senderId = senderId;
        this.senderName = senderName;
        this.receiverId = receiverId;
        this.receiverName = receiverName;
        this.message = message;
        this.messageType = messageType;
        this.sendTime = System.currentTimeMillis();
    }

    public String getMessageId() {
        return messageId;
    }

    public void setMessageId(String messageId) {
        this.messageId = messageId;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getSenderId() {
        return senderId;
    }

    public void setSenderId(String senderId) {
        this.senderId = senderId;
    }

    public String getSenderAvatarUrl() {
        return senderAvatarUrl;
    }

    public void setSenderAvatarUrl(String senderAvatarUrl) {
        this.senderAvatarUrl = senderAvatarUrl;
    }

    public String getSenderName() {
        return senderName;
    }

    public void setSenderName(String senderName) {
        this.senderName = senderName;
    }

    public String getReceiverId() {
        return receiverId;
    }

    public void setReceiverId(String receiverId) {
        this.receiverId = receiverId;
    }

    public String getReceiverAvatarUrl() {
        return receiverAvatarUrl;
    }

    public void setReceiverAvatarUrl(String receiverAvatarUrl) {
        this.receiverAvatarUrl = receiverAvatarUrl;
    }

    public String getReceiverName() {
        return receiverName;
    }

    public void setReceiverName(String receiverName) {
        this.receiverName = receiverName;
    }

    public long getSendTime() {
        return sendTime;
    }

    public void setSendTime(long sendTime) {
        this.sendTime = sendTime;
    }

    public long getCheckTime() {
        return checkTime;
    }

    public void setCheckTime(long checkTime) {
        this.checkTime = checkTime;
    }

    public long getReceiveTime() {
        return receiveTime;
    }

    public void setReceiveTime(long receiveTime) {
        this.receiveTime = receiveTime;
    }

    public String getMessageStatus() {
        return messageStatus;
    }

    public void setMessageStatus(String messageStatus) {
        this.messageStatus = messageStatus;
    }

    public String getMessageType() {
        return messageType;
    }

    public void setMessageType(String messageType) {
        this.messageType = messageType;
    }

    public boolean isRead() {
        return read;
    }

    public void setRead(boolean read) {
        this.read = read;
    }

    public int getToReadCount() {
        return toReadCount;
    }

    public void setToReadCount(int toReadCount) {
        this.toReadCount = toReadCount;
    }

    @Override
    public int compareTo(ContactMessage o) {
        return (int) -(this.sendTime - o.sendTime);
    }
}
