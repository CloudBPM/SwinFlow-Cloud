/**
 * 
 */
package com.cloudibpm.core.runtime.wfprocess.task;

import com.cloudibpm.core.TreeNode;
import com.cloudibpm.core.buildtime.wfprocess.task.AssignTask;

/**
 * 
 * @author Dahai Cao last updated on 20180221
 *
 */
public class AssignTaskInstance extends AssignTask {

	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = 1169735870679318921L;
	private long startTime = -1;
	private long endTime = -1;
	private String definitionId = null;

	/**
	 * 
	 */
	public AssignTaskInstance() {
		setName("Assign Task Instance");
		setClasstypename("AssignTaskInstance");
	}

	@Override
	public Object clone() throws CloneNotSupportedException {
		AssignTaskInstance assignTask = (AssignTaskInstance) super.clone();
		for (TreeNode assignment : assignTask.getChildren()) {
			assignTask.addChild((TreeNode) assignment.clone());
		}
		return assignTask;
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
