/**
 * @user Dahai CAO
 * @date 14/10/2011 4:33:46 PM
 */
package com.cloudibpm.core.buildtime.wfprocess.task;

import com.cloudibpm.core.TreeNode;
import com.cloudibpm.core.data.variable.DataVariable;

/**
 * @author Dahai CAO
 * @date 14/10/2011 4:33:47 PM last updated 2017-11-29
 */
public class Assignment extends TreeNode {

	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = 4662561195742020846L;
	private DataVariable variable;
	private int arrayIndex = -1;
	private String variableString;
	/** expression object (runtime) or expression string (storage) */
	private Object value;
	// 0: Assignment; 1: Subprocess input; 2: Subprocess output
	private int type = 0;

	/**
	 * Constructor
	 */
	public Assignment() {
		setName("Assignment");
	}

	/**
	 * Constructor
	 * 
	 * @param id
	 */
	public Assignment(String id) {
		super(id);
		setName("Assignment");
	}

	/**
	 * @author Dahai CAO
	 * @date 14/10/2011 4:33:47 PM
	 * @param o
	 * @return
	 * @see java.lang.Comparable#compareTo(java.lang.Object)
	 */
	@Override
	public int compareTo(TreeNode o) {
		return 0;
	}

	/**
	 * Clone assignment
	 */
	@Override
	public Object clone() throws CloneNotSupportedException {
		return super.clone();
	}

	/**
	 * @author Dahai CAO
	 * @date 14/10/2011 4:33:47 PM
	 * @return
	 */
	public Object getValue() {
		return value;
	}

	/**
	 * Sets a variable to current assignment. The variable maybe a process-level
	 * variable, i.e. process.var1, process.var2, etc., so the specified
	 * <code>variable</code> is a rule object containing an expression which
	 * contains series of task objects or components.
	 * 
	 * @date 2011-10-14 下午09:16:42
	 * @param variable
	 */
	public void setVariable(DataVariable variable) {
		this.variable = variable;
		if (this.variable != null)
			variableString = this.variable.getId() + "@" + this.variable.getClass().getSimpleName();
	}

	/**
	 * @return the variableString
	 */
	public String getVariableString() {
		return variableString;
	}

	/**
	 * @param variableString
	 *            the variableString to set
	 */
	public void setVariableString(String variableString) {
		this.variableString = variableString;
	}

	/**
	 * Gets a variable to current assignment. The variable maybe a process-level
	 * variable, i.e. process.var1, process.var2, etc., so the specified
	 * <code>variable</code> is a rule object containing an expression which
	 * contains series of task objects or components.
	 * 
	 * @date 2011-10-14 下午09:16:46
	 * @return
	 */
	public DataVariable getVariable() {
		return variable;
	}

	/**
	 * Set a value to current assignment. The value will be assigned to variable
	 * in current assignment object.
	 * 
	 * @date 2011-10-14 下午09:16:51
	 * @param value
	 */
	public void setValue(Object value) {
		this.value = value;
	}

	/**
	 * @return the type
	 */
	public int getType() {
		return type;
	}

	/**
	 * @param type
	 *            the type to set
	 */
	public void setType(int type) {
		this.type = type;
	}

	/**
	 * @return the arrayIndex
	 */
	public int getArrayIndex() {
		return arrayIndex;
	}

	/**
	 * @param arrayIndex
	 *            the arrayIndex to set
	 */
	public void setArrayIndex(int arrayIndex) {
		this.arrayIndex = arrayIndex;
	}

}
