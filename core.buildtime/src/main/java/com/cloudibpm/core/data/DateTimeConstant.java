/**
 *
 */
package com.cloudibpm.core.data;

import com.cloudibpm.core.buildtime.wfprocess.WfProcess;
import com.cloudibpm.core.util.DateUtility;

import java.util.Calendar;
import java.util.Date;
import java.util.regex.Pattern;

/**
 * @author Dahai Cao created on 2017-11-27
 *
 */
public class DateTimeConstant extends Constant {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 8296078883083516795L;
    // Date time: yyyy-MM-dd HH:mm:ss; Date:yyyy-MM-dd; Time: HH:mm:ss;
    private Calendar realtime = null;
    // 0: not current date time stamp;
    // 1: current date time stamp;
    private int currentDateTime = 1;

    /**
     *
     */
    public DateTimeConstant() {
        this.setDatatype(DataType.DATETIME);
        this.realtime = Calendar.getInstance();
    }

    public Object clone(WfProcess owner) {
        DateTimeConstant d = new DateTimeConstant();
        if (this.currentDateTime == 1) {
            d.realtime = Calendar.getInstance();
        } else {
            d.realtime = this.realtime;
        }
        d.setCurrentDateTime(this.currentDateTime);
        d.setDatatype(this.getDatatype());
        d.setValue(this.getValue());
        return d;
    }

    @Override
    public boolean equals(Object obj) {
        if (obj instanceof DateTimeConstant) {
            if (this.getDatatype().equals(((DateTimeConstant) obj).getDatatype())) {
                if (this.toString().equals(obj.toString())) {
                    return true;
                }
            }
        } else if (obj instanceof String) {// it is used to recognize Expression
            if (this.toString().equals(obj)) {
                return true;
            }
        }
        return false;
    }

    /**
     * @return the currentDateTime
     */
    public int getCurrentDateTime() {
        return currentDateTime;
    }

    /**
     * @param currentDateTime
     *            the currentDateTime to set
     */
    public void setCurrentDateTime(int currentDateTime) {
        this.currentDateTime = currentDateTime;
    }

    /**
     * The <code>datetime</code>'s format can be "yyyy-MM-dd HH:mm:ss"
     * or "yyyy-MM-dd" or "HH:mm:ss".
     *
     * @param datetime
     */
    public void setStringValue(String datetime) {
        if (this.getDatatype().equals("DateTime")) {
            String yyyy = datetime.substring(0, 4);
            String mm = datetime.substring(5, 7);
            String dd = datetime.substring(8, 10);
            String HH = datetime.substring(11, 13);
            String min = datetime.substring(14, 16);
            String ss = datetime.substring(17, 19);
            this.setValue(Integer.parseInt(yyyy), Integer.parseInt(mm), Integer.parseInt(dd),
                    Integer.parseInt(HH), Integer.parseInt(min), Integer.parseInt(ss));
        } else if (this.getDatatype().equals("Date")) {
            String yyyy = datetime.substring(0, 4);
            String mm = datetime.substring(5, 7);
            String dd = datetime.substring(8, 10);
            this.setValue(Integer.parseInt(yyyy), Integer.parseInt(mm), Integer.parseInt(dd),
                    0, 0, 0);
        } else if (this.getDatatype().equals("Time")) {
            String HH = datetime.substring(0, 2);
            String min = datetime.substring(3, 5);
            String ss = datetime.substring(6, 8);
            this.setValue(0, 0, 0,
                    Integer.parseInt(HH), Integer.parseInt(min), Integer.parseInt(ss));
        }
    }

    public void setValue(int yyyy, int MM, int dd, int HH, int min, int ss) {
        this.setCurrentDateTime(0);
        this.realtime = Calendar.getInstance();
        if (this.getDatatype().equals("DateTime")) {
            this.realtime.set(yyyy, MM, dd - 1, HH, min, ss);
            this.setValue(DateUtility.formatDatetime(this.realtime.getTime()));
        } else if (this.getDatatype().equals("Date")) {
            this.realtime.set(yyyy, MM, dd - 1);
            this.setValue(DateUtility.formatDate(this.realtime.getTime()));
        } else if (this.getDatatype().equals("Time")) {
            this.realtime.set(Calendar.HOUR_OF_DAY, HH);
            this.realtime.set(Calendar.MINUTE, min);
            this.realtime.set(Calendar.SECOND, ss);
            this.setValue(DateUtility.formatTime(this.realtime.getTime()));
        }
    }

