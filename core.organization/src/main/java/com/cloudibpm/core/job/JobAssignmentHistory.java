package com.cloudibpm.core.job;

import java.util.Date;

import com.cloudibpm.core.WorkflowEntity;

public class JobAssignmentHistory extends WorkflowEntity {

	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = 6480385419970407500L;
	private String organizationName;
	private String departmentName;
	private String positionName;
	private Date startDate;
	private Date startDescription;
	private Date endDate;
	private Date endDescription;

	public JobAssignmentHistory() {
	}

	public String getOrganizationName() {
		return organizationName;
	}

	public void setOrganizationName(String organizationName) {
		this.organizationName = organizationName;
	}

	public String getDepartmentName() {
		return departmentName;
	}

	public void setDepartmentName(String departmentName) {
		this.departmentName = departmentName;
	}

	public String getPositionName() {
		return positionName;
	}

	public void setPositionName(String positionName) {
		this.positionName = positionName;
	}

	public Date getStartDate() {
		return startDate;
	}

	public void setStartDate(Date startDate) {
		this.startDate = startDate;
	}

	public Date getStartDescription() {
		return startDescription;
	}

	public void setStartDescription(Date startDescription) {
		this.startDescription = startDescription;
	}

	public Date getEndDate() {
		return endDate;
	}

	public void setEndDate(Date endDate) {
		this.endDate = endDate;
	}

	public Date getEndDescription() {
		return endDescription;
	}

	public void setEndDescription(Date endDescription) {
		this.endDescription = endDescription;
	}

}
