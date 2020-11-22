package com.xq.paas.core.bigdata.report;

import com.cloudibpm.core.Page;

/**
 * Pageable report model
 * @author Dahai Cao created at 14:26 on 2019-03-10
 */
public class ReportPage extends Page {
    private String id = null;// report service ID
    private String name = null;
    private ReportField [] titles = new ReportField[0];
    private ReportDataRow [] pageEntities = new ReportDataRow[0];
    private String classtypename = "ReportPage";

    public ReportPage() {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getClasstypename() {
        return classtypename;
    }

    public void setClasstypename(String classtypename) {
        this.classtypename = classtypename;
    }

    public ReportPage(int pageNo, int pageSize) {
        super(pageNo, pageSize);
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public ReportField[] getTitles() {
        return titles;
    }

    public void setTitles(ReportField[] titles) {
        this.titles = titles;
    }

    public ReportDataRow[] getPageEntities() {
        return pageEntities;
    }

    public void setPageEntities(ReportDataRow[] pageEntities) {
        this.pageEntities = pageEntities;
    }
}
