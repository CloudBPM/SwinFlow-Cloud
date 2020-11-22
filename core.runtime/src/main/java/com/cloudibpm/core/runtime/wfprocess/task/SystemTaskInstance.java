/**
 * 
 */
package com.cloudibpm.core.runtime.wfprocess.task;

import com.cloudibpm.core.TreeNode;
import com.cloudibpm.core.buildtime.wfprocess.task.SystemTask;

/**
 * @author Dahai Cao created 2011-09-28, last updated on 20180221
 * 
 */
public class SystemTaskInstance extends SystemTask {

	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = 8093462349129639880L;
	private long startTime = -1;
	private long endTime = -1;
	private String definitionId = null;

	/**
	 * 
	 */
	public SystemTaskInstance() {
		setName("System Task");
		setClasstypename(this.getClass().getSimpleName());
	}

	@Override
	public Object clone() throws CloneNotSupportedException {
		SystemTaskInstance invokeTask = (SystemTaskInstance) super.clone();
		TreeNode[] paras = invokeTask.getChildren();
		for (TreeNode para : paras) {
			invokeTask.addChild((TreeNode) para.clone());
		}
		return invokeTask;
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
