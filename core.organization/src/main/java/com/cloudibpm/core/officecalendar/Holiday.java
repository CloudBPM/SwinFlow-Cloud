package com.cloudibpm.core.officecalendar;

import com.cloudibpm.core.TreeNode;

import java.io.Serializable;
import java.util.Date;

/**
 * @Titel: 假期类
 * @Description: 描述
 * @Author: 作者
 * @CreateDate: 2019/4/15 11:00
 * @Version: 1.0
 */
public class Holiday extends TreeNode implements Serializable {

    private String id;
    private int isHoliday;
    private Date holiday;
    private String parent;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public int getIsHoliday() {
        return isHoliday;
    }

    public void setIsHoliday(int isHoliday) {
        this.isHoliday = isHoliday;
    }

    public Date getHoliday() {
        return holiday;
    }

    public void setHoliday(Date holiday) {
        this.holiday = holiday;
    }

    public String getParent() {
        return parent;
    }

    public void setParent(String parent) {
        this.parent = parent;
    }

}
