/**
 * 
 */
package com.cloudibpm.core.runtime.wfprocess.task;

/**
 * @author Dahai Cao created on 20180313 Manual task instance submission phases:
 *         <UL>
 *         <li>-1: by default;</li>
 *         <li>0: wait for fetching;</li>
 *         <li>1: fetched but not submit yet;</li>
 *         <li>2: submitted;</li>
 *         <li>3: returned;</li>
 *         </UL>
 *
 */
public interface ManualTaskInstancePhase {
	/**
	 * This property describes initial phase of task instance.
	 */
	int DEFAULT = -1;
	int WAIT_FOR_FETCHING = 0;
	int FETCHED_BUT_NOT_SUBMIT = 1;
	int SUBMITTED = 2;
	int RETURNED = 3;
}
