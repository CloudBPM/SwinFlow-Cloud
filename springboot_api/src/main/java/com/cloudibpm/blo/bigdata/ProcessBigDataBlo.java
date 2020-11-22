package com.cloudibpm.blo.bigdata;

import com.cloudibpm.blo.bigdata.reportservice.ReportServiceBlo;
import com.cloudibpm.core.TreeNode;
import com.cloudibpm.core.data.*;
import com.cloudibpm.core.data.variable.ArrayDataVariable;
import com.cloudibpm.core.data.variable.DataVariable;
import com.cloudibpm.core.repository.BusinessLogicObject;
import com.cloudibpm.core.runtime.util.WfProcessInstanceUncloner;
import com.cloudibpm.core.runtime.wfprocess.ProcessInstancePage;
import com.cloudibpm.core.runtime.wfprocess.WfProcessInstance;
import com.cloudibpm.eso.bigdata.ProcessBigDataEno;
import com.xq.paas.core.bigdata.report.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


/**
 * @author Dahai Cao created at 19:04 on 2019-02-21
 */
//@Transactional
@Service
public class ProcessBigDataBlo extends BusinessLogicObject {
    private final ProcessBigDataEno processBigDataEno;
    private final ReportServiceBlo reportServiceBlo;

    @Autowired
    public ProcessBigDataBlo(ProcessBigDataEno processBigDataEno,
                             ReportServiceBlo reportServiceBlo) {
        this.processBigDataEno = processBigDataEno;
        this.reportServiceBlo = reportServiceBlo;
    }

    /**
     * @param piid
     */
    public void removeInstance(String piid) {
        this.processBigDataEno.delete(piid);
    }

    /**
     * @param piid
     * @return
     * @throws Exception
     */
    public WfProcessInstance getInstance(String piid) throws Exception {
        return processBigDataEno.queryInstance(piid);
    }

    /**
     * @param id
     * @param condition
     * @param search
     * @param pageno
     * @param pagesize
     * @return
     * @throws Exception
     */
    public ReportPage generateReport(String id, String condition,
                                     String search, String pageno, String pagesize) throws Exception {
        ReportService reportService = this.reportServiceBlo.getReportServiceById(id);
        Map<String, Integer> map = new HashMap<String, Integer>();
        ReportField[] nodes = (ReportField[]) reportService.getReportDefinition();
        for (int i = 0; i < nodes.length; i++) {
            map.put(nodes[i].getId(), i);
        }
        ProcessInstancePage list = this.searchInstances(
                reportService.getParentVersion(), condition,
                search, nodes, Integer.parseInt(pageno), Integer.parseInt(pagesize));
        List<WfProcessInstance> all = new ArrayList<>();
        for (WfProcessInstance s : list.getPageEntities()) {
            all.add(WfProcessInstanceUncloner.unclone(s));
        }
        ReportPage report = new ReportPage();
        report.setPageNo(Integer.parseInt(pageno));
        report.setPageSize(Integer.parseInt(pagesize));
        report.setId(reportService.getId());
        report.setName(reportService.getName());
        report.setTitles(nodes);
        report.setPageIndex(list.getPageIndex());
        report.setAllEntitiesCount(list.getAllEntitiesCount());
        report.setAllPagesCount(list.getAllPagesCount());
        if (list.getAllEntitiesCount() > 0) {
            List<ReportDataRow> rows = new ArrayList<>();
            for (int i = 0; i < all.size(); i++) {
                WfProcessInstance instance = all.get(i);
                ReportDataRow row = this.getReportRow(instance, i, nodes.length, map);
                row.setWorkflowType(instance.getWorkflowType());
                rows.add(row);
            }
            report.setPageEntities(rows.toArray(new ReportDataRow[rows.size()]));
        }
        return report;
    }

