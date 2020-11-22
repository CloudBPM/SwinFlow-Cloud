/**
 * @author Cao Dahai
 * @version 1.0.0 下午07:48:07
 */
package com.cloudibpm.core.organization;

public class ProjectTeam extends AbstractOrganizationComponent {

	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = -4794532011045362701L;

	/**
	 * WfProjectTeam constructor
	 */
	public ProjectTeam() {
		super();
		setName("Project Team");
		setClasstypename("ProjectTeam");
	}

	public String toString() {
		return getName();
	}
}