/**
 * 
 */
package com.xq.myxuanqi.bean;

import java.io.Serializable;

/**
 * This class is used to represent the process search result.
 * 
 * @author Dahai Cao created on 2017-01-24
 *
 */
public class ProcessServiceSearchResult implements Serializable {

	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = -651611689063099428L;
	private String id = null;
	private String procName = null;
	private String procUrl = null;
	private int procType = 0;
	private int workflowType = 0;
	private String keywords = null;
	private int accessLevel = 0;
	private String description = null;
	private String author = null;
	private double purchasePrice = 0.0d;
	private double usagePrice = 0.0d;
	private long createDateTime = 0;
	private long lastupdate = 0;
	private String orgId = null;
	private String orgName = null;
	private String orgUrl = null;
	private String version = null;
	private String releaser = null;
	private String releaseStatement = null;
	private long releaseDate = 0;
	private int deprecated = 0;
	private int likeCounting = 0;
	private int totalUseCounting = 0;
	private int successCounting = 0;
	private int terminationCounting = 0;
	private int suspensionCounting = 0;
	private long spendTime = 0;

	/**
	 * 
	 */
	public ProcessServiceSearchResult() {
	}
	/**
	 * @return the spendTime
	 */
	public long getSpendTime() {
		return spendTime;
	}
	/**
	 * @param spendTime
	 *            the spendTime to set
	 */
	public void setSpendTime(long spendTime) {
		this.spendTime = spendTime;
	}
	/**
	 * @return the procName
	 */
	public String getProcName() {
		return procName;
	}

	/**
	 * @param procName
	 *            the procName to set
	 */
	public void setProcName(String procName) {
		this.procName = procName;
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
	 * @return the procUrl
	 */
	public String getProcUrl() {
		return procUrl;
	}

	/**
	 * @param procUrl
	 *            the procUrl to set
	 */
	public void setProcUrl(String procUrl) {
		this.procUrl = procUrl;
	}

	/**
	 * @return the procType
	 */
	public int getProcType() {
		return procType;
	}

	/**
	 * @param procType
	 *            the procType to set
	 */
	public void setProcType(int procType) {
		this.procType = procType;
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
	 * @return the accessLevel
	 */
	public int getAccessLevel() {
		return accessLevel;
	}

	/**
	 * @param accessLevel
	 *            the accessLevel to set
	 */
	public void setAccessLevel(int accessLevel) {
		this.accessLevel = accessLevel;
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
	public int getLikeCounting() {
		return likeCounting;
	}

	/**
	 * @param likeCounting
	 *            the likeCounting to set
	 */
	public void setLikeCounting(int likeCounting) {
		this.likeCounting = likeCounting;
	}

	/**
	 * @return the totalUseCounting
	 */
	public int getTotalUseCounting() {
		return totalUseCounting;
	}

	/**
	 * @param totalUseCounting
	 *            the totalUseCounting to set
	 */
	public void setTotalUseCounting(int totalUseCounting) {
		this.totalUseCounting = totalUseCounting;
	}

	/**
	 * @return the successCounting
	 */
	public int getSuccessCounting() {
		return successCounting;
	}

	/**
	 * @param successCounting
	 *            the successCounting to set
	 */
	public void setSuccessCounting(int successCounting) {
		this.successCounting = successCounting;
	}

	/**
	 * @return the terminationCounting
	 */
	public int getTerminationCounting() {
		return terminationCounting;
	}

	/**
	 * @param terminationCounting
	 *            the terminationCounting to set
	 */
	public void setTerminationCounting(int terminationCounting) {
		this.terminationCounting = terminationCounting;
	}

	/**
	 * @return the suspensionCounting
	 */
	public int getSuspensionCounting() {
		return suspensionCounting;
	}

	/**
	 * @param suspensionCounting
	 *            the suspensionCounting to set
	 */
	public void setSuspensionCounting(int suspensionCounting) {
		this.suspensionCounting = suspensionCounting;
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

	/**
	 * @return the workflowType
	 */
	public int getWorkflowType() {
		return workflowType;
	}

	/**
	 * @param workflowType
	 *            the workflowType to set
	 */
	public void setWorkflowType(int workflowType) {
		this.workflowType = workflowType;
	}

}
