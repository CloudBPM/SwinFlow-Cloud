/**
 * 
 */
package com.cloudibpm.core.admin.news;

import com.cloudibpm.core.Page;

/**
 * 
 *
 */
public class NewsListPage extends Page {

	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = 4377610937616750385L;
	private News[] pageEntities = new News[0];

	/**
	 * 
	 */
	public NewsListPage() {
	}

	/**
	 * @param pageNo
	 * @param pageSize
	 */
	public NewsListPage(int pageNo, int pageSize) {
		super(pageNo, pageSize);
	}

	public News[] getPageEntities() {
		return pageEntities;
	}

	public void setPageEntities(News[] pageEntities) {
		this.pageEntities = pageEntities;
	}

}
