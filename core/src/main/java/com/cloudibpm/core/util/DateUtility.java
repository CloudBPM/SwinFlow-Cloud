package com.cloudibpm.core.util;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;

public final class DateUtility implements java.io.Serializable {
	/**
	 * serialVersionUID
	 */
	public static final long serialVersionUID = -6583948679465935505L;

	/**
	 * Computes duration term.
	 * 
	 * @param duration
	 * @return
	 */
	public static String computeDuration(long duration) {
		String dur = ""; //$NON-NLS-1$
		long temp = duration;
		if (temp > MillisecondConstant.DAY) {
			dur = dur + (temp / MillisecondConstant.DAY) + "Days "; //$NON-NLS-1$
			temp = temp % MillisecondConstant.DAY;
		}
		if (temp > MillisecondConstant.HOUR) {
			dur = dur + (temp / MillisecondConstant.HOUR) + "Hours "; //$NON-NLS-1$
			temp = temp % MillisecondConstant.HOUR;
		}
		if (temp > MillisecondConstant.MINUTE) {
			dur = dur + (temp / MillisecondConstant.MINUTE) + "Minutes "; //$NON-NLS-1$
			temp = temp % MillisecondConstant.MINUTE;
		}
		// if (temp > SECOND) {
		// dur = dur + (temp / SECOND) + "Seconds"; //$NON-NLS-1$
		// }
		return dur;
	}

	/**
	 * Get current system date time according to the default pattern
	 * <code>yyyy-MM-dd HH:mm:ss</code>.
	 * 
	 * @date 2008-9-29 下午10:50:04
	 * @author CAO Dahai
	 * @return
	 */
	public static String getCurDateTime() {
		java.util.Date date = new java.util.Date();
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String d = sdf.format(date);
		return d;
	}

	public static String getCurrentDate() {
		java.util.Date date = new java.util.Date();
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		String d = sdf.format(date);
		return d;
	}

	/**
	 * Parse date string into Date object according to default pattern
	 * <code>yyyy-MM-dd HH:mm:ss</code>
	 * 
	 * @date 2008-9-29 下午10:49:49
	 * @author CAO Dahai
	 * @param datestr
	 * @return
	 * @throws ParseException
	 */
	public static Date parseDatetime(String datestr) throws ParseException {
		SimpleDateFormat sdf = null;
		if (datestr != null && !datestr.equals("")) {
			sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			java.util.Date tempDate = sdf.parse(datestr);
			return tempDate;
		} else {
			return null;
		}
	}

	public static Date parseDate(String datestr) throws ParseException {
		SimpleDateFormat sdf = null;
		if (datestr != null && !datestr.equals("")) {
			sdf = new SimpleDateFormat("yyyy-MM-dd");
			java.util.Date tempDate = sdf.parse(datestr);
			return tempDate;
		} else {
			return null;
		}
	}

	/**
	 * Parse date string into Date object according to the specified pattern
	 * 
	 * @date 2008-9-29 下午10:49:31
	 * @author CAO Dahai
	 * @param datestr
	 * @param pattern
	 * @return
	 * @throws ParseException
	 */
	public static Date parseDatetime(String datestr, String pattern) throws ParseException {
		SimpleDateFormat sdf = null;
		if (datestr != null && !datestr.equals("")) {
			sdf = new SimpleDateFormat(pattern);
			java.util.Date tempDate = sdf.parse(datestr);
			return tempDate;
		} else {
			throw new ParseException("Parsing Arguments Error->>", 0);
		}
	}

	/**
	 * Format date object according to the default pattern
	 * <code>yyyy-MM-dd HH:mm:ss</code>, e.g., 2017-11-27 23:59:59
	 * 
	 * @see DateUtility#DEFAULT_PATTERN
	 * @date 2008-9-29 下午10:49:03
	 * @author CAO Dahai
	 * @param dt
	 * @return
	 */
	public static String formatDatetime(Date dt) {
		if (dt != null) {
			return (new SimpleDateFormat("yyyy-MM-dd HH:mm:ss")).format(dt);
		}
		return null;
	}

	/**
	 * Format date like pattern<code>yyyy-MM-dd/code>, e.g., 2017-11-27
	 * 
	 * @date 2017-11-27
	 * @author CAO Dahai
	 * @param dt
	 * @return
	 */
	public static String formatDate(Date dt) {
		if (dt != null) {
			return (new SimpleDateFormat("yyyy-MM-dd")).format(dt);
		}
		return null;
	}

	/**
	 * Format date like<code>HH:mm:ss</code>, HH is 24-hour clock, e.g.,
	 * 23:58:59
	 * 
	 * @date 2017-11-27
	 * @author CAO Dahai
	 * @param dt
	 * @return
	 */
	public static String formatTime(Date dt) {
		if (dt != null) {
			return (new SimpleDateFormat("HH:mm:ss")).format(dt);
		}
		return null;
	}

	public static String formatTimeMilliseconds(Date dt) {
		if (dt != null) {
			return (new SimpleDateFormat("yyyy-MM-dd HH:mm:ss,SSS")).format(dt);
		}
		return null;
	}

	/**
	 * Format date object according to the specified pattern.
	 * 
	 * @param dt
	 * @param pattern
	 * @return
	 */
	public static String formatDatetime(Date dt, String pattern) {
		if (dt != null) {
			return (new SimpleDateFormat(pattern).format(dt));
		}
		return null;
	}

	/**
	 * 返回数天后的日期。
	 * 
	 * @param curDate
	 * @param days
	 * @return
	 */
	public static Date getDateAfter(Date curDate, int days) {
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String s3 = sdf.format(curDate);
		int j = (new Integer(s3.substring(0, 4))).intValue();
		int k = (new Integer(s3.substring(5, 7))).intValue();
		int l = (new Integer(s3.substring(8, 10))).intValue();
		int h = (new Integer(s3.substring(11, 13))).intValue();
		int m = (new Integer(s3.substring(14, 16))).intValue();
		int s = (new Integer(s3.substring(17, 19))).intValue();
		GregorianCalendar gregoriancalendar = new GregorianCalendar(j, k - 1, l, h, m, s);
		gregoriancalendar.add(Calendar.DATE, days);
		Date date1 = gregoriancalendar.getTime();
		return date1;
	}

	/**
	 * Get day name of week.
	 * 
	 * @author Dahai CAO
	 * @date 2008-11-2 下午11:22:02
	 * @param day
	 * @param isAbbreviate
	 * @return
	 */
	public static String getDayOfWeek(int day, boolean isAbbreviate) {
		String weekday = null;
		if (day == 1) {
			if (isAbbreviate) {
				weekday = "SUN.";
			} else {
				weekday = "Sunday";
			}
		} else if (day == 2) {
			if (isAbbreviate) {
				weekday = "MON.";
			} else {
				weekday = "Monday";
			}
		} else if (day == 3) {
			if (isAbbreviate) {
				weekday = "TUE.";
			} else {
				weekday = "Tuesday";
			}
		} else if (day == 4) {
			if (isAbbreviate) {
				weekday = "WED.";
			} else {
				weekday = "Wednesday";
			}
		} else if (day == 5) {
			if (isAbbreviate) {
				weekday = "THU.";
			} else {
				weekday = "Thursday";
			}
		} else if (day == 6) {
			if (isAbbreviate) {
				weekday = "FRI.";
			} else {
				weekday = "Friday";
			}
		} else if (day == 7) {
			if (isAbbreviate) {
				weekday = "SAT.";
			} else {
				weekday = "Saturday";
			}
		}
		return weekday;
	}
}
