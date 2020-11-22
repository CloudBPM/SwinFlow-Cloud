/**
 * 
 */
package com.cloudibpm.core.runtime.wfprocess.task;

import com.cloudibpm.core.TreeNode;
import com.cloudibpm.core.buildtime.wfprocess.task.SubprocessPoint;
import com.cloudibpm.core.runtime.wfprocess.WfProcessInstance;

/**
 * 
 * @author Dahai Cao last updated on 20180221
 *
 */
public class SubprocessPointInstance extends SubprocessPoint {

	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = -1278436507510567570L;
	private long startTime = -1;
	private long endTime = -1;
	private String definitionId = null;
	private String subprocessInstanceId = null;

	/**
	 * Constructor
	 */
	public SubprocessPointInstance() {
		setName("Subprocess Point");
		setClasstypename(this.getClass().getSimpleName());
	}

	@Override
	public Object clone() throws CloneNotSupportedException {
		SubprocessPointInstance subprocessPoint = (SubprocessPointInstance) super.clone();
		return subprocessPoint;
	}

	/**
	 * Sets a subprocess object for current subprocess invocation point.
	 * 
	 * @date 20/10/2011 10:56:53 AM
	 * @param process
	 */
	public void addSubprocess(WfProcessInstance process) {
		this.addChild(process);
	}

	/**
	 * Gets a subprocess object from current subprocess invocation point.
	 * 
	 * @date 20/10/2011 10:56:56 AM
	 * @return
	 */
	public WfProcessInstance fetchSubprocess() {
		for (TreeNode child :  this.getChildren()) {
			if (child instanceof WfProcessInstance)
				return (WfProcessInstance) child;
		}
		return null;
	}

	/**
	 * Returns whether current subprocess point task has subprocess object at
	 * runtime.
	 * 
	 * @return boolean
	 */
	public boolean hasSubprocess() {
		TreeNode[] children = this.getChildren();
		for (TreeNode child : children) {
			if (child instanceof WfProcessInstance)
				return true;
		}
		return false;
	}

	/**
	 * Removes a subprocess object from current subprocess invocation point.
	 * 
	 * @date 31/10/2011 2:11:08 PM
	 */
	public void removeSubprocess() {
		TreeNode[] children = this.getChildren();
		for (TreeNode child : children) {
			if (child instanceof WfProcessInstance) {
				removeChild(child);
				return;
			}
		}
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

	/**
	 * @return the subprocessInstanceId
	 */
	public String getSubprocessInstanceId() {
		return subprocessInstanceId;
	}

	/**
	 * @param subprocessInstanceId
	 *            the subprocessInstanceId to set
	 */
	public void setSubprocessInstanceId(String subprocessInstanceId) {
		this.subprocessInstanceId = subprocessInstanceId;
	}
}
