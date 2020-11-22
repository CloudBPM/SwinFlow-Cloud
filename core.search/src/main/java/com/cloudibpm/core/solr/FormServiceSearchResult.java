/**
 * 
 */
package com.cloudibpm.core.solr;

import java.io.Serializable;

/**
 * This class is used to represent the process search result.
 * 
 * @author Dahai Cao created on 2017-01-24, last updated at 19:11 on 2019-04-17
 *
 */
public class FormServiceSearchResult implements Serializable {

	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = -651611689063099428L;
	private long spendTime = 0;
	private String id = null;
	private String frmName = null;
	private String frmUrl = null;
	private int frmType;
	private String keywords = null;
	private String description = null;
	private String authorId = null;
	private String author = null;
	private double purchasePrice = 0.0d;
	private double usagePrice = 0.0d;
	private long createDateTime = 0;
	private long lastupdate = 0;
	private String orgId = null;
	private String orgName = null;
	private String orgUrl = null;
	private String version = null;
	private String releaserId = null;
	private String releaser = null;
	private String releaseStatement = null;
	private long releaseDate = 0;
	private int deprecated = 0;
	private long likeCounting = 0;
	private long totalUseCounting = 0;
	private long successCounting = 0;
	private int accessLevel = 0;
	private int serviceType = 0;
	private int trailPeriod = 0;

	/**
	 * 
	 */
	public FormServiceSearchResult() {
	}

	/**
	 * @return the frmName
	 */
	public String getFrmName() {
		return frmName;
	}

	/**
	 * @param frmName
	 *            the frmName to set
	 */
	public void setFrmName(String frmName) {
		this.frmName = frmName;
	}

	/**
	 * @return the frmUrl
	 */
	public String getFrmUrl() {
		return frmUrl;
	}

	/**
	 * @param frmUrl the frmUrl to set
	 */
	public void setFrmUrl(String frmUrl) {
		this.frmUrl = frmUrl;
	}

	/**
	 * @return the frmType
	 */
	public int getFrmType() {
		return frmType;
	}

	/**
	 * @param frmType the frmType to set
	 */
	public void setFrmType(int frmType) {
		this.frmType = frmType;
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
	 * @return the description
	 */
	public String getDescription() {
		return description;
	}

	/**
	 * @param description
	 *            the description to set
	 */
	public void setDescription(String description) {
		this.description = description;
	}

	/**
	 * @return the author
	 */
	public String getAuthor() {
		return author;
	}

	/**
	 * @param author
	 *            the author to set
	 */
	public void setAuthor(String author) {
		this.author = author;
	}

	/**
	 * @return the purchasePrice
	 */
	public double getPurchasePrice() {
		return purchasePrice;
	}

	/**
	 * @param purchasePrice
	 *            the purchasePrice to set
	 */
	public void setPurchasePrice(double purchasePrice) {
		this.purchasePrice = purchasePrice;
	}

	/**
	 * @return the usagePrice
	 */
	public double getUsagePrice() {
		return usagePrice;
	}

	/**
	 * @param usagePrice
	 *            the usagePrice to set
	 */
	public void setUsagePrice(double usagePrice) {
		this.usagePrice = usagePrice;
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
	 * @return the version
	 */
	public String getVersion() {
		return version;
	}

	/**
	 * @param version
	 *            the version to set
	 */
	public void setVersion(String version) {
		this.version = version;
	}

	/**
	 * @return the releaser
	 */
	public String getReleaser() {
		return releaser;
	}

	/**
	 * @param releaser
	 *            the releaser to set
	 */
	public void setReleaser(String releaser) {
		this.releaser = releaser;
	}

	/**
	 * @return the releaseStatement
	 */
	public String getReleaseStatement() {
		return releaseStatement;
	}

	/**
	 * @param releaseStatement
	 *            the releaseStatement to set
	 */
	public void setReleaseStatement(String releaseStatement) {
		this.releaseStatement = releaseStatement;
	}

	/**
	 * @return the releaseDate
	 */
	public long getReleaseDate() {
		return releaseDate;
	}

	/**
	 * @param releaseDate
	 *            the releaseDate to set
	 */
	public void setReleaseDate(long releaseDate) {
		this.releaseDate = releaseDate;
	}

	/**
	 * @return the deprecated
	 */
	public int getDeprecated() {
		return deprecated;
	}

	/**
	 * @param deprecated
	 *            the deprecated to set
	 */
	public void setDeprecated(int deprecated) {
		this.deprecated = deprecated;
	}

	/**
	 * @return the likeCounting
	 */
	public long getLikeCounting() {
		return likeCounting;
	}

	/**
	 * @param likeCounting
	 *            the likeCounting to set
	 */
	public void setLikeCounting(long likeCounting) {
		this.likeCounting = likeCounting;
	}

	/**
	 * @return the totalUseCounting
	 */
	public long getTotalUseCounting() {
		return totalUseCounting;
	}

	/**
	 * @param totalUseCounting
	 *            the totalUseCounting to set
	 */
	public void setTotalUseCounting(long totalUseCounting) {
		this.totalUseCounting = totalUseCounting;
	}

	/**
	 * @return the successCounting
	 */
	public long getSuccessCounting() {
		return successCounting;
	}

	/**
	 * @param successCounting
	 *            the successCounting to set
	 */
	public void setSuccessCounting(long successCounting) {
		this.successCounting = successCounting;
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

	public long getSpendTime() {
		return spendTime;
	}

	public void setSpendTime(long spendTime) {
		this.spendTime = spendTime;
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
