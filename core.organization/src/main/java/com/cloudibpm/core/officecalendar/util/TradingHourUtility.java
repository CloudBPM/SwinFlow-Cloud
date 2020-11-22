package com.cloudibpm.core.officecalendar.util;

import java.util.Calendar;

import com.cloudibpm.core.officecalendar.OfficeHoursIntervalType;
import com.cloudibpm.core.util.MillisecondConstant;

public class TradingHourUtility {
	/**
	 * Get date time interval between <code>calD1</code> and <code>calD2</code>
	 * according to the specified <code>type</code>. this type is referred to
	 * {@link OfficeHoursIntervalType#MILLISECOND} or
	 * {@link OfficeHoursIntervalType#SECOND} or
	 * {@link OfficeHoursIntervalType#MINUTE} or
	 * {@link OfficeHoursIntervalType#HOUR} or
	 * {@link OfficeHoursIntervalType#DAY} or
	 * {@link OfficeHoursIntervalType#WEEK}.
	 * 
	 * 
	 * @date 2008-9-29 下午10:47:10
	 * @author CAO Dahai
	 * @param calD2
	 * @param calD2
	 * @return
	 */
	public static long getDateTimeInterval(Calendar calD1, Calendar calD2, int type) {
		long d = 0;
		if (type == OfficeHoursIntervalType.MILLISECOND) {
			d = calD2.getTimeInMillis() - calD1.getTimeInMillis();
		} else if (type == OfficeHoursIntervalType.SECOND) {
			d = calD2.getTimeInMillis() - calD1.getTimeInMillis() / MillisecondConstant.SECOND;
		} else if (type == OfficeHoursIntervalType.MINUTE) {
			d = calD2.getTimeInMillis() - calD1.getTimeInMillis() / MillisecondConstant.MINUTE;
		} else if (type == OfficeHoursIntervalType.HOUR) {
			d = calD2.getTimeInMillis() - calD1.getTimeInMillis() / MillisecondConstant.HOUR;
		} else if (type == OfficeHoursIntervalType.DAY) {
			d = calD2.getTimeInMillis() - calD1.getTimeInMillis() / MillisecondConstant.DAY;
		} else if (type == OfficeHoursIntervalType.WEEK) {
			d = calD2.getTimeInMillis() - calD1.getTimeInMillis() / MillisecondConstant.WEEK;
		}
		return d;
	}

}