    /**
     * This method is used for the pageable table view form component
     *
     * @param id
     * @param search
     * @param pageno
     * @param pagesize
     * @return
     * @throws Exception
     */
    public ReportPage generateReport(String id,
                                     String search, String pageno, String pagesize) throws Exception {
        ReportService reportService = this.reportServiceBlo.getReportServiceById(id);
        String condition = reportService.getQueryCondition();
        if (condition == null) {
            condition = "";
        }
        Map<String, Integer> map = new HashMap<String, Integer>();
        ReportField[] nodes = (ReportField[]) reportService.getReportDefinition();
        for (int i = 0; i < nodes.length; i++) {
            map.put(nodes[i].getId(), i);
        }
        ProcessInstancePage list = this.searchInstances(
                reportService.getParentVersion(), condition,
                search, nodes, Integer.parseInt(pageno), Integer.parseInt(pagesize));
        List<WfProcessInstance> all = new ArrayList<>();
        for (WfProcessInstance s : list.getPageEntities()) {
            all.add(WfProcessInstanceUncloner.unclone(s));
        }
        ReportPage report = new ReportPage();
        report.setPageNo(Integer.parseInt(pageno));
        report.setPageSize(Integer.parseInt(pagesize));
        report.setId(reportService.getId());
        report.setName(reportService.getName());
        report.setTitles(nodes);
        report.setPageIndex(list.getPageIndex());
        report.setAllEntitiesCount(list.getAllEntitiesCount());
        report.setAllPagesCount(list.getAllPagesCount());
        if (list.getAllEntitiesCount() > 0) {
            List<ReportDataRow> rows = new ArrayList<>();
            for (int i = 0; i < all.size(); i++) {
                WfProcessInstance instance = all.get(i);
                ReportDataRow row = this.getReportRow(instance, i, nodes.length, map);
                row.setWorkflowType(instance.getWorkflowType());
                rows.add(row);
            }
            report.setPageEntities(rows.toArray(new ReportDataRow[rows.size()]));
        }
        return report;
    }

    /**
     * 这个方法是用于大数据后台展示的报表，大数据后台展示可以定义查询条件，
     * 所以参数中含有condition。
     *
     * @param id
     * @param condition
     * @return
     * @throws Exception
     */
    public Report generateReport(String id, String condition) throws Exception {
        ReportService reportService = this.reportServiceBlo.getReportServiceById(id);
        Map<String, Integer> map = new HashMap<String, Integer>();
        ReportField[] fields = (ReportField[]) reportService.getReportDefinition();
        for (int i = 0; i < fields.length; i++) {
            map.put(fields[i].getId(), i);
        }
        List<WfProcessInstance> list = this.searchInstances(condition,
                reportService.getParentVersion(), fields);
        List<WfProcessInstance> all = new ArrayList<>();
        for (WfProcessInstance s : list) {
            all.add(WfProcessInstanceUncloner.unclone(s));
        }
        Report report = new Report();
        report.setId(reportService.getId());
        report.setName(reportService.getName());
        report.setTitles(fields);
        if (all.size() > 0) {
            for (int i = 0; i < all.size(); i++) {
                WfProcessInstance instance = all.get(i);
                ReportDataRow row = this.getReportRow(instance, i, fields.length, map);
                row.setWorkflowType(instance.getWorkflowType());
                report.addChild(row);
            }
        }
        return report;
    }

    /**
     * 这个方法是用于前端表单组件中显示报表，
     * 由于前端表单中组件没有直接输入的条件，需要从后台获取，
     * 所以参数中不含有condition。
     *
     * @param id
     * @return
     * @throws Exception
     */
    public Report generateReport(String id) throws Exception {
        ReportService reportService = this.reportServiceBlo.getReportServiceById(id);
        String condition = reportService.getQueryCondition();
        if (condition == null) {
            condition = "";
        }
        Map<String, Integer> map = new HashMap<String, Integer>();
        ReportField[] fields = (ReportField[]) reportService.getReportDefinition();
        for (int i = 0; i < fields.length; i++) {
            map.put(fields[i].getId(), i);
        }
        List<WfProcessInstance> list = this.searchInstances(condition,
                reportService.getParentVersion(), fields);
        List<WfProcessInstance> all = new ArrayList<>();
        for (WfProcessInstance s : list) {
            all.add(WfProcessInstanceUncloner.unclone(s));
        }
        Report report = new Report();
        report.setId(reportService.getId());
        report.setName(reportService.getName());
        report.setTitles(fields);
        if (all.size() > 0) {
            for (int i = 0; i < all.size(); i++) {
                WfProcessInstance instance = all.get(i);
                ReportDataRow row = this.getReportRow(instance, i, fields.length, map);
                row.setWorkflowType(instance.getWorkflowType());
                report.addChild(row);
            }
        }
        return report;
    }

