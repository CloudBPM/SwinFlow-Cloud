/**
 * 
 */
package com.cloudibpm.core.job;

import java.util.Date;

/**
 * @author dev
 *
 */
public class JobAssignment implements java.io.Serializable {

	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = -370844279646193571L;
	private String positionId = null;
	private String staffId = null;
	private String userId =null;
	private String staffFullName = null;
	private String userName = null;
	private String staffCode = null;
	private Date onJobDate = null;
	private String ownerId = null;
	private String description = null;

	/**
	 * 
	 */
	public JobAssignment() {
	}

	public String getPositionId() {
		return positionId;
	}

	public void setPositionId(String positionId) {
		this.positionId = positionId;
	}

	public String getStaffId() {
		return staffId;
	}

	public void setStaffId(String staffId) {
		this.staffId = staffId;
	}

	public String getStaffFullName() {
		return staffFullName;
	}

	public void setStaffFullName(String staffFullName) {
		this.staffFullName = staffFullName;
	}

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public String getStaffCode() {
		return staffCode;
	}

	public void setStaffCode(String staffCode) {
		this.staffCode = staffCode;
	}

	public Date getOnJobDate() {
		return onJobDate;
	}

	public void setOnJobDate(Date onJobDate) {
		this.onJobDate = onJobDate;
	}

	public String getOwnerId() {
		return ownerId;
	}

	public void setOwnerId(String ownerId) {
		this.ownerId = ownerId;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	
}
