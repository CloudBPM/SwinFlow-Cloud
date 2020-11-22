package com.xq.myxuanqi.model.video;

import java.io.Serializable;

public class VideoInformation implements Serializable {

    private String id = null;
    private String userId = null;  //用户id
    private String ownerId = null;  //公司的id
    private String videoName = null;  //视频名称
    private String videoPath = null;  //视频地址
    private String imagePath = null;  //封面地址
    private String patchPath = null;  //视频贴片
    private String videoDesc = null;  //视频描述
    private int sellType = 0;   //售卖方式，付费免费
    private double goodPrise = 0.00;  //价格
    private double discountPrise = 0.00;  //折扣价格
    private long createTime = -1;  //创建时间
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

    public String getVideoName() {
        return videoName;
    }

    public void setVideoName(String videoName) {
        this.videoName = videoName;
    }

    public String getVideoPath() {
        return videoPath;
    }

    public void setVideoPath(String videoPath) {
        this.videoPath = videoPath;
    }

    public String getImagePath() {
        return imagePath;
    }

    public void setImagePath(String imagePath) {
        this.imagePath = imagePath;
    }

    public String getPatchPath() {
        return patchPath;
    }

    public void setPatchPath(String patchPath) {
        this.patchPath = patchPath;
    }

    public String getVideoDesc() {
        return videoDesc;
    }

    public void setVideoDesc(String videoDesc) {
        this.videoDesc = videoDesc;
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
