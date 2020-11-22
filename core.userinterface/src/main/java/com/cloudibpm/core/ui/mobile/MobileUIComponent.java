package com.cloudibpm.core.ui.mobile;

import com.cloudibpm.core.TreeNode;

public class MobileUIComponent extends TreeNode {
    private long createDateTime = 0;
    private long lastupdate = 0;
    //private boolean editing = true;
    private String classtypename = "MobileUIComponent";

    public long getCreateDateTime() {
        return createDateTime;
    }

    public void setCreateDateTime(long createDateTime) {
        this.createDateTime = createDateTime;
    }

    public long getLastupdate() {
        return lastupdate;
    }

    public void setLastupdate(long lastupdate) {
        this.lastupdate = lastupdate;
    }

    public String getClasstypename() {
        return classtypename;
    }

    public void setClasstypename(String classtypename) {
        this.classtypename = classtypename;
    }


}
