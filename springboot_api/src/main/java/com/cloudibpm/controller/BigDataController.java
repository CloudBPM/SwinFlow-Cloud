package com.cloudibpm.controller;

import com.cloudibpm.blo.bigdata.ProcessBigDataBlo;
import com.cloudibpm.blo.bigdata.reportservice.ReportServiceBlo;
import com.cloudibpm.blo.buildtime.id.BuildtimeIDGenerator;
import com.cloudibpm.blo.buildtime.wfprocess.BuildtimeWfProcessBlo;
import com.cloudibpm.core.TreeNode;
import com.cloudibpm.core.buildtime.release.wfprocess.ReleasedWfProcess;
import com.cloudibpm.core.folder.Folder;
import com.cloudibpm.core.folder.JSTreeNode;
import com.cloudibpm.core.organization.Organization;
import com.cloudibpm.poi.ExcelGenerater;
import com.xq.paas.core.bigdata.report.*;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/service15")
public class BigDataController {
    private final BuildtimeWfProcessBlo buildtimeWfProcessBlo;
    private final ReportServiceBlo reportServiceBlo;
    private final BuildtimeIDGenerator buildtimeIDGenerator;
    private final ProcessBigDataBlo processBigDataBlo;


    @Autowired
    public BigDataController(BuildtimeWfProcessBlo buildtimeWfProcessBlo,
                             BuildtimeIDGenerator buildtimeIDGenerator,
                             ReportServiceBlo reportServiceBlo,
                             ProcessBigDataBlo processBigDataBlo) {
        this.buildtimeWfProcessBlo = buildtimeWfProcessBlo;
        this.buildtimeIDGenerator = buildtimeIDGenerator;
        this.reportServiceBlo = reportServiceBlo;
        this.processBigDataBlo = processBigDataBlo;
    }

