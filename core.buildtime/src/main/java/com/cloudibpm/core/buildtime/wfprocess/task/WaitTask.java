/**
 * 
 */
package com.cloudibpm.core.buildtime.wfprocess.task;

/**
 * @author Dahai Cao created on 2011-09-11
 * @version 1.0.0
 */
public class WaitTask extends AbstractTask {

	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = 8610162795297732107L;

	public static final int WORKDAY = 0;
	/**
	 * This property describes that this task will suspend process path for one
	 * or more weeks.
	 */
	public static final int DAY = 1;
	/**
	 * This property describes that this task will suspend process path for one
	 * or more fornights.
	 */
	public static final int WEEK = 2;
	/**
	 * This property describes that this task will suspend process path for one
	 * or more months.
	 */
	public static final int MONTH = 3;
	/**
	 * This property describes that this task will suspend process path for one
	 * or more quarters.
	 */
	public static final int QUARTER = 4;
	/**
	 * This property describes that this task will suspend process path for one
	 * or more quarters.
	 */
	public static final int HOUR = 5;
	/**
	 * This property describes that this task will suspend process path for one
	 * or more quarters.
	 */
	public static final int MINUTE = 6;
	/**
	 * This property describes that this task will suspend process path for one
	 * or more quarters.
	 */
	public static final int SECOND = 7;
	/**
	 * This property describes that this task will suspend process path for one
	 * or more quarters.
	 */
	public static final int MILLISECOND = 8;

	// build time props
	private boolean specificDuration = true;
	private Object timeRule;
	// 0:workday; 1:day; 2:week; 3:month; 4:quarter(3 months);
	// 5:hour; 6:minute; 7:second; 8:millisecond;
	private int timeUnit = 0;

	private int largeDuration = 0;
	// 0:workday; 1:day; 2:week: 3:month; 4:quarter
	private int largeDurationUnit = 0;
	private int hours = 0;
	private int minutes = 0;
	private int seconds = 0;
	private int milliseconds = 0;

	/**
	 * Constructor
	 */
	public WaitTask() {
		setName("Wait Task");
		setClasstypename(this.getClass().getSimpleName());
	}

	@Override
	public Object clone() throws CloneNotSupportedException {
		WaitTask waitTask = (WaitTask) super.clone();
		return waitTask;
	}

	/**
	 * Sets the setting is specific duration.
	 * 
	 * @date 11/10/2011 10:37:03 AM
	 * @param specific
	 */
	public void setSpecificDuration(boolean specificDuration) {
		this.specificDuration = specificDuration;
	}

	/**
	 * Gets whether the setting is specific duration.
	 * 
	 * @date 11/10/2011 10:37:00 AM
	 * @return
	 */
	public boolean isSpecificDuration() {
		return specificDuration;
	}

	/**
	 * Sets a time expression rule for wait task. This expression rule consists
	 * of time functions and can use function to calculate time to satisfy more
	 * specific or flexible requirements. The time function can reference...
	 * 
	 * @param rule
	 */
	public void setTimeRule(Object rule) {
		this.timeRule = rule;
	}

	/**
	 * Gets a time expression rule for wait task. This expression rule consists
	 * of time functions and can use function to calculate time to satisfy more
	 * specific or flexible requirements. The time function can reference...
	 * 
	 * @return the rule
	 */
	public Object getTimeRule() {
		return timeRule;
	}

	/**
	 * Sets a large duration for current task. The duration is non-negative
	 * integer number, such as 0, 1, 2, ..., etc.
	 * 
	 * @date 11/10/2011 10:45:44 AM
	 * @param duration
	 */
	public void setLargeDuration(int duration) {
		this.largeDuration = duration;
	}

	/**
	 * Gets a large duration for current task. The duration is non-negative
	 * integer number, such as 0, 1, 2, ..., etc.
	 * 
	 * @date 11/10/2011 11:00:39 AM
	 * @return
	 */
	public int getLargeDuration() {
		return largeDuration;
	}

	/**
	 * Sets a large duration unit for current task.. The large duration units
	 * include {@link QUARTER}, {@link MONTH}, {@link FORNIGHT}, {@link WEEK},
	 * {@link DAY}.
	 * 
	 * @param unit
	 *            the timeUnit to set
	 */
	public void setLargeDurationUnit(int unit) {
		this.largeDurationUnit = unit;
	}

	/**
	 * Gets a large duration unit for current task. The large duration units
	 * include {@link QUARTER}, {@link MONTH}, {@link FORNIGHT}, {@link WEEK},
	 * {@link DAY}.
	 * 
	 * @return the timeUnit
	 */
	public int getLargeDurationUnit() {
		return this.largeDurationUnit;
	}

	/**
	 * Sets hour duration for current task. The duration is a non-negative
	 * integer number. This means that the task can wait one or more hours.
	 * 
	 * @date 11/10/2011 11:34:43 AM
	 * @param hours
	 */
	public void setHours(int hours) {
		this.hours = hours;
	}

	/**
	 * Gets hour duration for current task. The duration is a non-negative
	 * integer number. This means that the task can wait one or more hours.
	 * 
	 * @date 11/10/2011 11:34:45 AM
	 * @return
	 */
	public int getHours() {
		return this.hours;
	}

	/**
	 * Sets minute duration for current task. The duration is a non-negative
	 * integer number. This means that the task can wait one or more minutes.
	 * 
	 * @date 11/10/2011 11:35:21 AM
	 * @param minutes
	 */
	public void setMinutes(int minutes) {
		this.minutes = minutes;
	}

	/**
	 * Gets minute duration for current task. The duration is a non-negative
	 * integer number. This means that the task can wait one or more minutes.
	 * 
	 * @date 11/10/2011 11:35:25 AM
	 * @return
	 */
	public int getMinutes() {
		return this.minutes;
	}

	/**
	 * Sets second duration for current task. The duration is a non-negative
	 * integer number. This means that the task can wait one or more seconds.
	 * 
	 * @date 11/10/2011 11:36:41 AM
	 * @param seconds
	 */
	public void setSeconds(int seconds) {
		this.seconds = seconds;
	}

	/**
	 * Gets second duration for current task. The duration is a non-negative
	 * integer number. This means that the task can wait one or more seconds.
	 * 
	 * @date 11/10/2011 11:36:43 AM
	 * @return
	 */
	public int getSeconds() {
		return this.seconds;
	}

	/**
	 * Sets millisecond duration for current task. The duration is a
	 * non-negative integer number. This means that the task can wait one or
	 * more milliseconds.
	 * 
	 * @date 11/10/2011 11:37:23 AM
	 * @param milliseconds
	 */
	public void setMilliseconds(int milliseconds) {
		this.milliseconds = milliseconds;
	}

	/**
	 * Gets millisecond duration for current task. The duration is a
	 * non-negative integer number. This means that the task can wait one or
	 * more milliseconds.
	 * 
	 * @date 11/10/2011 11:37:26 AM
	 * @return
	 */
	public int getMilliseconds() {
		return this.milliseconds;
	}

	/**
	 * @return the timeUnit
	 */
	public int getTimeUnit() {
		return timeUnit;
	}

	/**
	 * @param timeUnit
	 *            the timeUnit to set
	 */
	public void setTimeUnit(int timeUnit) {
		this.timeUnit = timeUnit;
	}

}