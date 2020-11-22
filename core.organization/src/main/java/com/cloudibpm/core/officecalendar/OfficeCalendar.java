/**
 * 
 */
package com.cloudibpm.core.officecalendar;

import com.cloudibpm.core.TreeNode;

/**
 * @author Dahai CAO
 * 
 */
public class OfficeCalendar extends TreeNode {
	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = -1808105711285379387L;
	private int isDefault = 0;

	/**
	 * Constructor
	 * 
	 * @param id
	 *            constructor
	 */
	public OfficeCalendar(String id) {
		this();
		setId(id);
	}

	/**
	 * Constructor
	 */
	public OfficeCalendar() {
	}

	/**
	 * 
	 * @see java.lang.Object#clone()
	 */
	public Object clone() {
		return null;
	}

	public String toString() {
		String str = getName();
		if (this.isDefault == 1) {
			str = str + "*";
		}
		return str;
	}

	public int compareTo(TreeNode o) {
		return 0;
	}

	public int isDefault() {
		return isDefault;
	}

	public void setDefault(int isDefault) {
		this.isDefault = isDefault;
	}
}