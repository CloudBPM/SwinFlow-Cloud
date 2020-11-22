/**
 * 
 */
package com.cloudibpm.core.organization;

/**
 * @author Administrator
 * 
 */
public interface ResourceStatus {

	/**
	 * This property describes that this department is on the "unused" state.
	 */
	public static final int OFFLINE = 0;
	/**
	 * This property describes that this department is on the "used" state.
	 */
	public static final int ONLINE = 1;
	/**
	 * This property describes that this department is on the "write off" state.
	 */
	public static final int WRITEOFF = -1;
}
