package com.cloudibpm.controller;

import com.cloudibpm.blo.buildtime.id.BuildtimeIDGenerator;
import com.cloudibpm.blo.buildtime.wfprocess.BuildtimeWfProcessBlo;
import com.cloudibpm.blo.buildtime.wfprocess.ReleasedWfProcessBlo;
import com.cloudibpm.blo.folder.WfFolderBlo;
import com.cloudibpm.blo.om.organization.OrganizationBlo;
import com.cloudibpm.blo.release.log.ApproveForReleaseBlo;
import com.cloudibpm.core.TreeNode;
import com.cloudibpm.core.buildtime.release.wfprocess.ReleasedWfProcess;
import com.cloudibpm.core.buildtime.wfprocess.WfProcess;
import com.cloudibpm.core.folder.Folder;
import com.cloudibpm.core.folder.JSTreeNode;
import com.cloudibpm.core.organization.Organization;
import com.cloudibpm.core.solr.FormServiceSearchResultPage;
import com.cloudibpm.core.solr.FormServiceSolrUtils;
import com.cloudibpm.core.solr.ProcessServiceSearchResultPage;
import com.cloudibpm.core.solr.ProcessServiceSolrUtils;
import com.cloudibpm.core.util.SystemConfig;
import com.cloudibpm.core.util.file.FileUploadUtils;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.commons.lang.StringEscapeUtils;
import org.apache.solr.client.solrj.SolrServerException;
import org.json.JSONArray;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/service1")
public class ProcessController {

    private static final Logger logger = LoggerFactory.getLogger(ProcessController.class);

    private final BuildtimeWfProcessBlo buildtimeWfProcessBlo;
    private final BuildtimeIDGenerator buildtimeIDGenerator;
    private final WfFolderBlo wfFolderBlo;
    private final ReleasedWfProcessBlo releasedWfProcessBlo;
    private final ApproveForReleaseBlo approveForReleaseBlo;
    private final OrganizationBlo organizationBlo;

    @Autowired
    public ProcessController(BuildtimeWfProcessBlo buildtimeWfProcessBlo,
                             BuildtimeIDGenerator buildtimeIDGenerator,
                             WfFolderBlo wfFolderBlo,
                             ReleasedWfProcessBlo releasedWfProcessBlo,
                             ApproveForReleaseBlo approveForReleaseBlo,
                             OrganizationBlo organizationBlo) {
        this.buildtimeWfProcessBlo = buildtimeWfProcessBlo;
        this.buildtimeIDGenerator = buildtimeIDGenerator;
        this.wfFolderBlo = wfFolderBlo;
        this.releasedWfProcessBlo = releasedWfProcessBlo;
        this.approveForReleaseBlo = approveForReleaseBlo;
        this.organizationBlo = organizationBlo;
    }

