/**
 * 
 */
package com.cloudibpm.core.solr;

import com.cloudibpm.core.Page;

/**
 * @author dev
 *
 */
public class FormServiceSearchResultPage extends Page {

	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = -195819617818698959L;
	private FormServiceSearchResult[] pageEntities = new FormServiceSearchResult[0];

	/**
	 * 
	 */
	public FormServiceSearchResultPage() {
	}

	/**
	 * @param pageNo
	 * @param pageSize
	 */
	public FormServiceSearchResultPage(int pageNo, int pageSize) {
		super(pageNo, pageSize);
	}

	/**
	 * @return the pageEntities
	 */
	public FormServiceSearchResult[] getPageEntities() {
		return pageEntities;
	}

	/**
	 * @param pageEntities
	 *            the pageEntities to set
	 */
	public void setPageEntities(FormServiceSearchResult[] pageEntities) {
		this.pageEntities = pageEntities;
	}

}
