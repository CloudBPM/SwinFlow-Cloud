package com.cloudibpm.core.runtime.admin;

import com.cloudibpm.core.Page;

public class AdminSearchResultPage extends Page {

	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = -5621246672933960742L;
	private AdminSearchResult[] pageEntities = new AdminSearchResult[0];

	public AdminSearchResultPage() {
	}

	public AdminSearchResultPage(int pageNo, int pageSize) {
		super(pageNo, pageSize);
	}

	/**
	 * @return the pageEntities
	 */
	public AdminSearchResult[] getPageEntities() {
		return pageEntities;
	}

	/**
	 * @param pageEntities
	 *            the pageEntities to set
	 */
	public void setPageEntities(AdminSearchResult[] pageEntities) {
		this.pageEntities = pageEntities;
	}
}