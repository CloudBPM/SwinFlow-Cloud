/**
 * 
 */
package com.cloudibpm.core.user;

import com.cloudibpm.core.WorkflowEntity;

import java.util.Date;

/**
 * @author Caodahai
 *
 */
public class Staff extends WorkflowEntity { 

	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = -4005448117710024674L;
	// 1: 在职、2: 停职、3：待岗、4: 退休、5: 离职、6: 辞退
	public static final int ONJOB = 1;
	public static final int SUSPENSION = 2;
	public static final int AWAITINGJOB = 3;
	public static final int RETIRED = 4;
	public static final int RESIGNED = 5;
	public static final int FIRED = 6;
	// 1: 全职、2：兼职、3: 临时工、4：实习
	public static final int FULLTIME = 1;
	public static final int PARTTIME = 2;
	public static final int CASUAL = 3;
	public static final int INTERN = 4;
	// 0: 空闲、1：忙碌、2：繁忙、3：离开、4：下班
	public static final int IDLE = 0;
	public static final int BUSY = 1;
	public static final int CRAZY = 2;
	public static final int AWAY = 3;
	public static final int OFF = 4;

	private User user;
	private String professionalTitle;
	private String staffCode;
	private String workPhoneNumber;
	private String workMobileNumber;
	private String workFaxNumber;
	private String workEmail;
	private String officeLocation;
	private Date onBoardingDate;
	private Date resignDate;
	private String resignDescription;
	private boolean isHidden = false;
	private int jobStatus = ONJOB;
	private int workType = FULLTIME;
	private int workStatus = IDLE;
	private Date lastupdate;
	private String[] authorizations = new String[0];

	// 这三个属性用于展示用户列表用。
	private String currDepartment = null;
	private String currPostion = null;
	private String currGroup = null;
	private boolean dirty = false;
	
	private String organizationName;

	/**
	 * 
	 */
	public Staff() {
	}

	/**
	 * @param id
	 */
	public Staff(String id) {
		super(id);
	}

	/**
	 * @return the user
	 */
	public User getUser() {
		return user;
	}

	/**
	 * @param user
	 *            the user to set
	 */
	public void setUser(User user) {
		this.user = user;
	}

	public String getProfessionalTitle() {
		return professionalTitle;
	}

	public void setProfessionalTitle(String professionalTitle) {
		this.professionalTitle = professionalTitle;
	}

	/**
	 * @return the staffNumber
	 */
	public String getStaffCode() {
		return staffCode;
	}

	/**
	 * @param staffCode
	 *            the staffCode to set
	 */
	public void setStaffCode(String staffCode) {
		this.staffCode = staffCode;
	}

	/**
	 * @return the workPhoneNumber
	 */
	public String getWorkPhoneNumber() {
		return workPhoneNumber;
	}

	/**
	 * @param workPhoneNumber
	 *            the workPhoneNumber to set
	 */
	public void setWorkPhoneNumber(String workPhoneNumber) {
		this.workPhoneNumber = workPhoneNumber;
	}

	/**
	 * @return the workMobileNumber
	 */
	public String getWorkMobileNumber() {
		return workMobileNumber;
	}

	/**
	 * @param workMobileNumber
	 *            the workMobileNumber to set
	 */
	public void setWorkMobileNumber(String workMobileNumber) {
		this.workMobileNumber = workMobileNumber;
	}

	/**
	 * @return the workFaxNumber
	 */
	public String getWorkFaxNumber() {
		return workFaxNumber;
	}

	/**
	 * @param workFaxNumber
	 *            the workFaxNumber to set
	 */
	public void setWorkFaxNumber(String workFaxNumber) {
		this.workFaxNumber = workFaxNumber;
	}

	/**
	 * @return the workEmail
	 */
	public String getWorkEmail() {
		return workEmail;
	}

	/**
	 * @param workEmail
	 *            the workEmail to set
	 */
	public void setWorkEmail(String workEmail) {
		this.workEmail = workEmail;
	}

	/**
	 * @return the officeLocation
	 */
	public String getOfficeLocation() {
		return officeLocation;
	}

	/**
	 * @param officeLocation
	 *            the officeLocation to set
	 */
	public void setOfficeLocation(String officeLocation) {
		this.officeLocation = officeLocation;
	}

	/**
	 * @return the jobStatus
	 */
	public int getJobStatus() {
		return jobStatus;
	}

	/**
	 * @param jobStatus
	 *            the jobStatus to set
	 */
	public void setJobStatus(int jobStatus) {
		this.jobStatus = jobStatus;
	}

	/**
	 * @return the onBoardingDate
	 */
	public Date getOnBoardingDate() {
		return onBoardingDate;
	}

	/**
	 * @param onBoardingDate
	 *            the onBoardingDate to set
	 */
	public void setOnBoardingDate(Date onBoardingDate) {
		this.onBoardingDate = onBoardingDate;
	}

	/**
	 * @return the resignDate
	 */
	public Date getResignDate() {
		return resignDate;
	}

	/**
	 * @param resignDate
	 *            the resignDate to set
	 */
	public void setResignDate(Date resirgningDate) {
		this.resignDate = resirgningDate;
	}

	/**
	 * @return the resignDescription
	 */
	public String getResignDescription() {
		return resignDescription;
	}

	/**
	 * @param resignDescription
	 *            the resignDescription to set
	 */
	public void setResignDescription(String resignDescription) {
		this.resignDescription = resignDescription;
	}



	/**
	 * @return the isHidden
	 */
	public boolean isHidden() {
		return isHidden;
	}

	/**
	 * @param isHidden
	 *            the isHidden to set
	 */
	public void setHidden(boolean isHidden) {
		this.isHidden = isHidden;
	}

	/**
	 * @return the workType
	 */
	public int getWorkType() {
		return workType;
	}

	/**
	 * @param workType
	 *            the workType to set
	 */
	public void setWorkType(int workType) {
		this.workType = workType;
	}

	/**
	 * @return the workStatus
	 */
	public int getWorkStatus() {
		return workStatus;
	}

	/**
	 * @param workStatus
	 *            the workStatus to set
	 */
	public void setWorkStatus(int workStatus) {
		this.workStatus = workStatus;
	}

	/**
	 * @return the authorities
	 */
	public String[] getAuthorizations() {
		return authorizations;
	}

	/**
	 * @param authorities
	 *            the authorities to set
	 */
	public void setAuthorizations(String[] authorizations) {
		this.authorizations = authorizations;
	}

	public Date getLastupdate() {
		return lastupdate;
	}

	public void setLastupdate(Date lastupdate) {
		this.lastupdate = lastupdate;
	}

	public String getCurrDepartment() {
		return currDepartment;
	}

	public void setCurrDepartment(String currDepartment) {
		this.currDepartment = currDepartment;
	}

	public String getCurrPostion() {
		return currPostion;
	}

	public void setCurrPostion(String currPostion) {
		this.currPostion = currPostion;
	}

	public String getCurrGroup() {
		return currGroup;
	}

	public void setCurrGroup(String currGroup) {
		this.currGroup = currGroup;
	}

	public boolean isDirty() {
		return dirty;
	}

	public void setDirty(boolean dirty) {
		this.dirty = dirty;
	}

	public String getOrganizationName() {
		return organizationName;
	}

	public void setOrganizationName(String organizationName) {
		this.organizationName = organizationName;
	}
	
	

}