    /**
     * @param instance
     * @param i
     * @param length
     * @param map
     * @return
     */
    private ReportDataRow getReportRow(WfProcessInstance instance, int i,
                                       int length, Map<String, Integer> map) {
        ReportDataRow row = new ReportDataRow();
        row.setName("" + i);
        row.setInstanceId(instance.getId());
        ReportDataCell[] cells = new ReportDataCell[length];
        for (TreeNode child : instance.getChildren()) {
            if (child instanceof DataVariable
                    && map.containsKey(((DataVariable) child).getDefinitionId())) {
                Integer c = map.get(((DataVariable) child).getDefinitionId());
                ReportDataCell cell = new ReportDataCell();
                cell.setId(child.getId());
                cell.setName(child.getName());
                if (child instanceof ArrayDataVariable) {
                    Object objs = ((ArrayDataVariable) child).getValues();
                    if (objs != null) {
                        if (objs instanceof StringConstant[]) {
                            StringConstant[] ary = (StringConstant[])objs;
                            if (ary.length>0) {
                                String value = "";
                                for (StringConstant sc : ary) {
                                    if (value.equals("")) {
                                        value = sc.getValue();
                                    } else {
                                        value = value + "," + sc.getValue();
                                    }
                                }
                                cell.setCellContent(value);
                            } else {
                                cell.setCellContent("");
                            }
                        } else if (objs instanceof IntegerConstant[]) {
                            IntegerConstant[] ary = (IntegerConstant[])objs;
                            if (ary.length>0) {
                                String value = "";
                                for (IntegerConstant sc : ary) {
                                    if (value.equals("")) {
                                        value = sc.getValue();
                                    } else {
                                        value = value + "," + sc.getValue();
                                    }
                                }
                                cell.setCellContent(value);
                            } else {
                                cell.setCellContent("");
                            }
                        } else if (objs instanceof DoubleConstant[]) {
                            DoubleConstant[] ary = (DoubleConstant[])objs;
                            if (ary.length>0) {
                                String value = "";
                                for (DoubleConstant sc : ary) {
                                    if (value.equals("")) {
                                        value = sc.getValue();
                                    } else {
                                        value = value + "," + sc.getValue();
                                    }
                                }
                                cell.setCellContent(value);
                            } else {
                                cell.setCellContent("");
                            }
                        } else if (objs instanceof BooleanConstant[]) {
                            BooleanConstant[] ary = (BooleanConstant[])objs;
                            if (ary.length>0) {
                                String value = "";
                                for (BooleanConstant sc : ary) {
                                    if (value.equals("")) {
                                        value = sc.getValue();
                                    } else {
                                        value = value + "," + sc.getValue();
                                    }
                                }
                                cell.setCellContent(value);
                            } else {
                                cell.setCellContent("");
                            }
                        } else if (objs instanceof FileConstant[]) {
                            FileConstant[] ary = (FileConstant[])objs;
                            if (ary.length>0) {
                                String value = "";
                                for (FileConstant sc : ary) {
                                    if (value.equals("")) {
                                        value = sc.toString();
                                    } else {
                                        value = value + "," + sc.toString();
                                    }
                                }
                                cell.setCellContent(value);
                            } else {
                                cell.setCellContent("");
                            }
                        } else if (objs instanceof DateTimeConstant[]) {
                            DateTimeConstant[] ary = (DateTimeConstant[])objs;
                            if (ary.length>0) {
                                String value = "";
                                for (DateTimeConstant sc : ary) {
                                    if (value.equals("")) {
                                        value = sc.getValue();
                                    } else {
                                        value = value + "," + sc.getValue();
                                    }
                                }
                                cell.setCellContent(value);
                            } else {
                                cell.setCellContent("");
                            }
                        } else if (objs instanceof TimDurationConstant[]) {
                            TimDurationConstant[] ary = (TimDurationConstant[])objs;
                            if (ary.length>0) {
                                String value = "";
                                for (TimDurationConstant sc : ary) {
                                    if (value.equals("")) {
                                        value = sc.getValue();
                                    } else {
                                        value = value + "," + sc.getValue();
                                    }
                                }
                                cell.setCellContent(value);
                            } else {
                                cell.setCellContent("");
                            }
                        } else if (objs instanceof HandwritingConstant[]) {

                        } else if (objs instanceof JSONConstant[]) {

                        }
                    }
                } else if (child instanceof DataVariable) {
                    Object o = ((DataVariable) child).getValue();
                    if (o instanceof StringConstant) {
                        cell.setCellContent(((StringConstant) o).getValue());
                    } else if (o instanceof IntegerConstant) {
                        cell.setCellContent(((IntegerConstant) o).getValue());
                    } else if (o instanceof DoubleConstant) {
                        cell.setCellContent(((DoubleConstant) o).getValue());
                    } else if (o instanceof BooleanConstant) {
                        cell.setCellContent(((BooleanConstant) o).getValue());
                    } else if (o instanceof FileConstant) {
                        cell.setCellContent(o.toString());
                    } else if (o instanceof DateTimeConstant) {
                        cell.setCellContent(((DateTimeConstant) o).getValue());
                    } else if (o instanceof TimDurationConstant) {
                        cell.setCellContent(((TimDurationConstant) o).getValue());
                    } else if (o instanceof HandwritingConstant) {

                    } else if (o instanceof JSONConstant) {

                    }
                }
                cells[c] = cell;
            }
        }
        row.append(cells);
        return row;
    }

