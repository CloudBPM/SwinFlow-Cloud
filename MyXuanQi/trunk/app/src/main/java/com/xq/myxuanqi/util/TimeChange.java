package com.xq.myxuanqi.util;

import java.util.Calendar;
import java.util.Date;

public class TimeChange {

    public static final int TIME = 0;
    public static final int DATE = 1;

    public TimeChange() {}

    /**
     *
     * @param longTime  需要计算的时间戳， 精确到毫秒
     * @return  不符合条件返回false，成功则返回日期
     */
    public static String longToStringDate(long longTime, int type) {
        String stringTime = "" + longTime;
        if (stringTime.length() != 13) {
            return "false";
        }
        Calendar calendar = Calendar.getInstance();
        //获取当前时间
        int nowYear, nowMonth, nowDay, nowHour, nowMinutes, nowSeconds;
        nowYear = calendar.get(Calendar.YEAR);
        nowMonth = calendar.get(Calendar.MONTH);
        nowDay = calendar.get(Calendar.DAY_OF_MONTH);
        nowHour = calendar.get(Calendar.HOUR_OF_DAY);
        nowMinutes = calendar.get(Calendar.MINUTE);
        nowSeconds = calendar.get(Calendar.SECOND);

        //获取过去时间
        Date oldTime = new Date(longTime);
        calendar.setTime(oldTime);
        int oldYear, oldMonth, oldDay, oldHour, oldMinutes, oldSeconds;
        oldYear = calendar.get(Calendar.YEAR);
        oldMonth = calendar.get(Calendar.MONTH);
        oldDay = calendar.get(Calendar.DAY_OF_MONTH);
        oldHour = calendar.get(Calendar.HOUR_OF_DAY);
        oldMinutes = calendar.get(Calendar.MINUTE);
        oldSeconds = calendar.get(Calendar.SECOND);



        StringBuffer timeResult = new StringBuffer("");
        if (nowYear - oldYear < 0) {
            return "false";
        }
        if (nowYear - oldYear > 0) {
            timeResult.append(oldYear)
                    .append("-")
                    .append(oldMonth + 1)
                    .append("-")
                    .append(oldDay);
        } else if (nowMonth - oldMonth > 0 || nowDay - oldDay > 0) {
            timeResult.append(oldMonth + 1)
                    .append("-")
                    .append(oldDay)
                    .append("  ");
        }

        if ((nowYear - oldYear == 0 && nowMonth - oldMonth == 0 && nowDay - oldDay == 0) || type == TIME) {
            timeResult.append(oldHour)
                    .append(":");
            if (oldMinutes < 10) {  //分钟小于10则加一个前导0
                timeResult.append("0");
            }
            timeResult.append(oldMinutes);
        }
        return timeResult.toString();
    }

    public static String long2String(long time) {
        int sec = (int) time / 1000;
        int min = sec / 60;
        sec %= 60;
        return min < 10 ? (sec < 10 ? "0" + min + ":0" + sec : "0" + min + ":" + sec) : (sec < 10 ? min + ":0" + sec : min + ":" + sec);
    }

    private final static long minute = 60 * 1000;// 1分钟
    private final static long hour = 60 * minute;// 1小时
    private final static long day = 24 * hour;// 1天
    private final static long month = 31 * day;// 月
    private final static long year = 12 * month;// 年

    /**
     * 返回文字描述的日期
     *
     * @param date
     * @return
     */
    public static String getTimeFormatText(Date date) {
        if (date == null) {
            return null;
        }
        long diff = new Date().getTime() - date.getTime();
        long r = 0;
        if (diff > year) {
            r = (diff / year);
            return r + "年前";
        }
        if (diff > month) {
            r = (diff / month);
            return r + "个月前";
        }
        if (diff > day) {
            r = (diff / day);
            return r + "天前";
        }
        if (diff > hour) {
            r = (diff / hour);
            return r + "个小时前";
        }
        if (diff > minute) {
            r = (diff / minute);
            return r + "分钟前";
        }
        return "刚刚";
    }
}
