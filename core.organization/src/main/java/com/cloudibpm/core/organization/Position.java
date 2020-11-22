/**
 * @author Cao Dahai
 * @version 1.0.0 下午09:36:03
 */
package com.cloudibpm.core.organization;

/**
 * 
 * @author Cao Dahai
 * @modified on 2016-07-27 14:36pm
 */
public class Position extends AbstractPosition {

	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = 1070939796369419860L;

	/**
	 * 
	 */
	public Position() {
		setName("Position");
		setClasstypename("Position");
	}

	public String toString() {
		return getName();
	}

}