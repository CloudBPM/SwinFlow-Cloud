/**
 * 
 */
package com.cloudibpm.core.runtime.wfprocess.task;

import com.cloudibpm.core.buildtime.wfprocess.task.StartPoint;

/**
 * @author Dahai Cao created 2008-09-09, last updated on 20180221
 * 
 */
public class StartPointInstance extends StartPoint {

	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = 5638968420238537831L;
	private long startTime = -1;
	private long endTime = -1;
	private String definitionId = null;
	
	/**
	 * 
	 */
	public StartPointInstance() {
		setName("Start Point Instance");
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
