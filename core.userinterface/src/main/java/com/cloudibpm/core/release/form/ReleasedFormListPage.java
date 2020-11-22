/**
 * Wangk
 */
package com.cloudibpm.core.release.form;

import com.cloudibpm.core.Page;

/**
 * 
 * @author xq00008
 *
 */

public class ReleasedFormListPage extends Page {

	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = -7919419227296339903L;
	private ReleasedForm[] pageEntities = new ReleasedForm[0];
	
	/**
	 * 
	 */
	
	public ReleasedFormListPage(){
		
	}
	
	/**
	 * 
	 * @param pageNo
	 * @param pageSize
	 */
	
	public ReleasedFormListPage(int pageNo, int pageSize) {
		super(pageNo, pageSize);
	}

	public ReleasedForm[] getPageEntities() {
		return pageEntities;
	}

	public void setPageEntities(ReleasedForm[] pageEntities) {
		this.pageEntities = pageEntities;
	}
	

}