    public void setRealTime(long datetime) {
        Calendar cal = Calendar.getInstance();
        cal.setTime(new Date(datetime));
        if (this.getDatatype().equals("DateTime")) {
            this.setValue(DateUtility.formatDatetime(this.realtime.getTime()));
        } else if (this.getDatatype().equals("Date")) {
            this.setValue(DateUtility.formatDate(this.realtime.getTime()));
        } else if (this.getDatatype().equals("Time")) {
            this.setValue(DateUtility.formatTime(this.realtime.getTime()));
        }
    }

    public long getRealTime() {
        return this.realtime.getTimeInMillis();
    }

    @Override
    public String toExpressionString() {
        if (this.getDatatype().equals("DateTime")) {
            return "C@" + this.getDatatype() + "@" + this.getCurrentDateTime() + "@" + this.realtime.get(Calendar.YEAR)
                    + "|" + this.realtime.get(Calendar.MONTH) + "|" + this.realtime.get(Calendar.DAY_OF_MONTH) + "|"
                    + this.realtime.get(Calendar.HOUR_OF_DAY) + "|" + this.realtime.get(Calendar.MINUTE) + "|"
                    + this.realtime.get(Calendar.SECOND);
        } else if (this.getDatatype().equals("Date")) {
            return "C@" + this.getDatatype() + "@" + this.getCurrentDateTime() + "@" + this.realtime.get(Calendar.YEAR)
                    + "|" + this.realtime.get(Calendar.MONTH) + "|" + this.realtime.get(Calendar.DAY_OF_MONTH);
        } else if (this.getDatatype().equals("Time")) {
            return "C@" + this.getDatatype() + "@" + this.getCurrentDateTime() + "@"
                    + this.realtime.get(Calendar.HOUR_OF_DAY) + "|" + this.realtime.get(Calendar.MINUTE) + "|"
                    + this.realtime.get(Calendar.SECOND);
        }
        return "";
    }

    @Override
    public void parseString(String str) {
        String[] ary = str.split(Pattern.quote("@"));
        this.setDatatype(ary[1]);
        this.setCurrentDateTime(Integer.parseInt(ary[2]));
        if (ary[2] == "1") {
            this.realtime = Calendar.getInstance();
        } else {
            String[] ds = ary[3].split(Pattern.quote("|"));
            this.realtime = Calendar.getInstance();
            if (this.getDatatype().equals("DateTime")) {
                this.realtime.set(Integer.parseInt(ds[0]), Integer.parseInt(ds[1]), Integer.parseInt(ds[2]),
                        Integer.parseInt(ds[3]), Integer.parseInt(ds[4]), Integer.parseInt(ds[5]));
            } else if (this.getDatatype().equals("Date")) {
                this.realtime.set(Integer.parseInt(ds[0]), Integer.parseInt(ds[1]), Integer.parseInt(ds[2]));
            } else if (this.getDatatype().equals("Time")) {
                this.realtime.set(Calendar.HOUR_OF_DAY, Integer.parseInt(ds[0]));
                this.realtime.set(Calendar.MINUTE, Integer.parseInt(ds[1]));
                this.realtime.set(Calendar.SECOND, Integer.parseInt(ds[2]));
            }
        }
        if (this.getDatatype().equals("DateTime")) {
            this.setValue(DateUtility.formatDatetime(this.realtime.getTime()));
        } else if (this.getDatatype().equals("Date")) {
            this.setValue(DateUtility.formatDate(this.realtime.getTime()));
        } else if (this.getDatatype().equals("Time")) {
            this.setValue(DateUtility.formatTime(this.realtime.getTime()));
        }
    }

    public String toString() {
        if (this.currentDateTime == 1) {
            this.realtime = Calendar.getInstance();
        }
        if (this.realtime != null) {
            return getValue();
//            if (this.getDatatype().equals("DateTime")) {
//                return DateUtility.formatDatetime(this.realtime.getTime());
//            } else if (this.getDatatype().equals("Date")) {
//                return DateUtility.formatDate(this.realtime.getTime());
//            } else if (this.getDatatype().equals("Time")) {
//                return DateUtility.formatTime(this.realtime.getTime());
//            }
        }
        return null;
    }
}
