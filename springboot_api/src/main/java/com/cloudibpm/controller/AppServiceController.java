package com.cloudibpm.controller;

import com.alibaba.fastjson.JSON;
import com.cloudibpm.blo.am.androidapp.AndroidAppMsPluginBlo;
import com.cloudibpm.blo.am.appservice.AMPerspectiveBlo;
import com.cloudibpm.blo.am.appservice.WebAppServiceBlo;
import com.cloudibpm.blo.am.container.ServiceContainerBlo;
import com.cloudibpm.blo.am.template.EmailTemplateBlo;
import com.cloudibpm.blo.am.template.SMSTemplateBlo;
import com.cloudibpm.blo.buildtime.id.BuildtimeIDGenerator;
import com.cloudibpm.blo.om.organization.OrganizationBlo;
import com.cloudibpm.blo.release.log.ApproveForReleaseBlo;
import com.cloudibpm.core.TreeNode;
import com.cloudibpm.core.appservice.AndroidAppPlugin;
import com.cloudibpm.core.appservice.AndroidAppPluginPage;
import com.cloudibpm.core.appservice.WebAppService;
import com.cloudibpm.core.appservice.WebAppServiceListPage;
import com.cloudibpm.core.container.ServiceContainer;
import com.cloudibpm.core.folder.Folder;
import com.cloudibpm.core.folder.JSTreeNode;
import com.cloudibpm.core.organization.Organization;
import com.cloudibpm.core.solr.AppServiceSearchResultPage;
import com.cloudibpm.core.solr.AppServiceSolrUtils;
import com.cloudibpm.core.template.EmailTemplate;
import com.cloudibpm.core.template.SMSTemplate;
import com.cloudibpm.core.util.SystemConfig;
import com.cloudibpm.core.util.json.MicroServiceJSONParser;
import com.cloudibpm.eso.om.organization.WfOrganizationEso;
import org.apache.commons.lang3.StringUtils;
import org.json.JSONArray;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/service7")
public class AppServiceController {
    private final AMPerspectiveBlo amPerspectiveBlo;
    private final WebAppServiceBlo webAppServiceBlo;
    private final SMSTemplateBlo smsTemplateBlo;
    private final EmailTemplateBlo emailTemplateBlo;
    private final ServiceContainerBlo serviceContainerBlo;
    private final BuildtimeIDGenerator buildtimeIDGenerator;
    private final ApproveForReleaseBlo approveForReleaseBlo;
    private final AndroidAppMsPluginBlo androidAppMsPluginBlo;
    private final OrganizationBlo organizationBlo;
    private final WfOrganizationEso wfOrganizationEso;
    private static Logger logger = LoggerFactory.getLogger(AppServiceController.class);

    @Autowired
    public AppServiceController(AMPerspectiveBlo amPerspectiveBlo,
                                WebAppServiceBlo webAppServiceBlo,
                                SMSTemplateBlo smsTemplateBlo,
                                EmailTemplateBlo emailTemplateBlo,
                                ServiceContainerBlo serviceContainerBlo,
                                BuildtimeIDGenerator buildtimeIDGenerator,
                                ApproveForReleaseBlo approveForReleaseBlo,
                                AndroidAppMsPluginBlo androidAppMsPluginBlo, OrganizationBlo organizationBlo, WfOrganizationEso wfOrganizationEso) {
        this.amPerspectiveBlo = amPerspectiveBlo;
        this.webAppServiceBlo = webAppServiceBlo;
        this.smsTemplateBlo = smsTemplateBlo;
        this.emailTemplateBlo = emailTemplateBlo;
        this.serviceContainerBlo = serviceContainerBlo;
        this.buildtimeIDGenerator = buildtimeIDGenerator;
        this.approveForReleaseBlo = approveForReleaseBlo;
        this.androidAppMsPluginBlo = androidAppMsPluginBlo;
        this.organizationBlo = organizationBlo;
        this.wfOrganizationEso = wfOrganizationEso;
    }

