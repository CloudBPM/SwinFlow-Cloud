/**
 * @user Dahai CAO
 * @date 12/10/2011 4:08:15 PM, last updated at 20:08 on 2018-08-31
 */
package com.cloudibpm.runtime.engine.transaction;

import com.cloudibpm.core.WorkflowEntity;
import com.cloudibpm.core.antlr.evaluation.EvalExprCalculatorUtil;
import com.cloudibpm.core.buildtime.wfprocess.task.WaitTask;
import com.cloudibpm.core.data.Constant;
import com.cloudibpm.core.data.DoubleConstant;
import com.cloudibpm.core.data.IntegerConstant;
import com.cloudibpm.core.data.expression.Expression;
import com.cloudibpm.core.data.function.DateTimeFunctions;
import com.cloudibpm.core.data.variable.ArrayDataVariable;
import com.cloudibpm.core.data.variable.DataVariable;
import com.cloudibpm.core.runtime.wfprocess.WfProcessInstance;
import com.cloudibpm.core.runtime.wfprocess.task.WaitTaskInstance;
import com.cloudibpm.core.util.MillisecondConstant;

import java.util.Calendar;
import java.util.Date;

public class WaitTaskTransaction extends AbstractTaskTransaction<WaitTaskInstance> {
	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = -7746509548454641028L;
	private long originalValue = 0;

	/**
	 * Constructor
	 * 
	 * @param name
	 */
	public WaitTaskTransaction(WaitTaskInstance task, WfProcessInstance process) {
		super(task, process);
	}

	@Override
	public void begin() {
		originalValue = taskInstance.getWaitTime();
		taskInstance.setStartTime(System.currentTimeMillis());
	}

	/**
	 * @author Dahai CAO
	 * @date 12/10/2011 4:08:15 PM
	 * @param monitor
	 * @return
	 * @throws Exception
	 */
	@Override
	public void commit() throws Exception {
		Date currentDate = Calendar.getInstance().getTime();
		long interval = 0L;
		if (taskInstance.isSpecificDuration()) {
			int milliseconds = taskInstance.getMilliseconds();
			int minutes = taskInstance.getMinutes();
			int seconds = taskInstance.getSeconds();
			int hours = taskInstance.getHours();
			if (milliseconds != 0)
				interval = new Long(milliseconds).longValue();
			if (seconds != 0)
				interval += new Long(seconds * MillisecondConstant.SECOND).longValue();
			if (minutes != 0)
				interval += new Long(minutes * MillisecondConstant.MINUTE).longValue();
			if (hours != 0)
				interval += new Long(hours * MillisecondConstant.HOUR).longValue();
			int num = taskInstance.getLargeDuration();
			int unit = taskInstance.getLargeDurationUnit();
			Date tDate = null;
			if (num != 0) {
				if (unit == 0) { // days: wait num*24hours
					tDate = DateTimeFunctions.afterDays(currentDate, num);
				} else if (unit == 1) { // weeks: wait num*24hours*7days
					tDate = DateTimeFunctions.afterDays(currentDate, 7 * num);
				} else if (unit == 2) { // fornights: wait
					// num*24hours*7days*2
					tDate = DateTimeFunctions.afterDays(currentDate, 14 * num);
				} else if (unit == 3) { // months: wait num*24hours*7days*4
					tDate = DateTimeFunctions.afterMonths(currentDate, num);
				} else if (unit == 4) { // quarters: wait
					// num*24hours*7days*4*4
					tDate = DateTimeFunctions.afterMonths(currentDate, 4 * num);
				}
				interval = tDate.getTime() - currentDate.getTime() + interval;
			}
		} else {
			if (taskInstance.getTimeRule() != null && taskInstance.getTimeRule() instanceof Expression) {
				WorkflowEntity e = EvalExprCalculatorUtil.computeValue((Expression) taskInstance.getTimeRule(),
						this.getWfProcessInstance());
				Object val = null;
				if (e instanceof ArrayDataVariable) {
					if (((ArrayDataVariable) e).getValues() != null) {
						Constant[] cs = (Constant[]) ((ArrayDataVariable) e).getValues();
						if (cs.length > 0) {
							for (int j = 0; j < cs.length; j++) {
								// cs[j];
							}
						}
					}
				} else if (e instanceof DataVariable) {
					if (((DataVariable) e).getValue() != null) {
						val = ((DataVariable) e).getValue();
					}
				} else if (e instanceof Constant) {
					val = e;
				}
				int num = 0;
				if (val != null && val instanceof Constant) {
					if (val instanceof DoubleConstant) {
						String s = ((DoubleConstant) val).getValue();
						double d = Double.parseDouble(s);
						num = (int) Math.round(d);
					} else if (val instanceof IntegerConstant) {
						String s = ((IntegerConstant) val).getValue();
						int d = Integer.parseInt(s);
						num = Math.round(d);
					}
				}
				Date tDate = null;
				int unit = taskInstance.getTimeUnit();
				if (unit == WaitTask.WORKDAY) {
					// days: wait num*24hours
					tDate = DateTimeFunctions.afterDays(currentDate, num);
				} else if (unit == WaitTask.DAY) {
					// days: wait num*24hours
					tDate = DateTimeFunctions.afterDays(currentDate, num);
				} else if (unit == WaitTask.WEEK) {
					// weeks: wait num*24hours*7days
					tDate = DateTimeFunctions.afterDays(currentDate, num);
				} else if (unit == WaitTask.MONTH) {
					// months: wait num*24hours*7days*4
					tDate = DateTimeFunctions.afterMonths(currentDate, num);
				} else if (unit == WaitTask.QUARTER) {
					// quarters: wait num*24hours*7days*4*4
					tDate = DateTimeFunctions.afterMonths(currentDate, 4 * num);
				} else if (unit == WaitTask.HOUR) {
					long t = currentDate.getTime();
					t = t + num * 60 * 60 * 1000;
					tDate = new Date(t);
				} else if (unit == WaitTask.MINUTE) {
					long t = currentDate.getTime();
					t = t + num * 60 * 1000;
					tDate = new Date(t);
				} else if (unit == WaitTask.SECOND) {
					long t = currentDate.getTime();
					t = t + num * 1000;
					tDate = new Date(t);
				} else if (unit == WaitTask.MILLISECOND) {
					long t = currentDate.getTime();
					t = t + num;
					tDate = new Date(t);
				}
				interval = tDate.getTime() - currentDate.getTime();
			}

		}
		taskInstance.setWaitTime(interval);
		// should be update to permanent repository....
		if (interval != 0)
			Thread.sleep(interval);
		taskInstance.setEndTime(System.currentTimeMillis());
	}

	@Override
	public void rollback() {
		taskInstance.setWaitTime(originalValue);
	}

}
