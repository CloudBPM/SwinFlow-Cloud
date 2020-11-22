package com.cloudibpm.core.runtime.wfprocess;

import com.cloudibpm.core.Page;

public class ProcessInstancePage extends Page {

    private WfProcessInstance[] pageEntities = new WfProcessInstance[0];

    public ProcessInstancePage(int pageNo, int pageSize) {
        super(pageNo, pageSize);
    }

    public ProcessInstancePage() {
    }

    public WfProcessInstance[] getPageEntities() {
        return pageEntities;
    }

    public void setPageEntities(WfProcessInstance[] pageEntities) {
        this.pageEntities = pageEntities;
    }
}
