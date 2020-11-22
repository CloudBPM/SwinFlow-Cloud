package com.cloudibpm.core.runtime.wfprocess.task;

import com.cloudibpm.core.buildtime.wfprocess.task.EmailSendingTask;

/**
 * 
 * @author Dahai Cao last updated on 20180221
 *
 */
public class EmailSendingTaskInstance extends EmailSendingTask {

	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = 6016531843195953574L;
	private long startTime = -1;
	private long endTime = -1;
	private String definitionId = null;

	public EmailSendingTaskInstance() {
		setName("Email Sending Task Instance");
		setClasstypename("EmailSendingTaskInstance");
	}

	public EmailSendingTaskInstance(String id) {
		super(id);
		setName("Email Sending Task Instance");
		setClasstypename("EmailSendingTaskInstance");
	}

	/**
	 * @return the startTime
	 */
	public long getStartTime() {
		return startTime;
	}

	/**
	 * @param startTime
	 *            the startTime to set
	 */
	public void setStartTime(long startTime) {
		this.startTime = startTime;
	}

	/**
	 * @return the endTime
	 */
	public long getEndTime() {
		return endTime;
	}

	/**
	 * @param endTime
	 *            the endTime to set
	 */
	public void setEndTime(long endTime) {
		this.endTime = endTime;
	}

	/**
	 * @return the definitionId
	 */
	public String getDefinitionId() {
		return definitionId;
	}

	/**
	 * @param definitionId
	 *            the definitionId to set
	 */
	public void setDefinitionId(String definitionId) {
		this.definitionId = definitionId;
	}
}
