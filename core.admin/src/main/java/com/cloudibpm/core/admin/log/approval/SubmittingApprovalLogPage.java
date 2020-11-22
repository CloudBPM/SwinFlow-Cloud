/**
 * 
 */
package com.cloudibpm.core.admin.log.approval;

import com.cloudibpm.core.Page;

/**
 * @author Dahai Cao created at 22:03 on 2018-10-17
 *
 */
public class SubmittingApprovalLogPage extends Page {
	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = 8890687785899175786L;

	private SubmittingApprovalLog[] pageEntities = new SubmittingApprovalLog[0];

	/**
	 * 
	 */
	public SubmittingApprovalLogPage() {
	}

	/**
	 * @param pageNo
	 * @param pageSize
	 */
	public SubmittingApprovalLogPage(int pageNo, int pageSize) {
		super(pageNo, pageSize);
	}

	/**
	 * @return the pageEntities
	 */
	public SubmittingApprovalLog[] getPageEntities() {
		return pageEntities;
	}

	/**
	 * @param pageEntities
	 *            the pageEntities to set
	 */
	public void setPageEntities(SubmittingApprovalLog[] pageEntities) {
		this.pageEntities = pageEntities;
	}

}
