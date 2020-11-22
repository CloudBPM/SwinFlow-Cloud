package com.cloudibpm.runtime.engine.transaction;

import com.cloudibpm.core.buildtime.wfprocess.task.AbstractTask;
import com.cloudibpm.core.runtime.wfprocess.WfProcessInstance;

public abstract class AbstractTaskTransaction<E extends AbstractTask> implements Transaction {

	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = -7396457829789987148L;
	protected int status = UNKNOWN;
	protected E taskInstance = null;
	protected WfProcessInstance wfprocessInstance = null;

	public AbstractTaskTransaction(E taskInstance, WfProcessInstance wfprocessInstance) {
		super();
		this.taskInstance = taskInstance;
		this.wfprocessInstance = wfprocessInstance;
	}

	/**
	 * @return the task
	 */
	public E getTaskInstance() {
		return taskInstance;
	}

	public WfProcessInstance getWfProcessInstance() {
		return wfprocessInstance;
	}

	/**
	 * 
	 */
	@Override
	public int getStatus() {
		return status;
	}

	/**
	 * 
	 */
	@Override
	public void setStatus(int status) {
		this.status = status;
	}
}
