package com.cloudibpm.core.solr;

import com.cloudibpm.core.Page;

public class ProcessServiceSearchResultPage extends Page {

	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = -7081463393189264137L;
	private ProcessServiceSearchResult[] pageEntities = new ProcessServiceSearchResult[0];

	public ProcessServiceSearchResultPage() {
	}

	public ProcessServiceSearchResultPage(int pageNo, int pageSize) {
		super(pageNo, pageSize);
	}

	/**
	 * @return the pageEntities
	 */
	public ProcessServiceSearchResult[] getPageEntities() {
		return pageEntities;
	}

	/**
	 * @param pageEntities
	 *            the pageEntities to set
	 */
	public void setPageEntities(ProcessServiceSearchResult[] pageEntities) {
		this.pageEntities = pageEntities;
	}

}
