/**
 * 
 */
package com.cloudibpm.core.appservice;

import com.cloudibpm.core.Page;

/**
 * @author dev
 *
 */
public class AppServiceAccessControlPage extends Page {

	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = 1982042921301161715L;
	private AppServiceAccessControl[] pageEntities = new AppServiceAccessControl[0];

	/**
	 * 
	 */
	public AppServiceAccessControlPage() {
	}

	/**
	 * @param pageNo
	 * @param pageSize
	 */
	public AppServiceAccessControlPage(int pageNo, int pageSize) {
		super(pageNo, pageSize);
	}

	/**
	 * @return the pageEntities
	 */
	public AppServiceAccessControl[] getPageEntities() {
		return pageEntities;
	}

	/**
	 * @param pageEntities
	 *            the pageEntities to set
	 */
	public void setPageEntities(AppServiceAccessControl[] pageEntities) {
		this.pageEntities = pageEntities;
	}

}
