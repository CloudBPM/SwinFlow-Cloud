/**
 *
 */
package com.cloudibpm.controller;

import com.cloudibpm.blo.buildtime.id.BuildtimeIDGenerator;
import com.cloudibpm.blo.folder.WfFolderBlo;
import com.cloudibpm.blo.form.FormBlo;
import com.cloudibpm.blo.om.organization.OrganizationBlo;
import com.cloudibpm.blo.reference.ReferenceBlo;
import com.cloudibpm.blo.release.form.ReleasedFormBlo;
import com.cloudibpm.blo.release.log.ApproveForReleaseBlo;
import com.cloudibpm.core.TreeNode;
import com.cloudibpm.core.folder.Folder;
import com.cloudibpm.core.folder.JSTreeNode;
import com.cloudibpm.core.form.Form;
import com.cloudibpm.core.organization.Organization;
import com.cloudibpm.core.reference.Reference;
import com.cloudibpm.core.release.form.ReleasedForm;
import com.cloudibpm.core.release.form.ReleasedFormListPage;
import com.cloudibpm.core.solr.FormServiceSolrUtils;
import com.cloudibpm.core.util.DateUtility;
import com.cloudibpm.core.util.SystemConfig;
import com.cloudibpm.core.util.file.FileUploadUtils;
import org.apache.commons.lang.StringEscapeUtils;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * This service is used for external application access control.
 *
 * @author Dahai Cao
 * @date 20170109
 */
@RestController
@RequestMapping("/service9")
public class FormController {
    private final FormBlo formBlo;
    private final BuildtimeIDGenerator buildtimeIDGenerator;
    private final ReleasedFormBlo releasedFormBlo;
    private final ApproveForReleaseBlo approveForReleaseBlo;
    private final ReferenceBlo referenceBlo;
    private final OrganizationBlo organizationBlo;
    private final WfFolderBlo wfFolderBlo;

    @Autowired
    public FormController(FormBlo formBlo,
                          BuildtimeIDGenerator buildtimeIDGenerator,
                          WfFolderBlo wfFolderBlo,
                          ReleasedFormBlo releasedFormBlo,
                          ApproveForReleaseBlo approveForReleaseBlo,
                          ReferenceBlo referenceBlo, OrganizationBlo organizationBlo) {
        this.formBlo = formBlo;
        this.buildtimeIDGenerator = buildtimeIDGenerator;
        this.wfFolderBlo = wfFolderBlo;
        this.releasedFormBlo = releasedFormBlo;
        this.approveForReleaseBlo = approveForReleaseBlo;
        this.referenceBlo = referenceBlo;
        this.organizationBlo = organizationBlo;
    }

