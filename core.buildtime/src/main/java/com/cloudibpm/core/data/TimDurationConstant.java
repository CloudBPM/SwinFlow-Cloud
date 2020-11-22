package com.cloudibpm.core.data;

import com.cloudibpm.core.buildtime.wfprocess.WfProcess;

import java.util.regex.Pattern;

/**
 * @author Dahai Cao created on 2017-11-27
 */
public class TimDurationConstant extends Constant {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 755083462017797117L;
    private int largeDuration = 0;
    // 0:workday; 1:day; 2:week: 3:month; 4:quarter
    private int largeDurationUnit = 0;
    private int hours = 0;
    private int minutes = 0;
    private int seconds = 0;
    private int milliseconds = 0;

    public TimDurationConstant() {
        this.setValue("");
        this.setDatatype(DataType.TIMEDURATION);
    }

    @Override
    public Object clone(WfProcess owner) {
        TimDurationConstant d = new TimDurationConstant();
        d.setValue(this.getValue());
        d.largeDuration = this.largeDuration;
        d.largeDurationUnit = this.largeDurationUnit;
        d.hours = this.hours;
        d.minutes = this.minutes;
        d.seconds = this.seconds;
        d.milliseconds = this.milliseconds;
        return d;
    }


    @Override
    public boolean equals(Object obj) {
        if (obj == null)
            return false;
        if (obj instanceof TimDurationConstant) {
            if ((this.toString().equals("") && obj.toString().equals(""))) {
                return true;
            } else if (this.getLargeDuration() == ((TimDurationConstant) obj).getLargeDuration()
                    && this.getLargeDurationUnit() == ((TimDurationConstant) obj).getLargeDurationUnit()
                    && this.getHours() == ((TimDurationConstant) obj).getHours()
                    && this.getMinutes() == ((TimDurationConstant) obj).getMinutes()
                    && this.getSeconds() == ((TimDurationConstant) obj).getSeconds()
                    && this.getMilliseconds() == ((TimDurationConstant) obj).getMilliseconds()) {
                return true;
            }
        } else if (obj instanceof String) {// it is used to recognize Expression
            if (this.toString().equals(obj)) {
                return true;
            }
        }
        return false;
    }

    @Override
    public String toExpressionString() {
        String v = this.largeDuration + "|" + this.largeDurationUnit + "|" + this.hours + "|" + this.minutes + "|"
                + this.seconds + "|" + this.milliseconds;
        return "C@" + this.getDatatype() + "@" + v;
    }


    @Override
    public void parseString(String timeduration) {
        if (timeduration == null)
            return;
        String[] ary = timeduration.split("@");
        this.setDatatype(ary[1]);
        String[] ary1 = ary[2].split(Pattern.quote("|"));
        if (ary1.length > 0)
            this.largeDuration = Integer.parseInt(ary1[0]);
        // 0:workday; 1:day; 2:week: 3:month; 4:quarter;
        if (ary1.length > 1)
            this.largeDurationUnit = Integer.parseInt(ary1[1]);
        if (ary1.length > 2)
            this.hours = Integer.parseInt(ary1[2]);
        if (ary1.length > 3)
            this.minutes = Integer.parseInt(ary1[3]);
        if (ary1.length > 4)
            this.seconds = Integer.parseInt(ary1[4]);
        if (ary1.length > 5)
            this.milliseconds = Integer.parseInt(ary1[5]);
    }

    public void setStringValue(String timeduration) {
        if (timeduration == null)
            return;
        String[] ary1 = timeduration.split(Pattern.quote("|"));
        if (ary1.length > 0)
            this.largeDuration = Integer.parseInt(ary1[0]);
        if (ary1.length > 1) // 0:workday; 1:day; 2:week: 3:month; 4:quarter;
            this.largeDurationUnit = Integer.parseInt(ary1[1]);
        if (ary1.length > 2)
            this.hours = Integer.parseInt(ary1[2]);
        if (ary1.length > 3)
            this.minutes = Integer.parseInt(ary1[3]);
        if (ary1.length > 4)
            this.seconds = Integer.parseInt(ary1[4]);
        if (ary1.length > 5)
            this.milliseconds = Integer.parseInt(ary1[5]);
    }

    @Override
    public String getValue() {
        return (this.largeDuration == 0 ? ""
                : this.largeDuration + getDurationName(this.largeDurationUnit)
                + (this.hours == 0 ? "" : this.hours + getDurationName(5))
                + (this.minutes == 0 ? "" : this.minutes + getDurationName(6))
                + (this.seconds == 0 ? "" : this.seconds + getDurationName(7))
                + (this.milliseconds == 0 ? "" : this.milliseconds + getDurationName(8)));
    }


    /**
     * converse time duration to real time in milliseconds
     *
     * @return long
     */
    public long getRealTime() {
        return 0;
    }

    @Override
    public String toString() {
        return getValue();
    }

    private String getDurationName(int i) {
        switch (i) {
            case 0:
                return "工作日";
            case 1:
                return "日";
            case 2:
                return "周";
            case 3:
                return "月";
            case 4:
                return "季度";
            case 5:
                return "小时";
            case 6:
                return "分";
            case 7:
                return "秒";
            case 8:
                return "毫秒";
        }
        return "";
    }

    /**
     * @return the largeDuration
     */
    public int getLargeDuration() {
        return largeDuration;
    }

    /**
     * @param largeDuration the largeDuration to set
     */
    public void setLargeDuration(int largeDuration) {
        if (largeDuration > 0)
            this.largeDuration = largeDuration;
    }

    /**
     * @return the largeDurationUnit
     */
    public int getLargeDurationUnit() {
        return largeDurationUnit;
    }

    /**
     * @param largeDurationUnit the largeDurationUnit to set
     */
    public void setLargeDurationUnit(int largeDurationUnit) {
        if (largeDurationUnit > -1)
            this.largeDurationUnit = largeDurationUnit;
    }

    /**
     * @return the hours
     */
    public int getHours() {
        return hours;
    }

    /**
     * @param hours the hours to set
     */
    public void setHours(int hours) {
        if (hours > 0)
            this.hours = hours;
    }

    /**
     * @return the minutes
     */
    public int getMinutes() {
        return minutes;
    }

    /**
     * @param minutes the minutes to set
     */
    public void setMinutes(int minutes) {
        if (minutes > 0)
            this.minutes = minutes;
    }

    /**
     * @return the seconds
     */
    public int getSeconds() {
        return seconds;
    }

    /**
     * @param seconds the seconds to set
     */
    public void setSeconds(int seconds) {
        if (seconds > 0)
            this.seconds = seconds;
    }

    /**
     * @return the milliseconds
     */
    public int getMilliseconds() {
        return milliseconds;
    }

    /**
     * @param milliseconds the milliseconds to set
     */
    public void setMilliseconds(int milliseconds) {
        if (milliseconds > 0)
            this.milliseconds = milliseconds;
    }

}
