package com.model.course;

import java.io.Serializable;

/**
 * @author: yaofeng
 * @create:2019-03-14-14:30
 **/
public class Audio implements Serializable {
    private String id =null;
    private String audioName = null;
    private String ownerId = null;
    private String userId = null;
    private String audioPath = null;
    private String audioImage = null;
    private String audioDesc = null;
    private int sellType = -1;
    private double goodPrise =0.00;
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

    public String getAudioName() {
        return audioName;
    }

    public void setAudioName(String audioName) {
        this.audioName = audioName;
    }

    public String getAudioPath() {
        return audioPath;
    }

    public void setAudioPath(String audioPath) {
        this.audioPath = audioPath;
    }

    public String getAudioImage() {
        return audioImage;
    }

    public void setAudioImage(String audioImage) {
        this.audioImage = audioImage;
    }

    public String getAudioDesc() {
        return audioDesc;
    }

    public void setAudioDesc(String audioDesc) {
        this.audioDesc = audioDesc;
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

    public String getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(String ownerId) {
        this.ownerId = ownerId;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
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
