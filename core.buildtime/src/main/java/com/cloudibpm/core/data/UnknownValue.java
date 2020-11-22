package com.cloudibpm.core.data;

import com.cloudibpm.core.WorkflowEntity;

/**
 * This class represents an unknown data value we can not get to know. It is not
 * null value.
 * 
 * @user Dahai CAO
 * @date 25/03/2011 9:30:15 PM
 */
public class UnknownValue extends WorkflowEntity {

	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = -1407303834692971654L;

	/**
	 * Constructor with an unknown variable.
	 */
	public UnknownValue() {
		setId("unknown");
		setName("unknown");
	}

	public Object clone() {
		return new UnknownValue();
	}

	/**
	 * Returns a string of this unknown value. The string format is
	 * <p>
	 * U@variable name@unknown, e.g., U@abc@unknown, here, abc is variable name.
	 * On the other hand, the default variable name is 'unknown' string. That
	 * is, default string of unknown value is U@unknown@unknown.
	 * </p>
	 * <p>
	 * Note: this string is used to store the object into repository.
	 * </p>
	 * 
	 * @author Dahai CAO
	 * @date 25/03/2011 9:30:15 PM
	 * @return
	 * @see com.cloudibpm.core.data.UnknownValue#toExpressionString()
	 */
	public String toExpressionString() {
		if (getName() != null)
			return "U@" + getName().trim() + "@unknown";//$NON-NLS-1$ $NON-NLS-2$
		return "U@unknown@unknown";//$NON-NLS-1$
	}

	/**
	 * 
	 * @author Dahai CAO
	 * @date 25/03/2011 9:39:31 PM
	 * @return
	 * @see java.lang.Object#toString()
	 */
	public String toString() {
		return "未知数据";
	}

}
