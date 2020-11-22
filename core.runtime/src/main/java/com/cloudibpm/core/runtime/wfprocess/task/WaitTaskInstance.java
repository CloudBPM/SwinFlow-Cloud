/**
 * 
 */
package com.cloudibpm.core.runtime.wfprocess.task;

import com.cloudibpm.core.buildtime.wfprocess.task.WaitTask;

/**
 * @author Dahai Cao created 20111-09-08, last updated on 20180221
 * 
 * @version 1.0.0
 */
public class WaitTaskInstance extends WaitTask {

	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = 8610162795297732107L;
	private long startTime = -1;
	private long endTime = -1;
	private String definitionId;
	// runtime props
	private double progress = 0.0D;
	private Long waitTime = 0L;

	/**
	 * Constructor
	 */
	public WaitTaskInstance() {
		setName("Wait Task");
		setClasstypename(this.getClass().getSimpleName());
	}

	@Override
	public Object clone() throws CloneNotSupportedException {
		WaitTaskInstance waitTask = (WaitTaskInstance) super.clone();
		// if (this.getTimeRule() != null)
		// waitTask.setTimeRule((Expression) this.getTimeRule().clone());
		return waitTask;
	}

	/**
	 * Sets a <code>percent</code> of progress when current task is running. The
	 * <code>percent</code> is calculated and set every one percent running by
	 * system, and system will sets the percent into permanent storage. It
	 * should be set manually. It is an important measure for resuming system
	 * performing once system crashing.
	 * 
	 * @date 11/10/2011 11:39:29 AM
	 * @param percent
	 *            the value between 0.0000% .. 100.0000%.
	 */
	public void setProgress(Double percent) {
		this.progress = percent;
	}

	/**
	 * Gets a <code>percent</code> of progress when current task is running. The
	 * <code>percent</code> is calculated and set every one percent running by
	 * system. It is an important measure for resuming system performing once
	 * system crashing.
	 * 
	 * @date 11/10/2011 11:39:27 AM
	 * @return the value between 0.0000% .. 100.0000%.
	 */
	public Double getProgress() {
		return progress;
	}

	/**
	 * Sets a long object for current task. The object is real wait time that is
	 * calculated by system. System will make current task sleep according to
	 * long number value of the object. Current task does not resumes until
	 * duration expires.
	 * 
	 * @param waitTime
	 *            the waitTime to set
	 */
	public void setWaitTime(Long waitTime) {
		this.waitTime = waitTime;
	}

	/**
	 * Gets a long object for current task. The object is real wait time that is
	 * calculated by system. System will make current task sleep according to
	 * long number value of the object. Current task does not resumes until
	 * duration expires.
	 * 
	 * @return the waitTime
	 */
	public Long getWaitTime() {
		return waitTime;
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