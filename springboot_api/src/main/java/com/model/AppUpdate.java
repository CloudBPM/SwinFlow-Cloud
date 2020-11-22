package com.model;

public class AppUpdate {
	
	private String pkVersionId = "";  //主键id
	private String appName = "";   //app名称：xxx.apk
	private int versionCode = 1;   //版本号
	private String versionName = "";
	private String updateContent = "";  //更新内容
	private int online = 1;   //是否上架，0 ： 不上架， 1 ：上架
	private int important = 1;  //是否重要更新 0：不重要， 1：重要
	private long updateTime = 0L;  //更新时间
	
	
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
	public long getUpdateTime() {
		return updateTime;
	}
	public void setUpdateTime(long updateTime) {
		this.updateTime = updateTime;
	}
	
	

}
