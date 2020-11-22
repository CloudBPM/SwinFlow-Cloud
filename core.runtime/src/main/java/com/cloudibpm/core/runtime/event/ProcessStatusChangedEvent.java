/**
 * 
 */
package com.cloudibpm.core.runtime.event;

import com.cloudibpm.core.runtime.wfprocess.WfProcessInstance;

/**
 * @author cdh
 * 
 */
public class ProcessStatusChangedEvent extends WorkflowEvent {

	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = 5133767698876549960L;

	/**
	 * 
	 */
	public ProcessStatusChangedEvent() {
		super();
	}

	/**
	 * @param type
	 * @param eventSource
	 * @param description
	 */
	public ProcessStatusChangedEvent(int type, WfProcessInstance eventSource) {
		super();
		this.setType(type);
		this.setEventSourceId(eventSource.getId());
		this.setName(eventSource.getName() + "(" + eventSource.getVersion() + ")");
		this.setStatus(eventSource.getStatus());
		String description = "";
		if (type == PROCESS_LAUNCHED)
			description = this.getName() + " launched.";
		else if (type == PROCESS_INITIATED)
			description = this.getName() + " initiated.";
		else if (type == PROCESS_RUNNED)
			description = this.getName() + " running.";
		else if (type == PROCESS_SUSPENDED)
			description = this.getName() + " suspended.";
		else if (type == PROCESS_RESUMED)
			description = this.getName() + " resumed.";
		else if (type == PROCESS_TERMINATED)
			description = this.getName() + " terminated.";
		else if (type == PROCESS_COMPLETED)
			description = this.getName() + " completed.";
		else if (type == PROCESS_MODIFIED)
			description = this.getName() + " modified for adaption.";
		else if (type == PROCESS_EXPORTED_TO_BUILDTIME)
			description = this.getName() + " exported to buildtime repository.";
		this.setDescription(description);
		this.setParent(eventSource.getId());
		this.setOwner(eventSource.getOwner());
	}

	public ProcessStatusChangedEvent(int type, WfProcessInstance eventSource, String cause) {
		super();
		this.setType(type);
		this.setEventSourceId(eventSource.getId());
		this.setName(eventSource.getName() + "(" + eventSource.getVersion() + ")");
		this.setStatus(eventSource.getStatus());
		this.setDescription(this.getName() + "'s satus is changed by " + cause);
		this.setParent(eventSource.getId());
		this.setOwner(eventSource.getOwner());
	}
}
