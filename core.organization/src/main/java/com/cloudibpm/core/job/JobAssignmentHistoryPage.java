/**
 * 
 */
package com.cloudibpm.core.job;

import com.cloudibpm.core.Page;

/**
 * @author dev
 *
 */
public class JobAssignmentHistoryPage extends Page {

	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = -7326890321737434577L;
	private JobAssignmentHistory[] pageEntities = new JobAssignmentHistory[0];

	/**
	 * 
	 */
	public JobAssignmentHistoryPage() {
	}

	/**
	 * @param pageNo
	 * @param pageSize
	 */
	public JobAssignmentHistoryPage(int pageNo, int pageSize) {
		super(pageNo, pageSize);
	}

	public JobAssignmentHistory[] getPageEntities() {
		return pageEntities;
	}

	public void setPageEntities(JobAssignmentHistory[] pageEntities) {
		this.pageEntities = pageEntities;
	}

}
