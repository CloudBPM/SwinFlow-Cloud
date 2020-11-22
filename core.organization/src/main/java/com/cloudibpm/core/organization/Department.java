/**
 * 
 */
package com.cloudibpm.core.organization;

/**
 * @author Dahai Cao
 * @version 1.0.0
 * @modified on 2016-07-27 14:36pm
 */
public class Department extends AbstractOrganizationComponent {

	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = 5953731343321391733L;

	public Department() {
		super();
		setName("general deparment");
		setClasstypename("Department");
	}

	public String toString() {
		return getName();
	}
}