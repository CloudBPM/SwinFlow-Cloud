package com.cloudibpm.core.job;

import com.cloudibpm.core.TreeNode;

/**
 * 加班、值班、倒班安排
 */
public class OvertimeWorkArrangement extends TreeNode {

    private long fomTime = 0;

    private long toTime = 0;

    public long getFomTime() {
        return fomTime;
    }

    public void setFomTime(long fomTime) {
        this.fomTime = fomTime;
    }

    public long getToTime() {
        return toTime;
    }

    public void setToTime(long toTime) {
        this.toTime = toTime;
    }
}
