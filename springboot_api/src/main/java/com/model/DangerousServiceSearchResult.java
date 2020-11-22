/**
 * 
 */
package com.model;

import java.io.Serializable;
import java.util.Date;

/**
 * This class is used to represent the process search result.
 * 
 * @author Dahai Cao created on 2017-01-24
 *
 */
public class DangerousServiceSearchResult implements Serializable {

	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = -651611689063099428L;
	private String id = null;
	private String dangerName = null;
	private String dangerUrl = null;
	private String dangerAlias = null;
	private String description = null;
	private String dangerEname = null;
	private String dangerType = null;
	private String dangerFormula = null;
	private String code = null;
	private String remarks = null;
	private String industryName = null;
	private String industryContent = null;
	private String industryOwner = null;
	private String industryUser = null;
	private String industryType = null;
	private String industryStatus = null;
	private String disposalMethod = null;
	private long recordingTime = 0;
	private long lastupdate = 0;
	private String version = null;
	private String releaser = null;
	private String releaseStatement = null;
	private Date releaseDate = null;
	private int deprecated = 0;
	private int likeCounting = 0;
	private int totalUseCounting = 0;
	private int successCounting = 0;
	private int terminationCounting = 0;
	private int suspensionCounting = 0;

	/**
	 * 
	 */
	public DangerousServiceSearchResult() {
	}
	public String getIndustryName() {
		return industryName;
	}
	public void setIndustryName(String industryName) {
		this.industryName = industryName;
	}
	
	public String getIndustryContent() {
		return industryContent;
	}
	public void setIndustryContent(String industryContent) {
		this.industryContent = industryContent;
	}
	
	public String getIndustryOwner() {
		return industryOwner;
	}
	public void setIndustryOwner(String industryOwner) {
		this.industryOwner = industryOwner;
	}
	
	public String getIndustryUser() {
		return industryUser;
	}
	public void setIndustryUser(String industryUser) {
		this.industryUser = industryUser;
	}
	
	public String getIndustryType() {
		return industryType;
	}
	public void setIndustryType(String industryType) {
		this.industryType = industryType;
	}
	
	public String getIndustryStatus() {
		return industryStatus;
	}
	public void setIndustryStatus(String industryStatus) {
		this.industryStatus = industryStatus;
	}
	
	public String getDangerName() {
		return dangerName;
	}
	public void setDangerName(String dangerName) {
		this.dangerName = dangerName;
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

	public String getDangerUrl() {
		return dangerUrl;
	}

	public void setDangerUrl(String dangerUrl) {
		this.dangerUrl = dangerUrl;
	}
	public String getDangerAlias() {
		return dangerAlias;
	}

	public void setDangerAlias(String dangerAlias) {
		this.dangerAlias = dangerAlias;
	}
	public String getDangerEname() {
		return dangerEname;
	}

	public void setDangerEname(String dangerEname) {
		this.dangerEname = dangerEname;
	}

	/**
	 * @return 
	 * @return the procType
	 */
	public String getDangerType() {
		return dangerType;
	}

	/**
	 * @param procType
	 *            the procType to set
	 */
	public void setDangerType(String dangerType) {
		this.dangerType = dangerType;
	}

	/**
	 * @return the keywords
	 */
	public String getDangerFormula() {
		return dangerFormula;
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
	 * @param keywords
	 *            the keywords to set
	 */
	public void setDangerFormula(String dangerFormula) {
		this.dangerFormula = dangerFormula;
	}
	public String getCode() {
		return code;
	}
	public void setCode(String code) {
		this.code = code;
	}
	
	public String getRemarks() {
		return remarks;
	}
	public void setRemarks(String remarks) {
		this.remarks = remarks;
	}
	public String getDisposalMethod() {
		return disposalMethod;
	}
	public void setDisposalMethod(String disposalMethod) {
		this.disposalMethod = disposalMethod;
	}
	/**
	 * @return the createDateTime
	 */
	public long getRecordingTime() {
		return recordingTime;
	}

	/**
	 * @param createDateTime
	 *            the createDateTime to set
	 */
	public void setRecordingTime(long recordingTime) {
		this.recordingTime = recordingTime;
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
	public Date getReleaseDate() {
		return releaseDate;
	}

	/**
	 * @param releaseDate
	 *            the releaseDate to set
	 */
	public void setReleaseDate(Date releaseDate) {
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


}
