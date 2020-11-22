/**
 * Wangk
 */
package com.cloudibpm.core.appservice;

import com.cloudibpm.core.Page;

public class WebAppServiceListPage extends Page{

	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = 7280624210301197846L;
	private WebAppService[] pageEntities = new WebAppService[0];
	
	/**
	 * 
	 */
	public WebAppServiceListPage(){
		
	}
	 /**
	  * 
	  * @param pageNo
	  * @param pageSize
	  */
	public WebAppServiceListPage(int pageNo, int pageSize){
		super(pageNo, pageSize);
	}
	
	public WebAppService[] getPageEntities() {
		return pageEntities;
	}
	public void setPageEntities(WebAppService[] pageEntities) {
		this.pageEntities = pageEntities;
	}

}