    @RequestMapping(value = "/api0", method = RequestMethod.POST,
            headers = "Accept=application/json")
    @ResponseBody
    public JSTreeNode[] getProcessFolders(String ids) {
        List<Organization> orgs = null;
        try {
            if (ids.equals("00000000000001R")) {
                orgs = buildtimeWfProcessBlo.getOrganizationsForBigDataViewer();
            } else {
                String[] strArry = ids.split(";");
                orgs = buildtimeWfProcessBlo.getOrganizationsForBigDataViewer(strArry);
            }
            if (orgs != null) {
                Organization[] orgArray = new Organization[orgs.size()];
                for (int i = 0; i < orgArray.length; i++) {
                    orgArray[i] = orgs.get(i);
                }
                return generateJSTreeNodes(orgArray);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    private JSTreeNode[] generateJSTreeNodes(TreeNode[] roots) {
        if (roots.length > 0) {
            JSTreeNode[] jstnodes = new JSTreeNode[roots.length];
            for (int i = 0; i < roots.length; i++) {
                TreeNode node = roots[i];
                JSTreeNode jstnode = new JSTreeNode();
                jstnode.id = node.getId();
                jstnode.text = JSTreeNode.parseUTF8(node.getName());
                jstnode.icon = "";
                if (node instanceof Organization) {
                    jstnode.icon = "glyphicon glyphicon-home";
                    jstnode.data = "1|null";
                } else if (node instanceof Folder && ((Folder) node).getType() == 109) {
                    jstnode.icon = "glyphicon glyphicon-th-large";
                    jstnode.data = "2|" + node.getOwner() + "|" + ((Folder) node).getType() + "|"
                            + ((Folder) node).getRank();
                } else if (node instanceof ReleasedWfProcess) {
                    jstnode.icon = "glyphicon glyphicon-fire";
                    jstnode.data = "3|" + node.getOwner() + "|" + ((ReleasedWfProcess) node).getCode() + "|"
                            + ((ReleasedWfProcess) node).getVersion() + "|0|R";
                    jstnode.text = JSTreeNode
                            .parseUTF8(node.getName() + "(" + ((ReleasedWfProcess) node).getVersion() + ")");
                } else if (node instanceof ReportService) {
                    jstnode.icon = "glyphicon glyphicon-file";
                    jstnode.data = "3|" + node.getOwner() + "|7|" + ((ReportService) node).getReportType() +
                            "|" + ((ReportService) node).getParentCode() + "|RPT" + ((ReportService) node).getReportType();
                }
                if (node.getParent() != null) {
                    jstnode.parentId = node.getParent();
                }
                if (node.hasChildren()) {
                    jstnode.children = generateJSTreeNodes(node.getChildren());
                }
                jstnodes[i] = jstnode;
            }
            return jstnodes;
        }
        return null;
    }

    @RequestMapping(value = "/api1", method = RequestMethod.POST,
            headers = "Accept=application/json")
    @ResponseBody
    public JSTreeNode createReportService(String entityname, String parentid,
                                          String ownerid, String type, String version,
                                          String reporttype, String crossversion) throws Exception {
        ReportService reportService = new ReportService();
        reportService.setId(buildtimeIDGenerator.getNewBuildTimeID());
        reportService.setName(entityname);// report service name
        reportService.setCreateDateTime(System.currentTimeMillis());
        reportService.setLastupdate(System.currentTimeMillis());
        reportService.setParent(parentid);// process id
        reportService.setOwner(ownerid);// process organization id
        reportService.setParentCode(type);// process code
        String[] versions = new String[1];
        versions[0] = version;
        reportService.setParentVersion(versions);// process version
        reportService.setReportType(Integer.parseInt(reporttype));// 0:不分页；1：分页；2：统计报表
        reportService.setCrossVersion(Integer.parseInt(crossversion));
        this.reportServiceBlo.create(reportService);
        JSTreeNode node = new JSTreeNode();
        node.id = reportService.getId();
        node.text = reportService.getName();
        node.data = "3|" + reportService.getOwner() + "|7|" + reportService.getReportType() +
                "|" + reportService.getParentCode() + "|RPT" + reportService.getReportType();
        node.icon = "glyphicon glyphicon-file";
        return node;
    }

    @RequestMapping(value = "/api2", method = RequestMethod.GET, produces = "application/json")
    @ResponseBody
    public ReportService getReportService(String id) throws Exception {
        ReportService reportService = this.reportServiceBlo.getReportServiceById(id);
        return reportService;
    }

    /**
     * Get a pageable report
     *
     * @param id
     * @param condition
     * @param search
     * @param pageno
     * @param pagesize
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/api3", method = RequestMethod.GET, produces = "application/json")
    @ResponseBody
    public ReportPage generateReport(String id, String condition,
                                     String search, String pageno,
                                     String pagesize) throws Exception {
        return this.processBigDataBlo.generateReport(id, condition, search, pageno, pagesize);
    }

    @RequestMapping(value = "/api4", method = RequestMethod.POST, headers = "Accept=application/json; charset=utf-8")
    @ResponseBody
    public ResponseEntity<byte[]> generateExcel(String id, String condition, String search) throws Exception {
        Report report = this.processBigDataBlo.generateReport(id);
        List<ArrayList<String>> records = new ArrayList<ArrayList<String>>();
        ArrayList<String> recordTitle = new ArrayList<String>();
        for (int i = 0; i < report.getTitles().length; i++) {
            recordTitle.add(report.getTitles()[i].getName());
        }
        records.add(recordTitle);
        for (int i = 0; i < report.getChildren().length; i++) {
            ReportDataRow row = (ReportDataRow) report.getChildren()[i];
            ArrayList<String> recordContent = new ArrayList<String>();
            for (TreeNode child : row.getChildren()) {
                recordContent.add(((ReportDataCell) child).getCellContent());
            }
            records.add(recordContent);
        }
        byte[] bytes = ExcelGenerater.getInstance().generate(records, report.getName());
        HttpHeaders headers = new HttpHeaders();
        headers.setContentDispositionFormData("attachment", report.getName());
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        ResponseEntity<byte[]> res = new ResponseEntity<byte[]>(bytes, headers, HttpStatus.OK);
        return res; // success
    }

    @RequestMapping(value = "/api5", method = RequestMethod.POST,
            headers = "Accept=application/json; charset=utf-8")
    @ResponseBody
    public String saveReportService(String reportservice) throws Exception {
        JSONObject obj = new JSONObject(reportservice);
        ReportService reportService = new ReportService();
        reportService.setId(obj.getString("id"));
        reportService.setName(obj.getString("name"));
        reportService.setAccessType(obj.getInt("accessType"));
        if (!obj.isNull("comments")) {
            reportService.setComments(obj.getString("comments"));
        }
        if (!obj.isNull("keywords")) {
            reportService.setKeywords(obj.getString("keywords"));
        }
        if (!obj.isNull("securityAccessKey")) {
            reportService.setSecurityAccessKey(obj.getString("securityAccessKey"));
        }
        if (!obj.isNull("price")) {
            reportService.setPrice(obj.getDouble("price"));
        }
        if (!obj.isNull("usagePrice")) {
            reportService.setUsagePrice(obj.getDouble("usagePrice"));
        }
        if (!obj.isNull("status")) {
            reportService.setStatus(obj.getInt("status"));
        }
        if (!obj.isNull("onlineDateTime")) {
            reportService.setOnlineDateTime(obj.getLong("onlineDateTime"));
        }
        if (!obj.isNull("offlineDateTime")) {
            reportService.setOfflineDateTime(obj.getLong("offlineDateTime"));
        }
        if (!obj.isNull("lastupdate")) {
            reportService.setLastupdate(obj.getLong("lastupdate"));
        }
        if (!obj.isNull("createDateTime")) {
            reportService.setCreateDateTime(obj.getLong("createDateTime"));
        }
        if (!obj.isNull("parent")) {
            reportService.setParent(obj.getString("parent"));
        }
        if (!obj.isNull("currOwner")) {
            reportService.setCurrOwner(obj.getString("currOwner"));
        }
        if (!obj.isNull("owner")) {
            reportService.setOwner(obj.getString("owner"));
        }
        if (!obj.isNull("reportType")) {
            reportService.setReportType(obj.getInt("reportType"));
        }
        if (!obj.isNull("parentCode")) {
            reportService.setParentCode(obj.getString("parentCode"));
        }
        if (!obj.isNull("crossVersion")) {
            reportService.setCrossVersion(obj.getInt("crossVersion"));
        }
        if (!obj.isNull("parentVersion")) {
            JSONArray ary = obj.getJSONArray("parentVersion");
            if (ary.length() > 0) {
                String[] versions = new String[ary.length()];
                for (int i = 0; i < ary.length(); i++) {
                    versions[i] = ary.getString(i);
                }
                reportService.setParentVersion(versions);
            } else {
                reportService.setParentVersion(new String[0]);
            }
        }
        //  queryCondition
        JSONArray jsonarr = obj.getJSONArray("reportDefinition");
        if (jsonarr.length() > 0) { // parsing data variables and tasks
            reportService.setReportDefinition(jsonarr.toString());
        }
        this.reportServiceBlo.modify(reportService);
        return "{\"status\": \"1\"}"; // success;
    }

    @RequestMapping(value = "/api6", method = RequestMethod.POST,
            headers = "Accept=application/json; charset=utf-8")
    @ResponseBody
    public String removeData(String piid) throws Exception {
        this.processBigDataBlo.removeInstance(piid);
        return "{\"status\": \"1\"}"; // success;
    }

    /**
     * Rename big data report service name
     *
     * @param id
     * @param entityname
     * @param lastupdate
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/api7", method = RequestMethod.POST,
            headers = "Accept=application/json; charset=utf-8")
    @ResponseBody
    public String rename(String id, String entityname, String lastupdate) throws Exception {
        this.reportServiceBlo.renameReportService(id, entityname, lastupdate);
        return "{\"status\": \"1\"}"; // success;
    }


    /**
     * Remove big data report service from repository
     *
     * @param id
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/api8", method = RequestMethod.POST,
            headers = "Accept=application/json; charset=utf-8")
    @ResponseBody
    public String delete(String id) throws Exception {
        this.reportServiceBlo.removeReportService(id);
        return "{\"status\": \"1\"}"; // success;
    }


    /**
     * Gets a report without pages.
     *
     * @param id
     * @param condition
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/api9", method = RequestMethod.GET, produces = "application/json")
    @ResponseBody
    public Report generateReport(String id, String condition) throws Exception {
        return this.processBigDataBlo.generateReport(id, condition);
    }

    /**
     * Get all versions in all process instances by the specified <code>process Id<code/>.
     *
     * @param pid process definition code
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/api10", method = RequestMethod.GET, produces = "application/json")
    @ResponseBody
    public List<String> getAllVersions(String proccode) throws Exception {
        return this.processBigDataBlo.getProcessInstanceVersions(proccode);
    }

    /**
     * Get the report service list for form component table.
     *
     * @param owner
     * @param types
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/api11", method = RequestMethod.GET, produces = "application/json")
    @ResponseBody
    public List<ReportService> getReportServicesBy(String owner, String types) throws Exception {
        String[] ary = types.split(",");
        int[] iary = new int[ary.length];
        for (int i = 0; i < ary.length; i++) {
            iary[i] = Integer.parseInt(ary[i]);
        }
        return this.reportServiceBlo.getReportServices(owner, iary);
    }

    /**
     * This method is used for the pageable table view form component in form management.
     *
     * @param id
     * @param search
     * @param pageno
     * @param pagesize
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/api12", method = RequestMethod.GET, produces = "application/json")
    @ResponseBody
    public ReportPage generateReport(String id,
                                     String search, String pageno,
                                     String pagesize) throws Exception {
        return this.processBigDataBlo.generateReport(id, search, pageno, pagesize);
    }

    /**
     * This method is used for the table view form component in form management.
     *
     * @param id
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/api13", method = RequestMethod.GET, produces = "application/json")
    @ResponseBody
    public Report generateReport(String id) throws Exception {
        return this.processBigDataBlo.generateReport(id);
    }
}