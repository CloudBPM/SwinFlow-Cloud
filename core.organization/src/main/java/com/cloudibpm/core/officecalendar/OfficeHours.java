/**
 *
 */
package com.cloudibpm.core.officecalendar;

import com.cloudibpm.core.TreeNode;

/**
 * 该类的功能是负责提供办公时间的显示支持，两个double类型提供时间运算支持，不用于显示；<br>
 * 而两个String类型提供时间显示支持，显示在日历表中。
 *
 * @author Dahai CAO
 * @version 1.0.0
 * @date 2008-10-19
 */
public class OfficeHours extends TreeNode {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 8641008850298672245L;
    private String fromTime = null;
    private String toTime = null;

    public String getFromTime() {
        return fromTime;
    }

    public void setFromTime(String fromTime) {
        this.fromTime = fromTime;
    }

    public String getToTime() {
        return toTime;
    }

    public void setToTime(String toTime) {
        this.toTime = toTime;
    }
}
