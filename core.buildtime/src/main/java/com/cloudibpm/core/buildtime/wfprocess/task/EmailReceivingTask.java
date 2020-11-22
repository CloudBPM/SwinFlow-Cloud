package com.cloudibpm.core.buildtime.wfprocess.task;

public class EmailReceivingTask extends AbstractTask {

	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = -7776640433784092154L;

	public EmailReceivingTask() {
		setName("Email Receiving Task");
		setClasstypename(this.getClass().getSimpleName());
	}

	public EmailReceivingTask(String id) {
		super(id);
		setName("Email Receiving Task");
		setClasstypename(this.getClass().getSimpleName());
	}

}