    public List<String> getProcessInstanceVersions(String proccode) throws Exception {
        return this.processBigDataEno.queryAllVersions(proccode);
    }


    public List<WfProcessInstance> searchInstances(
            String condition, String[] versions, ReportField[] fields) throws Exception {
        List<WfProcessInstance> l = this.processBigDataEno.queryCompletedInstances(
                condition, versions, fields);
        return l;
    }

    public ProcessInstancePage searchInstances(String[] version, String condition,
                                               String search, ReportField[] fields,
                                               int pageno, int pagesize) throws Exception {

        ProcessInstancePage page = new ProcessInstancePage(pageno, pagesize);
        long total = 0L;
        if (condition == null || condition.equals("")) { // 没有查询条件
            total = this.processBigDataEno.count(version, fields);
            page.setPageSize(pagesize);
            if (total == 0L) {
                page.setPageNo(1);
                page.setAllEntitiesCount(0);
                page.setAllPagesCount(0);
                page.setPageIndex(0);
            } else {
                if (search == null || search.equals("")) {
                    search = "";
                    page.setPageNo(pageno);
                    page.setAllEntitiesCount(total);
                    long n = total / pagesize;
                    long m = total % pagesize;
                    if (m > 0) {
                        n = n + 1;
                    }
                    page.setAllPagesCount(n);
                    int pageindex = (pageno - 1) * pagesize; // 跳过的数据条数
                    page.setPageIndex(pageindex);
                    List<WfProcessInstance> list = this.processBigDataEno.queryByCondition(
                            version, fields, pageindex, pagesize); // 查询所有的新闻
                    page.setPageEntities(list.toArray(new WfProcessInstance[list.size()]));
                } else {
                    total = this.processBigDataEno.countByCondition(search, version, fields); // 根据条件查询数量
                    if (total == 0L) {
                        page.setPageNo(0);
                        page.setAllEntitiesCount(0);
                        page.setAllPagesCount(0);
                        page.setPageIndex(0);
                    } else {
                        page.setPageNo(pageno);
                        page.setAllEntitiesCount(total);
                        long n = total / pagesize;
                        long m = total % pagesize;
                        if (m > 0) {
                            n = n + 1;
                        }
                        page.setAllPagesCount(n);
                        int pageindex = (pageno - 1) * pagesize;// 需要跳过的数据条数
                        page.setPageIndex(pageindex);
                        List<WfProcessInstance> list = this.processBigDataEno.queryByCondition(
                                search, version, fields, pageindex, pagesize); // 查询所有的新闻
                        page.setPageEntities(list.toArray(new WfProcessInstance[list.size()]));
                    }

                }
            }
        }

        return page;
    }
}
