package com.xq.paas.core.bigdata.report;

import com.cloudibpm.core.TreeNode;

public class ReportDataRow extends TreeNode {
    private String instanceId = null;
    private int workflowType = 0;

    public int getWorkflowType() {
        return workflowType;
    }

    public void setWorkflowType(int workflowType) {
        this.workflowType = workflowType;
    }

    public String getInstanceId() {
        return instanceId;
    }

    public void setInstanceId(String instanceId) {
        this.instanceId = instanceId;
    }
}