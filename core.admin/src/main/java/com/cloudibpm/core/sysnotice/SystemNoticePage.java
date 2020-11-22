/**
 * 
 */
package com.cloudibpm.core.sysnotice;

import com.cloudibpm.core.Page;

/**
 * @author Dahai Cao created at 22:03 on 2018-10-11
 *
 */
public class SystemNoticePage extends Page {
	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = 6509713859845998993L;
	private SystemNotice[] pageEntities = new SystemNotice[0];

	/**
	 * 
	 */
	public SystemNoticePage() {
	}

	/**
	 * @param pageNo
	 * @param pageSize
	 */
	public SystemNoticePage(int pageNo, int pageSize) {
		super(pageNo, pageSize);
	}

	/**
	 * @return the pageEntities
	 */
	public SystemNotice[] getPageEntities() {
		return pageEntities;
	}

	/**
	 * @param pageEntities
	 *            the pageEntities to set
	 */
	public void setPageEntities(SystemNotice[] pageEntities) {
		this.pageEntities = pageEntities;
	}

}
