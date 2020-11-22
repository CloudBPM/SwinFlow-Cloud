/**
 * 
 */
package com.cloudibpm.core.data;

import com.cloudibpm.core.WorkflowEntity;

/**
 * 
 * @author Dahai Cao created on 2011-08-11
 * @date 2017-10-10 last updated.
 */
public class NullValue extends WorkflowEntity {

	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = 2076002430478997100L;

	/**
	 * Constructor with a null variable.
	 */
	public NullValue() {
		setId("null");
		setName("null");
	}
	
	public Object clone() {
		return new NullValue();
	}

	/**
	 * This name can be "null" or "NULL" or "Null" or "空", etc.
	 * 
	 * @param name
	 */
	public NullValue(String name) {
		setId("null");
		setName(name);
	}

	/**
	 * Returns a string of this null value. The string format is
	 * <p>
	 * N@null@null
	 * </p>
	 * <p>
	 * Note: this string is used to store the object into repository.
	 * </p>
	 * 
	 * @author Dahai CAO
	 * @date 25/03/2011 9:30:15 PM
	 * @return
	 */
	public String toExpressionString() {
		return "N@null@null";//$NON-NLS-1$
	}

	/**
	 * 
	 * @author Dahai CAO
	 * @date 25/03/2011 9:39:31 PM
	 * @return
	 * @see java.lang.Object#toString()
	 */
	public String toString() {
		return "空值";
	}
}
