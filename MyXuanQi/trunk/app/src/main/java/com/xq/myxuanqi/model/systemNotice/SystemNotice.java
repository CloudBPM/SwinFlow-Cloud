package com.xq.myxuanqi.model.systemNotice;

import com.google.gson.annotations.SerializedName;

import org.litepal.crud.LitePalSupport;

public class SystemNotice extends LitePalSupport {

    @SerializedName("id")
    private String systemNoticeId = "";
    private String name = "";
    private String owner = "";
    private String currOwner = "";

    // system notification content for PC application
    private String pcContent = "";
    // system notification content for Mobile application
    private String mobileContent = "";
    private String keywords = "";
    // publisher user ID (it is foreign key in user profile)
    private String publisherId = "";
    // publisher user full name
    private String publisher = "";
    // 0: not live; 1: live
    private int liveStatus = 0;
    private long createDatetime = 0;
    private long lastupdate = 0;
    private String organizationName = null;
    // 0: allow to use (not force exit or to allow to login);1: not allow use
    // (force exit or not ban to login)
    private int banned = 0;
    private long banStartTime = 0;
    private long banEndTime = 0;
    // 这个字段还没有被启用，是备用字段
    // system notice level
    private int level = 0;

    public String getSystemNoticeId() {
        return systemNoticeId;
    }

    public void setSystemNoticeId(String systemNoticeId) {
        this.systemNoticeId = systemNoticeId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getOwner() {
        return owner;
    }

    public void setOwner(String owner) {
        this.owner = owner;
    }

    public String getCurrOwner() {
        return currOwner;
    }

    public void setCurrOwner(String currOwner) {
        this.currOwner = currOwner;
    }

    public String getPcContent() {
        return pcContent;
    }

    public void setPcContent(String pcContent) {
        this.pcContent = pcContent;
    }

    public String getMobileContent() {
        return mobileContent;
    }

    public void setMobileContent(String mobileContent) {
        this.mobileContent = mobileContent;
    }

    public String getKeywords() {
        return keywords;
    }

    public void setKeywords(String keywords) {
        this.keywords = keywords;
    }

    public String getPublisherId() {
        return publisherId;
    }

    public void setPublisherId(String publisherId) {
        this.publisherId = publisherId;
    }

    public String getPublisher() {
        return publisher;
    }

    public void setPublisher(String publisher) {
        this.publisher = publisher;
    }

    public int getLiveStatus() {
        return liveStatus;
    }

    public void setLiveStatus(int liveStatus) {
        this.liveStatus = liveStatus;
    }

    public long getCreateDatetime() {
        return createDatetime;
    }

    public void setCreateDatetime(long createDatetime) {
        this.createDatetime = createDatetime;
    }

    public long getLastupdate() {
        return lastupdate;
    }

    public void setLastupdate(long lastupdate) {
        this.lastupdate = lastupdate;
    }

    public String getOrganizationName() {
        return organizationName;
    }

    public void setOrganizationName(String organizationName) {
        this.organizationName = organizationName;
    }

    public int getBanned() {
        return banned;
    }

    public void setBanned(int banned) {
        this.banned = banned;
    }

    public long getBanStartTime() {
        return banStartTime;
    }

    public void setBanStartTime(long banStartTime) {
        this.banStartTime = banStartTime;
    }

    public long getBanEndTime() {
        return banEndTime;
    }

    public void setBanEndTime(long banEndTime) {
        this.banEndTime = banEndTime;
    }

    public int getLevel() {
        return level;
    }

    public void setLevel(int level) {
        this.level = level;
    }
}
