/**
 *
 */
package com.cloudibpm.controller;

import com.alibaba.fastjson.JSON;
import com.cloudibpm.blo.buildtime.id.BuildtimeIDGenerator;
import com.cloudibpm.blo.om.job.JobAssignmentBlo;
import com.cloudibpm.blo.om.organization.*;
import com.cloudibpm.blo.om.user.WfUserBlo;
import com.cloudibpm.blo.punch.PunchBlo;
import com.cloudibpm.blo.websocket.WebSocketBlo;
import com.cloudibpm.core.PageObject;
import com.cloudibpm.core.TreeNode;
import com.cloudibpm.core.authorization.AuthorityGroup;
import com.cloudibpm.core.category.Category;
import com.cloudibpm.core.folder.FileObject;
import com.cloudibpm.core.folder.Folder;
import com.cloudibpm.core.folder.FolderType;
import com.cloudibpm.core.folder.JSTreeNode;
import com.cloudibpm.core.job.JobAssignment;
import com.cloudibpm.core.job.JobAssignmentEditList;
import com.cloudibpm.core.officecalendar.Holiday;
import com.cloudibpm.core.officecalendar.OfficeDay;
import com.cloudibpm.core.officecalendar.OfficeHours;
import com.cloudibpm.core.organization.*;
import com.cloudibpm.core.officecalendar.OfficeCalendar;
import com.cloudibpm.core.user.Staff;
import com.cloudibpm.core.user.User;
import com.cloudibpm.core.util.DateUtility;
import com.cloudibpm.core.util.SystemConfig;
import com.cloudibpm.core.util.file.FileUtil;
import com.cloudibpm.core.util.serviceresult.ServiceResult;
import com.model.Contact;
import com.model.Punch;
import org.apache.commons.lang3.StringUtils;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.transaction.Transactional;
import java.io.File;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

/**
 * This service is organization service in cloud BPM system. Unified number of
 * service can simplify service management. It can keep service secure and is
 * hard to recognize what it means.
 *
 * @author Dahai Cao
 * @date 20160317
 */
@RestController
@RequestMapping("/service2")
public class OrganizationController {
    private final OrganizationTreeViewerBlo organizationTreeViewerBlo;
    private final BuildtimeIDGenerator buildtimeIDGenerator;
    private final OrganizationBlo organizationBlo;
    private final DepartmentBlo departmentBlo;
    private final DivisionBlo divisionBlo;
    private final ProjectTeamBlo projectTeamBlo;
    private final JobAssignmentBlo jobAssignmentBlo;
    private final WfUserBlo wfUserBlo;
    private final WebSocketBlo webSocketBlo;
    private final PunchBlo punchBlo;
    private final CalenderBlo calenderBlo;

    @Autowired
    public OrganizationController(OrganizationTreeViewerBlo organizationTreeViewerBlo,
                                  BuildtimeIDGenerator buildtimeIDGenerator,
                                  OrganizationBlo organizationBlo,
                                  DepartmentBlo departmentBlo,
                                  DivisionBlo divisionBlo,
                                  ProjectTeamBlo projectTeamBlo,
                                  JobAssignmentBlo jobAssignmentBlo,
                                  WfUserBlo wfUserBlo,
                                  RegistrateOrganizationBlo registrateOrganizationBlo,
                                  WebSocketBlo webSocketBlo,
                                  PunchBlo punchBlo, CalenderBlo calenderBlo) {
        this.organizationTreeViewerBlo = organizationTreeViewerBlo;
        this.buildtimeIDGenerator = buildtimeIDGenerator;
        this.organizationBlo = organizationBlo;
        this.departmentBlo = departmentBlo;
        this.divisionBlo = divisionBlo;
        this.projectTeamBlo = projectTeamBlo;
        this.jobAssignmentBlo = jobAssignmentBlo;
        this.wfUserBlo = wfUserBlo;
        this.webSocketBlo = webSocketBlo;
        this.punchBlo = punchBlo;
        this.calenderBlo = calenderBlo;
    }

