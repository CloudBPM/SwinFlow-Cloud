/**
 * AdaptiveFlo.com
 */
package com.cloudibpm.core.officecalendar;

import java.util.Calendar;

/**
 * @author CAO Dahai
 * 
 */
public interface OfficeHoursIntervalType extends java.io.Serializable {
	/**
	 * {@link Calendar#MILLISECOND}
	 */
	public static final int MILLISECOND = Calendar.MILLISECOND;
	/**
	 * {@link Calendar#SECOND}
	 * 
	 */
	public static final int SECOND = Calendar.SECOND;
	/**
	 * {@link Calendar#MINUTE}
	 */
	public static final int MINUTE = Calendar.MINUTE;
	/**
	 * {@link Calendar#HOUR_OF_DAY}
	 */
	public static final int HOUR = Calendar.HOUR_OF_DAY;
	/**
	 * {@link Calendar#DATE}
	 */
	public static final int DAY = Calendar.DATE;
	/**
	 * {@link Calendar#WEEK_OF_YEAR}
	 */
	public static final int WEEK = Calendar.WEEK_OF_YEAR;
	/**
	 * {@link Calendar#MONTH}
	 */
	public static final int MONTH = Calendar.MONTH;
	/**
	 * {@link Calendar#YEAR}F
	 */
	public static final int YEAR = Calendar.YEAR;
}
