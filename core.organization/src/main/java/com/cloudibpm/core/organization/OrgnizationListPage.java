/**
 * 
 */
package com.cloudibpm.core.organization;

import com.cloudibpm.core.Page;

/**
 * @author Dahai Cao created at 22:12 on 2018/07/03
 *
 */
public class OrgnizationListPage extends Page {

	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = -8294857050102132145L;
	private Organization[] pageEntities = new Organization[0];

	/**
	 * 
	 */
	public OrgnizationListPage() {
	}

	/**
	 * @param pageNo
	 * @param pageSize
	 */
	public OrgnizationListPage(int pageNo, int pageSize) {
		super(pageNo, pageSize);
	}

	public Organization[] getPageEntities() {
		return pageEntities;
	}

	public void setPageEntities(Organization[] pageEntities) {
		this.pageEntities = pageEntities;
	}

}
