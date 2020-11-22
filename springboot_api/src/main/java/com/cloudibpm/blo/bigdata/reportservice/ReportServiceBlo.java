package com.cloudibpm.blo.bigdata.reportservice;

import com.cloudibpm.blo.buildtime.wfprocess.ReleasedWfProcessBlo;
import com.cloudibpm.core.TreeNode;
import com.cloudibpm.core.buildtime.release.wfprocess.ReleasedWfProcess;
import com.cloudibpm.core.buildtime.util.json.WfProcessJSONParser;
import com.cloudibpm.core.data.variable.DataVariable;
import com.cloudibpm.core.repository.BusinessLogicObject;
import com.cloudibpm.eso.bigdata.ReportServiceEno;
import com.xq.paas.core.bigdata.report.ReportField;
import com.xq.paas.core.bigdata.report.ReportService;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
//@Transactional
public class ReportServiceBlo extends BusinessLogicObject {
    private ReportServiceEno reportServiceEno;
    private final ReleasedWfProcessBlo releasedWfProcessBlo;

    @Autowired
    public ReportServiceBlo(ReportServiceEno reportServiceEno,
                            ReleasedWfProcessBlo releasedWfProcessBlo) {
        this.reportServiceEno = reportServiceEno;
        this.releasedWfProcessBlo = releasedWfProcessBlo;
    }

    @Transactional
    public void create(ReportService reportService) {
        this.reportServiceEno.insert(reportService);
    }

    public List<ReportService> getReportServices(String owner, int [] reporttype) throws Exception {
        return this.reportServiceEno.queryByType(owner, reporttype);
    }

    /**
     * Gets a report service object for big data query.
     *
     * @param id
     * @return
     * @throws Exception
     */
    public ReportService getReportServiceById(String id) throws Exception {
        ReportService reportService = this.reportServiceEno.query(id);
        String pid = reportService.getParent();
        ReleasedWfProcess process = releasedWfProcessBlo.getReleasedProcess(pid);
        process = WfProcessJSONParser.parseReleasedWfProcess(process.getProcessContent());
        if (process.hasChildren()) {
            for (TreeNode child : process.getChildren()) {
                if (child instanceof DataVariable) {
                    reportService.addChild(child);
                }
            }
        }
        if (reportService.getReportDefinition() == null) {
            if (reportService.hasChildren()) {
                List<ReportField> list = new ArrayList<>();
                for (int i = 0; i < reportService.getChildren().length; i++) {
                    ReportField rf = new ReportField();
                    rf.setId(reportService.getChildren()[i].getId());
                    rf.setName(reportService.getChildren()[i].getName());
                    list.add(rf);
                }
                reportService.setReportDefinition(
                        list.toArray(new ReportField[list.size()]));
            }
        } else {
            JSONArray jsonarr = new JSONArray((String) reportService.getReportDefinition());
            if (jsonarr.length() > 0) { // parsing report fields
                ReportField[] reportFields = new ReportField[jsonarr.length()];
                for (int i = 0; i < jsonarr.length(); i++) {
                    ReportField reportField = new ReportField();
                    JSONObject obj = jsonarr.getJSONObject(i);
                    reportField.setId(obj.getString("id"));
                    reportField.setName(obj.getString("name"));
                    reportFields[i] = reportField;
                }
                reportService.setReportDefinition(reportFields);
            }
        }
        return reportService;

    }

    public List<ReportService> getReportServices(String parentId) throws Exception {
        return this.reportServiceEno.queryByParent(parentId);
    }

    @Transactional
    public void modify(ReportService plugin) throws Exception {
        this.reportServiceEno.update(plugin);
    }

    @Transactional
    public void renameReportService(String id, String entityname, String lastupdate) {
        this.reportServiceEno.updateName(id, entityname, lastupdate);
    }

    @Transactional
    public void removeReportService(String id) {
        this.reportServiceEno.delete(id);
    }

}
