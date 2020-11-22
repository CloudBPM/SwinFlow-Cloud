/**
 * 
 */
package com.cloudibpm.runtime.engine.transaction;

import com.cloudibpm.blo.microservice.MicroServiceBlo;
import com.cloudibpm.core.appservice.WebAppService;
import com.cloudibpm.core.buildtime.wfprocess.task.SystemTask;
import com.cloudibpm.core.data.Constant;
import com.cloudibpm.core.data.variable.DataVariable;
import com.cloudibpm.core.runtime.wfprocess.WfProcessInstance;
import com.cloudibpm.core.runtime.wfprocess.task.SystemTaskInstance;
import com.cloudibpm.runtime.util.microservice.RTHttpExecutor;

/**
 * 
 * @author Dahai Cao created on 2011-08-20, last updated at 19:02 on 2018-08-01
 */
public class SystemTaskTransaction extends AbstractTaskTransaction<SystemTask> {

	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = -2997592497429187374L;
	private Object originalValue = null;

	public SystemTaskTransaction(SystemTask task, WfProcessInstance process) {
		super(task, process);
	}

	@Override
	public void begin() throws Exception {
		SystemTaskInstance invokeTask = (SystemTaskInstance) taskInstance;
		DataVariable dv = invokeTask.getReturnObject();
		invokeTask.setStartTime(System.currentTimeMillis());
		if (dv != null) {
			Object o = dv.getValue();
			if (o instanceof Constant) {
				originalValue = ((Constant) o).clone(this.getWfProcessInstance());
			}
		}
	}

	/**
	 * 系统自动任务
	 */
	@Override
	public void commit() throws Exception {
		System.out.println(taskInstance.getName() + " is running.....");
		SystemTaskInstance invokeTask = (SystemTaskInstance) taskInstance;
		WebAppService ws = MicroServiceBlo.getInstance().getAppService(invokeTask.getAppServiceId());
		if (ws.getMethodName().equals("GET")) {
			RTHttpExecutor.doGetAction(ws, invokeTask, this.getWfProcessInstance());
		} else if (ws.getMethodName().equals("POST")) {
			RTHttpExecutor.doPostAction(ws, invokeTask, this.getWfProcessInstance());
		}
		invokeTask.setEndTime(System.currentTimeMillis());
	}

	@Override
	public void rollback() throws Exception {
		SystemTaskInstance invokeTask = (SystemTaskInstance) taskInstance;
		DataVariable dv = invokeTask.getReturnObject();
		if (dv != null) {
			Object o = dv.getValue();
			if (o instanceof Constant) {
				dv.setValue(originalValue);
			}
		}
	}
}