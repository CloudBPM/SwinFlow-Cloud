/**
 * 
 */
package com.cloudibpm.core.authorization;

import com.cloudibpm.core.Page;

/**
 * @author dev
 *
 */
public class AuthorityGroupPage extends Page {

	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = -1019347024951794209L;
	private AuthorityGroup[] pageEntities = new AuthorityGroup[0];

	/**
	 * 
	 */
	public AuthorityGroupPage() {
	}

	/**
	 * @param pageNo
	 * @param pageSize
	 */
	public AuthorityGroupPage(int pageNo, int pageSize) {
		super(pageNo, pageSize);
	}

	public AuthorityGroup[] getPageEntities() {
		return pageEntities;
	}

	public void setPageEntities(AuthorityGroup[] pageEntities) {
		this.pageEntities = pageEntities;
	}

}