    @RequestMapping(value = "/api0", method = RequestMethod.POST, headers = "Accept=application/json")
    @ResponseBody
    public JSTreeNode[] getProcessFolders(String ids) {
        List<Organization> orgs = null;
        try {
            if (ids.equals("00000000000001R")) {
                orgs = buildtimeWfProcessBlo.getOrganizationsForProcessViewer();
            } else {
                String[] strArry = ids.split(";");
                orgs = buildtimeWfProcessBlo.getOrganizationsForProcessViewer(strArry);
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
                jstnode.parentId = node.getParent();
                jstnode.icon = "";
                if (node instanceof Organization) {
                    jstnode.icon = "glyphicon glyphicon-home";
                    // add some spare information
                    jstnode.data = "1|null";
                } else if (node instanceof Folder && ((Folder) node).getType() != 109) {
                    jstnode.icon = "glyphicon glyphicon-folder-open";
                    // add some spare information
                    jstnode.data = "2|" + node.getOwner() + "|" + ((Folder) node).getType() + "|"
                            + ((Folder) node).getRank();
                } else if (node instanceof Folder && ((Folder) node).getType() == 109) {
                    jstnode.icon = "glyphicon glyphicon-th-large";
                    // add some spare information
                    jstnode.data = "2|" + node.getOwner() + "|" + ((Folder) node).getType() + "|"
                            + ((Folder) node).getRank();
                } else if (node instanceof ReleasedWfProcess) {
                    jstnode.icon = "glyphicon glyphicon-fire";
                    // add some spare information
                    jstnode.data = "3|" + node.getOwner() + "|" + ((ReleasedWfProcess) node).getCode() + "|R|"
                            + ((ReleasedWfProcess) node).getVersion();
                    jstnode.text = JSTreeNode
                            .parseUTF8(node.getName() + "(" + ((ReleasedWfProcess) node).getVersion() + ")");
                } else if (node instanceof WfProcess) {
                    jstnode.icon = "glyphicon glyphicon-flash";
                    // add some spare information
                    jstnode.data = "3|" + node.getOwner() + "|" + ((WfProcess) node).getCode() + "|P";
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

    @RequestMapping(value = "/api1", method = RequestMethod.GET, produces = "application/json")
    @ResponseBody
    public String getNewIDandSerialNumber() {
        try {
            String id = buildtimeIDGenerator.getNewBuildTimeID();
            String sn = buildtimeIDGenerator.getNewBuildTimeCode();// serialNumber
            return id + "|" + sn;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "0";
    }

    @RequestMapping(value = "/api2", method = RequestMethod.GET, produces = "application/json")
    @ResponseBody
    public String getNewID() {
        try {
            String id = buildtimeIDGenerator.getNewBuildTimeID();
            return id;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    @RequestMapping(value = "/api3", method = RequestMethod.POST, headers = "Accept=application/json")
    @ResponseBody
    public Folder createFolder(String entityname, String parentid, String ownerid, int type) {
        Folder folder = new Folder();
        try {
            String id = buildtimeIDGenerator.getNewBuildTimeID();
            folder.setId(id);
            folder.setName(entityname);
            folder.setType(type);
            folder.setRank(Folder.CUSTOM);
            folder.setParent(parentid);
            folder.setOwner(ownerid);
            wfFolderBlo.addNewFolder(folder);
            return folder;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    @RequestMapping(value = "/api4", method = RequestMethod.POST, headers = "Accept=application/json")
    @ResponseBody
    public JSTreeNode createWfProcess(String entityname, String parentid,
                                      String ownerid, String authorid, String authorname, String workflowtype) {
        try {
            WfProcess newprocess = new WfProcess();
            String id = buildtimeIDGenerator.getNewBuildTimeID();
            String code = buildtimeIDGenerator.getNewBuildTimeCode();
            newprocess.setId(id);
            newprocess.setCode(code);
            newprocess.setName(entityname);
            newprocess.setLastupdate(System.currentTimeMillis());
            newprocess.setAuthorId(authorid);
            newprocess.setAuthor(authorname);
            newprocess.setParent(parentid);
            newprocess.setOwner(ownerid);
            newprocess.setWorkflowType(Integer.parseInt(workflowtype));
            ObjectMapper mapper = new ObjectMapper();
            String strWfProcess = mapper.writeValueAsString(newprocess);
            newprocess.setProcessContent(strWfProcess);
            buildtimeWfProcessBlo.createNewWfProcess(newprocess);
            JSTreeNode wfprocess = new JSTreeNode();
            wfprocess.id = id;
            wfprocess.text = entityname;
            wfprocess.parentId = parentid;
            wfprocess.data = "3|" + ownerid + "|" + newprocess.getCode();
            return wfprocess; // failed
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    /**
     * Create and save a new user into repository.
     */
    @RequestMapping(value = "/api5", method = RequestMethod.POST, headers = "Accept=application/json")
    @ResponseBody
    public String saveWfProcess(String process) {
        try {
            JSONObject obj = new JSONObject(process);
            WfProcess newprocess = new WfProcess();
            newprocess.setId(obj.getString("id"));
            newprocess.setCode(obj.getString("code"));
            newprocess.setName(obj.getString("name"));
            newprocess.setWorkflowType(obj.getInt("workflowType"));
            newprocess.setProcessType(obj.getInt("processType"));
            newprocess.setAccessLevel(obj.getInt("accessLevel"));
            if (!obj.isNull("keywords")) {
                newprocess.setKeywords(obj.getString("keywords"));
            }
            if (!obj.isNull("description")) {
                newprocess.setDescription(obj.getString("description"));
            }
            if (!obj.isNull("authorId")) {
                newprocess.setAuthorId(obj.getString("authorId"));
            }
            if (!obj.isNull("author")) {
                newprocess.setAuthor(obj.getString("author"));
            }
            newprocess.setParent(obj.getString("parent"));
            newprocess.setOwner(obj.getString("owner"));
            newprocess.setLastupdate(obj.getLong("lastupdate"));
            newprocess.setStatus(obj.getInt("status"));
            if (!obj.isNull("purchasePrice")) {
                newprocess.setPurchasePrice(obj.getDouble("purchasePrice"));
            }
            if (!obj.isNull("usagePrice")) {
                newprocess.setUsagePrice(obj.getDouble("usagePrice"));
            }
            newprocess.setProcessContent(process);
            buildtimeWfProcessBlo.saveWfProcess(newprocess);
            return "{\"status\": \"1\"}"; // success
        } catch (Exception e) {
            e.printStackTrace();
            return "{\"status\": \"0\"}"; // failed
        }

    }

    // void : @ResponseStatus(value = HttpStatus.OK)
    @RequestMapping(value = "/api6", method = RequestMethod.GET, produces = "application/json; charset=utf-8")
    @ResponseBody
    public String getWfProcess(@RequestParam("id") String id) {
        try {
            return buildtimeWfProcessBlo.getProcessContent(id);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    @RequestMapping(value = "/api7", method = RequestMethod.POST, headers = "Accept=application/json")
    @ResponseBody
    public int updateWfProcessName(String id, String entityname, String lastupdate) {
        try {
            WfProcess p = buildtimeWfProcessBlo.getProcessById(id);
            String oldname = p.getName();
            String name = StringEscapeUtils.escapeSql(entityname);
            p.setName(name);
            String content = p.getProcessContent();
            if (content != null) {
                String newcontent = content.replaceAll(oldname, name);
                p.setProcessContent(newcontent);
            }
            p.setLastupdate(Long.parseLong(lastupdate));
            buildtimeWfProcessBlo.updateProcessName(p);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return 1;
    }

    @RequestMapping(value = "/api8", method = RequestMethod.POST, headers = "Accept=application/json")
    @ResponseBody
    public int updateFolderName(String id, String entityname) {
        try {
            Folder f = new Folder();
            f.setId(id);
            f.setName(entityname);
            wfFolderBlo.updateFolderName(f);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return 1;
    }

    @RequestMapping(value = "/api9", method = RequestMethod.GET, produces = "application/json; charset=utf-8")
    @ResponseBody
    public String[] getAllWfProcesses(String ownerid) {
        // WfProcess[] processes = null;
        try {
            return buildtimeWfProcessBlo.getAllProcesses(ownerid);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * Create and save a new released process into repository.
     */
    @RequestMapping(value = "/api10", method = RequestMethod.POST, headers = "Accept=application/json")
    @ResponseBody
    public String releaseWfProcess(String pid, String version, String releaser, String releaserid, String versionnote,
                                   double purchaseprice, double usageprice, String parent, String orgid) {
        try {
            String id = releasedWfProcessBlo.sendWfProcessForApproval(pid, version, releaser, releaserid, versionnote,
                    purchaseprice, usageprice, parent, orgid);
            return "{\"status\": \"1\", \"id\": \"" + id + "\"}"; // success
        } catch (Exception e) {
            e.printStackTrace();
            return "{\"status\": \"0\"}"; // failed
        }
    }

    @RequestMapping(value = "/api11", method = RequestMethod.POST, headers = "Accept=application/json")
    @ResponseBody
    public String deleteWfProcess(String processid, String ownerid) {
        try {
            buildtimeWfProcessBlo.deleteWfProcess(processid);
            FileUploadUtils.removeAllFiles(ownerid, "pm", processid);

            releasedWfProcessBlo.deleteWfProcess(processid);
            FileUploadUtils.removeAllFiles(ownerid, "rlp", processid);

            ProcessServiceSolrUtils.deleteSearchIndex(processid);
            return "{\"status\": \"1\"}"; // success
        } catch (Exception e) {
            e.printStackTrace();
            return "{\"status\": \"0\"}"; // failed
        }
    }

    @RequestMapping(value = "/api12", method = RequestMethod.GET, produces = "application/json; charset=utf-8")
    @ResponseBody
    public ProcessServiceSearchResultPage searchWfProcessService(String procid, String cond,
                                                                 String ownerid, int pageno, int pagesize) {
        String[] conditions = cond.split(" ");
        try {
            return ProcessServiceSolrUtils.searchApp(new String[]{ownerid}, conditions, pageno, pagesize);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    // void : @ResponseStatus(value = HttpStatus.OK)
    @RequestMapping(value = "/api13", method = RequestMethod.GET, produces = "application/json; charset=utf-8")
    @ResponseBody
    public ReleasedWfProcess getReleasedWfProcess(@RequestParam("id") String id) {
        try {
            return releasedWfProcessBlo.getReleasedProcess(id);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    @RequestMapping(value = "/api14", method = RequestMethod.POST, headers = "Accept=application/json")
    @ResponseBody
    public JSTreeNode[] getPublishFolders(String orgid) {
        List<Organization> orgs = null;
        try {
            orgs = buildtimeWfProcessBlo.getPulishFoldersForProcessViewer(orgid);
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

    @RequestMapping(value = "/api15", method = RequestMethod.POST, headers = "Accept=application/json")
    @ResponseBody
    public String updateReleaseWfProcess(String process) {
        try {
            JSONObject obj = new JSONObject(process);
            ReleasedWfProcess releasedProcess = new ReleasedWfProcess();
            releasedProcess.setId(obj.getString("id"));
            releasedProcess.setName(obj.getString("name"));
            if (!obj.isNull("version")) {
                releasedProcess.setVersion(obj.getString("version"));
            }
            if (!obj.isNull("releaser")) {
                releasedProcess.setReleaser(obj.getString("releaser"));
            }
            if (!obj.isNull("releaserId")) {
                releasedProcess.setReleaserId(obj.getString("releaserId"));
            }
            if (!obj.isNull("releaseStatement")) {
                releasedProcess.setReleaseStatement(obj.getString("releaseStatement"));
            }
            if (!obj.isNull("purchasePrice")) {
                releasedProcess.setPurchasePrice(obj.getDouble("purchasePrice"));
            }
            if (!obj.isNull("usagePrice")) {
                releasedProcess.setUsagePrice(obj.getDouble("usagePrice"));
            }
            if (!obj.isNull("trialPeriod")) {
                releasedProcess.setTrialPeriod(obj.getInt("trialPeriod"));
            }
            if (!obj.isNull("owner")) {
                releasedProcess.setOwner(obj.getString("owner"));
            }
            releasedWfProcessBlo.updateReleasedWfProcess(releasedProcess);
        } catch (Exception e) {
            e.printStackTrace();
            return "{\"status\": \"0\"}"; // failed
        }
        return "{\"status\": \"1\"}"; // success
    }

    // release/withdraw process from process service store
    @RequestMapping(value = "/api16", method = RequestMethod.POST, headers = "Accept=application/json")
    @ResponseBody
    public String releaseWfProcess(String id, String deprecated, String comment, String owner, String userId,
                                   String userfullname, String ownername) {
        try {
            String v = SystemConfig.getProp("xq.product.service.approval");
            if (v.equals("0")) { // does not support approval service
                releasedWfProcessBlo.modifyWfProcessStatus(id, Integer.parseInt(deprecated),
                        System.currentTimeMillis());
            } else if (v.equals("1")) { // supports approval service
                releasedWfProcessBlo.releasedWfProcess(id, Integer.parseInt(deprecated));
            }
            Organization org = this.organizationBlo.getOrganizationDetailsById(owner);
            // 创建日志 Dahai Cao at 15:30 on 2018-10-18
            approveForReleaseBlo.createSubmittingApproveLog(id, "业务应用",
                    org.getId(), org.getName(),
                    ReleasedWfProcess.class.getSimpleName(),
                    Integer.parseInt(deprecated), comment,
                    System.currentTimeMillis(), owner,
                    userId, userfullname, ownername);
        } catch (Exception e) {
            e.printStackTrace();
            return "{\"status\": \"0\"}"; // failed
        }
        return "{\"status\": \"1\"}"; // success
    }

    @RequestMapping(value = "/api17", method = RequestMethod.GET, produces = "application/json; charset=utf-8")
    @ResponseBody
    public FormServiceSearchResultPage searchFormService(String frmid, String cond, String ownerid, int pageno,
                                                         int pagesize) throws IOException, SolrServerException {
        logger.info("被调用了");
        String[] conditions = cond.split(" ");
        return FormServiceSolrUtils.searchApp(new String[]{ownerid}, conditions, pageno, pagesize);
    }

    /**
     * 原api 18 ~ api 20 转移到 FileUploadController 内
     */

    @RequestMapping(value = "/api21", method = RequestMethod.POST, headers = "Accept=application/json")
    @ResponseBody
    public JSTreeNode[] getFolders(String orgid) {
        List<Organization> orgs = null;
        try {
            orgs = buildtimeWfProcessBlo.getFoldersForProcessViewer(orgid);
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

    /**
     * Move a wfprocess from one folder to another folder. The type is 100, the
     * process folder; 109, the released process folder;
     *
     * @param pid
     * @param parent
     * @param type   wfprocess type : "R", "P"
     * @return
     */
    @RequestMapping(value = "/api22", method = RequestMethod.POST, headers = "Accept=application/json")
    @ResponseBody
    public int moveWfProcess(String pid, String parent, String type) {
        try {
            if (type.equals("P")) {
                WfProcess p = buildtimeWfProcessBlo.getProcessById(pid);
                String oldparent = p.getParent();
                String content = p.getProcessContent();
                String newcontent = content.replaceAll(oldparent, parent);
                p.setProcessContent(newcontent);
                buildtimeWfProcessBlo.moveWfProcess(pid, parent, content);
            } else if (type.equals("R")) {
                ReleasedWfProcess rp = releasedWfProcessBlo.prepReleasedWfProcess(pid);
                String oldparent = rp.getParent();
                String content = rp.getProcessContent();
                String newcontent = content.replaceAll(oldparent, parent);
                rp.setProcessContent(newcontent);
                releasedWfProcessBlo.moveReleasedWfProcess(pid, parent, content);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return 1;
    }

    // @RequestMapping(value = "/api23", method = RequestMethod.POST, headers =
    // "Accept=application/json")
    // @ResponseBody
    // public JSTreeNode[] getCopyFolders(String orgid) {
    // List<Organization> orgs = null;
    // try {
    // orgs =
    // buildtimeWfProcessBlo.getFoldersForProcessViewer(orgid);
    // if (orgs != null) {
    // Organization[] orgArray = new Organization[orgs.size()];
    // for (int i = 0; i < orgArray.length; i++) {
    // orgArray[i] = orgs.get(i);
    // }
    // return generateJSTreeNodes(orgArray);
    // }
    // } catch (Exception e) {
    // e.printStackTrace();
    // }
    // return null;
    // }

    @RequestMapping(value = "/api24", method = RequestMethod.POST, headers = "Accept=application/json")
    @ResponseBody
    public String copyWfProcess(String pid, String parent, String orgid, String type) {
        try {
            if (type.equals("R")) {
                WfProcess newprocess = releasedWfProcessBlo.copyReleasedWfProcess(pid);
                // copy the files in the folder
                return "{\"status\": \"1\", \"id\": \"" + newprocess.getId() + "\"}"; // success
            } else if (type.equals("P")) {
                WfProcess newprocess = buildtimeWfProcessBlo.copyWfProcess(pid);
                // copy the files in the folder
                return "{\"status\": \"1\", \"id\": \"" + newprocess.getId() + "\"}"; // success
            }
        } catch (Exception e) {
            e.printStackTrace();

        }
        return "{\"status\": \"0\"}"; // failed
    }

    // purchase a process from process service store
    @RequestMapping(value = "/api25", method = RequestMethod.POST, headers = "Accept=application/json")
    @ResponseBody
    public JSTreeNode buyWfProcessById(String id, String parent, String owner, String modify) {
        try {
            // payment codes here.
            if (true) {
                WfProcess p = releasedWfProcessBlo.buyWfProcess(id, parent, owner, modify);
                JSTreeNode jstnode = new JSTreeNode();
                jstnode.id = p.getId();
                jstnode.text = JSTreeNode.parseUTF8(p.getName());
                jstnode.parentId = p.getParent();
                jstnode.icon = "";
                if (p instanceof ReleasedWfProcess) {
                    jstnode.icon = "glyphicon glyphicon-fire";
                    jstnode.data = "3|" + p.getOwner() + "|" + ((ReleasedWfProcess) p).getCode() + "|R|"
                            + ((ReleasedWfProcess) p).getVersion();
                    jstnode.text = JSTreeNode.parseUTF8(p.getName() + "(" + ((ReleasedWfProcess) p).getVersion() + ")");
                } else if (p instanceof WfProcess) {
                    jstnode.icon = "glyphicon glyphicon-flash";
                    jstnode.data = "3|" + p.getOwner() + "|" + ((WfProcess) p).getCode() + "|P";
                }
                return jstnode;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;

    }

    @RequestMapping(value = "/api26", method = RequestMethod.POST, headers = "Accept=application/json")
    @ResponseBody
    public String deleteFolder(String ids, String ownerid) {
        try {
            if (ids != null) {
                JSONArray obj = new JSONArray(ids);
                if (obj.length() > 0) {
                    String[] fpids = new String[obj.length()];
                    for (int i = 0; i < fpids.length; i++) {
                        fpids[i] = obj.getString(i);
                    }
                    buildtimeWfProcessBlo.deleteWfProcesses(fpids);
                    wfFolderBlo.deleteFolder(fpids);
                    releasedWfProcessBlo.deleteReleasedWfProcesses(fpids);
                    if (fpids != null && fpids.length > 0) {
                        for (String pid : fpids) {
                            ProcessServiceSolrUtils.deleteSearchIndex(pid);
                            FileUploadUtils.removeAllFiles(ownerid, "pm", pid);
                            FileUploadUtils.removeAllFiles(ownerid, "rlp", pid);
                        }
                    }
                }
            }
            return "{\"status\": \"1\"}"; // success
        } catch (Exception e) {
            e.printStackTrace();
            return "{\"status\": \"0\"}"; // failed
        }
    }

    @RequestMapping(value = "/api27", method = RequestMethod.POST, headers = "Accept=application/json")
    @ResponseBody
    public String moveFolder(String fid, String parent) {
        try {
            wfFolderBlo.moveFolder(fid, parent);
            return "{\"status\": \"1\"}"; // success
        } catch (Exception e) {
            e.printStackTrace();
            return "{\"status\": \"0\"}"; // failed
        }
    }


    @RequestMapping(value = "/api28", method = RequestMethod.GET, produces = "application/json; charset=utf-8")
    @ResponseBody
    public ProcessServiceSearchResultPage searchAppServices(String orgs,
                                                            String cond,
                                                            String uid,
                                                            int pageno,
                                                            int pagesize) {
        String[] conditions = cond.split(" ");
        try {
            String[] owners = null;
            if (orgs.indexOf("#") > 0) {
                owners = orgs.split("#");
            } else
                owners = new String[]{orgs};
            return ProcessServiceSolrUtils.search(owners, conditions, pageno, pagesize);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    @RequestMapping(value = "/api29", method = RequestMethod.GET, produces = "application/json; charset=utf-8")
    @ResponseBody
    public ProcessServiceSearchResultPage searchHomeworkAppServices(
            String uid, String pageno, String pagesize) throws Exception {
        return ProcessServiceSolrUtils.searchAllAppsByUserId(uid, Integer.valueOf(pageno), Integer.valueOf(pagesize));
    }

}