    /**
     * This method is used to get all organizations.
     *
     * @param ids
     * @return JSTreeNode[]
     */
    @RequestMapping(value = "/api0", method = RequestMethod.POST, headers = "Accept=application/json")
    @ResponseBody
    public JSTreeNode[] getOrganizationFolders(String ids) {
        List<Organization> orgs = null;
        try {
            if (ids.equals("00000000000001R")) {
                orgs = organizationTreeViewerBlo.getAllOrganizationList();
            } else {
                String[] strArry = ids.split(";");
                orgs = organizationTreeViewerBlo.getOrganizationListByIds(strArry);
            }
            if (orgs != null) {
                Organization[] orgArry = (Organization[]) orgs.toArray(new Organization[orgs.size()]);
                JSTreeNode[] js = generateJSTreeNodes(orgArry);
                return js;
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
                    jstnode.id = node.getId() + "S";
                    jstnode.icon = "glyphicon glyphicon-home";
                    jstnode.data = "1|null|Organization";
                } else if (node instanceof Folder) {
                    if (((Folder) node).getType() == Folder.STRUCTURE_FOLDER) {
                        jstnode.id = node.getOwner();
                    }
                    if (((Folder) node).getType() == Folder.USER_FOLDER) {
                        jstnode.icon = "fa fa-users";
                    } else if (((Folder) node).getType() == FolderType.CATEGORY_FOLDER) {
                        jstnode.icon = "fa fa-cogs";
                    } else if (((Folder) node).getType() == FolderType.ORG_CATEGORY_FOLDER
                            || ((Folder) node).getType() == FolderType.DEPARTMENT_CATEGORY_FOLDER
                            || ((Folder) node).getType() == FolderType.POSITION_CATEGORY_FOLDER
                            || ((Folder) node).getType() == FolderType.RANK_CATEGORY_FOLDER) {
                        jstnode.icon = "fa fa-cog";
                    } else if (((Folder) node).getType() == FolderType.CALENDAR_FOLDER) {
                        jstnode.icon = "glyphicon glyphicon-calendar";
                    } else if (((Folder) node).getType() == FolderType.HOLIDAY_FOLDER) {
                        jstnode.icon = "glyphicon glyphicon-calendar";
                    } else {
                        jstnode.icon = "glyphicon glyphicon-folder-open";
                    }
                    jstnode.data = "2|" + node.getOwner() + "|" + ((Folder) node).getType();
                } else if (node instanceof OfficeCalendar) {
                    jstnode.icon = "glyphicon glyphicon-calendar";
                    jstnode.data = "3|" + node.getOwner() + "|OfficeCalendar" + "|" + ((OfficeCalendar) node).isDefault();
                } else if (node instanceof Holiday) {
                    jstnode.icon = "glyphicon glyphicon-calendar";
                    jstnode.data = "3|" + node.getOwner() + "|Holiday";
                } else if (node instanceof AuthorityGroup) {
                    jstnode.icon = "glyphicon glyphicon-user";
                    jstnode.data = "3|" + node.getOwner() + "|Group";
                } else if (node instanceof Division) {
                    jstnode.icon = "glyphicon glyphicon-folder-close";
                    jstnode.data = "3|" + node.getOwner() + "|Division";
                } else if (node instanceof Department) {
                    jstnode.icon = "glyphicon glyphicon-folder-close";
                    jstnode.data = "3|" + node.getOwner() + "|Department";
                } else if (node instanceof ProjectTeam) {
                    jstnode.icon = "glyphicon glyphicon-folder-close";
                    jstnode.data = "3|" + node.getOwner() + "|ProjectTeam";
                } else if (node instanceof FileObject && node.getParent() == null) {
                    jstnode.icon = "glyphicon glyphicon-folder-open";
                    jstnode.data = "1|null|FileObject";
                } else if (node instanceof Category) {
                    jstnode.icon = "fa fa-cog";
                    jstnode.data = "3|" + node.getOwner() + "|" + ((Category) node).getCategoryType() + "|"
                            + node.getCurrOwner();
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

    /**
     * Returns a new build time ID and serialNumber for new object.
     *
     * @return String
     */
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

    /**
     * Returns a new build time ID for new object.
     *
     * @return String
     */
    @RequestMapping(value = "/api2", method = RequestMethod.GET, produces = "application/json")
    @ResponseBody
    public String getNewID() {
        try {
            String id = buildtimeIDGenerator.getNewBuildTimeID();
            return id;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "0";
    }

    /**
     * Returns a new build time organization with structure details.
     *
     * @return String
     */
    @RequestMapping(value = "/api3", method = RequestMethod.GET, produces = "application/json")
    @ResponseBody
    public Organization getOrganizationByID(String id) {
        Organization org = null;
        try {
            org = organizationBlo.getOrganizationById(id);
            org.setParent(null);
            org.setOwner(null);
            if (org.hasChildren()) {
                for (int i = 0; i < org.getChildren().length; i++) {
                    removeReference(org.getChildren()[i]);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        System.out.println(JSON.toJSONString(org));
        return org;
    }

    /**
     * Returns a new build time department with structure details.
     *
     * @return String
     */
    @RequestMapping(value = "/api4", method = RequestMethod.GET, produces = "application/json")
    @ResponseBody
    public Department getDepartmentByID(String id) {
        Department org = null;
        try {
            org = departmentBlo.getDepartmentByID(id);
            // org.setOwner(null);
            if (org.hasChildren()) {
                for (int i = 0; i < org.getChildren().length; i++) {
                    removeReference(org.getChildren()[i]);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return org;
    }

    /**
     * Returns a new build time division with structure details.
     *
     * @return String
     */
    @RequestMapping(value = "/api5", method = RequestMethod.GET, produces = "application/json")
    @ResponseBody
    public Division getDivisionByID(String id) {
        Division org = null;
        try {
            org = divisionBlo.getDivisionByID(id);
            // org.setParent(null);
            // org.setOwner(null);
            if (org.hasChildren()) {
                for (int i = 0; i < org.getChildren().length; i++) {
                    removeReference(org.getChildren()[i]);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return org;
    }

    /**
     * Returns a new build time project team with structure details.
     *
     * @return String
     */
    @RequestMapping(value = "/api6", method = RequestMethod.GET, produces = "application/json")
    @ResponseBody
    public ProjectTeam getProjectTeamByID(String id) {
        ProjectTeam org = null;
        try {
            org = projectTeamBlo.getProjectTeamByID(id);
            if (org.hasChildren()) {
                for (int i = 0; i < org.getChildren().length; i++) {
                    removeReference(org.getChildren()[i]);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return org;
    }

    private void removeReference(TreeNode node) {
        if (node instanceof AbstractPosition) {
            ((AbstractPosition) node).setCurrOwner(null);
        }
        node.setParent(null);
        node.setOwner(null);
        if (node.hasChildren()) {
            for (int i = 0; i < node.getChildren().length; i++) {
                removeReference(node.getChildren()[i]);
            }
        }
    }

    @RequestMapping(value = "/api7", method = RequestMethod.POST, headers = "Accept=application/json")
    @ResponseBody
    public String saveOrganization(String org) {
        try {
            JSONObject obj = new JSONObject(org);
            Organization orgs = new Organization();
            orgs.setId(obj.getString("id"));
            if (!obj.isNull("serialNumber")) {
                orgs.setSerialNumber(obj.getString("serialNumber"));
            }
            if (!obj.isNull("name")) {
                orgs.setName(obj.getString("name"));
            }

            if (!obj.isNull("abbrLocal")) {
                orgs.setAbbrLocal(obj.getString("abbrLocal"));
            }
            if (!obj.isNull("nameInternational")) {
                orgs.setNameInternational(obj.getString("nameInternational"));
            }
            if (!obj.isNull("abbrInternational")) {
                orgs.setAbbrInternational(obj.getString("abbrInternational"));
            }
            if (!obj.isNull("businessCategory")) {
                orgs.setBusinessCategory(obj.getString("businessCategory"));
            }
            if (!obj.isNull("registrationCode")) {
                orgs.setRegistrationCode(obj.getString("registrationCode"));
            }
            if (!obj.isNull("registrationDate")) {
                orgs.setRegistrationDate(obj.getLong("registrationDate"));
            }
            if (!obj.isNull("representative")) {
                orgs.setRepresentative(obj.getString("representative"));
            }
            if (!obj.isNull("businessType")) {
                orgs.setBusinessType(obj.getString("businessType"));
            }
            if (!obj.isNull("staffNumber")) {
                orgs.setStaffNumber(obj.getBigInteger("staffNumber").toString());
            }
            if (!obj.isNull("address")) {
                orgs.setAddress(obj.getString("address"));
            }
            if (!obj.isNull("city")) {
                orgs.setCity(obj.getString("city"));
            }
            if (!obj.isNull("province")) {
                orgs.setProvince(obj.getString("province"));
            }
            if (!obj.isNull("postCode")) {
                orgs.setPostCode(obj.getString("postCode"));
            }
            if (!obj.isNull("country")) {
                orgs.setCountry(obj.getString("country"));
            }
            if (!obj.isNull("phoneNumber")) {
                orgs.setPhoneNumber(obj.getString("phoneNumber"));
            }
            if (!obj.isNull("faxNumber")) {
                orgs.setFaxNumber(obj.getString("faxNumber"));
            }
            if (!obj.isNull("website")) {
                orgs.setWebsite(obj.getString("website"));
            }
            if (!obj.isNull("email")) {
                orgs.setEmail(obj.getString("email"));
            }
            if (!obj.isNull("microblog")) {
                orgs.setMicroblog(obj.getString("microblog"));
            }
            if (!obj.isNull("webchat")) {
                orgs.setWebchat(obj.getString("webchat"));
            }
            if (!obj.isNull("customerService")) {
                orgs.setCustomerService(obj.getString("customerService"));
            }
            if (!obj.isNull("businessScope")) {
                orgs.setBusinessScope(obj.getString("businessScope"));
            }
            if (!obj.isNull("introduction")) {
                orgs.setIntroduction(obj.getString("introduction"));
            }
            if (!obj.isNull("isHeadOffice")) {
                orgs.setHeadOffice(obj.getString("isHeadOffice"));
            }
            if (!obj.isNull("status")) {
                orgs.setStatus(obj.getInt("status"));
            }
            orgs.setLastupdate(obj.getLong("lastupdate"));
            if (!obj.isNull("bankAccountNumber")) {
                orgs.setBankAccountNumber(obj.getString("bankAccountNumber"));
            }
            if (!obj.isNull("bankAccountName")) {
                orgs.setBankAccountName(obj.getString("bankAccountName"));
            }
            if (!obj.isNull("setBankAddress")) {
                orgs.setBankAddress(obj.getString("setBankAddress"));
            }
            if (!obj.isNull("bsb")) {
                orgs.setBsb(obj.getString("bsb"));
            }
            if (!obj.isNull("apiAccessKey")) {
                orgs.setApiAccessKey(obj.getString("apiAccessKey"));
            }
            if (!obj.isNull("categoryId")) {
                orgs.setCategoryId(obj.getString("categoryId"));
            }
            JSONArray jsonarr = obj.getJSONArray("children");
            if (jsonarr.length() > 0) {
                for (int i = 0; i < jsonarr.length(); i++) {
                    parseOrganizationStructureTree(jsonarr.getJSONObject(i), orgs, orgs.getId());
                }
            }
            if (orgs.getChildren().length > 0)
                orgs.getChildren()[0].setParent(null);
            organizationBlo.modifyOrganizationStructure(orgs);
        } catch (Exception e) {
            e.printStackTrace();
            return "{\"status\": \"0\"}"; // failed
        }
        return "{\"status\": \"1\"}"; // success
    }

    private void parseOrganizationStructureTree(JSONObject obj, TreeNode parent, String owner)
            throws JSONException, ParseException {
        if (obj.getString("classtypename").equals("Department")) {
            Department depart = new Department();
            depart.setId(obj.getString("id"));
            if (!obj.isNull("serialNumber")) {
                depart.setSerialNumber(obj.getString("serialNumber"));
            }
            depart.setName(obj.getString("name"));
            if (!obj.isNull("abbrName")) {
                depart.setAbbrName(obj.getString("abbrName"));
            }
            if (!obj.isNull("rank")) {
                depart.setRank(obj.getInt("rank"));
            }
            if (!obj.isNull("status")) {
                depart.setStatus(obj.getInt("status"));
            }
            if (!obj.isNull("createDate")) {
                depart.setCreateDate(obj.getLong("createDate"));
            }
            if (!obj.isNull("lastupdate")) {
                depart.setLastupdate(obj.getLong("lastupdate"));
            }
            if (!obj.isNull("categoryId")) {
                depart.setCategoryId(obj.getString("categoryId"));
            }
            depart.setX0(obj.getDouble("x0"));
            depart.setY0(obj.getDouble("y0"));
            depart.setX1(obj.getDouble("x1"));
            depart.setY1(obj.getDouble("y1"));
            depart.setOwner(owner);
            JSONArray jsonarr = obj.getJSONArray("children");
            if (jsonarr.length() > 0) {
                for (int i = 0; i < jsonarr.length(); i++) {
                    parseOrganizationStructureTree(jsonarr.getJSONObject(i), depart, owner);
                }
            }
            parent.addChild(depart);
        } else if (obj.getString("classtypename").equals("Division")) {
            Division depart = new Division();
            depart.setId(obj.getString("id"));
            if (!obj.isNull("serialNumber")) {
                depart.setSerialNumber(obj.getString("serialNumber"));
            }
            depart.setName(obj.getString("name"));
            if (!obj.isNull("abbrName")) {
                depart.setAbbrName(obj.getString("abbrName"));
            }
            if (!obj.isNull("rank")) {
                depart.setRank(obj.getInt("rank"));
            }
            if (!obj.isNull("status")) {
                depart.setStatus(obj.getInt("status"));
            }
            if (!obj.isNull("createDate")) {
                depart.setCreateDate(obj.getLong("createDate"));
            }
            depart.setLastupdate(obj.getLong("lastupdate"));
            if (!obj.isNull("categoryId")) {
                depart.setCategoryId(obj.getString("categoryId"));
            }
            depart.setX0(obj.getDouble("x0"));
            depart.setY0(obj.getDouble("y0"));
            depart.setX1(obj.getDouble("x1"));
            depart.setY1(obj.getDouble("y1"));

            if (!obj.isNull("address")) {
                depart.setAddress(obj.getString("address"));
            }
            if (!obj.isNull("postCode")) {
                depart.setPostCode(obj.getString("postCode"));
            }
            if (!obj.isNull("phoneNumber")) {
                depart.setPhoneNumber(obj.getString("phoneNumber"));
            }
            if (!obj.isNull("faxNumber")) {
                depart.setFaxNumber(obj.getString("faxNumber"));
            }
            if (!obj.isNull("email")) {
                depart.setEmail(obj.getString("email"));
            }

            depart.setOwner(owner);
            JSONArray jsonarr = obj.getJSONArray("children");
            if (jsonarr.length() > 0) {
                for (int i = 0; i < jsonarr.length(); i++) {
                    parseOrganizationStructureTree(jsonarr.getJSONObject(i), depart, owner);
                }
            }
            parent.addChild(depart);
        } else if (obj.getString("classtypename").equals("ProjectTeam")) {
            ProjectTeam depart = new ProjectTeam();
            depart.setId(obj.getString("id"));
            if (!obj.isNull("serialNumber")) {
                depart.setSerialNumber(obj.getString("serialNumber"));
            }
            depart.setName(obj.getString("name"));
            if (!obj.isNull("abbrName")) {
                depart.setAbbrName(obj.getString("abbrName"));
            }
            if (!obj.isNull("rank")) {
                depart.setRank(obj.getInt("rank"));
            }
            if (!obj.isNull("status")) {
                depart.setStatus(obj.getInt("status"));
            }
            if (!obj.isNull("createDate")) {
                depart.setCreateDate(obj.getLong("createDate"));
            }
            // Unparseable date: "2018-08-09T11:48:32.000+0000"
            depart.setLastupdate(obj.getLong("lastupdate"));
            if (!obj.isNull("categoryId")) {
                depart.setCategoryId(obj.getString("categoryId"));
            }
            depart.setX0(obj.getDouble("x0"));
            depart.setY0(obj.getDouble("y0"));
            depart.setX1(obj.getDouble("x1"));
            depart.setY1(obj.getDouble("y1"));
            depart.setOwner(owner);
            JSONArray jsonarr = obj.getJSONArray("children");
            if (jsonarr.length() > 0) {
                for (int i = 0; i < jsonarr.length(); i++) {
                    parseOrganizationStructureTree(jsonarr.getJSONObject(i), depart, owner);
                }
            }
            parent.addChild(depart);
        }
    }

    @RequestMapping(value = "/api8", method = RequestMethod.POST, headers = "Accept=application/json")
    @ResponseBody
    public String saveDepartment(String depart) {
        try {
            JSONObject obj = new JSONObject(depart);
            Department department = new Department();
            department.setId(obj.getString("id"));
            if (!obj.isNull("serialNumber")) {
                department.setSerialNumber(obj.getString("serialNumber"));
            }
            department.setName(obj.getString("name"));
            if (!obj.isNull("abbrName")) {
                department.setAbbrName(obj.getString("abbrName"));
            }
            if (!obj.isNull("rank")) {
                department.setRank(obj.getInt("rank"));
            }
            if (!obj.isNull("status")) {
                department.setStatus(obj.getInt("status"));
            }
            if (!obj.isNull("createDate")) {
                department.setCreateDate(obj.getLong("createDate"));
            }
            department.setLastupdate(obj.getLong("lastupdate"));
            if (!obj.isNull("categoryId")) {
                department.setCategoryId(obj.getString("categoryId"));
            }
            department.setX0(obj.getDouble("x0"));
            department.setY0(obj.getDouble("y0"));
            department.setX1(obj.getDouble("x1"));
            department.setY1(obj.getDouble("y1"));
            String owner = obj.getString("owner");
            department.setOwner(obj.getString("owner"));
            if (!obj.isNull("parent")) {
                department.setParent(obj.getString("parent"));
            }
            JSONArray jsonarr = obj.getJSONArray("children");
            if (jsonarr.length() > 0) {
                for (int i = 0; i < jsonarr.length(); i++) {
                    parsePositionStructureTree(jsonarr.getJSONObject(i), department, department.getId(), owner);
                }
            }
            if (department.getChildren() != null &&
                    department.getChildren().length > 0) {
                department.getChildren()[0].setParent(null);
            }
            departmentBlo.saveDepartmentStructure(department);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "{\"status\": \"1\"}"; // success
    }

    private void parsePositionStructureTree(JSONObject obj, TreeNode parent, String currOwner, String owner)
            throws JSONException, ParseException {
        if (obj.getString("classtypename").equals("Position")) {
            Position position = new Position();
            position.setId(obj.getString("id"));
            if (!obj.isNull("serialNumber")) {
                position.setSerialNumber(obj.getString("serialNumber"));
            }
            position.setName(obj.getString("name"));
            if (!obj.isNull("abbrName")) {
                position.setAbbrName(obj.getString("abbrName"));
            }
            if (!obj.isNull("rank")) {
                position.setRank(obj.getInt("rank"));
            }
            if (!obj.isNull("status")) {
                position.setStatus(obj.getInt("status"));
            }
            if (!obj.isNull("createDate")) {
                position.setCreateDate(obj.getLong("createDate"));
            }
            if (!obj.isNull("categoryId")) {
                position.setCategoryId(obj.getString("categoryId"));
            }
            if (!obj.isNull("calenderId")) {
                position.setOfficeCalendarID(obj.getString("calenderId"));
            }
            position.setLastupdate(obj.getLong("lastupdate"));
            position.setX0(obj.getDouble("x0"));
            position.setY0(obj.getDouble("y0"));
            position.setX1(obj.getDouble("x1"));
            position.setY1(obj.getDouble("y1"));
            position.setCurrOwner(currOwner);
            position.setOwner(owner);
            JSONArray jsonarr = obj.getJSONArray("children");
            if (jsonarr.length() > 0) {
                for (int i = 0; i < jsonarr.length(); i++) {
                    parsePositionStructureTree(jsonarr.getJSONObject(i), position, currOwner, owner);
                }
            }
            parent.addChild(position);
        }
    }

    @RequestMapping(value = "/api9", method = RequestMethod.POST, headers = "Accept=application/json")
    @ResponseBody
    public String saveDivision(String div) {
        try {
            JSONObject obj = new JSONObject(div);
            Division division = new Division();
            division.setId(obj.getString("id"));
            if (!obj.isNull("serialNumber")) {
                division.setSerialNumber(obj.getString("serialNumber"));
            }
            division.setName(obj.getString("name"));
            if (!obj.isNull("abbrName")) {
                division.setAbbrName(obj.getString("abbrName"));
            }
            if (!obj.isNull("rank")) {
                division.setRank(obj.getInt("rank"));
            }
            if (!obj.isNull("status")) {
                division.setStatus(obj.getInt("status"));
            }
            if (!obj.isNull("createDate")) {
                division.setCreateDate(obj.getLong("createDate"));
            }
            division.setLastupdate(obj.getLong("lastupdate"));
            if (!obj.isNull("categoryId")) {
                division.setCategoryId(obj.getString("categoryId"));
            }
            division.setX0(obj.getDouble("x0"));
            division.setY0(obj.getDouble("y0"));
            division.setX1(obj.getDouble("x1"));
            division.setY1(obj.getDouble("y1"));
            String owner = obj.getString("owner");
            division.setOwner(owner);
            if (!obj.isNull("parent")) {
                division.setParent(obj.getString("parent"));
            }

            JSONArray jsonarr = obj.getJSONArray("children");
            if (jsonarr.length() > 0) {
                for (int i = 0; i < jsonarr.length(); i++) {
                    parsePositionStructureTree(jsonarr.getJSONObject(i), division, division.getId(), owner);
                }
            }
            if (division.getChildren() != null &&
                    division.getChildren().length > 0) {
                division.getChildren()[0].setParent(null);
            }

            divisionBlo.saveDivisionStructure(division);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "{\"status\": \"1\"}"; // success
    }

    @RequestMapping(value = "/api10", method = RequestMethod.POST, headers = "Accept=application/json")
    @ResponseBody
    public String saveProjectTeam(String team) {
        try {
            JSONObject obj = new JSONObject(team);
            ProjectTeam projectteam = new ProjectTeam();
            projectteam.setId(obj.getString("id"));
            if (!obj.isNull("serialNumber")) {
                projectteam.setSerialNumber(obj.getString("serialNumber"));
            }
            projectteam.setName(obj.getString("name"));
            if (!obj.isNull("abbrName")) {
                projectteam.setAbbrName(obj.getString("abbrName"));
            }
            if (!obj.isNull("rank")) {
                projectteam.setRank(obj.getInt("rank"));
            }
            if (!obj.isNull("status")) {
                projectteam.setStatus(obj.getInt("status"));
            }
            if (!obj.isNull("createDate")) {
                projectteam.setCreateDate(obj.getLong("createDate"));
            }
            projectteam.setLastupdate(obj.getLong("lastupdate"));
            if (!obj.isNull("categoryId")) {
                projectteam.setCategoryId(obj.getString("categoryId"));
            }
            projectteam.setX0(obj.getDouble("x0"));
            projectteam.setY0(obj.getDouble("y0"));
            projectteam.setX1(obj.getDouble("x1"));
            projectteam.setY1(obj.getDouble("y1"));
            String owner = obj.getString("owner");
            projectteam.setOwner(owner);
            if (!obj.isNull("parent")) {
                projectteam.setParent(obj.getString("parent"));
            }
            JSONArray jsonarr = obj.getJSONArray("children");
            if (jsonarr.length() > 0) {
                for (int i = 0; i < jsonarr.length(); i++) {
                    parseProjectRoleStructureTree(jsonarr.getJSONObject(i), projectteam, projectteam.getId(), owner);
                }
            }
            if (projectteam.getChildren() != null &&
                    projectteam.getChildren().length > 0) {
                projectteam.getChildren()[0].setParent(null);
            }
            projectTeamBlo.saveProjectTeamStructure(projectteam);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "{\"status\": \"1\"}"; // success
    }

    private void parseProjectRoleStructureTree(JSONObject obj, TreeNode parent, String currOwner, String owner)
            throws JSONException, ParseException {
        if (obj.getString("classtypename").equals("ProjectRole")) {
            ProjectRole role = new ProjectRole();
            role.setId(obj.getString("id"));
            if (!obj.isNull("serialNumber")) {
                role.setSerialNumber(obj.getString("serialNumber"));
            }
            role.setName(obj.getString("name"));
            if (!obj.isNull("abbrName")) {
                role.setAbbrName(obj.getString("abbrName"));
            }
            if (!obj.isNull("rank")) {
                role.setRank(obj.getInt("rank"));
            }
            if (!obj.isNull("status")) {
                role.setStatus(obj.getInt("status"));
            }
            if (!obj.isNull("createDate")) {
                role.setCreateDate(obj.getLong("createDate"));
            }
            role.setLastupdate(obj.getLong("lastupdate"));
            if (!obj.isNull("categoryId")) {
                role.setCategoryId(obj.getString("categoryId"));
            }
            if (!obj.isNull("calenderId")) {
                role.setOfficeCalendarID(obj.getString("calenderId"));
            }
            role.setX0(obj.getDouble("x0"));
            role.setY0(obj.getDouble("y0"));
            role.setX1(obj.getDouble("x1"));
            role.setY1(obj.getDouble("y1"));
            role.setCurrOwner(currOwner);
            role.setOwner(owner);
            JSONArray jsonarr = obj.getJSONArray("children");
            if (jsonarr.length() > 0) {
                for (int i = 0; i < jsonarr.length(); i++) {
                    parseProjectRoleStructureTree(jsonarr.getJSONObject(i), role, currOwner, owner);
                }
            }
            parent.addChild(role);
        }
    }

    /**
     * Returns an assignment list for the specified position id.
     *
     * @return String
     */
    @RequestMapping(value = "/api11", method = RequestMethod.GET, produces = "application/json")
    @ResponseBody
    public JobAssignment[] getJobAssignments(String positionid, String owner) {
        try {
            return jobAssignmentBlo.getAssignments(positionid, owner);
        } catch (Exception e) {
            e.printStackTrace();
            return null; // failed
        }
    }

    /**
     * Returns a job assignment edit list for the specified position id.
     *
     * @return String
     */
    @RequestMapping(value = "/api12", method = RequestMethod.GET, produces = "application/json")
    @ResponseBody
    public JobAssignmentEditList getJobAssignmentEditList(String positionid, String owner) {
        try {
            return jobAssignmentBlo.getAssignmentEditList(positionid, owner);
        } catch (Exception e) {
            e.printStackTrace();
            return null; // failed
        }
    }

    @RequestMapping(value = "/api13", method = RequestMethod.POST, headers = "Accept=application/json")
    @ResponseBody
    @Transactional
    public String updateJobAssignmentEditList(String editlist) {
        try {
            JobAssignmentEditList gmeditlist = new JobAssignmentEditList();
            JSONObject obj = new JSONObject(editlist);
            gmeditlist.setPositionId(obj.getString("positionId"));
            gmeditlist.setOwnerId(obj.getString("ownerId"));
            gmeditlist.setSource(obj.getInt("source"));
            if (!obj.isNull("description")) {
                String desc = obj.getString("description");
                if (!desc.trim().equals("")) {
                    gmeditlist.setDescription(obj.getString("description"));
                }
            }
            JSONArray addedStaffIds = obj.getJSONArray("addedStaffIds");
            if (addedStaffIds.length() > 0) {
                List<String> l = new ArrayList<String>();
                for (int i = 0; i < addedStaffIds.length(); i++) {
                    l.add((String) addedStaffIds.get(i));
                }
                gmeditlist.setAddedStaffIds(l.toArray(new String[l.size()]));
            }
            JSONArray removedStaffIds = obj.getJSONArray("removedStaffIds");
            if (removedStaffIds.length() > 0) {
                List<String> l = new ArrayList<String>();
                for (int i = 0; i < removedStaffIds.length(); i++) {
                    l.add((String) removedStaffIds.get(i));
                }
                gmeditlist.setRemovedStaffIds(l.toArray(new String[l.size()]));
            }
            jobAssignmentBlo.updateJobAssignmentEditList(gmeditlist);
            return "{\"status\": \"1\"}"; // success
        } catch (Exception e) {
            e.printStackTrace();
            return "{\"status\": \"0\"}"; // success
        }
    }

    /**
     * Returns an organization list without structure details. This method is
     * used to set participants for manual tasks in process manager
     *
     * @param id,
     *            organization ID
     * @return String
     */
    @RequestMapping(value = "/api14", method = RequestMethod.GET, produces = "application/json")
    @ResponseBody
    public Organization[] getOrganizationsByID(String id) {
        try {
            return organizationBlo.getOrganizationsById(id);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * Returns a departs list without structure details. This method is used to
     * set participants for manual tasks in process manager
     *
     * @param id,
     *            organization ID
     * @return String
     */
    @RequestMapping(value = "/api15", method = RequestMethod.GET, produces = "application/json")
    @ResponseBody
    public AbstractOrganization[] getDepartmentsByID(String id) {
        try {
            return organizationBlo.getAllDepartmentsById(id);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    @RequestMapping(value = "/api16", method = RequestMethod.GET, produces = "application/json")
    @ResponseBody
    public AbstractPosition[] getAllPositionsById(String id) {
        try {
            return organizationBlo.getAllPositionsById(id);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    @RequestMapping(value = "/api17", method = RequestMethod.POST, produces = "application/json")
    @ResponseBody
    public String createNewUser(String userinfo) {
        JSONObject obj = new JSONObject(userinfo);
        User user = new User();
        try {
            user.setId(buildtimeIDGenerator.getNewBuildTimeID());
        } catch (Exception e1) {
            e1.printStackTrace();
        }
        user.setName(obj.getString("name"));
        user.setGivenname(obj.getString("givenname"));
        user.setSurname(obj.getString("surname"));
        user.setEmail(obj.getString("email"));
        user.setPasswd(obj.getString("password"));
        user.setMobile(obj.getString("mobile"));
        user.setRegistrationDate(new Date());
        user.setLastupdate(new Date());
        try {
            if (wfUserBlo.createNewUser(user) == 1) {
                return "{\"status\": \"1\"}";
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "{\"status\": \"0\"}";
    }

//    @RequestMapping(value = "/api18", method = RequestMethod.GET, produces = "application/json")
//    @ResponseBody
//    public HomePage getHomePage(String orgId) {
//
//        try {
//            HomePage page = homePageBlo.getHomePage(orgId);
//            if (null != page) {
//                return page;
//            }
//        } catch (Exception e) {
//            e.printStackTrace();
//        }
//
//        return new HomePage();
//    }

//    @RequestMapping(value = "/api19", method = RequestMethod.POST, produces = "application/json")
//    @ResponseBody
//    public String saveOrUpdateHomePage(String str) throws JSONException, ParseException {
//        HomePage page = new HomePage();
//        JSONObject obj = new JSONObject(str);
//
//        page.setImgURL(obj.getString("imgURL"));
//        page.setOrgTitle(obj.getString("orgTitle"));
//        page.setSkin(obj.getString("skin"));
//        page.setLastupdate(DateUtility.parseDate(obj.getString("lastupdate")));
//        page.setParent(obj.getString("parent"));
//        page.setOwner(obj.getString("owner"));
//        page.setId(obj.getString("id"));
//
//        try {
//            if (homePageBlo.saveOrUpdateHomePage(page) == 1) {
//                return "{\"status\": \"1\"}";
//            }
//        } catch (Exception e) {
//            e.printStackTrace();
//        }
//
//        return "{\"status\": \"0\"}";
//    }

//    @RequestMapping(value = "/api20", method = RequestMethod.GET, produces = "application/json")
//    @ResponseBody
//    public HomePage getHomePageByOrgName(String orgName) {
//
//        String orgId = organizationBlo.getOrganizationByName(orgName);
//        return homePageBlo.getHomePage(orgId);
//    }

    @RequestMapping(value = "/api21", method = RequestMethod.POST, produces = "application/json")
    @ResponseBody
    public String updateUser(String userinfo) {
        try {
            JSONObject obj = new JSONObject(userinfo);
            User user = new User();
            user.setId(obj.getString("id"));
            user.setGivenname(obj.getString("givenname"));
            user.setSurname(obj.getString("surname"));
            user.setEmail(obj.getString("email"));
            user.setMobile(obj.getString("mobile"));
            if (obj.get("idType") != null) {
                user.setIdType(obj.getString("idType"));
            }
            user.setIdNumber(obj.getString("idNumber"));
            user.setGender(obj.getString("gender"));
            user.setCountry("中国");
            user.setProvince(obj.getString("province"));
            user.setCity(obj.getString("city"));
            user.setCounty(obj.getString("county"));
            user.setPostcode(obj.getString("postcode"));
            user.setBirthday(DateUtility.parseDate(obj.getString("birthday")));
            user.setLastupdate(new Date());
            if (wfUserBlo.updateUser(user) == 1) {
                return "{\"status\": \"1\"}";
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "{\"status\": \"0\"}";
    }

    private static final String storagetype = SystemConfig.getProp("filestorage.type");

    @RequestMapping(value = "/api22", method = RequestMethod.POST, headers = "Accept=application/json")
    @ResponseBody
    public JSTreeNode[] getOrganizationFiles(String oid) {
        String destination = null;
        if (storagetype.trim().equals("win")) {
            String syspath = SystemConfig.getProp("windows.filestorage.lib");
            destination = syspath + "/" + oid;
        } else if (storagetype.trim().equals("linux")) {
            String syspath = SystemConfig.getProp("linux.filestorage.lib");
            destination = syspath + "/" + oid;
        }
        List<File> files = FileUtil.getFileList(destination);
        List<FileObject> fileNodes = new ArrayList<>();// 存放所有节点
        getChildFile(files, fileNodes);

        JSTreeNode[] js = generateJSTreeNodes1(fileNodes.toArray(new FileObject[fileNodes.size()]));
        List<JSTreeNode> js2 = new ArrayList<>();
        for (int i = 0; i < js.length; i++) {
            if (StringUtils.isEmpty(fileNodes.get(i).getParent())) {
                js2.add(js[i]);
            }
        }
        JSTreeNode[] js3 = js2.toArray(new JSTreeNode[js2.size()]);
        return js3;

    }

    /**
     * 获取联系人列表
     *
     * @param orgId 组织ID(不能为空)
     * @param userId 用户ID(不能为空)
     * @return
     * ServiceResult
     *      success  (code = 1, message = success, T(data) = List<Map<String, String>> )
     *      error (code = 1001, message = "组织ID不能为空")
     *            (code = 1002, message = "联系人列表为空")
     *      exception(code = -1,message = "服务异常")
     */
    @RequestMapping(value = "/api23", method = RequestMethod.POST, headers = "Accept=application/json")
    @ResponseBody
    public ServiceResult getAllUserByOrgId(String orgId, String userId) {
        if (StringUtils.isBlank(userId)) {
            return ServiceResult.error(1001, "用户ID不能为空");
        }
        try {
            if (StringUtils.isNotBlank(orgId)) {
                List<Contact> mapList = wfUserBlo.getAllUserByOrgId(orgId, userId);
                if (mapList == null || mapList.isEmpty()) {
                    return ServiceResult.error(1002, "联系人列表为空");
                }
                return ServiceResult.success(mapList);
            } else {
                List<Contact> contacts = wfUserBlo.getUsersWithoutOwner(userId);
                if (contacts == null || contacts.isEmpty()) {
                    return ServiceResult.error(1002, "联系人列表为空");
                }
                return ServiceResult.success(contacts);
            }

        } catch (Exception e) {
            e.printStackTrace();
            return ServiceResult.exception();
        }
    }

    /**
     * 查询两人 消息记录
     * @param senderId  发送人ID
     * @param receiverId   接收人ID
     * @param lastTime    时间
     * @return
     * ServiceResult
     *      success  (code = 1, message = success, T(data) = List<MessageFormat> )
     *      error   (code = 1001, message = "发送人或接收人ID为空")
     *              (code = 1002, message = "聊天记录为空")
     *      exception(code = -1,message = "服务异常")
     */
    @RequestMapping(value = "/api24", method = RequestMethod.POST, headers = "Accept=application/json")
    @ResponseBody
    public ServiceResult queryTwoMessage(String senderId, String receiverId, long lastTime) {
        try {
            return webSocketBlo.queryTwoMessage(senderId, receiverId, lastTime);
        } catch (Exception e) {
            e.printStackTrace();
            return ServiceResult.exception();
        }
    }

    /**
     * 查询会话列表
     * 查询未读消息
     *
     * @param userId
     * @return
     */
    @RequestMapping(value = "/api25", method = RequestMethod.POST, headers = "Accept=application/json")
    @ResponseBody
    public ServiceResult queryConversationList(String userId) {
        try {
            List<PageObject> list = webSocketBlo.queryConversationList(userId);
            if (list != null && list.size() > 0) {
                return ServiceResult.success(list);
            } else {
                return ServiceResult.error(1004, "会话列表为空");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ServiceResult.exception();
        }
    }


    /**
     * 设置我和他之间的消息状态为已读  (我发出的消息是对方的未读消息数,只设置对方发给我的消息状态)
     *
     * @param userId
     * @param receiverId
     * @return
     */
    @RequestMapping(value = "/api26", method = RequestMethod.POST, headers = "Accept=application/json")
    @ResponseBody
    public void updateAllMessageStatus(String userId, String receiverId) {
        webSocketBlo.updateAllMessageStatus(userId, receiverId);
    }

    @PostMapping("/api27")
    public ServiceResult findAllOrg() throws Exception {
        List<Organization> organizations = organizationBlo.getOrganizations();
        if (organizations != null && organizations.size() > 0) {
            return ServiceResult.success(organizations);
        } else {
            return ServiceResult.error(1001, "组织列表为空");
        }
    }

    /**
     * 保存用户信息
     * sj
     * @param userId
     * @param receiverId
     */
    @RequestMapping(value = "/api28", method = RequestMethod.POST, headers = "Accept=application/json")
    @ResponseBody
    public void saveInformation(String info) {
        Punch punch = JSON.parseObject(info, Punch.class);
        try {
            punchBlo.savePunchInfo(punch);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * 创建一个日历
     *
     * @param ownerId 组织ID
     * @param parent  父ID (folder,该日历在那个folder下 )
     * @param name   日历名
     */
    @RequestMapping(value = "/api29", method = RequestMethod.POST, headers = "Accept=application/json")
    @ResponseBody
    public void addOfficeCalender(String calender) throws Exception {
        OfficeCalendar officeCalendar = JSON.parseObject(calender, OfficeCalendar.class);
        officeCalendar.setId(buildtimeIDGenerator.getNewBuildTimeID());
        calenderBlo.addCalender(officeCalendar);
        //默认添加 7天工作日, 1-5为工作日,6-7为休息日
        for (int i = 1; i < 8; i++) {
            OfficeDay officeDay = new OfficeDay();
            officeDay.setId(buildtimeIDGenerator.getNewBuildTimeID());
            officeDay.setWeekkDay(i);
            if (i >= 6) {
                officeDay.setIsWorkDay(0);
            } else {
                officeDay.setIsWorkDay(1);
            }
            officeDay.setParent(officeCalendar.getId());
            officeDay.setOwner(officeCalendar.getOwner());
            calenderBlo.setYIsWorkDay(officeDay);
        }
    }

    /**
     * 设置某一天是否是工作日
     *
     * @param ownerId 组织ID
     */
    @RequestMapping(value = "/api30", method = RequestMethod.POST, headers = "Accept=application/json")
    @ResponseBody
    public void setYIsWorkDay(String officeDay) {
        OfficeDay office = JSON.parseObject(officeDay, OfficeDay.class);
        if (office != null) {
            calenderBlo.setYIsWorkDay(office);
        }
    }

    /**
     * 设置周几对应的工作时间段  8:00-12:00
     * @param formTime  开始时间
     * @param toTime    结束时间
     * @param parentId  父id
     * @param oid
     * @return
     */
    @RequestMapping(value = "/api31", method = RequestMethod.POST, headers = "Accept=application/json")
    @ResponseBody
    public String setYPeriod(String formTime, String toTime, String parentId, String oid) throws Exception {
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("HH:mm");
        Date beginTime = simpleDateFormat.parse(formTime);
        Date endTime = simpleDateFormat.parse(toTime);
        if (beginTime.after(endTime)) {
            return "{\"status\":\"0\"}";  //结束时间小于开始时间
        }
        OfficeHours officeHours = new OfficeHours();
        officeHours.setId(buildtimeIDGenerator.getNewBuildTimeID());
        officeHours.setFromTime(formTime);
        officeHours.setToTime(toTime);
        officeHours.setParent(parentId);
        officeHours.setOwner(oid);
        int i = calenderBlo.setYPeriod(officeHours);
        if (i == 1) {
            return "{\"status\":\"1\"}"; //添加成功
        }
        return "{\"status\":\"2\"}"; //添加失败
    }

    /**
     * 设置某一天是否是假期
     * @param htime 日期
     * @param oid
     * @return
     */
    @RequestMapping(value = "/api32", method = RequestMethod.POST, headers = "Accept=application/json")
    @ResponseBody
    public String setIsHoliday(String htime, String oid) throws Exception {
        if (StringUtils.isNotBlank(htime) && StringUtils.isNotBlank(oid)) {
            SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd");
            Holiday holiday = new Holiday();
            holiday.setHoliday(simpleDateFormat.parse(htime));
            holiday.setId(buildtimeIDGenerator.getNewBuildTimeID());
            holiday.setParent(oid);
            holiday.setOwner(oid);
            int n = calenderBlo.setIsHoliday(holiday);
            if (n == 0) {
                return "{\"status\":\"0\"}"; // 添加失败
            } else {
                return "{\"status\":\"1\"}"; //添加成功
            }
        } else {
            return "{\"status\":\"2\"}";  //数据为空
        }
    }

    /**
     * 查看某一天是否是假期
     * @param date
     * @param parentId
     * @param ownerId
     * @return
     */
    @RequestMapping(value = "/api33", method = RequestMethod.POST, headers = "Accept=application/json")
    @ResponseBody
    public Boolean isHoliday(Long date, String parentId, String ownerId) throws Exception {
        Date dt = new Date(date);
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd");
        String format = simpleDateFormat.format(dt);
        dt = simpleDateFormat.parse(format);
        //判断今天是周几
        int weekDay = 0;
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(dt);
        if (calendar.get(Calendar.DAY_OF_WEEK) == 1) {
            weekDay = 7;
        } else {
            weekDay = calendar.get(Calendar.DAY_OF_WEEK) - 1;
        }
        //查看某一天是否是假期
        return calenderBlo.isHoliday(dt, weekDay, parentId, ownerId);
    }

    /**
     * 列出某个日历下星期列表
     * @param calenderId  日历ID
     * @param ownerId     组织ID
     * @return
     */
    @RequestMapping(value = "/api34", method = RequestMethod.POST, headers = "Accept=application/json")
    @ResponseBody
    public List<OfficeDay> getWeekList(String calenderId, String ownerId) {
        return calenderBlo.getWeekList(calenderId, ownerId);
    }

    /**
     * 列出某个公司下假期表数据
     * @param ownerId  组织ID
     * @return
     */
    @RequestMapping(value = "/api35", method = RequestMethod.POST, headers = "Accept=application/json")
    @ResponseBody
    public List<Holiday> getHolidayList(String ownerId) {
        List<Holiday> holidayList = calenderBlo.getHolidayList(ownerId);
        return holidayList;
    }

    /**
     * 删除某公司假期表下的某个数据
     * @param ownerId  组织ID
     * @param holidayId
     * @return
     */
    @RequestMapping(value = "/api36", method = RequestMethod.POST, headers = "Accept=application/json")
    @ResponseBody
    public String delHoliday(String ownerId, String holidayId) {
        try {
            calenderBlo.delHoliday(ownerId, holidayId);
        } catch (Exception e) {
            e.printStackTrace();
            return "{\"status\":\"0\"}";
        }
        return "{\"status\":\"1\"}";
    }

    /**
     * 条件搜索假期表数据
     * @param startTime  起始时间
     * @param toTime     结束时间
     * @param oid
     * @return
     */
    @RequestMapping(value = "/api37", method = RequestMethod.POST, headers = "Accept=application/json")
    @ResponseBody
    public List<Holiday> searchHoliday(String startTime, String toTime, String oid) throws ParseException {
        //条件不为空
        if (StringUtils.isBlank(oid)) {
            return null;
        }
        if (StringUtils.isBlank(startTime) && StringUtils.isBlank(toTime)) {
            return calenderBlo.getHolidayList(oid);
        } else {
            return calenderBlo.searchHoliday(startTime, toTime, oid);
        }
    }

    /**
     * 查询日历对应的周期
     * @param cid  日历id
     * @param oid
     * @return
     */
    @RequestMapping(value = "/api38", method = RequestMethod.POST, headers = "Accept=application/json")
    @ResponseBody
    public List<OfficeDay> getCalenderOfficeDay(String cid, String oid) {
        return calenderBlo.getCalenderOfficeDay(cid, oid);
    }

    /**
     * 根据日历周期id  周一id 查询周一对应时间段
     * @param officeDayId  周几id
     * @param oid
     * @return
     */
    @RequestMapping(value = "/api39", method = RequestMethod.POST, headers = "Accept=application/json")
    @ResponseBody
    public List<OfficeHours> getCalenderOfficeDayHours(String officeDayId, String oid) {
        return calenderBlo.getCalenderOfficeDayHours(officeDayId, oid);
    }

    /**
     * 查询日历下周一对应的时间段
     * @param cid  日历id
     * @param oid
     * @return
     */
    @RequestMapping(value = "/api40", method = RequestMethod.POST, headers = "Accept=application/json")
    @ResponseBody
    public List<OfficeHours> getOnMondayTime(String cid, String oid) {
        return calenderBlo.getOnMondayTime(cid, oid);
    }

    /**
     * 根据时间段id删除对应时间段
     * @param pid  日时间段id
     */
    @RequestMapping(value = "/api41", method = RequestMethod.POST, headers = "Accept=application/json")
    @ResponseBody
    public void delPeriod(String pid) {
        calenderBlo.delPeriod(pid);
    }

    /**
     * 重命名日历 根据日历id
     * @param cid  日历id
     * @param cname  日历名字
     * @param oid
     */
    @RequestMapping(value = "/api42", method = RequestMethod.POST, headers = "Accept=application/json")
    @ResponseBody
    public void renameCalender(String cid, String cname, String oid) {
        calenderBlo.renameCalender(cid, cname, oid);
    }

    /**
     * 根据日历id 删除日历 并删除对应周期和时间
     * @param cid  日历id
     * @param oid
     */
    @RequestMapping(value = "/api43", method = RequestMethod.POST, headers = "Accept=application/json")
    @ResponseBody
    public void delCalender(String cid, String oid) {
        calenderBlo.delCalender(cid, oid);
    }

    /**
     * 查询公司下所有日历
     * @param oid   组织id
     */
    @RequestMapping(value = "/api44", method = RequestMethod.POST, headers = "Accept=application/json")
    @ResponseBody
    public List<OfficeCalendar> getAllCalender(String oid) {
        return calenderBlo.getAllCalender(oid);
    }

    private JSTreeNode[] generateJSTreeNodes1(TreeNode[] roots) {
        if (roots.length > 0) {
            JSTreeNode[] jstnodes = new JSTreeNode[roots.length];
            for (int i = 0; i < roots.length; i++) {
                TreeNode node = roots[i];
                JSTreeNode jstnode = new JSTreeNode();
                FileObject file = (FileObject) node;
                if (StringUtils.isEmpty(file.getParent())) {
                    file.setOperatation(0);
                } else if (file.getName().equals("emltp") || file.getName().equals("idcard")
                        || file.getName().equals("licence")) {
                    file.setOperatation(0);
                } else {
                    file.setOperatation(1);
                }
                jstnode.id = node.getId();
                jstnode.text = node.getName();
                jstnode.data = file.getMimeType() + "|" + file.fetchFileSize() + "|" + file.getLastUpdate() + "|"
                        + file.getPath() + "|" + file.getSufix() + "|" + file.getOperatation();
                jstnode.icon = "";
                // 1: Tree root; 2: Folder (Subtree); 3: Leaf nodes
                if (node instanceof FileObject) {
                    jstnode.icon = "glyphicon glyphicon-folder-open";
                }

                if (file.getMimeType().equals("File")) {
                    jstnode.icon = "glyphicon glyphicon-file";
                }

                if (node.getParent() != null) {
                    jstnode.parentId = node.getParent();
                }

                if (node.hasChildren()) {
                    jstnode.children = generateJSTreeNodes1(node.getChildren());
                }
                jstnodes[i] = jstnode;

            }
            return jstnodes;
        }
        return null;
    }

    private void getChildFile(List<File> files, List<FileObject> fileNodes) {
        List<FileObject> children = new ArrayList<>();// 存放子节点
        for (File file : files) { // 遍历文件 给所有节点赋值
            FileObject fileObject = new FileObject();
            fileObject.setName(file.getName());
            fileObject.setPath(file.getPath());
            fileObject.setSize(file.length());
            fileObject.setLastUpdate(new Date(file.lastModified()));
            fileObject.setSufix(file.isFile()
                    ? file.getName().substring(file.getName().lastIndexOf("."), file.getName().length()) : "");
            fileObject.setId(getNewIDandSerialNumber());
            fileObject.setMimeType("File");
            fileNodes.add(fileObject);
            children.add(fileObject);
        }
        for (File file : files) {// 给节点建立父子关系
            organizationBlo.setFileParent1(file, children, fileNodes);
        }
    }


    @RequestMapping(value = "/api45", method = RequestMethod.GET, produces = "application/json")
    @ResponseBody
    public Staff[] getSubordinateStaffs(String posid) throws Exception {
        return organizationBlo.getSubordinateStaffs(posid);

    }

}
