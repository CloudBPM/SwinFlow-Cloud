package com.xq.paas.core.bigdata.report;

import com.cloudibpm.core.TreeNode;

public class ReportDataCell extends TreeNode {
    private String cellContent = null;

    public String getCellContent() {
        return cellContent;
    }

    public void setCellContent(String cellContent) {
        this.cellContent = cellContent;
    }
}
