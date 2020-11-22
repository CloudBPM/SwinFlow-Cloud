/**
 * 
 */
package com.cloudibpm.core.runtime.workitem;

import com.cloudibpm.core.TreeNode;

/**
 * This class describes the work item which needs to be done.
 * 
 * @author Dahai Cao created on 20180227
 *
 */
public class WorkitemInfoDescriptor extends TreeNode {

	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = 8111551451863597373L;
	// this Id is task instance Id;
	// this Name is task instance Name;
	// 1: successful; non 1: failed
	private int status = 1;
	private String priority = null;
	private int taskInstanceStatus = -1;
	// Submitter user Id
	private String submitterId = null;
	private String submitterName = null;
	private String wfProcessId = null;
	private String wfProcessInstanceId = null;
	private String wfProcessInstanceName = null;
	// this is status is com.cloudibpm.core.buildtime.wfprocess.WfProcessStatus
	private int wfProcessInstanceStatus = -1;
	private long launchDateTime = -1;
	private long taskInstanceEnabledDateTime = -1;
	private long taskInstanceAlarmDateTime = -1;
	private long taskInstanceStartDateTime = -1;
	private long taskInstanceDateTimeLimit = -1;
	private String launchUserId = null;
	private String launchUserName = null;
	private int launchUserIdType = -1;
	private String launchUserIdNumber = null;
	private String serverIp = null;
	private Object formContent = null;
	private int wfProcessAccessLevel = 0;
	private int wfProcessType = 0;
	private int workflowType = 0;

	/**
	 * @return the wfProcessAccessLevel
	 */
	public int getWfProcessAccessLevel() {
		return wfProcessAccessLevel;
	}

	/**
	 * @param wfProcessAccessLevel
	 *            the wfProcessAccessLevel to set
	 */
	public void setWfProcessAccessLevel(int wfProcessAccessLevel) {
		this.wfProcessAccessLevel = wfProcessAccessLevel;
	}

	/**
	 * @return the wfProcessType
	 */
	public int getWfProcessType() {
		return wfProcessType;
	}

	/**
	 * @param wfProcessType
	 *            the wfProcessType to set
	 */
	public void setWfProcessType(int wfProcessType) {
		this.wfProcessType = wfProcessType;
	}

	/**
	 * @return the workflowType
	 */
	public int getWorkflowType() {
		return workflowType;
	}

	/**
	 * @param workflowType
	 *            the workflowType to set
	 */
	public void setWorkflowType(int workflowType) {
		this.workflowType = workflowType;
	}

	/**
	 * 
	 */
	public WorkitemInfoDescriptor() {
	}

	/**
	 * @param id
	 */
	public WorkitemInfoDescriptor(String id) {
		super(id);
	}

	/**
	 * @return the priority
	 */
	public String getPriority() {
		return priority;
	}

	/**
	 * @param priority
	 *            the priority to set
	 */
	public void setPriority(String priority) {
		this.priority = priority;
	}

	/**
	 * @return the taskInstanceStatus
	 */
	public int getTaskInstanceStatus() {
		return taskInstanceStatus;
	}

	/**
	 * @param taskInstanceStatus
	 *            the taskInstanceStatus to set
	 */
	public void setTaskInstanceStatus(int taskInstanceStatus) {
		this.taskInstanceStatus = taskInstanceStatus;
	}

	/**
	 * @return the submitterId
	 */
	public String getSubmitterId() {
		return submitterId;
	}

	/**
	 * @param submitterId
	 *            the submitterId to set
	 */
	public void setSubmitterId(String submitterId) {
		this.submitterId = submitterId;
	}

	/**
	 * @return the sumitterName
	 */
	public String getSubmitterName() {
		return submitterName;
	}

	/**
	 * @param submitterName
	 *            the submitterName to set
	 */
	public void setSubmitterName(String submitterName) {
		this.submitterName = submitterName;
	}

	/**
	 * @return the wfProcessId
	 */
	public String getWfProcessId() {
		return wfProcessId;
	}

	/**
	 * @param wfProcessId
	 *            the wfProcessId to set
	 */
	public void setWfProcessId(String wfProcessId) {
		this.wfProcessId = wfProcessId;
	}

	/**
	 * @return the wfProcessInstanceId
	 */
	public String getWfProcessInstanceId() {
		return wfProcessInstanceId;
	}

	/**
	 * @param wfProcessInstanceId
	 *            the wfProcessInstanceId to set
	 */
	public void setWfProcessInstanceId(String wfProcessInstanceId) {
		this.wfProcessInstanceId = wfProcessInstanceId;
	}

	/**
	 * @return the wfProcessInstanceName
	 */
	public String getWfProcessInstanceName() {
		return wfProcessInstanceName;
	}

	/**
	 * @param wfProcessInstanceName
	 *            the wfProcessInstanceName to set
	 */
	public void setWfProcessInstanceName(String wfProcessInstanceName) {
		this.wfProcessInstanceName = wfProcessInstanceName;
	}

