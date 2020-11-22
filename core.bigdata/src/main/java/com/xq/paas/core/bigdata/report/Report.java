package com.xq.paas.core.bigdata.report;

import com.cloudibpm.core.TreeNode;

/**
 * Pageable report model
 *
 * @author Dahai Cao created at 14:20 on 2019-02-22
 */
public class Report extends TreeNode {
    private ReportField[] titles = new ReportField[0];
    private String classtypename = "Report";

    public ReportField[] getTitles() {
        return titles;
    }

    public void setTitles(ReportField[] titles) {
        this.titles = titles;
    }

    public String getClasstypename() {
        return classtypename;
    }

    public void setClasstypename(String classtypename) {
        this.classtypename = classtypename;
    }
}
