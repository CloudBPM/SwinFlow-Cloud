/**
 * 
 */
package com.cloudibpm.core.buildtime.wfprocess.task;

/**
 * @author dev
 * 
 */
public class SMSReceivingTask extends AbstractTask {

	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = -5476523777897733589L;

	/**
	 * 
	 */
	public SMSReceivingTask() {
		setName("SMS Receiving Task");
		setClasstypename(this.getClass().getSimpleName());
	}

	/**
	 * @param id
	 */
	public SMSReceivingTask(String id) {
		super(id);
		setName("SMS Receiving Task");
		setClasstypename(this.getClass().getSimpleName());
	}

}
