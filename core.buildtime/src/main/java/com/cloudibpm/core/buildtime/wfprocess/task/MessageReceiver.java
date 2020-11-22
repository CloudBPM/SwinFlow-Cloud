/**
 * 
 */
package com.cloudibpm.core.buildtime.wfprocess.task;

import com.cloudibpm.core.TreeNode;

/**
 * This receiver can be email or SMS or QQ or WeChat receivers.
 * 
 * @author Dahai Cao designed on 2016-10-28
 *
 */
public class MessageReceiver extends TreeNode {

	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = -3637341867877762602L;
	private String taskId = null;
	// 0: SMS; 1: Email; 2: QQ; 3: WeChat extensible ,etc.
	private int messageType = 0;
	// 0: workflow launcher; 1: all staffs in current organization; 2; all
	// staffs in all associated organizations; 3: specific position(s) or
	// project roles;
	private int receiverType = 0;
	private String organizationId = null;
	private String organizationName = null;
	// division Id, department Id, or project team Id
	private String departmentId = null;
	private String departmentName = null;
	// position Id or project role Id
	private String positionId = null;
	private String positionName = null;
	// WORKFLOW_LAUNCHR;
	// ALL_CUR_STAFFS;
	// ALL_ORG_STAFFS;
	private String userId = null;
	private String userFullName = null;
	private String classtypename = "MessageReceiver";

	/**
	 * 
	 */
	public MessageReceiver() {
		setName("MessageReceiver");
	}

	/**
	 * @param id
	 */
	public MessageReceiver(String id) {
		super(id);
		setName("MessageReceiver");
	}

	public int getMessageType() {
		return messageType;
	}

	public void setMessageType(int messageType) {
		this.messageType = messageType;
	}

	public int getReceiverType() {
		return receiverType;
	}

	public void setReceiverType(int receiverType) {
		this.receiverType = receiverType;
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
	 * @param taskId
	 *            the taskId to set
	 */
	public void setTaskId(String taskId) {
		this.taskId = taskId;
	}

}
