package com.cloudibpm.core.organization;

import java.util.Date;

import com.cloudibpm.core.TreeNode;

public class HomePage extends TreeNode{

	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = 1L;
	private String skin;
	private String imgURL;
	private String orgTitle;
	private Date createdate;
	private Date lastupdate;


	public String getSkin() {
		return skin;
	}

	public void setSkin(String skin) {
		this.skin = skin;
	}

	public String getImgURL() {
		return imgURL;
	}

	public void setImgURL(String imgURL) {
		this.imgURL = imgURL;
	}



	public Date getCreatedate() {
		return createdate;
	}

	public void setCreatedate(Date createdate) {
		this.createdate = createdate;
	}

	public Date getLastupdate() {
		return lastupdate;
	}

	public void setLastupdate(Date lastupdate) {
		this.lastupdate = lastupdate;
	}

	public String getOrgTitle() {
		return orgTitle;
	}

	public void setOrgTitle(String orgTitle) {
		this.orgTitle = orgTitle;
	}

	
	
}
