/**
 * 
 */

package com.cloudibpm.core.buildtime.wfprocess;

import com.cloudibpm.core.Page;

/**
 * 
 * @author xq00008
 *
 */
public class WfProcessListPage extends Page {

	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = 1435400503595044221L;
	private WfProcess[] pageEntities = new WfProcess[0];
	
	/**
	 * 
	 */	
	
	public WfProcessListPage(){
		
	}
	/**
	 * 
	 * @param pageNo
	 * @param pageSize
	 */
	public WfProcessListPage(int pageNo, int pageSize){
		super(pageNo,pageSize);
	}
	public WfProcess[] getPageEntities() {
		return pageEntities;
	}
	public void setPageEntities(WfProcess[] pageEntities) {
		this.pageEntities = pageEntities;
	}
	
}
