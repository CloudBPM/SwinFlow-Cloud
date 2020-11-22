/**
 * @author Cao Dahai
 * @version 1.0.0 下午09:40:52
 */
package com.cloudibpm.core.organization;

public class ProjectRole extends AbstractPosition {

	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = -8803090103673727757L;

	/**
	 * 
	 */
	public ProjectRole() {
		setName("Role");
		setClasstypename("ProjectRole");
	}

	public String toString() {
		return getName();
	}
}