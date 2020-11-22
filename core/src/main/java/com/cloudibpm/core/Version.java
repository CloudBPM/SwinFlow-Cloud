package com.cloudibpm.core;

import java.util.Date;

/**
 * @date 2008-9-30 下午06:55:39
 * @author CAODAHAI
 * @version 3.0.0
 */
public class Version extends TreeNode {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	/**
	 * Draft version, this version is unlocked, user can modify the drafted
	 * entity.
	 */
	public static final int DRAFT_UNLOCKED = 0;
	/**
	 * Draft version, this version is locked,user cannot modify the drafted
	 * entity.
	 */
	public static final int DRAFT_LOCKED = 1;

	/**
	 * Standard version, user can not modify the versioned entity. but this
	 * version can not be executed before release.
	 */
	public static final int VERSIONED = 2;
	/**
	 * Release version, user can not modify this version, and this version can
	 * be executed on server.
	 */
	public static final int RELEASED = 3;

	private String version;
	private String author;
	private boolean displayed = true;
	private int status = DRAFT_UNLOCKED;
	private Date versionLastupdate;
	private String description;

	public Version() {
		super();
	}

	public Version(String id) {
		super(id);
	}

	/**
	 * Sets entity version number, the number can be date time, e.g.,
	 * 2008-09-08, or characters, e.g., beijing2008, etc.
	 * 
	 * @param num
	 *            String
	 */
	public void setVersion(String version) {
		this.version = version;
	}

	/**
	 * Gets entity version number, the number can be date time, e.g.,
	 * 2008-09-08, or characters, e.g., beijing2008, etc.
	 * 
	 * @return String
	 */
	public String getVersion() {
		return version;
	}

	/**
	 * Sets last modifier of current business process.
	 * 
	 * @param author
	 */

	public void setAuthor(String author) {
		this.author = author;
	}

	/**
	 * Return last modifier of current business process.
	 * 
	 * @return
	 */

	public String getAuthor() {
		return author;
	}

	/**
	 * Sets the status of current business process. the status of business
	 * process can reference {@link DRAFT_UNLOCKED}, {@link DRAFT_LOCKED},
	 * {@link RELEASED}, {@link VERSIONED}
	 * 
	 * @param status
	 */
	public void setStatus(int status) {
		this.status = status;
	}

	/**
	 * Return the status of current business process. the status of business
	 * process can reference {@link DRAFT_UNLOCKED}, {@link DRAFT_LOCKED},
	 * {@link RELEASED}, {@link VERSIONED}
	 * 
	 * @return
	 */
	public int getStatus() {
		return this.status;
	}

	/**
	 * Returns whether the version is displayed on user or not.
	 * 
	 * @return boolean
	 */
	public boolean isDisplayed() {
		return displayed;
	}

	/**
	 * Sets whether the version is displayed on user or not.
	 * 
	 * @param display
	 *            boolean
	 */
	public void setDisplayed(boolean display) {
		this.displayed = display;
	}

	/**
	 * Sets last update date time of current business process version.The format
	 * of the time is MM/DD/YYYY.
	 * 
	 * @param versionLastupdate
	 */

	public void setVersionLastupdate(Date versionLastupdate) {
		this.versionLastupdate = versionLastupdate;
	}

	/**
	 * Return last update date time of current business process version.
	 * 
	 * @return last update date time
	 */

	public Date getVersionLastupdate() {
		return versionLastupdate;
	}

	/**
	 * 
	 * Create Date: 2010-6-24 下午04:48:34
	 * 
	 * @see com.cloudibpm.core.Version#getDescription()
	 */
	public String getDescription() {
		return this.description;
	}

	/**
	 * 
	 * Create Date: 2010-6-24 下午04:48:38
	 * 
	 * @see com.cloudibpm.core.Version#setDescription(java.lang.String)
	 */
	public void setDescription(String description) {
		this.description = description;
	}

	/**
	 * Returns a name with version number.
	 * 
	 * @return
	 */
	public String toNameWithStatus() {
		String displayName = ""; //$NON-NLS-1$
		if (this.getStatus() == DRAFT_LOCKED
				|| this.getStatus() == DRAFT_UNLOCKED) {
			displayName = this.getName() + " <" + this.getVersion() + ">"; //$NON-NLS-1$ $NON-NLS-2$
		} else if (this.getStatus() == VERSIONED
				|| this.getStatus() == RELEASED) {
			displayName = this.getName() + " " + this.getVersion(); //$NON-NLS-1$
		}
		return displayName;
	}
}
