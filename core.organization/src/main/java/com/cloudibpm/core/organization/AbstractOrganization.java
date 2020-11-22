/**
 * 
 */
package com.cloudibpm.core.organization;

import com.cloudibpm.core.TreeNode;

/**
 * @author dev
 *
 */
public class AbstractOrganization extends TreeNode {
	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = 3017164227788566065L;
	private String serialNumber = null; // unique code

	private int status = ResourceStatus.OFFLINE; // 0: offline; 1: online; -1:write off;
	private String categoryId = null;
	private String category = null;

	private long createDate = 0L;
	private long lastupdate = 0L;

	/**
	 * 
	 */
	public AbstractOrganization() {
	}

	public AbstractOrganization(String id) {
		super(id);
	}

	public String getSerialNumber() {
		return serialNumber;
	}

	public void setSerialNumber(String serialNumber) {
		this.serialNumber = serialNumber;
	}

	public int getStatus() {
		return status;
	}

	public void setStatus(int status) {
		this.status = status;
	}

	public long getCreateDate() {
		return createDate;
	}

	public void setCreateDate(long createDate) {
		this.createDate = createDate;
	}

	public long getLastupdate() {
		return lastupdate;
	}

	public void setLastupdate(long lastupdate) {
		this.lastupdate = lastupdate;
	}

	/**
	 * @return the categoryId
	 */
	public String getCategoryId() {
		return categoryId;
	}

	/**
	 * @param categoryId
	 *            the categoryId to set
	 */
	public void setCategoryId(String categoryId) {
		this.categoryId = categoryId;
	}

	/**
	 * @return the category
	 */
	public String getCategory() {
		return category;
	}

	/**
	 * @param category
	 *            the category to set
	 */
	public void setCategory(String category) {
		this.category = category;
	}
}
