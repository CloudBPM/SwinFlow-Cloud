/**
 * 
 */
package com.cloudibpm.core.solr;

import com.cloudibpm.core.Page;

/**
 * @author dev
 *
 */
public class AppServiceSearchResultPage extends Page {

	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = -7806664058765783653L;
	private AppServiceSearchResult[] pageEntities = new AppServiceSearchResult[0];

	/**
	 * 
	 */
	public AppServiceSearchResultPage() {
	}

	/**
	 * @param pageNo
	 * @param pageSize
	 */
	public AppServiceSearchResultPage(int pageNo, int pageSize) {
		super(pageNo, pageSize);
	}

	/**
	 * @return the pageEntities
	 */
	public AppServiceSearchResult[] getPageEntities() {
		return pageEntities;
	}

	/**
	 * @param pageEntities
	 *            the pageEntities to set
	 */
	public void setPageEntities(AppServiceSearchResult[] pageEntities) {
		this.pageEntities = pageEntities;
	}

}
