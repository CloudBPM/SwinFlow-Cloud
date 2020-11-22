package com.xq.myxuanqi.bean;

/**
 * Created by wm on 2019/1/10.
 */

public class AppUpdate {

    /**
     * pkVersionId : tt
     * appName : xuanqi.apk
     * versionCode : 1
     * versionName : 1.1
     * updateContent : sad
     * online : 1
     * important : 1
     * updateTime : 2019-01-08T08:27:26.000+0000
     */

    private String pkVersionId;
    private String appName;
    private int    versionCode;
    private String versionName;
    private String updateContent;
    private int    online;
    private int    important;
    private String updateTime;

    public String getPkVersionId() {
        return pkVersionId;
    }

    public void setPkVersionId(String pkVersionId) {
        this.pkVersionId = pkVersionId;
    }

    public String getAppName() {
        return appName;
    }

    public void setAppName(String appName) {
        this.appName = appName;
    }

    public int getVersionCode() {
        return versionCode;
    }

    public void setVersionCode(int versionCode) {
        this.versionCode = versionCode;
    }

    public String getVersionName() {
        return versionName;
    }

    public void setVersionName(String versionName) {
        this.versionName = versionName;
    }

    public String getUpdateContent() {
        return updateContent;
    }

    public void setUpdateContent(String updateContent) {
        this.updateContent = updateContent;
    }

    public int getOnline() {
        return online;
    }

    public void setOnline(int online) {
        this.online = online;
    }

    public int getImportant() {
        return important;
    }

    public void setImportant(int important) {
        this.important = important;
    }

    public String getUpdateTime() {
        return updateTime;
    }

    public void setUpdateTime(String updateTime) {
        this.updateTime = updateTime;
    }
}
