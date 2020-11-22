/**
 * 
 */
package com.cloudibpm.core.buildtime.wfprocess;

import java.io.Serializable;

/**
 * @author Dahai Cao created on 2018-03-15
 *
 */
public interface ParticipationType extends Serializable {
	/**
	 * This is a default status of a process or a process instance
	 */
	public static final int NO_PARTICIPANT_APP = 0;
	/**
	 * Process is unlocked. This property is used to support team work for
	 * process modeling.
	 */
	public static final int SINGLE_PARTICIPANT_APP = 1;
	/**
	 * Process is locked. This property is used to support team work for process
	 * modeling.
	 */
	public static final int MULTIPLE_PARTICIPANT_APP = 2;
}
