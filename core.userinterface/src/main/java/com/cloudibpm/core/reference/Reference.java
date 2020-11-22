/**
 * 
 */
package com.cloudibpm.core.reference;

import com.cloudibpm.core.TreeNode;

/**
 * This class describes the reference data for drop list UI components and list
 * UI components.
 * 
 * @author Dahai Cao on 2017-05-31
 *
 */
public class Reference extends TreeNode {

	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = -5868353559816345114L;
	private String description = null;
	private long createDatetime;
	private long lastupdate;

	/**
	 * 
	 */
	public Reference() {
	}

	/**
	 * @param id
	 */
	public Reference(String id) {
		super(id);
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
	 * @return the createDatetime
	 */
	public long getCreateDatetime() {
		return createDatetime;
	}

	/**
	 * @param createDatetime
	 *            the createDatetime to set
	 */
	public void setCreateDatetime(long createDatetime) {
		this.createDatetime = createDatetime;
	}

	/**
	 * @return the lastupdate
	 */
	public long getLastupdate() {
		return lastupdate;
	}

	/**
	 * @param lastupdate
	 *            the lastupdate to set
	 */
	public void setLastupdate(long lastupdate) {
		this.lastupdate = lastupdate;
	}

	public String toString() {
		return getName();
	}
}
