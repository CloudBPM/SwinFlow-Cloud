/**
 * 
 */
package com.cloudibpm.core.authorization;

import com.cloudibpm.core.Page;

/**
 * @author dev
 *
 */
public class GroupMemberPage extends Page {

	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = -9174907030760092512L;
	private GroupMember[] pageEntities = new GroupMember[0];

	/**
	 * 
	 */
	public GroupMemberPage() {
	}

	/**
	 * @param pageNo
	 * @param pageSize
	 */
	public GroupMemberPage(int pageNo, int pageSize) {
		super(pageNo, pageSize);
	}

	public GroupMember[] getPageEntities() {
		return pageEntities;
	}

	public void setPageEntities(GroupMember[] pageEntities) {
		this.pageEntities = pageEntities;
	}

}
