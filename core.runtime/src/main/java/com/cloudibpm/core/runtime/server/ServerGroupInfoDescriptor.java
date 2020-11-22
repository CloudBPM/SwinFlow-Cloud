/**
 * 
 */
package com.cloudibpm.core.runtime.server;

import java.util.Date;

import com.cloudibpm.core.TreeNode;

/**
 * @author Dahai Cao created on 2018-02-05
 *
 */
public class ServerGroupInfoDescriptor extends TreeNode {

	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = -3525565453006803635L;
	/** 注册时间 */
	private Date createDatetime = null;
	/** 最后更新 */
	private Date Lastupdate = null;

	/**
	 * 
	 */
	public ServerGroupInfoDescriptor() {
	}

	/**
	 * @param id
	 */
	public ServerGroupInfoDescriptor(String id) {
		super(id);
	}

	/**
	 * @return the createDatetime
	 */
	public Date getCreateDatetime() {
		return createDatetime;
	}

	/**
	 * @param createDatetime
	 *            the createDatetime to set
	 */
	public void setCreateDatetime(Date createDatetime) {
		this.createDatetime = createDatetime;
	}

	/**
	 * @return the lastupdate
	 */
	public Date getLastupdate() {
		return Lastupdate;
	}

	/**
	 * @param lastupdate
	 *            the lastupdate to set
	 */
	public void setLastupdate(Date lastupdate) {
		Lastupdate = lastupdate;
	}

}