	/**
	 * @return the launchDateTime
	 */
	public long getLaunchDateTime() {
		return launchDateTime;
	}

	/**
	 * @param launchDateTime
	 *            the launchDateTime to set
	 */
	public void setLaunchDateTime(long launchDateTime) {
		this.launchDateTime = launchDateTime;
	}

	/**
	 * @return the taskInstanceStartDateTime
	 */
	public long getTaskInstanceStartDateTime() {
		return taskInstanceStartDateTime;
	}

	/**
	 * @param taskInstanceStartDateTime
	 *            the taskInstanceStartDateTime to set
	 */
	public void setTaskInstanceStartDateTime(long taskInstanceStartDateTime) {
		this.taskInstanceStartDateTime = taskInstanceStartDateTime;
	}

	/**
	 * @return the taskInstanceDateTimeLimit
	 */
	public long getTaskInstanceDateTimeLimit() {
		return taskInstanceDateTimeLimit;
	}

	/**
	 * @param taskInstanceDateTimeLimit
	 *            the taskInstanceDateTimeLimit to set
	 */
	public void setTaskInstanceDateTimeLimit(long taskInstanceDateTimeLimit) {
		this.taskInstanceDateTimeLimit = taskInstanceDateTimeLimit;
	}

	/**
	 * @return the launchUserId
	 */
	public String getLaunchUserId() {
		return launchUserId;
	}

	/**
	 * @param launchUserId
	 *            the launchUserId to set
	 */
	public void setLaunchUserId(String launchUserId) {
		this.launchUserId = launchUserId;
	}

	/**
	 * @return the launchUserName
	 */
	public String getLaunchUserName() {
		return launchUserName;
	}

	/**
	 * @param launchUserName
	 *            the launchUserName to set
	 */
	public void setLaunchUserName(String launchUserName) {
		this.launchUserName = launchUserName;
	}

	/**
	 * @return the launchUserIdType
	 */
	public int getLaunchUserIdType() {
		return launchUserIdType;
	}

	/**
	 * @param launchUserIdType
	 *            the launchUserIdType to set
	 */
	public void setLaunchUserIdType(int launchUserIdType) {
		this.launchUserIdType = launchUserIdType;
	}

	/**
	 * @return the launchUserIdNumber
	 */
	public String getLaunchUserIdNumber() {
		return launchUserIdNumber;
	}

	/**
	 * @param launchUserIdNumber
	 *            the launchUserIdNumber to set
	 */
	public void setLaunchUserIdNumber(String launchUserIdNumber) {
		this.launchUserIdNumber = launchUserIdNumber;
	}

	/**
	 * @return the serverIp
	 */
	public String getServerIp() {
		return serverIp;
	}

	/**
	 * @param serverIp
	 *            the serverIp to set
	 */
	public void setServerIp(String serverIp) {
		this.serverIp = serverIp;
	}

	/**
	 * @return the taskInstanceEnabledDateTime
	 */
	public long getTaskInstanceEnabledDateTime() {
		return taskInstanceEnabledDateTime;
	}

	/**
	 * @param taskInstanceEnabledDateTime
	 *            the taskInstanceEnabledDateTime to set
	 */
	public void setTaskInstanceEnabledDateTime(long taskInstanceEnabledDateTime) {
		this.taskInstanceEnabledDateTime = taskInstanceEnabledDateTime;
	}

	/**
	 * @return the taskInstanceAlarmDateTime
	 */
	public long getTaskInstanceAlarmDateTime() {
		return taskInstanceAlarmDateTime;
	}

	/**
	 * @param taskInstanceAlarmDateTime
	 *            the taskInstanceAlarmDateTime to set
	 */
	public void setTaskInstanceAlarmDateTime(long taskInstanceAlarmDateTime) {
		this.taskInstanceAlarmDateTime = taskInstanceAlarmDateTime;
	}

	/**
	 * @return the formContent
	 */
	public Object getFormContent() {
		return formContent;
	}

	/**
	 * @param formContent
	 *            the formContent to set
	 */
	public void setFormContent(Object formContent) {
		this.formContent = formContent;
	}

	/**
	 * @return the status
	 */
	public int getStatus() {
		return status;
	}

	/**
	 * @param status
	 *            the status to set
	 */
	public void setStatus(int status) {
		this.status = status;
	}

	/**
	 * @return the wfProcessInstanceStatus
	 */
	public int getWfProcessInstanceStatus() {
		return wfProcessInstanceStatus;
	}

	/**
	 * @param wfProcessInstanceStatus
	 *            the wfProcessInstanceStatus to set
	 */
	public void setWfProcessInstanceStatus(int wfProcessInstanceStatus) {
		this.wfProcessInstanceStatus = wfProcessInstanceStatus;
	}

}