    @RequestMapping(value = "/api0", method = RequestMethod.POST,
            headers = "Accept=application/json")
    @ResponseBody
    public JSTreeNode[] getProcessFolders(String ids) {
        List<Organization> orgs = null;
        try {
            if (ids.equals("00000000000001R")) {
                orgs = formBlo.getOrganizationsForFormViewer();
            } else {
                String[] strArry = ids.split(";");
                orgs = formBlo.getOrganizationsForFormViewer(strArry);
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
                    // add some spare information
                    jstnode.data = "1|null";
                } else if (node instanceof Folder && ((Folder) node).getType() == 104) {
                    jstnode.icon = "glyphicon glyphicon-book";
                    jstnode.data = "2|" + node.getOwner() + "|" + ((Folder) node).getType() + "|"
                            + ((Folder) node).getRank();
                } else if (node instanceof Folder && ((Folder) node).getType() == 105) {
                    jstnode.icon = "glyphicon glyphicon-list-alt";
                    jstnode.data = "2|" + node.getOwner() + "|" + ((Folder) node).getType() + "|"
                            + ((Folder) node).getRank();
                } else if (node instanceof Folder && ((Folder) node).getType() == 106) {
                    jstnode.icon = "glyphicon glyphicon-th-large";
                    jstnode.data = "2|" + node.getOwner() + "|" + ((Folder) node).getType() + "|"
                            + ((Folder) node).getRank();
                } else if (node instanceof Folder && ((Folder) node).getType() == 118) {
                    jstnode.icon = "glyphicon glyphicon-folder-open";
                    jstnode.data = "2|" + node.getOwner() + "|" + ((Folder) node).getType() + "|"
                            + ((Folder) node).getRank();
                } else if (node instanceof ReleasedForm) {
                    jstnode.icon = "glyphicon glyphicon-file";
                    // add some spare information
                    jstnode.data = "3|" + node.getOwner() + "|" + ((ReleasedForm) node).getCode() + "|RF";
                } else if (node instanceof Form) {
                    jstnode.icon = "glyphicon glyphicon-file";
                    // add some spare information
                    jstnode.data = "3|" + node.getOwner() + "|" + ((Form) node).getCode() + "|F";
                } else if (node instanceof Reference) {
                    jstnode.icon = "glyphicon glyphicon-file";
                    // add some spare information
                    jstnode.data = "3|" + node.getOwner() + "||R";
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

    @RequestMapping(value = "/api1", method = RequestMethod.GET,
            produces = "application/json")
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

    @RequestMapping(value = "/api2", method = RequestMethod.GET,
            produces = "application/json")
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

    @RequestMapping(value = "/api3", method = RequestMethod.POST,
            headers = "Accept=application/json")
    @ResponseBody
    public Folder createFolder(String entityname, int type,
                               String parentid, String ownerid) {
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

    @RequestMapping(value = "/api4", method = RequestMethod.POST,
            headers = "Accept=application/json")
    @ResponseBody
    public JSTreeNode createForm(String entityname, String parentid,
                                 String ownerid, String authorid, String authorname, String servicetype) {
        try {
            Form newform = new Form();
            String id = buildtimeIDGenerator.getNewBuildTimeID();
            String code = buildtimeIDGenerator.getNewBuildTimeCode();
            newform.setId(id);
            newform.setCode(code);
            newform.setName(entityname);
            long d = System.currentTimeMillis();
            newform.setCreateDatetime(d);
            newform.setLastupdate(d);
            newform.setAuthorId(authorid);
            newform.setAuthor(authorname);
            newform.setParent(parentid);
            newform.setOwner(ownerid);
            newform.setServiceType(Integer.parseInt(servicetype));
            formBlo.createNewForm(newform);
            JSTreeNode form = new JSTreeNode();
            form.id = id;
            form.text = entityname;
            form.parentId = parentid;
            form.data = "3|" + ownerid + "|" + newform.getCode() + "|F";
            return form;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * Gets a form object/released form object.
     *
     * @param id
     *          form ID or released Form Id
     * @param r
     *          released flag, 0: form; 1: released form;
     * @return
     */
    // void : @ResponseStatus(value = HttpStatus.OK)
    @RequestMapping(value = "/api5", method = RequestMethod.GET,
            produces = "application/json")
    @ResponseBody
    public Form getForm(@RequestParam("id") String id, @RequestParam("r") String r) {
        try {
            if (r.equals("0")) {
                return formBlo.getForm(id);
            } else {
                return releasedFormBlo.getReleasedForm(id);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * Update and save a form object into repository
     *
     * @param f
     *            Form
     */
    @RequestMapping(value = "/api6", method = RequestMethod.POST,
            headers = "Accept=application/json")
    @ResponseBody
    public String saveForm(String f) {
        try {
            JSONObject obj = new JSONObject(f);
            Form form = new Form();
            form.setId(obj.getString("id"));
            form.setCode(obj.getString("code"));
            form.setName(obj.getString("name"));
            if (!obj.isNull("keywords")) {
                form.setKeywords(obj.getString("keywords"));
            }
            if (!obj.isNull("description")) {
                form.setDescription(obj.getString("description"));
            }
            if (!obj.isNull("authorId")) {
                form.setAuthorId(obj.getString("authorId"));
            }
            if (!obj.isNull("author")) {
                form.setAuthor(obj.getString("author"));
            }
            form.setParent(obj.getString("parent"));
            // not update the two values
            // form.setOwner(obj.getString("owner"));
            form.setCreateDatetime(obj.getLong("createDatetime"));
            form.setLastupdate(obj.getLong("lastupdate"));
            form.setStatus(obj.getInt("status"));
            if (!obj.isNull("purchasePrice")) {
                form.setPurchasePrice(obj.getDouble("purchasePrice"));
            }
            if (!obj.isNull("usagePrice")) {
                form.setUsagePrice(obj.getDouble("usagePrice"));
            }
            if (!obj.isNull("formContent")) {
                form.setFormContent(obj.getString("formContent"));
            }
            formBlo.updateForm(form);
        } catch (Exception e) {
            e.printStackTrace();
            return "{\"status\": \"0\"}"; // failed
        }
        return "{\"status\": \"1\"}"; // success
    }

    @RequestMapping(value = "/api7", method = RequestMethod.POST,
            headers = "Accept=application/json")
    @ResponseBody
    public JSTreeNode[] getPublishFolders(String orgid) {
        List<Organization> orgs = null;
        try {
            orgs = formBlo.getPulishFoldersForFormViewer(orgid);
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
     * Create and save a new released form into repository.
     *
     */
    @RequestMapping(value = "/api8", method = RequestMethod.POST,
            headers = "Accept=application/json")
    @ResponseBody
    public String releaseForm(String fid, String version, String releaserid, String releaser,
                              String versionnote, double purchaseprice,
                              double usageprice, String parent, String orgid) {
        try {
            ReleasedForm rlForm = releasedFormBlo.getForm(fid);
            rlForm.setVersion(version);
            rlForm.setReleaserId(releaserid);
            rlForm.setReleaser(releaser);
            rlForm.setReleaseStatement(versionnote);
            rlForm.setReleaseDate(System.currentTimeMillis());
            rlForm.setPurchasePrice(purchaseprice);
            rlForm.setUsagePrice(usageprice);
            rlForm.setParent(parent);
            rlForm.setOwner(orgid);
            rlForm.setDeprecated(1); // once release, it is on deprecated.
            // change ID and change Organization ID.
            String id = buildtimeIDGenerator.getNewBuildTimeID();
            rlForm.setId(id);
            String content = rlForm.getFormContent();
            String newcontent = content.replaceAll(fid, id);
            rlForm.setFormContent(newcontent);
            rlForm.setOwner(orgid);
            // change ID and change Organization ID.
            releasedFormBlo.saveReleasedForm(rlForm);
            return "{\"status\": \"1\", \"id\": \"" + id + "\"}"; // success
        } catch (Exception e) {
            e.printStackTrace();
            return "{\"status\": \"0\"}"; // failed
        }
    }

    // void : @ResponseStatus(value = HttpStatus.OK)
    @RequestMapping(value = "/api9", method = RequestMethod.GET, produces = "application/json")
    @ResponseBody
    public ReleasedForm getReleasedForm(@RequestParam("id") String id) {
        try {
            ReleasedForm form = releasedFormBlo.getReleasedForm(id);
            return form;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    @RequestMapping(value = "/api10", method = RequestMethod.POST,
            headers = "Accept=application/json")
    @ResponseBody
    public String updateReleaseForm(String f) {
        try {
            JSONObject obj = new JSONObject(f);
            ReleasedForm releasedForm = new ReleasedForm();
            releasedForm.setId(obj.getString("id"));
            if (!obj.isNull("version")) {
                releasedForm.setVersion(obj.getString("version"));
            }
            if (!obj.isNull("releaserId")) {
                releasedForm.setReleaserId(obj.getString("releaserId"));
            }
            if (!obj.isNull("releaser")) {
                releasedForm.setReleaser(obj.getString("releaser"));
            }
            if (!obj.isNull("releaseStatement")) {
                releasedForm.setReleaseStatement(obj.getString("releaseStatement"));
            }
            if (!obj.isNull("deprecated")) {
                releasedForm.setDeprecated(obj.getInt("deprecated"));
            }
            if (!obj.isNull("purchasePrice")) {
                releasedForm.setPurchasePrice(obj.getDouble("purchasePrice"));
            }
            if (!obj.isNull("usagePrice")) {
                releasedForm.setUsagePrice(obj.getDouble("usagePrice"));
            }
            if (!obj.isNull("trialPeriod")) {
                releasedForm.setTrialPeriod(obj.getInt("trialPeriod"));
            }
            if (!obj.isNull("owner")) {
                releasedForm.setOwner(obj.getString("owner"));
            }
            releasedFormBlo.updateReleasedForm(releasedForm);
        } catch (Exception e) {
            e.printStackTrace();
            return "{\"status\": \"0\"}"; // failed
        }
        return "{\"status\": \"1\"}"; // success
    }

    @RequestMapping(value = "/api11", method = RequestMethod.POST,
            headers = "Accept=application/json")
    @ResponseBody
    public String releaseForm(String id, String deprecated,
                              String comment, String lastupdate,
                              String owner, String userId,
                              String userfullname, String ownername) {
        try {
            String v = SystemConfig.getProp("xq.product.service.approval");
            if (v.equals("0")) { // does not support approval service
                releasedFormBlo.modifyRlFormStatus(id, Integer.parseInt(deprecated),
                        Long.parseLong(lastupdate), ownername);
            } else if (v.equals("1")) { // supports approval service
                releasedFormBlo.releasedForm(id, Integer.parseInt(deprecated));
            }
            Organization org = this.organizationBlo.getOrganizationDetailsById(owner);
            // 创建日志 Dahai Cao at 15:30 on 2018-10-18
            approveForReleaseBlo.createSubmittingApproveLog(id,
                    "界面应用", org.getId(), org.getName(),
                    ReleasedForm.class.getSimpleName(),
                    Integer.parseInt(deprecated),
                    comment, Long.parseLong(lastupdate), owner, userId,
                    userfullname, ownername);
        } catch (Exception e) {
            e.printStackTrace();
            return "{\"status\": \"0\"}"; // failed
        }
        return "{\"status\": \"1\"}"; // success
    }

    // query all form
    @RequestMapping(value = "/api12", method = RequestMethod.GET, produces = "application/json")
    @ResponseBody
    public ReleasedFormListPage queryReleasedForm(int deprecated, String condition,
                                                  int pageno, int pagesize) {
        try {
            return releasedFormBlo.searchReleasedForm(deprecated,
                    condition, pageno, pagesize);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    // update form status
    @RequestMapping(value = "/api13", method = RequestMethod.POST,
            headers = "Accept=application/json")
    @ResponseBody
    public String modifyRlFormStatus(String deprecated, String fid, String lastupdate,
                                     String comment, String owner, String userId,
                                     String userfullname, String ownername) {
        try {
            releasedFormBlo.modifyRlFormStatus(fid, Integer.parseInt(deprecated),
                    Long.parseLong(lastupdate), ownername);
            // 创建日志 Dahai Cao at 15:30 on 2018-10-18
            approveForReleaseBlo.createApprovingLog(fid,
                    "界面应用", owner, ownername,
                    ReleasedForm.class.getSimpleName(),
                    Integer.parseInt(deprecated), comment,
                    System.currentTimeMillis(), owner, userId,
                    userfullname, ownername);
            return "{\"status\": \"1\"}";
        } catch (Exception e) {
            return "{\"status\": \"0\"}";
        }
    }

    /**
     * @author Dahai Cao created at 22:38 on 2018-09-14
     * @param id
     *            String, reference Id or form Id or released form Id
     * @param ownerid
     *            String, organization ID
     * @return
     */
    @RequestMapping(value = "/api14", method = RequestMethod.POST,
            headers = "Accept=application/json")
    @ResponseBody
    public String removeObject(String id, String ownerid) {
        try {
            //wfFolderBlo.deleteFolder();
            releasedFormBlo.removeForm(id);
            formBlo.removeForm(id);
            referenceBlo.removeReference(id);
            // 删除这个ID下的所有文件。
            FileUploadUtils.removeAllFiles(ownerid, "fm", id);
            FileUploadUtils.removeAllFiles(ownerid, "rlf", id);
            FormServiceSolrUtils.deleteSearchIndex(id);
        } catch (Exception e) {
            e.printStackTrace();
            return "{\"status\": \"0\"}"; // failed
        }
        return "{\"status\": \"1\"}"; // success
    }

    /**
     * @author Dahai Cao created at 22:38 on 2018-09-14
     * @param ids
     *            String array, the folder ID array and object Ids( reference
     *            Id, form Id, released form Id)
     * @param ownerid
     *            String, organization ID
     * @return
     */
    @RequestMapping(value = "/api15",
            method = RequestMethod.POST,
            headers = "Accept=application/json")
    @ResponseBody
    public String removeFolder(String ids, String ownerid) {
        try {
            if (ids != null) {
                JSONArray obj = new JSONArray(ids);
                if (obj.length() > 0) {
                    String[] fpids = new String[obj.length()];
                    for (int i = 0; i < fpids.length; i++) {
                        fpids[i] = obj.getString(i);
                    }
                    releasedFormBlo.removeForms(fpids);
                    formBlo.removeForms(fpids);
                    wfFolderBlo.deleteFolder(fpids);
                    if (fpids != null && fpids.length > 0) {
                        for (String fid : fpids) {
                            FormServiceSolrUtils.deleteSearchIndex(fid);
                            FileUploadUtils.removeAllFiles(ownerid, "fm", fid);
                            FileUploadUtils.removeAllFiles(ownerid, "rlf", fid);
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

    /**
     *
     * @param id,
     *            entity id, form id, reference id, released form id
     * @param entityname,
     *            entity name, form name, reference name, released form name
     * @param lastupdate,
     *            time stamp
     * @param type,
     *            R: reference; RF: released form; F: form
     * @return
     */
    @RequestMapping(value = "/api16", method = RequestMethod.POST,
            headers = "Accept=application/json")
    @ResponseBody
    public int updateObjectName(String id, String entityname, String lastupdate, String type) {
        try {
            if (type.equals("R")) { // update reference name
                String name = StringEscapeUtils.escapeSql(entityname);
                referenceBlo.renameReferenceName(id, name,
                        DateUtility.parseDatetime(lastupdate).getTime());
            } else if (type.equals("RF")) { // update released form name
                ReleasedForm form = releasedFormBlo.getReleasedForm(id);
                String oldname = form.getName();
                String name = StringEscapeUtils.escapeSql(entityname);
                form.setName(name);
                form.setLastupdate(Long.parseLong(lastupdate));
                String content = form.getFormContent();
                if (content != null) {
                    String newcontent = content.replaceAll(oldname, name);
                    form.setFormContent(newcontent);
                }
                releasedFormBlo.updateRelasedFormName(form.getId(),
                        form.getName(), form.getFormContent(),
                        DateUtility.parseDate(lastupdate).getTime());
            } else if (type.equals("F")) { // update form name
                Form form = formBlo.getForm(id);
                String oldname = form.getName();
                String name = StringEscapeUtils.escapeSql(entityname);
                form.setName(name);
                form.setLastupdate(Long.parseLong(lastupdate));
                String content = form.getFormContent();
                if (content != null) {
                    String newcontent = content.replaceAll(oldname, name);
                    form.setFormContent(newcontent);
                }
                formBlo.updateForm(form);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return 1;
    }

    @RequestMapping(value = "/api17", method = RequestMethod.POST, headers = "Accept=application/json")
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

    // 保留接口
    @RequestMapping(value = "/api18", method = RequestMethod.GET,
            produces = "application/json")
    @ResponseBody
    public String[] getNewIDs(String idnum) {
        try {
            int n = Integer.parseInt(idnum);
            String[] ids = new String[n];
            for (int i = 0; i < n; i++) {
                ids[i] = buildtimeIDGenerator.getNewBuildTimeID();
            }
            return ids;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

}
