/**
 * 
 */
package com.cloudibpm.core.runtime.event;


/**
 * @author dcao
 * 
 */
public class WorkflowEvent extends Event {

	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = -8849938094617331947L;

	public static final int PROCESS_EXCEPTION = -1;
	public static final int PROCESS_LAUNCHED = 0;
	public static final int PROCESS_INITIATED = 1;
	public static final int PROCESS_RUNNED = 2;
	public static final int PROCESS_SUSPENDED = 3;
	public static final int PROCESS_RESUMED = 4;
	public static final int PROCESS_TERMINATED = 5;
	public static final int PROCESS_COMPLETED = 6;
	public static final int PROCESS_MODIFIED = 7;
	public static final int PROCESS_EXPORTED_TO_BUILDTIME = 8;

	public static final int TASK_ENABLED = 9;
	public static final int TASK_RUNNED = 10;
	public static final int TASK_COMPLETED = 11;
	public static final int TASK_UNUSED = 12;
	public static final int TASK_EXCEPTION = 13;
	public static final int TASK_SKIPPED = 14;
	public static final int TASK_TERMINATED = 15;

	public static final int TRANSITION_ENABLED = 16;
	public static final int TRANSITION_COMPLETED = 17;
	public static final int TRANSITION_UNUSED = 18;
	public static final int TRANSITION_EXCEPTION = 19;

	public static final int TRANSACTION_STARTED = 20;
	public static final int TRANSACTION_COMPLETED = 21;
	public static final int TRANSACTION_TRMINATED = 22;
	public static final int TRANSACTION_ROLLBACK = 23;

	private String eventSourceId;
	private int status;

	public WorkflowEvent() {
		super();
	}

	public int getStatus() {
		return status;
	}

	public void setStatus(int status) {
		this.status = status;
	}

	public String getEventSourceId() {
		return eventSourceId;
	}

	public void setEventSourceId(String eventSourceId) {
		this.eventSourceId = eventSourceId;
	}
}
