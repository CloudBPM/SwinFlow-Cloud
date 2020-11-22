package com.cloudibpm.core.authorization;

import java.util.Date;

public class GroupMember implements java.io.Serializable {

	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = 6877593306076188403L;
	private String groupId = null;
	private String staffId = null;
	private String staffCode = null;
	private Date boardDate = null;
	private String userAccount = null;
	private String userGivenName = null;
	private String userSurname = null;

	public GroupMember() {
	}

	/**
	 * @return the userGivenName
	 */
	public String getUserGivenName() {
		return userGivenName;
	}

	/**
	 * @param userGivenName
	 *            the userGivenName to set
	 */
	public void setUserGivenName(String userGivenName) {
		this.userGivenName = userGivenName;
	}

	/**
	 * @return the userSurname
	 */
	public String getUserSurname() {
		return userSurname;
	}

	/**
	 * @param userSurname
	 *            the userSurname to set
	 */
	public void setUserSurname(String userSurname) {
		this.userSurname = userSurname;
	}

	public String getUserAccount() {
		return userAccount;
	}

	public void setUserAccount(String userAccount) {
		this.userAccount = userAccount;
	}

	public Date getBoardDate() {
		return boardDate;
	}

	public void setBoardDate(Date boardDate) {
		this.boardDate = boardDate;
	}

	public String getStaffCode() {
		return staffCode;
	}

	public void setStaffCode(String staffCode) {
		this.staffCode = staffCode;
	}

	public String getGroupId() {
		return groupId;
	}

	public void setGroupId(String groupId) {
		this.groupId = groupId;
	}

	public String getStaffId() {
		return staffId;
	}

	public void setStaffId(String staffId) {
		this.staffId = staffId;
	}

	public String toString() {
		return this.userAccount + "," + this.userSurname + this.userGivenName;
	}

}
