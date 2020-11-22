/**
 * 
 */
package com.cloudibpm.core.runtime.wfprocess.task;

import com.cloudibpm.core.buildtime.wfprocess.task.EndPoint;

/**
 * @author Dahai Cao created 2011-09-11,Dahai Cao last updated on 20180221
 * 
 */
public class EndPointInstance extends EndPoint {

	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = -1727145241172472178L;
	private long startTime = -1;
	private long endTime = -1;
	private String definitionId = null; // End point ID in process definition
	private String processInstanceId = null;

	/**
	 * 
	 */
	public EndPointInstance() {
		setName("End Instance");
		setClasstypename("EndPointInstance");
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

	public String getProcessInstanceId() {
		return processInstanceId;
	}

	public void setProcessInstanceId(String processInstanceId) {
		this.processInstanceId = processInstanceId;
	}
}
