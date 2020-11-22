/**
 * 
 */
package com.cloudibpm.core.solr;

import java.io.Serializable;

/**
 * This class is used to represent application service search results.
 * 
 * @author Dahai Cao created 2017-01-18, last updated at 19:12 on 2019-04-17
 *
 */
public class AppServiceSearchResult implements Serializable {

	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = -4990040487885551513L;
	private String id = null;
	private String appName = null;
	private String appUrl = null;
	private String appType = null;// business type
	private String keywords = null;
	private int accessType = 0;
	private String comments = null;
	private String authorId = null;
	private String author = null;
	private String password = "N";
	private double price = 0.0d;
	private long createDateTime = 0;
	private long lastupdate = 0;
	private double purchasePrice = 0.0d;
	private double usagePrice = 0.0d;
	private String orgId = null;
	private String orgName = null;
	private String orgUrl = null;
	private String version = null;
	private String releaserId = null;
	private String releaser = null;
	private String releaseStatement = null;
	private long releaseDate = 0;
	private long likeCounting = 0;
	private long totalUseCounting = 0;
	private long successCounting = 0;
	private int accessLevel = 0;
	private int serviceType = 0;
	private int trailPeriod = 0;
	private long spendTime = 0;
	private int status = 0;
	/**
	 * 
	 */
	public AppServiceSearchResult() {
	}

	/**
	 * @return the id
	 */
	public String getId() {
		return id;
	}

	/**
	 * @param id
	 *            the id to set
	 */
	public void setId(String id) {
		this.id = id;
	}

	/**
	 * @return the appName
	 */
	public String getAppName() {
		return appName;
	}

	/**
	 * @param appName
	 *            the appName to set
	 */
	public void setAppName(String appName) {
		this.appName = appName;
	}

	/**
	 * @return the appUrl
	 */
	public String getAppUrl() {
		return appUrl;
	}

	/**
	 * @param appUrl
	 *            the appUrl to set
	 */
	public void setAppUrl(String appUrl) {
		this.appUrl = appUrl;
	}

	/**
	 * @return the appType
	 */
	public String getAppType() {
		return appType;
	}

	/**
	 * @param appType
	 *            the appType to set
	 */
	public void setAppType(String appType) {
		this.appType = appType;
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
	 * @return the accessType
	 */
	public int getAccessType() {
		return accessType;
	}

	/**
	 * @param accessType
	 *            the accessType to set
	 */
	public void setAccessType(int accessType) {
		this.accessType = accessType;
	}

	/**
	 * @return the comments
	 */
	public String getComments() {
		return comments;
	}

	/**
	 * @param comments
	 *            the comments to set
	 */
	public void setComments(String comments) {
		this.comments = comments;
	}

	/**
	 * @return the password
	 */
	public String getPassword() {
		return password;
	}

	/**
	 * @param password
	 *            the password to set
	 */
	public void setPassword(String password) {
		this.password = password;
	}

	/**
	 * @return the price
	 */
	public double getPrice() {
		return price;
	}

	/**
	 * @param price
	 *            the price to set
	 */
	public void setPrice(double price) {
		this.price = price;
	}

	/**
	 * @return the createDateTime
	 */
	public long getCreateDateTime() {
		return createDateTime;
	}

	/**
	 * @param createDateTime
	 *            the createDateTime to set
	 */
	public void setCreateDateTime(long createDateTime) {
		this.createDateTime = createDateTime;
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
	 * @return the orgId
	 */
	public String getOrgId() {
		return orgId;
	}

	/**
	 * @param orgId
	 *            the orgId to set
	 */
	public void setOrgId(String orgId) {
		this.orgId = orgId;
	}

	/**
	 * @return the orgName
	 */
	public String getOrgName() {
		return orgName;
	}

	/**
	 * @param orgName
	 *            the orgName to set
	 */
	public void setOrgName(String orgName) {
		this.orgName = orgName;
	}

	/**
	 * @return the orgUrl
	 */
	public String getOrgUrl() {
		return orgUrl;
	}

	/**
	 * @param orgUrl
	 *            the orgUrl to set
	 */
	public void setOrgUrl(String orgUrl) {
		this.orgUrl = orgUrl;
	}

	public String getAuthor() {
		return author;
	}

	public void setAuthor(String author) {
		this.author = author;
	}

	public double getPurchasePrice() {
		return purchasePrice;
	}

	public void setPurchasePrice(double purchasePrice) {
		this.purchasePrice = purchasePrice;
	}

	public double getUsagePrice() {
		return usagePrice;
	}

	public void setUsagePrice(double usagePrice) {
		this.usagePrice = usagePrice;
	}

	public String getVersion() {
		return version;
	}

	public void setVersion(String version) {
		this.version = version;
	}

	public String getReleaser() {
		return releaser;
	}

	public void setReleaser(String releaser) {
		this.releaser = releaser;
	}

	public String getReleaseStatement() {
		return releaseStatement;
	}

	public void setReleaseStatement(String releaseStatement) {
		this.releaseStatement = releaseStatement;
	}

	public long getReleaseDate() {
		return releaseDate;
	}

	public void setReleaseDate(long releaseDate) {
		this.releaseDate = releaseDate;
	}

	public long getLikeCounting() {
		return likeCounting;
	}

	public void setLikeCounting(long likeCounting) {
		this.likeCounting = likeCounting;
	}

	public long getTotalUseCounting() {
		return totalUseCounting;
	}

	public void setTotalUseCounting(long totalUseCounting) {
		this.totalUseCounting = totalUseCounting;
	}

	public long getSuccessCounting() {
		return successCounting;
	}

	public void setSuccessCounting(long successCounting) {
		this.successCounting = successCounting;
	}

	public int getAccessLevel() {
		return accessLevel;
	}

	public void setAccessLevel(int accessLevel) {
		this.accessLevel = accessLevel;
	}

	public int getServiceType() {
		return serviceType;
	}

	public void setServiceType(int serviceType) {
		this.serviceType = serviceType;
	}

	public int getTrailPeriod() {
		return trailPeriod;
	}

	public void setTrailPeriod(int trailPeriod) {
		this.trailPeriod = trailPeriod;
	}

	public long getSpendTime() {
		return spendTime;
	}

	public void setSpendTime(long spendTime) {
		this.spendTime = spendTime;
	}

	public int getStatus() {
		return status;
	}

	public void setStatus(int status) {
		this.status = status;
	}

	public String getAuthorId() {
		return authorId;
	}

	public void setAuthorId(String authorId) {
		this.authorId = authorId;
	}

	public String getReleaserId() {
		return releaserId;
	}

	public void setReleaserId(String releaserId) {
		this.releaserId = releaserId;
	}
}
