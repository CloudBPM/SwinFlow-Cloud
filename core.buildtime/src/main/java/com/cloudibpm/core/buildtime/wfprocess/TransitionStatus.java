package com.cloudibpm.core.buildtime.wfprocess;

public interface TransitionStatus {
	/**
	 * This status of transition is default status. that is, it is unused
	 * status.
	 */
	public static final int DEFAULT = 0;

	/**
	 * This status of transition is enabled
	 */
	public static final int ENABLED = 1;

	/**
	 * This status of transition is executed, that is, it has completed
	 * transition.
	 */
	public static final int COMPLETED = 2;

	/**
	 * This status of transition is unused, that is, it did not be use during
	 * process execution.
	 */
	public static final int UNUSED = 3;

	/**
	 * This status of transition is unused, that is, it did not be use during
	 * process execution.
	 */
	public static final int EXCEPTION = 4;

	public void setStatus(int status);

	public int getStatus();

	public String getStatusName();
}
