package com.xq.myxuanqi.model;

/**
 * Created by wm on 2019/2/26.
 */

public class NewsModel extends BaseModel {
    private String title;   //新闻标题
    private String brief;   //简介
    private String titleImage;  //标题照片
    private String author;  //原作者
    private long lastUpdate;   //发布时间

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getBrief() {
        return brief;
    }

    public void setBrief(String brief) {
        this.brief = brief;
    }

    public String getTitleImage() {
        return titleImage;
    }

    public void setTitleImage(String titleImage) {
        this.titleImage = titleImage;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public long getLastUpdate() {
        return lastUpdate;
    }

    public void setLastUpdate(long lastUpdate) {
        this.lastUpdate = lastUpdate;
    }
}
