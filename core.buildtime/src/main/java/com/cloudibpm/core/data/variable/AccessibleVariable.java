/**
 * 
 */
package com.cloudibpm.core.data.variable;

import com.cloudibpm.core.TreeNode;

/**
 * This class is used to support the variable list under a task (start point,
 * manual task).
 * 
 * @author Dahai Cao designed and created on 2016-10-18
 *
 */
public class AccessibleVariable extends TreeNode {
	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = 1906520018725385039L;
	private String taskId = null;
	// data variable ID in current process
	private String varId = null;
	// 0: read; 1: write
	private int accessControl = 0;
	private String classtypename = "AccessibleVariable";
	// form component ID
	private String componentId = null;

	/**
	 * 
	 */
	public AccessibleVariable() {
		setName("Accessible Variable");
		setClasstypename(this.getClass().getSimpleName());
	}

	public String getVarId() {
		return varId;
	}

	public void setVarId(String varId) {
		this.varId = varId;
	}

	public int getAccessControl() {
		return accessControl;
	}

	public void setAccessControl(int accessControl) {
		this.accessControl = accessControl;
	}

	/**
	 * @return the classtypename
	 */
	public String getClasstypename() {
		return classtypename;
	}

	/**
	 * @param classtypename
	 *            the classtypename to set
	 */
	public void setClasstypename(String classtypename) {
		this.classtypename = classtypename;
	}

	/**
	 * @return the componentId
	 */
	public String getComponentId() {
		return componentId;
	}

	/**
	 * @param componentId
	 *            the componentId to set
	 */
	public void setComponentId(String componentId) {
		this.componentId = componentId;
	}

	/**
	 * @return the taskId
	 */
	public String getTaskId() {
		return taskId;
	}

	/**
	 * @param taskId the taskId to set
	 */
	public void setTaskId(String taskId) {
		this.taskId = taskId;
	}

}
