package com.cloudibpm.core.holiday;

import com.cloudibpm.core.TreeNode;

/**
 * 法定假日安排
 */
public class HolidayArrangement extends TreeNode {

    /**
     * 0: is holiday（法定假日）; 1: working day（调休）
     */
    private int isHoliday = 0;

    private long Holiday = 0;

    public int getIsHoliday() {
        return isHoliday;
    }

    public void setIsHoliday(int isHoliday) {
        this.isHoliday = isHoliday;
    }

    public long getHoliday() {
        return Holiday;
    }

    public void setHoliday(long holiday) {
        Holiday = holiday;
    }
}
