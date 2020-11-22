/**
 * 
 */
package com.cloudibpm.core.buildtime.wfprocess.task;

import com.cloudibpm.core.TreeNode;

/**
 * @author dev
 *
 */
public class Participant extends TreeNode {

	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = 4903824703227088294L;
	// 0: position; 1: launcher; 2: specific user;
	private int participationType = 0;
	private String organizationId = null;
	private String organizationName = null;
	// division Id, department Id, or project team Id
	private String departmentId = null;
	private String departmentName = null;
	// position Id or project role Id
	private String positionId = null;
	private String positionName = null;
	private String userId = null;
	private String userFullName = null;
	// work assignment priority:
	// 0: low priority(normal); 
	// 1: medium priority(important); 
	// 2: high priority(urgent);
	private int priority = 0;
	private String taskId = null;
	private String classtypename = "Participant";

	/**
	 * 
	 */
	public Participant() {
		setName("Participant");
		setClasstypename(this.getClass().getSimpleName());
	}

	public int getParticipationType() {
		return participationType;
	}

	public void setParticipationType(int participationType) {
		this.participationType = participationType;
	}

	public String getOrganizationId() {
		return organizationId;
	}

	public void setOrganizationId(String organizationId) {
		this.organizationId = organizationId;
	}

	public String getOrganizationName() {
		return organizationName;
	}

	public void setOrganizationName(String organizationName) {
		this.organizationName = organizationName;
	}

	public String getDepartmentId() {
		return departmentId;
	}

	public void setDepartmentId(String departmentId) {
		this.departmentId = departmentId;
	}

	public String getDepartmentName() {
		return departmentName;
	}

	public void setDepartmentName(String departmentName) {
		this.departmentName = departmentName;
	}

	public String getPositionId() {
		return positionId;
	}

	public void setPositionId(String positionId) {
		this.positionId = positionId;
	}

	public String getPositionName() {
		return positionName;
	}

	public void setPositionName(String positionName) {
		this.positionName = positionName;
	}

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public String getUserFullName() {
		return userFullName;
	}

	public void setUserFullName(String userFullName) {
		this.userFullName = userFullName;
	}

	public int getPriority() {
		return priority;
	}

	public void setPriority(int priority) {
		this.priority = priority;
	}

	public String getClasstypename() {
		return classtypename;
	}

	public void setClasstypename(String classtypename) {
		this.classtypename = classtypename;
	}

	/**
	 * @return the taskId
	 */
	public String getTaskId() {
		return taskId;
	}

	/**
	 * @param taskId the taskId to set
	 */
	public void setTaskId(String taskId) {
		this.taskId = taskId;
	}

}
