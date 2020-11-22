package com.cloudibpm.core.buildtime.release.wfprocess;

import com.cloudibpm.core.TreeNode;
import com.cloudibpm.core.WorkflowEntity;
import com.cloudibpm.core.buildtime.wfprocess.WfProcess;
import com.cloudibpm.core.folder.Folder;

/**
 * @author Dahai Cao created on 2016-11-03
 */
public class ReleasedWfProcess extends WfProcess {

	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = 8674308322741914975L;
	// this version is used to describe the business version of an application process
	private String version = null;
	private String releaserId = null;
	private String releaser = null;
	private String releaseStatement = null;
	private long releaseDate = 0;
	// 1:deprecated(not use any more);0:still use
	private int deprecated = 1;
	// 0: no trial;
	// 1: 1 month trial;
	// 2: 3 months;
	// 3: 6 months;
	// 4: 9 months;
	// 5: 12 months;
	private int trialPeriod = 0;

	private long likeCounting = 0;
	private long totalDownloading = 0;
	private long totalUseCounting = 0;
	private long successCounting = 0;
	private long terminationCounting = 0;
	private long suspensionCounting = 0;

	/**
	 * Constructor
	 */
	public ReleasedWfProcess() {
		super();
	}

	/**
	 * Constructor
	 * 
	 * @param id
	 */
	public ReleasedWfProcess(String id) {
		this();
		setId(id);
		setName("");
	}

	public int compareTo(TreeNode o) {
		if (o instanceof Folder) {
			return 1;
		} else {
			return this.getName().compareTo(((WorkflowEntity) o).getName());
		}
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

	public int getDeprecated() {
		return deprecated;
	}

	public void setDeprecated(int deprecated) {
		this.deprecated = deprecated;
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

	public long getTerminationCounting() {
		return terminationCounting;
	}

	public void setTerminationCounting(long terminationCounting) {
		this.terminationCounting = terminationCounting;
	}

	public long getSuspensionCounting() {
		return suspensionCounting;
	}

	public void setSuspensionCounting(long suspensionCounting) {
		this.suspensionCounting = suspensionCounting;
	}

	/**
	 * @return the trialPeriod
	 */
	public int getTrialPeriod() {
		return trialPeriod;
	}

	/**
	 * Trial period type. 0: no trial; 1: 1 month trial; 2: 3 months; 3: 6
	 * months; 4: 9 months; 5: 12 months;
	 * 
	 * @param trialPeriod
	 *            the trialPeriod to set
	 */
	public void setTrialPeriod(int trialPeriod) {
		this.trialPeriod = trialPeriod;
	}

	/**
	 * Totally download counting.
	 * 
	 * @return the totalDownloading
	 */
	public long getTotalDownloading() {
		return totalDownloading;
	}

	/**
	 * @param totalDownloading
	 *            the totalDownloading to set
	 */
	public void setTotalDownloading(long totalDownloading) {
		this.totalDownloading = totalDownloading;
	}


	public String getReleaserId() {
		return releaserId;
	}

	public void setReleaserId(String releaserId) {
		this.releaserId = releaserId;
	}

}