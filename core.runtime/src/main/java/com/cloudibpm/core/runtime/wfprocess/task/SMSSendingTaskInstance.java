/**
 * 
 */
package com.cloudibpm.core.runtime.wfprocess.task;

import com.cloudibpm.core.buildtime.wfprocess.task.SMSSendingTask;

/**
 * @author Dahai Cao last updated on 20180221
 *
 */
public class SMSSendingTaskInstance extends SMSSendingTask {

	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = 2414708295776969447L;
	private long startTime = -1;
	private long endTime = -1;
	private String definitionId = null;
	
	/**
	 * 
	 */
	public SMSSendingTaskInstance() {
		setName("SMS Sending Task Instance");
		setClasstypename(this.getClass().getSimpleName());
	}

	/**
	 * @param id
	 */
	public SMSSendingTaskInstance(String id) {
		super(id);
		setName("SMS Sending Task Instance");
		setClasstypename(this.getClass().getSimpleName());
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
