package com.xq.paas.core.bigdata.report;

import com.cloudibpm.core.MicroService;

/**
 * This class is used to describe the report template on a WfPeocess.
 *
 * @author Dahai Cao created at 14:22 on 2019-01-10
 */
public class ReportService extends MicroService {
    /**
     * Report service;
     * 0: the report service with report model without page；
     * 1：the report service with pageable report model；
     * 2：the report service with statistic report model;
     */
    private int reportType = 0;
    /**
     * Query condition definition;
     */
    private String queryCondition = null;
    /**
     * Report field definition;
     */
    private Object reportDefinition = null;
    /**
     * 该属性保存的是SaaS应用过程的编码，
     * 每个SaaS应用过程都有唯一编码，
     * 不管其版本变了多少次，其编码始终不变。
     */
    private String parentCode = null;
    /**
     * 0:不跨版本；1：跨版本；
     * 每个SaaS应用过程都有特定的编号和特定的版本，
     * 查询可以查特定版本的数据也可以查多个版本的数据
     */
    private int crossVersion = 0;
    /**
     * 该属性保存的是SaaS应用过程的特定版本号
     */
    private String [] parentVersion = null;


    public int getCrossVersion() {
        return crossVersion;
    }

    public void setCrossVersion(int crossVersion) {
        this.crossVersion = crossVersion;
    }

    public int getReportType() {
        return reportType;
    }

    public void setReportType(int reportType) {
        this.reportType = reportType;
    }

    public String getQueryCondition() {
        return queryCondition;
    }

    public void setQueryCondition(String queryCondition) {
        this.queryCondition = queryCondition;
    }

    public Object getReportDefinition() {
        return reportDefinition;
    }

    public void setReportDefinition(Object reportDefinition) {
        this.reportDefinition = reportDefinition;
    }

    public String getParentCode() {
        return parentCode;
    }

    public void setParentCode(String parentCode) {
        this.parentCode = parentCode;
    }

    public String [] getParentVersion() {
        return parentVersion;
    }

    public void setParentVersion(String [] parentVersion) {
        this.parentVersion = parentVersion;
    }
}