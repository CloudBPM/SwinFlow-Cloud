/**
 * 
 */
package com.cloudibpm.runtime.engine.transaction;

import com.cloudibpm.core.runtime.wfprocess.task.ManualTaskInstance;
import com.cloudibpm.runtime.engine.PEngine;

/**
 * @author Caodahai created on 2016-11-05, last updated on 2018-03-07
 *
 */
public class CompleteManualTaskTransaction extends AbstractTaskTransaction<ManualTaskInstance> {

	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = -1925583170755963684L;
	// private String tempId = null;
	private PEngine pengine = null;

	public CompleteManualTaskTransaction(ManualTaskInstance task, PEngine pengine) {
		super(task, pengine.getInstance());
		this.pengine = pengine;
	}

	@Override
	public void begin() throws Exception {
	}

	@Override
	public void commit() throws Exception {
		//System.out.println(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>11");
		taskInstance.setEndTime(System.currentTimeMillis());
	}

	@Override
	public void rollback() throws Exception {

	}

}
