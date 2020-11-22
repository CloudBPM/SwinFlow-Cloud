package com.cloudibpm.core.authorization;

import java.util.Date;

import com.cloudibpm.core.TreeNode;

/**
 * 
 * @author Cao.Da.hai
 * @version 2.0.1, 29/08/2009
 * @since Workflow Peoject 2.0.0
 * @Copyright 2006-2010
 */
public class AuthorityGroup extends TreeNode {
	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = -1665078269743172768L;
	private String description;
	private Date createDate;
	private int type = 0; // 0:system;1:custom
	private String[] authoritiesIds;
	private String[] addedAuthIds = new String[0];
	private String[] removedAuthIds = new String[0];

	public AuthorityGroup() {
	}

	public String toString() {
		return getName();
	}

	public int compareTo(TreeNode o) {
		return 0;
	}

	@Override
	public Object clone() {
		return null;
	}

	/**
	 * @return the description
	 */
	public String getDescription() {
		return description;
	}

	/**
	 * @param description
	 *            the description to set
	 */
	public void setDescription(String description) {
		this.description = description;
	}

	/**
	 * @return the createDate
	 */
	public Date getCreateDate() {
		return createDate;
	}

	/**
	 * @param createDate
	 *            the createDate to set
	 */
	public void setCreateDate(Date createDate) {
		this.createDate = createDate;
	}

	public int getType() {
		return type;
	}

	public void setType(int type) {
		this.type = type;
	}

	public String[] getAuthoritiesIds() {
		return authoritiesIds;
	}

	public void setAuthoritiesIds(String[] authoritiesIds) {
		this.authoritiesIds = authoritiesIds;
	}

	public String[] getAddedAuthIds() {
		return addedAuthIds;
	}

	public void setAddedAuthIds(String[] addedAuthIds) {
		this.addedAuthIds = addedAuthIds;
	}

	public String[] getRemovedAuthIds() {
		return removedAuthIds;
	}

	public void setRemovedAuthIds(String[] removedAuthIds) {
		this.removedAuthIds = removedAuthIds;
	}

}