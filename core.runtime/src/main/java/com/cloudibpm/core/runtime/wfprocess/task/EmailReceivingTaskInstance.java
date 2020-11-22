package com.cloudibpm.core.runtime.wfprocess.task;

import com.cloudibpm.core.buildtime.wfprocess.task.EmailReceivingTask;
/**
 * 
 * @author Dahai Cao last updated on 20180221
 *
 */
public class EmailReceivingTaskInstance extends EmailReceivingTask {

	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = -7776640433784092154L;
	private long startTime = -1;
	private long endTime = -1;
	private String definitionId = null;

	public EmailReceivingTaskInstance() {
		setName("Email Receiving Task Instance");
		setClasstypename("EmailReceivingTaskInstance");
	}

	public EmailReceivingTaskInstance(String id) {
		super(id);
		setName("Email Receiving Task Instance");
		setClasstypename("EmailReceivingTaskInstance");
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
