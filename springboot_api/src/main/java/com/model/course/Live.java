package com.model.course;

import java.io.Serializable;

/**
 * @author: yaofeng
 * @create:2019-03-16-10:06
 **/
public class Live implements Serializable {
    private String id = null;
    private String userId = null;
    private String ownerId = null;
    private String liveName = null;
    private String liveDesc = null;
    private String liveType = null;
    private long liveDate = -1;
    private String liveTime = null;//0、一小时，1、二小时，2、三小时
    private String liveImage = null;
    private String liveInfo = null;
    private int sellType = 0;
    private double goodPrise = 0.00;
    private double discountPrise = 0.00;
    private long createTime = -1;
    private int isPass = 1; //0、通过 1、未通过
    private int isSell = 1; //0、上架 1、下架

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(String ownerId) {
        this.ownerId = ownerId;
    }

    public String getLiveName() {
        return liveName;
    }

    public void setLiveName(String liveName) {
        this.liveName = liveName;
    }

    public String getLiveDesc() {
        return liveDesc;
    }

    public void setLiveDesc(String liveDesc) {
        this.liveDesc = liveDesc;
    }

    public String getLiveType() {
        return liveType;
    }

    public void setLiveType(String liveType) {
        this.liveType = liveType;
    }

    public long getLiveDate() {
        return liveDate;
    }

    public void setLiveDate(long liveDate) {
        this.liveDate = liveDate;
    }

    public String getLiveTime() {
        return liveTime;
    }

    public void setLiveTime(String liveTime) {
        this.liveTime = liveTime;
    }

    public String getLiveImage() {
        return liveImage;
    }

    public void setLiveImage(String liveImage) {
        this.liveImage = liveImage;
    }

    public String getLiveInfo() {
        return liveInfo;
    }

    public void setLiveInfo(String liveInfo) {
        this.liveInfo = liveInfo;
    }

    public int getSellType() {
        return sellType;
    }

    public void setSellType(int sellType) {
        this.sellType = sellType;
    }

    public double getGoodPrise() {
        return goodPrise;
    }

    public void setGoodPrise(double goodPrise) {
        this.goodPrise = goodPrise;
    }

    public double getDiscountPrise() {
        return discountPrise;
    }

    public void setDiscountPrise(double discountPrise) {
        this.discountPrise = discountPrise;
    }

    public long getCreateTime() {
        return createTime;
    }

    public void setCreateTime(long createTime) {
        this.createTime = createTime;
    }

    public int getIsPass() {
        return isPass;
    }

    public void setIsPass(int isPass) {
        this.isPass = isPass;
    }

    public int getIsSell() {
        return isSell;
    }

    public void setIsSell(int isSell) {
        this.isSell = isSell;
    }
}
