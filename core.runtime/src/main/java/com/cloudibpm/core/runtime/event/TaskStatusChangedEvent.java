/**
 * 
 */
package com.cloudibpm.core.runtime.event;

import com.cloudibpm.core.buildtime.wfprocess.task.AbstractTask;
import com.cloudibpm.core.runtime.wfprocess.WfProcessInstance;

/**
 * 
 * @author cdh
 * @date 2017-10-03 last updated
 */
public class TaskStatusChangedEvent extends WorkflowEvent {

	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = -5287325756967609391L;

	/**
	 * 
	 */
	public TaskStatusChangedEvent() {
		super();
	}

	/**
	 * Task status changed event.
	 * 
	 * @param type
	 * @param eventSource
	 * @param eventSourceParent
	 */
	public TaskStatusChangedEvent(int type, AbstractTask eventSource, WfProcessInstance sourceOwner) {
		super();
		this.setType(type);
		this.setEventSourceId(eventSource.getId());
		this.setStatus(eventSource.getStatus());
		String eventName = sourceOwner.getName() + "(" + sourceOwner.getVersion() + ")" + "." + eventSource.getName();
		this.setName(eventName);
		if (type == TASK_ENABLED)
			eventName = eventName + " enabled.";
		else if (type == TASK_RUNNED)
			eventName = eventName + " running.";
		else if (type == TASK_COMPLETED)
			eventName = eventName + " completed.";
		else if (type == TASK_UNUSED)
			eventName = eventName + " unused.";
		else if (type == TASK_EXCEPTION)
			eventName = eventName + " has exception.";
		else if (type == TASK_SKIPPED)
			eventName = eventName + " skipped.";
		else if (type == TASK_TERMINATED)
			eventName = eventName + " terminated.";
		this.setDescription(eventName);
		this.setParent(sourceOwner.getId());
		this.setCurrOwner(eventSource.getCurrOwner());
		this.setOwner(eventSource.getOwner());
	}

	/**
	 * 
	 * @param type
	 * @param eventSource
	 * @param cause
	 * @param eventSourceParent
	 */
	public TaskStatusChangedEvent(int type, AbstractTask eventSource, String cause, WfProcessInstance sourceOwner) {
		super();
		this.setType(type);
		this.setEventSourceId(eventSource.getId());
		this.setName(sourceOwner.getName() + "(" + sourceOwner.getVersion() + ")" + "." + eventSource.getName());
		this.setStatus(eventSource.getStatus());
		this.setDescription(this.getName() + "'s status is changed by " + cause);
		this.setParent(sourceOwner.getId());
		this.setCurrOwner(eventSource.getCurrOwner());
		this.setOwner(eventSource.getOwner());
	}
}
