/**
 * @author Cao Dahai
 * @version 1.0.0 下午12:12:47
 */
package com.cloudibpm.core.user;

import com.cloudibpm.core.Page;

public class UserLoginHistoryPage extends Page {

	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = -1904169539287454955L;
	private UserLoginHistory[] pageEntities = new UserLoginHistory[0];

	/**
	 * 
	 */
	public UserLoginHistoryPage() {
	}

	public UserLoginHistoryPage(int pageNo, int pageSize) {
		super(pageNo, pageSize);
	}

	public UserLoginHistory[] getPageEntities() {
		return pageEntities;
	}

	public void setPageEntities(UserLoginHistory[] pageEntities) {
		this.pageEntities = pageEntities;
	}

}
