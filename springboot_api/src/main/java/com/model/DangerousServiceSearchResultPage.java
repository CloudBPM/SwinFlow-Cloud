package com.model;

import com.cloudibpm.core.Page;

public class DangerousServiceSearchResultPage extends Page {

	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = -7081463393189264137L;
	private DangerousServiceSearchResult[] pageEntities = new DangerousServiceSearchResult[0];

	public DangerousServiceSearchResultPage() {
	}

	public DangerousServiceSearchResultPage(int pageNo, int pageSize) {
		super(pageNo, pageSize);
	}

	/**
	 * @return the pageEntities
	 */
	public DangerousServiceSearchResult[] getPageEntities() {
		return pageEntities;
	}

	/**
	 * @param pageEntities
	 *            the pageEntities to set
	 */
	public void setPageEntities(DangerousServiceSearchResult[] pageEntities) {
		this.pageEntities = pageEntities;
	}

}
