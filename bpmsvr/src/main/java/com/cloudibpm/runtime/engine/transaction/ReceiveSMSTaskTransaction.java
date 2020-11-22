/**
 * 
 */
package com.cloudibpm.runtime.engine.transaction;

import com.cloudibpm.core.runtime.wfprocess.WfProcessInstance;
import com.cloudibpm.core.runtime.wfprocess.task.SMSReceivingTaskInstance;

/**
 * 这个类是接收短信事务，接收短信是根据任务的设置，连接远程服务器，获取特定手机号的短信内容，并把短信内容存储在流程变量中。
 * 
 * @author Dahai Cao created at 15:01 on 2018-08-31
 */
public class ReceiveSMSTaskTransaction extends AbstractTaskTransaction<SMSReceivingTaskInstance> {

	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = -2997592497429187374L;
	// private Object originalValue = null;

	public ReceiveSMSTaskTransaction(SMSReceivingTaskInstance task, WfProcessInstance process) {
		super(task, process);
	}

	@Override
	public void begin() throws Exception {
		taskInstance.setStartTime(System.currentTimeMillis());
		// SMSReceivingTaskInstance t = (SMSReceivingTaskInstance) taskInstance;
	}

	/**
	 * 系统自动任务
	 */
	@Override
	public void commit() throws Exception {
		System.out.println(taskInstance.getName() + " is running.....");
		taskInstance.setEndTime(System.currentTimeMillis());
	}

	@Override
	public void rollback() throws Exception {
		// SMSReceivingTaskInstance t = (SMSReceivingTaskInstance) taskInstance;

	}
}