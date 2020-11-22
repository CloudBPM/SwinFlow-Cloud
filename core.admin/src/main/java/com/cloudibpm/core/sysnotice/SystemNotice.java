/**
 * 
 */
package com.cloudibpm.core.sysnotice;

import com.cloudibpm.core.WorkflowEntity;

/**
 * @author Dahai Cao created 20:23 on 2018-10-11, last updated 8:45 on
 *         2018-10-13
 *
 */
public class SystemNotice extends WorkflowEntity {

	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = 583158908516403099L;
	// system notification content for PC application
	private String pcContent = null;
	// system notification content for Mobile application
	private String mobileContent = null;
	private String keywords = null;
	// publisher user ID (it is foreign key in user profile)
	private String publisherId = null;
	// publisher user full name
	private String publisher = null;
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

	/**
	 * 
	 */
	public SystemNotice() {
	}

	/**
	 * @param id
	 */
	public SystemNotice(String id) {
		super(id);
	}

	/**
	 * @return the pcContent
	 */
	public String getPcContent() {
		return pcContent;
	}

	/**
	 * @param pcContent
	 *            the pcContent to set
	 */
	public void setPcContent(String pcContent) {
		this.pcContent = pcContent;
	}

	/**
	 * @return the mobileContent
	 */
	public String getMobileContent() {
		return mobileContent;
	}

	/**
	 * @param mobileContent
	 *            the mobileContent to set
	 */
	public void setMobileContent(String mobileContent) {
		this.mobileContent = mobileContent;
	}

	/**
	 * @return the keywords
	 */
	public String getKeywords() {
		return keywords;
	}

	/**
	 * @param keywords
	 *            the keywords to set
	 */
	public void setKeywords(String keywords) {
		this.keywords = keywords;
	}

	/**
	 * @return the publisherId
	 */
	public String getPublisherId() {
		return publisherId;
	}

	/**
	 * @param publisherId
	 *            the publisherId to set
	 */
	public void setPublisherId(String publisherId) {
		this.publisherId = publisherId;
	}

	/**
	 * @return the publisher
	 */
	public String getPublisher() {
		return publisher;
	}

	/**
	 * @param publisher
	 *            the publisher to set
	 */
	public void setPublisher(String publisher) {
		this.publisher = publisher;
	}

	/**
	 * @return the liveStatus
	 */
	public int getLiveStatus() {
		return liveStatus;
	}

	/**
	 * @param liveStatus
	 *            the liveStatus to set
	 */
	public void setLiveStatus(int liveStatus) {
		this.liveStatus = liveStatus;
	}

	/**
	 * @return the createDatetime
	 */
	public long getCreateDatetime() {
		return createDatetime;
	}

	/**
	 * @param createDatetime
	 *            the createDatetime to set
	 */
	public void setCreateDatetime(long createDatetime) {
		this.createDatetime = createDatetime;
	}

	/**
	 * @return the lastupdate
	 */
	public long getLastupdate() {
		return lastupdate;
	}

	/**
	 * @param lastupdate
	 *            the lastupdate to set
	 */
	public void setLastupdate(long lastupdate) {
		this.lastupdate = lastupdate;
	}

	/**
	 * @return the organizationName
	 */
	public String getOrganizationName() {
		return organizationName;
	}

	/**
	 * @param organizationName
	 *            the organizationName to set
	 */
	public void setOrganizationName(String organizationName) {
		this.organizationName = organizationName;
	}

	/**
	 * @return the banned
	 */
	public int getBanned() {
		return banned;
	}

	/**
	 * @param banned
	 *            the banned to set
	 */
	public void setBanned(int banned) {
		this.banned = banned;
	}

	/**
	 * @return the banStartTime
	 */
	public long getBanStartTime() {
		return banStartTime;
	}

	/**
	 * @param banStartTime
	 *            the banStartTime to set
	 */
	public void setBanStartTime(long banStartTime) {
		this.banStartTime = banStartTime;
	}

	/**
	 * @return the banEndTime
	 */
	public long getBanEndTime() {
		return banEndTime;
	}

	/**
	 * @param banEndTime
	 *            the banEndTime to set
	 */
	public void setBanEndTime(long banEndTime) {
		this.banEndTime = banEndTime;
	}

	/**
	 * @return the level
	 */
	public int getLevel() {
		return level;
	}

	/**
	 * @param level
	 *            the level to set
	 */
	public void setLevel(int level) {
		this.level = level;
	}

}
