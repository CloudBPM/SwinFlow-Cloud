package com.cloudibpm.core.buildtime.wfprocess;

public interface WfProcessStatus {
	/**
	 * This is a default status of a process or a process instance
	 */
	public static final int DEFAULT = 0;
	/**
	 * Process is unlocked. This property is used to support team work for
	 * process modeling.
	 */
	public static final int UNLOCKED = 1;
	/**
	 * Process is locked. This property is used to support team work for process
	 * modeling.
	 */
	public static final int LOCKED = 2;
	/**
	 * Process is released to web
	 */
	public static final int RELEASED = 3;
	/**
	 * Process is instantiated and launched.
	 */
	public static final int LAUNCHED = 4;
	/**
	 * Process is running
	 */
	public static final int RUNNING = 5;
	/**
	 * Process is suspended
	 */
	public static final int SUSPENDED = 6;
	/**
	 * Process is terminated
	 */
	public static final int TERMINATED = 7;
	/**
	 * Process completed
	 */
	public static final int COMPLETED = 8;

	public void setStatus(int status);

	public int getStatus();
	
	public String toNameWithStatus();
	
	public String getStatusName();
}