    @RequestMapping(value = "/api0", method = RequestMethod.POST, headers = "Accept=application/json")
    @ResponseBody
    public JSTreeNode[] getAppServiceFolders(String ids) {
        List<Organization> orgs = null;
        try {
            if (ids.equals("00000000000001R")) {
                orgs = amPerspectiveBlo.getOrganizationsForAgentViewer();
            } else {
                String[] strArry = ids.split(";");
                orgs = amPerspectiveBlo.getOrganizationsForAgentViewer(strArry);
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
                jstnode.text = node.getName();
                jstnode.icon = "";
                // 1: Tree root; 2: Folder (Subtree); 3: Leaf nodes
                if (node instanceof Organization) {
                    jstnode.icon = "glyphicon glyphicon-home";
                    jstnode.data = "1|null";
                } else if (node instanceof Folder) {
                    jstnode.icon = "glyphicon glyphicon-folder-open";
                    jstnode.data = "2|" + node.getOwner() + "|" + ((Folder) node).getType() + "|"
                            + ((Folder) node).getRank();
                } else if (node instanceof ServiceContainer) {
                    jstnode.icon = "glyphicon glyphicon-th-large";
                    jstnode.data = "3|" + node.getOwner() + "|5|" + ((ServiceContainer) node).getType() + "|"
                            + ((ServiceContainer) node).getRank() + "|" + ((ServiceContainer) node).getContainerType();
                } else if (node instanceof SMSTemplate) {
                    jstnode.icon = "glyphicon glyphicon-envelope";
                    jstnode.data = "3|" + node.getOwner() + "|1|" + ((SMSTemplate) node).getStatus();
                } else if (node instanceof EmailTemplate) {
                    jstnode.icon = "glyphicon glyphicon-envelope";
                    jstnode.data = "3|" + node.getOwner() + "|2|" + ((EmailTemplate) node).getStatus();
                } else if (node instanceof WebAppService) {
                    jstnode.icon = "glyphicon glyphicon-leaf";
                    jstnode.data = "3|" + node.getOwner() + "|4|" + ((WebAppService) node).getAccessType() + "|"
                            + ((WebAppService) node).getStatus();
                } else if (node instanceof AndroidAppPlugin) {
                    jstnode.icon = "fa fa-android fa-lg";
                    jstnode.data = "3|" + node.getOwner() + "|6|" + ((AndroidAppPlugin) node).getAccessType() + "|"
                            + ((AndroidAppPlugin) node).getStatus();
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

    // api1 has been deleted

    @RequestMapping(value = "/api2", method = RequestMethod.GET, produces = "application/json")
    @ResponseBody
    public TreeNode getAppAPI(String apptype, String id) {
        try {
            if (apptype.equals("7")) {// web app service (micro service)
                WebAppService was = webAppServiceBlo.getAppServiceForPM(id);
                return was;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    @RequestMapping(value = "/api3", method = RequestMethod.GET, produces = "application/json")
    @ResponseBody
    public String checkName(String name, String type, String owner) {
        try {
            if (type.equals("1")) { // sms template
                boolean f = smsTemplateBlo.existsTemplateName(name, owner);
                if (f)
                    return "1";
            } else if (type.equals("2")) { // email template
                boolean f = emailTemplateBlo.existsTemplateName(name, owner);
                if (f)
                    return "1";
            } else if (type.equals("3")) { // micro-service
                boolean f = webAppServiceBlo.existsServiceName(name, owner);
                if (f)
                    return "1";
            } else if (type.equals("5")) { // docker container
                boolean f = serviceContainerBlo.existsContainerName(name, owner);
                if (f)
                    return "1";
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "0";
    }

    @RequestMapping(value = "/api4", method = RequestMethod.POST, headers = "Accept=application/json")
    @ResponseBody
    public JSTreeNode create(String jsonobj) {
        try {
            JSONObject obj = new JSONObject(jsonobj);
            String classtypename = obj.getString("classtypename");
            if (classtypename.equals("SMSTemplate")) {
                SMSTemplate template = new SMSTemplate();
                template.setId(buildtimeIDGenerator.getNewBuildTimeID());
                template.setName(obj.getString("name"));
                template.setStatus(1);
                if (obj.isNull("createDateTime")) {
                    template.setCreateDateTime(obj.getLong("createDateTime"));
                }
                if (!obj.isNull("lastupdate")) {
                    template.setLastupdate(obj.getLong("lastupdate"));
                }
                if (!obj.isNull("parent")) {
                    template.setParent(obj.getString("parent"));
                }
                if (!obj.isNull("owner")) {
                    template.setOwner(obj.getString("owner"));
                }
                smsTemplateBlo.createTemplate(template);
                JSTreeNode node = new JSTreeNode();
                node.id = template.getId();
                node.text = obj.getString("name");
                node.data = "3|" + template.getOwner() + "|1|" + template.getStatus();
                node.icon = "glyphicon glyphicon-envelope";
                return node;
            } else if (classtypename.equals("EmailTemplate")) {
                EmailTemplate template = new EmailTemplate();
                template.setId(buildtimeIDGenerator.getNewBuildTimeID());
                template.setName(obj.getString("name"));
                template.setStatus(1);
                if (obj.isNull("createDateTime")) {
                    template.setCreateDateTime(obj.getLong("createDateTime"));
                }
                if (!obj.isNull("lastupdate")) {
                    template.setLastupdate(obj.getLong("lastupdate"));
                }
                if (!obj.isNull("parent")) {
                    template.setParent(obj.getString("parent"));
                }
                if (!obj.isNull("owner")) {
                    template.setOwner(obj.getString("owner"));
                }
                emailTemplateBlo.createTemplate(template);
                JSTreeNode node = new JSTreeNode();
                node.id = template.getId();
                node.text = template.getName();
                node.data = "3|" + template.getOwner() + "|2|" + template.getStatus();
                node.icon = "glyphicon glyphicon-envelope";
                return node;
            } else if (classtypename.equals("WebAppService")) {
                WebAppService ras = new WebAppService();
                ras.setId(buildtimeIDGenerator.getNewBuildTimeID());
                ras.setName(obj.getString("name"));
                ras.setMethodName(obj.getString("methodName"));
                if (obj.isNull("createDateTime")) {
                    ras.setCreateDateTime(obj.getLong("createDateTime"));
                }
                if (!obj.isNull("lastupdate")) {
                    ras.setLastupdate(obj.getLong("lastupdate"));
                }
                if (!obj.isNull("parent")) {
                    ras.setParent(obj.getString("parent"));
                }
                if (!obj.isNull("owner")) {
                    ras.setOwner(obj.getString("owner"));
                }
                webAppServiceBlo.create(ras);
                JSTreeNode node = new JSTreeNode();
                node.id = ras.getId();
                node.text = ras.getName();
                node.data = "3|" + ras.getOwner() + "|4|" + ras.getAccessType() + "|" + ras.getStatus();
                node.icon = "glyphicon glyphicon-leaf";
                return node;
            } else if (classtypename.equals("ServiceContainer")) {
                ServiceContainer sc = new ServiceContainer();
                sc.setId(buildtimeIDGenerator.getNewBuildTimeID());
                sc.setName(obj.getString("name"));
                sc.setContainerType(obj.getInt("containerType"));
                sc.setRank(obj.getInt("rank"));
                sc.setType(obj.getInt("type"));
                if (obj.isNull("createDateTime")) {
                    sc.setCreateDateTime(obj.getLong("createDateTime"));
                }
                if (!obj.isNull("lastupdate")) {
                    sc.setLastupdate(obj.getLong("lastupdate"));
                }
                if (!obj.isNull("parent")) {
                    sc.setParent(obj.getString("parent"));
                }
                if (!obj.isNull("owner")) {
                    sc.setOwner(obj.getString("owner"));
                }
                serviceContainerBlo.create(sc);
                JSTreeNode node = new JSTreeNode();
                node.id = sc.getId();
                node.text = sc.getName();
                node.data = "3|" + sc.getOwner() + "|5|" + sc.getType() + "|" + sc.getRank() + "|"
                        + sc.getContainerType();
                node.icon = "glyphicon glyphicon-th-large";
                return node;
            } else if (classtypename.equals("AndroidAppPlugin")) {
                AndroidAppPlugin plugin = new AndroidAppPlugin();
                plugin.setId(buildtimeIDGenerator.getNewBuildTimeID());
                plugin.setAlias(buildtimeIDGenerator.getNewBuildTimeCode());
                plugin.setName(obj.getString("name"));
                if (!obj.isNull("createDateTime")) {
                    plugin.setCreateDateTime(obj.getLong("createDateTime"));
                }
                if (!obj.isNull("lastupdate")) {
                    plugin.setLastupdate(obj.getLong("lastupdate"));
                }
                if (!obj.isNull("parent")) {
                    plugin.setParent(obj.getString("parent"));
                }
                if (!obj.isNull("owner")) {
                    plugin.setOwner(obj.getString("owner"));
                }
                this.androidAppMsPluginBlo.create(plugin);
                JSTreeNode node = new JSTreeNode();
                node.id = plugin.getId();
                node.text = plugin.getName();
                node.data = "3|" + plugin.getOwner() + "|6|" + plugin.getAccessType() + "|" + plugin.getStatus();
                node.icon = "fa fa-android fa-lg";
                return node;
            }
        } catch (Exception e) {
            logger.info(e.toString());
            e.printStackTrace();
        }
        return null; // success
    }

    @RequestMapping(value = "/api5", method = RequestMethod.GET, produces = "application/json")
    @ResponseBody
    public SMSTemplate getSMSTemplate(String id) {
        try {
            return smsTemplateBlo.getTemplate(id);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @RequestMapping(value = "/api6", method = RequestMethod.GET, produces = "application/json")
    @ResponseBody
    public EmailTemplate getEmailTemplate(String id) {
        try {
            return emailTemplateBlo.getTemplate(id);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    @RequestMapping(value = "/api7", method = RequestMethod.POST, headers = "Accept=application/json")
    @ResponseBody
    public String saveSMSTemplate(String template) {
        try {
            JSONObject obj = new JSONObject(template);
            SMSTemplate t = new SMSTemplate();
            t.setId(obj.getString("id"));
            t.setName(obj.getString("name"));
            t.setStatus(obj.getInt("status"));
            if (!obj.isNull("smsContent"))
                t.setSmsContent(obj.getString("smsContent"));
            t.setCreateDateTime(obj.getLong("createDateTime"));
            t.setLastupdate(obj.getLong("lastupdate"));
            t.setParent(obj.getString("parent"));
            t.setOwner(obj.getString("owner"));
            smsTemplateBlo.updateTemplate(t);
        } catch (Exception e) {
            e.printStackTrace();
            return "{\"status\": \"0\"}"; // failed
        }
        return "{\"status\": \"1\"}"; // success
    }

    @RequestMapping(value = "/api8", method = RequestMethod.POST, headers = "Accept=application/json")
    @ResponseBody
    public String saveEmailTemplate(String template) {
        try {
            JSONObject obj = new JSONObject(template);
            EmailTemplate t = new EmailTemplate();
            t.setId(obj.getString("id"));
            t.setName(obj.getString("name"));
            t.setStatus(obj.getInt("status"));
            if (!obj.isNull("emailSubject"))
                t.setEmailSubject(obj.getString("emailSubject"));
            if (!obj.isNull("emailContent")) {
                String s = obj.getString("emailContent");
                t.setEmailContent(new String(s.getBytes("utf-8")));
            }
            if (obj.getJSONArray("attachments") != null) {
                String attachs = "";
                JSONArray arry = obj.getJSONArray("attachments");
                for (int i = 0; i < arry.length(); i++) {
                    if (attachs.equals("")) {
                        attachs = arry.getJSONObject(i).toString();
                    } else {
                        attachs = attachs + ";" + arry.getJSONObject(i).toString();
                    }
                }
                t.setAttachments(arry.toString());
            }
            t.setCreateDateTime(obj.getLong("createDateTime"));
            t.setLastupdate(obj.getLong("lastupdate"));
            t.setParent(obj.getString("parent"));
            t.setOwner(obj.getString("owner"));
            emailTemplateBlo.updateTemplate(t);
        } catch (Exception e) {
            e.printStackTrace();
            return "{\"status\": \"0\"}"; // failed
        }
        return "{\"status\": \"1\"}"; // success
    }

    // api9-14 has been deleted.

    @RequestMapping(value = "/api15", method = RequestMethod.GET, produces = "application/json")
    @ResponseBody
    public WebAppService getWebAppService(String id) {
        try {
            return webAppServiceBlo.getAppService(id);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    @RequestMapping(value = "/api16", method = RequestMethod.POST, headers = "Accept=application/json")
    @ResponseBody
    public String saveWebAppService(String webappservice) {
        try {
            WebAppService t = MicroServiceJSONParser.parseWebAppServiceFromString(webappservice);
            webAppServiceBlo.save(t);
        } catch (Exception e) {
            e.printStackTrace();
            return "{\"status\": \"0\"}"; // failed
        }
        return "{\"status\": \"1\"}"; // success
    }

    @RequestMapping(value = "/api17", method = RequestMethod.GET, produces = "application/json")
    @ResponseBody
    public AppServiceSearchResultPage searchAppService(String appid,
                                                       String apptype,
                                                       String cond,
                                                       String ownerid,
                                                       int pageno,
                                                       int pagesize) {
        String[] conditions = cond.split(" ");
        try {
            return AppServiceSolrUtils.searchApp(new String[]{ownerid}, conditions, pageno, pagesize);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    @RequestMapping(value = "/api18", method = RequestMethod.GET, produces = "application/json")
    @ResponseBody
    public WebAppServiceListPage queryWebAppService(int status, String condition, int pageno, int pagesize) {
        try {
            WebAppServiceListPage page = webAppServiceBlo.searchWebAppService(status, condition, pageno,
                    pagesize);
            if (page != null && page.getPageEntities() != null && page.getPageEntities().length > 0) {
                for (int i = 0; i < page.getPageEntities().length; i++) {
                    page.getPageEntities()[i].setSecurityAccessKey("");
                }
            }
            return page;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;

    }

    @RequestMapping(value = "/api19", method = RequestMethod.POST, headers = "Accept=application/json")
    @ResponseBody
    public String deleteObject(String id, String etype, String owner) {
        try {
            if (etype.equals("1")) {
                smsTemplateBlo.deleteTemplate(id);
            } else if (etype.equals("2")) {
                emailTemplateBlo.deleteTemplate(id, owner);
            } else if (etype.equals("4")) {
                webAppServiceBlo.remove(id);
            } else if (etype.equals("5")) {
                serviceContainerBlo.remove(id);
            } else if (etype.equals("6")) {

            }
        } catch (Exception e) {
            e.printStackTrace();
            return "{\"status\": \"0\"}"; // failed
        }
        return "{\"status\": \"1\"}"; // success
    }

    /**
     * Rename the micro-service name, java application service name, service
     * container name, sms template name, email template name.
     *
     * @param id         String
     * @param entityname String,
     * @param etype      String
     * @param lastupdate String
     * @return
     */
    @RequestMapping(value = "/api20", method = RequestMethod.POST, headers = "Accept=application/json")
    @ResponseBody
    public String updateObjectName(String id, String entityname, String etype, String lastupdate) {
        try {
            if (etype.equals("1")) {
                smsTemplateBlo.rename(id, entityname, lastupdate);
            } else if (etype.equals("2")) {
                emailTemplateBlo.rename(id, entityname, lastupdate);
            } else if (etype.equals("4")) {
                webAppServiceBlo.rename(id, entityname, lastupdate);
            } else if (etype.equals("5")) {
                serviceContainerBlo.rename(id, entityname, lastupdate);
            } else if (etype.equals("6")) {

            }
        } catch (Exception e) {
            e.printStackTrace();
            return "{\"status\": \"0\"}"; // failed
        }
        return "{\"status\": \"1\"}"; // success
    }

    @RequestMapping(value = "/api21", method = RequestMethod.POST, headers = "Accept=application/json")
    @ResponseBody
    public int updateTemplateStatus(String id, int status, String etype, String lastupdate) {
        try {
            if (etype.equals("1")) {
                smsTemplateBlo.updateTemplateStatus(id, status, lastupdate);
            } else if (etype.equals("2")) {
                emailTemplateBlo.updateTemplateStatus(id, status, lastupdate);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return 1;
    }

    @RequestMapping(value = "/api22", method = RequestMethod.POST, headers = "Accept=application/json")
    @ResponseBody
    public String sendTestingSMS(String id, String to, String content) {
        try {
            smsTemplateBlo.sendTestSMS(id, to, content);
        } catch (Exception e) {
            e.printStackTrace();
            return "{\"status\": \"0\"}"; // failed
        }
        return "{\"status\": \"1\"}"; // success
    }

    @RequestMapping(value = "/api23", method = RequestMethod.POST, headers = "Accept=application/json")
    @ResponseBody
    public String sendTestingEmail(String oid, String id, String to, String subject, String content) {
        try {
            EmailTemplate emailTemplate = emailTemplateBlo.getTemplate(id);
            String temp = emailTemplate.getAttachments();
            String[] attachments = new String[0];
            String storagetype = SystemConfig.getProp("filestorage.type");
            String syspath = "";
            if (storagetype.trim().equals("win")) {
                syspath = SystemConfig.getProp("windows.filestorage.lib");
            } else if (storagetype.trim().equals("linux")) {
                syspath = SystemConfig.getProp("linux.filestorage.lib");
            }
            if (!syspath.equals("")) {
                String destination = syspath + "/" + oid + "/am/emltp/" + id;
                if (!StringUtils.isEmpty(temp)) {
                    JSONArray attach = new JSONArray(temp);
                    if (attach.length() > 0) {
                        attachments = new String[attach.length()];
                        for (int i = 0; i < attach.length(); i++) {
                            JSONObject o = attach.getJSONObject(i);
                            String fid = o.getString("id");
                            String name = o.getString("name");
                            attachments[i] = destination + "/" + fid + "_" + name;
                        }
                    }
                }
            }
            emailTemplateBlo.sendEmail(id, to, subject, content, attachments);
        } catch (Exception e) {
            e.printStackTrace();
            return "{\"status\": \"0\"}"; // failed
        }
        return "{\"status\": \"1\"}"; // success
    }

    @RequestMapping(value = "/api24", method = RequestMethod.POST, headers = "Accept=application/json")
    @ResponseBody
    public int updateMicroServiceStatus(String wid, int status, String lastupdate, String comment, String owner,
                                        String userId, String userfullname, String ownername) {
        try {
            webAppServiceBlo.modifyStatus(wid, status, Long.parseLong(lastupdate));

            Organization org = wfOrganizationEso.queryByPK(owner);
            // 创建日志 Dahai Cao at 15:30 on 2018-10-18
            approveForReleaseBlo.createSubmittingApproveLog(wid, "微服务", org.getId(), org.getName(),
                    WebAppService.class.getSimpleName(), status, comment, Long.parseLong(lastupdate), owner, userId,
                    userfullname, ownername);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return 1;
    }

    @RequestMapping(value = "/api25", method = RequestMethod.POST, headers = "Accept=application/json")
    @ResponseBody
    public String modifyWebAppServiceStatus(int status,
                                            String wid,
                                            String lastupdate,
                                            String comment,
                                            String owner,
                                            String userId,
                                            String userfullname,
                                            String ownername) {
        try {
            webAppServiceBlo.modifyStatus(wid, status, Long.parseLong(lastupdate));

            Organization org = wfOrganizationEso.queryByPK(owner);
            // 创建日志 Dahai Cao at 15:30 on 2018-10-18
            approveForReleaseBlo.createApprovingLog(wid, "微服务", org.getId(), org.getName(),
                    WebAppService.class.getSimpleName(), status, comment, Long.parseLong(lastupdate), owner, userId,
                    userfullname, ownername);

            return "{\"status\": \"1\"}";
        } catch (Exception e) {
            return "{\"status\": \"0\"}";
        }
    }

    /**
     * @param oid organization Id
     * @return EmailTemplate[]
     */
    @RequestMapping(value = "/api26", method = RequestMethod.GET, produces = "application/json")
    @ResponseBody
    public EmailTemplate[] getAllEmailTempletesByOwner(String oid) {
        try {
            List<EmailTemplate> templates = emailTemplateBlo.getActiveTemplates(oid);
            return templates.toArray(new EmailTemplate[templates.size()]);
        } catch (Exception e) {
            e.printStackTrace();
            return new EmailTemplate[0];
        }
    }

    /**
     * @param oid organization Id
     * @return SMSTemplate[]
     */
    @RequestMapping(value = "/api27", method = RequestMethod.GET, produces = "application/json")
    @ResponseBody
    public SMSTemplate[] getAllSMSTempletesByOwner(String oid) {
        try {
            List<SMSTemplate> templates = smsTemplateBlo.getActiveTemplates(oid);
            return templates.toArray(new SMSTemplate[templates.size()]);
        } catch (Exception e) {
            e.printStackTrace();
            return new SMSTemplate[0];
        }
    }

    @RequestMapping(value = "/api28", method = RequestMethod.POST, headers = "Accept=application/json")
    @ResponseBody
    public int updateAndroidAppMSPluginStatus(String wid,
                                              int status,
                                              String lastupdate,
                                              String comment,
                                              String owner,
                                              String userId,
                                              String userfullname,
                                              String ownername) {
        try {
            androidAppMsPluginBlo.modifyStatus(wid, status, Long.parseLong(lastupdate));
            Organization org = this.organizationBlo.getOrganizationById(owner);
            // 创建日志 Dahai Cao at 21:17 on 2018-12-12
            approveForReleaseBlo.createSubmittingApproveLog(wid,
                    "手机APP微服务",
                    org.getId(),
                    org.getName(),
                    AndroidAppPlugin.class.getSimpleName(),
                    status,
                    comment,
                    Long.parseLong(lastupdate),
                    owner,
                    userId,
                    userfullname,
                    ownername);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return 1;
    }


    /**
     * @param id android app mircro service plugin ID
     * @return SMSTemplate[]
     */
    @RequestMapping(value = "/api29", method = RequestMethod.GET, produces = "application/json")
    @ResponseBody
    public AndroidAppPlugin getAndroidAppPlugin(String id) {
        try {
            return androidAppMsPluginBlo.getAndroidPlugin(id);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    // 查询所有组织的已经发布的手机APP微服务插件
    @RequestMapping(value = "/api30", method = RequestMethod.GET, produces = "application/json")
    @ResponseBody
    public AndroidAppPluginPage queryAllPublishedAndroidMobileAppMSPlugins(String condition, int pageno,
                                                                           int pagesize, int appState) {
        try {
            return androidAppMsPluginBlo.searchAllPublishedMobilAppMSPlugins(condition, pageno, pagesize, appState);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    @RequestMapping(value = "/api31", method = RequestMethod.POST, headers = "Accept=application/json")
    @ResponseBody
    public int modifyAndroidAppMSPluginStatus(String wid,
                                              int status,
                                              String lastupdate,
                                              String comment,
                                              String owner,
                                              String userId,
                                              String userfullname,
                                              String ownername) {
        try {
            androidAppMsPluginBlo.modifyStatus(wid, status, Long.parseLong(lastupdate));
            Organization org = this.organizationBlo.getOrganizationById(owner);
            // 创建日志 Dahai Cao at 19:57 on 2018-12-13
            approveForReleaseBlo.createApprovingLog(wid,
                    "手机APP微服务",
                    org.getId(),
                    org.getName(),
                    AndroidAppPlugin.class.getSimpleName(),
                    status,
                    comment,
                    Long.parseLong(lastupdate),
                    owner,
                    userId,
                    userfullname,
                    ownername);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return 1;
    }


    @RequestMapping(value = "/api32", method = RequestMethod.POST, headers = "Accept=application/json")
    @ResponseBody
    public int modifyAndroidAppMSPlugin(String plugin) {
        try {
            JSONObject obj = new JSONObject(plugin);
            AndroidAppPlugin p = new AndroidAppPlugin();
            if (!obj.isNull("id"))
                p.setId(obj.getString("id"));
            if (!obj.isNull("name"))
                p.setName(obj.getString("name"));
            if (!obj.isNull("keywords"))
                p.setKeywords(obj.getString("keywords"));
            if (!obj.isNull("status"))
                p.setStatus(obj.getInt("status"));
            if (!obj.isNull("accessType"))
                p.setAccessType(obj.getInt("accessType"));
            if (!obj.isNull("comments"))
                p.setComments(obj.getString("comments"));
            if (!obj.isNull("securityAccessKey"))
                p.setSecurityAccessKey(obj.getString("securityAccessKey"));
            if (!obj.isNull("price"))
                p.setPrice(obj.getDouble("price"));
            if (!obj.isNull("usagePrice"))
                p.setUsagePrice(obj.getDouble("usagePrice"));
            if (!obj.isNull("onlineDateTime"))
                p.setOnlineDateTime(obj.getLong("onlineDateTime"));
            if (!obj.isNull("offlineDateTime"))
                p.setOfflineDateTime(obj.getLong("offlineDateTime"));
            if (!obj.isNull("versionCode"))
                p.setVersionCode(obj.getInt("versionCode"));
            if (!obj.isNull("versionName"))
                p.setVersionName(obj.getString("versionName"));
            if (!obj.isNull("apkFileName"))
                p.setApkFileName(obj.getString("apkFileName"));
            if (!obj.isNull("deveoplerId"))
                p.setDeveoplerId(obj.getString("deveoplerId"));
            if (!obj.isNull("lastupdate"))
                p.setLastupdate(obj.getLong("lastupdate"));
            if (!obj.isNull("lastupdateInfo"))
                p.setLastupdateInfo(obj.getString("lastupdateInfo"));
            if (!obj.isNull("createDateTime"))
                p.setCreateDateTime(obj.getLong("createDateTime"));
            if (!obj.isNull("parent"))
                p.setParent(obj.getString("parent"));
            if (!obj.isNull("currOwner"))
                p.setCurrOwner(obj.getString("currOwner"));
            androidAppMsPluginBlo.modify(p);

        } catch (Exception e) {
            e.printStackTrace();
        }
        return 1;
    }

    //发送反馈邮件
    @RequestMapping(value = "/api33", method = RequestMethod.POST, headers = "Accept=application/json")
    @ResponseBody
    public String sendFeedBackEmail(String nickname, String contactInformation,
                                    String content, String attachments) {
        try {
            String title = "问题反馈;";
            if (StringUtils.isBlank(contactInformation)) {
                title = title + "昵称:" + nickname;
            } else {
                title = title + "昵称:" + nickname + ";联系方式:" + contactInformation;
            }
            if (StringUtils.isNotBlank(attachments)) {
                Object[] objects = JSON.parseArray(attachments).toArray();
                String[] str = new String[objects.length];
                for (int i = 0; i < objects.length; i++) {
                    str[i] = (String) objects[i];
                }
                //有附件
                emailTemplateBlo.sendEmail("", "feedback@xuanqiyun.com", title, content, str);
            } else {
                //没有附件
                emailTemplateBlo.sendEmailNoAnnex("feedback@xuanqiyun.com", title, content);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return "{\"status\": \"0\"}"; // failed
        }
        return "{\"status\": \"1\"}"; // success
    }

}