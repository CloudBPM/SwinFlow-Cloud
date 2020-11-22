/**
 * @user Dahai CAO
 * @date 13/10/2011 10:17:15 AM
 */
package com.cloudibpm.core.data.function;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;

public class DateTimeFunctions {

    /**
     * Return Gregorian calendar from <code>date</code>.
     * 
     * @date 13/10/2011 11:18:47 AM
     * @param date
     * @return
     */
    private static Calendar getGregorianCalendar(Date date) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String s3 = sdf.format(date);
        int j = (new Integer(s3.substring(0, 4))).intValue();
        int k = (new Integer(s3.substring(5, 7))).intValue();
        int l = (new Integer(s3.substring(8, 10))).intValue();
        int h = (new Integer(s3.substring(11, 13))).intValue();
        int m = (new Integer(s3.substring(14, 16))).intValue();
        int s = (new Integer(s3.substring(17, 19))).intValue();
        GregorianCalendar gregoriancalendar = new GregorianCalendar(j, k - 1,
                l, h, m, s);
        return gregoriancalendar;

    }

    /**
     * Return the date object that is after
     * <code>days<code> from <code>fromDate</code>. For example, current date is
     * 2011-10-13, it is 2011-10-23 after 10 days.
     * 
     * @date 13/10/2011 11:50:16 AM
     * @param fromDate
     * @param days
     * @return
     */
    public static Date afterDays(Date fromDate, int days) {
        GregorianCalendar gregoriancalendar = (GregorianCalendar) getGregorianCalendar(fromDate);
        gregoriancalendar.add(Calendar.DATE, days);
        Date date1 = gregoriancalendar.getTime();
        return date1;
    }

    /**
     * Return the date object that is after
     * <code>months<code> from <code>fromDate</code>. For example, current date
     * is 2011-10-13, it is 2012-02-23 after 4 months.
     * 
     * @date 13/10/2011 11:02:59 AM
     * @param fromDate
     * @param months
     * @return
     */
    public static Date afterMonths(Date fromDate, int months) {
        GregorianCalendar gregoriancalendar = (GregorianCalendar) getGregorianCalendar(fromDate);
        gregoriancalendar.add(Calendar.MONTH, months);
        Date date1 = gregoriancalendar.getTime();
        return date1;
    }

    /**
     * 
     * @date 13/10/2011 12:13:13 PM
     * @param fromDate
     * @param days
     * @return
     */
    public static Date afterWorkDays(Date fromDate, int days) {
        return null;
    }
}
