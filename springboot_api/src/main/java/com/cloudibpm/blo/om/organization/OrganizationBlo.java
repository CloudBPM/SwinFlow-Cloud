/**
 *
 */
package com.cloudibpm.blo.om.organization;

import com.cloudibpm.core.TreeNode;
import com.cloudibpm.core.WorkflowEntity;
import com.cloudibpm.core.code.StatusCode;
import com.cloudibpm.core.folder.FileObject;
import com.cloudibpm.core.organization.*;
import com.cloudibpm.core.repository.BusinessLogicObject;
import com.cloudibpm.core.user.Staff;
import com.cloudibpm.core.user.User;
import com.cloudibpm.core.util.SystemConfig;
import com.cloudibpm.core.util.file.FileUtil;
import com.cloudibpm.eso.om.authorization.AuthorizationEso;
import com.cloudibpm.eso.om.organization.*;
import com.cloudibpm.eso.om.user.WfUserEso;
import org.apache.commons.lang3.StringEscapeUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;
import java.sql.SQLException;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @author CAO Dahai
 * @version 1.0.0
 */

@Service
//@Transactional
public class OrganizationBlo extends BusinessLogicObject {
    private final WfOrganizationEso orgESO;
    private final WfDepartmentEso dprtEso;
    private final WfDivisionEso dvsEso;
    private final WfProjectTeamEso prjEso;
    private final WfPositionEso posEso;
    private final WfProjectRoleEso prjrEso;
    private final AuthorizationEso authEso;
    private final WfUserEso userESO;
    private final DivisionBlo divisionBlo;
    private final DepartmentBlo departmentBlo;
    private final ProjectTeamBlo projectTeamBlo;
    private PositionBlo positionBlo;
    private final OrganizationRelationshipEso organizationRelationshipEso;


    @Autowired
    public OrganizationBlo(WfOrganizationEso orgESO,
                           WfDepartmentEso dprtEso,
                           WfDivisionEso dvsEso,
                           WfProjectTeamEso prjEso,
                           WfPositionEso posEso,
                           WfProjectRoleEso prjrEso,
                           AuthorizationEso authEso,
                           WfUserEso userESO,
                           DivisionBlo divisionBlo,
                           DepartmentBlo departmentBlo,
                           ProjectTeamBlo projectTeamBlo,
                           OrganizationRelationshipEso organizationRelationshipEso,
                           WfUserEso userEso, PositionBlo positionBlo) {
        this.orgESO = orgESO;

        this.dprtEso = dprtEso;
        this.dvsEso = dvsEso;
        this.prjEso = prjEso;
        this.posEso = posEso;
        this.prjrEso = prjrEso;
        this.authEso = authEso;
        this.userESO = userESO;
        this.divisionBlo = divisionBlo;
        this.departmentBlo = departmentBlo;

        this.projectTeamBlo = projectTeamBlo;
        this.organizationRelationshipEso = organizationRelationshipEso;
        this.positionBlo = positionBlo;
    }


    /**
     * Gets all organization objects from repository. These organizations don't
     * contain contact information and all children nodes.
     *
     * @date 2011-11-1 下午09:36:02
     * @return
     * @throws Exception
     */
    public List<Organization> getOrganizations() throws Exception {

        return orgESO.queryAll();
    }

    public List<Organization> getOrganizationsByIds(String[] ids) throws Exception {

        return orgESO.queryByIds(ids);
    }

    public Organization getOrganizationDetailsById(String id) throws Exception {

        return orgESO.queryByPK(id);
    }


    /**
     * This method is used to get an organization list via specified
     * organization ID. The organizations in this list have cooperation
     * relationships which were built in organization manager.
     *
     * @param id,
     *            organization ID.
     * @return Organization[]
     * @throws Exception
     */
    public Organization[] getOrganizationsById(String id) throws Exception {
        List<Organization> list = new ArrayList<Organization>();
        list.add(orgESO.queryNameByPK(id));
        List<OrganizationRelationship> relationships = organizationRelationshipEso.queryAllforSelect(id, 0);
        if (!relationships.isEmpty()) {
            for (int i = 0; i < relationships.size(); i++) {
                if (!relationships.get(i).getOrgAId().equals(id)) {
                    list.add(orgESO.queryNameByPK(relationships.get(i).getOrgAId()));
                } else if (!relationships.get(i).getOrgBId().equals(id)) {
                    list.add(orgESO.queryNameByPK(relationships.get(i).getOrgBId()));
                }
            }
        }
        return list.toArray(new Organization[list.size()]);
    }


    public Organization[] getAllOtherOrganizations(String id) throws Exception {

        List<Organization> list = orgESO.queryOthersByPK(id);
        return list.toArray(new Organization[list.size()]);
    }

    public AbstractOrganization[] getAllDepartmentsById(String organizationId) throws Exception {
        List<AbstractOrganization> departs = new ArrayList<AbstractOrganization>();

        List<Department> list = dprtEso.queryNamesByFk(organizationId);
        if (!list.isEmpty()) {
            for (int i = 0; i < list.size(); i++) {
                AbstractOrganization o = new AbstractOrganization();
                o.setId(list.get(i).getId());
                o.setSerialNumber(list.get(i).getSerialNumber());
                o.setName(list.get(i).getName());
                departs.add(o);
            }
        }

        List<Division> list1 = dvsEso.queryNamesByFk(organizationId);
        if (!list1.isEmpty()) {
            for (int i = 0; i < list1.size(); i++) {
                AbstractOrganization o = new AbstractOrganization();
                o.setId(list1.get(i).getId());
                o.setSerialNumber(list1.get(i).getSerialNumber());
                o.setName(list1.get(i).getName());
                departs.add(o);
            }
        }
        List<ProjectTeam> list2 = prjEso.queryNamesByFk(organizationId);
        if (!list2.isEmpty()) {
            for (int i = 0; i < list2.size(); i++) {
                AbstractOrganization o = new AbstractOrganization();
                o.setId(list2.get(i).getId());
                o.setSerialNumber(list2.get(i).getSerialNumber());
                o.setName(list2.get(i).getName());
                departs.add(o);
            }
        }
        return departs.toArray(new AbstractOrganization[departs.size()]);
    }

    ;

    public AbstractPosition[] getAllPositionsById(String departmentId) throws Exception {
        List<AbstractPosition> postions = new ArrayList<AbstractPosition>();
        List<Position> list = posEso.queryAll(departmentId);
        if (!list.isEmpty()) {
            for (int i = 0; i < list.size(); i++) {
                AbstractPosition o = new AbstractPosition();
                o.setId(list.get(i).getId());
                o.setSerialNumber(list.get(i).getSerialNumber());
                o.setName(list.get(i).getName());
                postions.add(o);
            }
        }

        List<ProjectRole> list1 = prjrEso.queryAll(departmentId);
        if (!list1.isEmpty()) {
            for (int i = 0; i < list1.size(); i++) {
                AbstractPosition o = new AbstractPosition();
                o.setId(list1.get(i).getId());
                o.setSerialNumber(list1.get(i).getSerialNumber());
                o.setName(list1.get(i).getName());
                postions.add(o);
            }
        }
        return postions.toArray(new AbstractPosition[postions.size()]);
    }

    // new
    public Organization getOrganizationById(String id) throws Exception {
        Organization organization = getOrganizationDetailsById(id);
        List<Division> divisions = divisionBlo.getDivisions(organization);
        List<Department> departments = departmentBlo.getDepartments(organization);
        List<ProjectTeam> teams = projectTeamBlo.getProjectTeams(organization);
        Map<String, WorkflowEntity> map = new HashMap<String, WorkflowEntity>();
        // 首先将所有的组织对象都装在一个哈希表中。
        for (Division division : divisions) {
            map.put(division.getId(), division);
        }
        for (Department department : departments) {
            map.put(department.getId(), department);
        }
        for (ProjectTeam team : teams) {
            map.put(team.getId(), team);
        }
        for (Division division : divisions) {
            if (division.getParent() != null) {
                TreeNode parent = (TreeNode) map.get(division.getParent());
                parent.addChild(division);
            } else {
                organization.addChild(division);
            }
        }
        for (Department department : departments) {
            if (department.getParent() != null) {
                TreeNode parent = (TreeNode) map.get(department.getParent());
                parent.addChild(department);
            } else {
                organization.addChild(department);
            }
        }
        for (ProjectTeam team : teams) {
            if (team.getParent() != null) {
                TreeNode parent = (TreeNode) map.get(team.getParent());
                parent.addChild(team);
            } else {
                organization.addChild(team);
            }
        }
        return organization;
    }

    /**
     * Modify organization general information.
     *
     * @author CAO Dahai
     * @date 2008-10-10 下午09:58:43
     * @param org
     * @throws SQLException
     * @throws ParseException
     */
    @Transactional
    public void modifyOrganization(Organization org) throws SQLException, ParseException {

        orgESO.update(org);
    }

    /**
     * Modify organization structure.
     *
     * @author CAO Dahai
     * @param org
     * @throws SQLException
     * @throws ParseException
     */
    @Transactional
    public void modifyOrganizationStructure(Organization org) throws Exception {

        orgESO.update(org);
        // save organization structure;
        departmentBlo.deleteAllDepartments(org.getId());
        divisionBlo.deleteAllDivisions(org.getId());
        projectTeamBlo.deleteAllProjectTeams(org.getId());

        if (org.getChildren().length > 0) {
            org.getChildren()[0].setParent(null);
            saveChildren(org.getChildren());
        }
    }

    private void saveChildren(TreeNode[] nodes) throws Exception {
        if (nodes != null && nodes.length > 0) {
            for (int i = 0; i < nodes.length; i++) {
                TreeNode node = nodes[i];
                if (node instanceof Division) {
                    divisionBlo.saveDivisionNode((Division) node);
                } else if (node instanceof Department) {
                    departmentBlo.saveDepartmentNode((Department) node);
                } else if (node instanceof ProjectTeam) {
                    projectTeamBlo.saveProjectTeamNode((ProjectTeam) node);
                }
                saveChildren(node.getChildren());
            }
        }
    }

    /**
     * 查询序列号或组织名称在资源库之中的唯一性。
     *
     * @author CAO Dahai
     * @date 2008-10-11 下午08:54:24
     * @param sernum
     * @return
     * @throws SQLException
     */
    public boolean serialNumberExisted(String sernum) throws SQLException {

        return orgESO.queryNum(sernum);
    }

    /**
     * 查询序列号或组织名称在资源库之中的唯一性。
     *
     * @author CAO Dahai
     * @date 2008-10-11 下午08:54:24
     * @param orgname
     * @return
     * @throws SQLException
     * @throws SQLException
     */
    public boolean organizationNameExisted(String orgname) throws SQLException {

        return orgESO.queryName(orgname);
    }

    public boolean organizationEmailExisted(String email) {

        return orgESO.queryEmail(email);
    }

    public String getOrganizationByName(String orgName) {

        return orgESO.getOrganizationByName(orgName);

    }

    public boolean organizationCodeExisted(String unescapeJava) {

        return orgESO.queryOrgCode(unescapeJava);
    }


    /**
     * This method is used to search and represent a list of organizations.
     *
     * @author Dahai Cao created at 22:23 on 2018/07/03
     * @param condition
     *            search condition
     * @param pageno
     *            page number
     * @param pagesize
     *            page size
     * @return OrgnizationListPage
     * @throws Exception
     */
    public OrgnizationListPage searchOrganizations(int status, String condition, int pageno, int pagesize) throws Exception {

        OrgnizationListPage page = new OrgnizationListPage(pageno, pagesize);
        int total = orgESO.queryApprovedOrgCounting(status);
        if (total == 0) {
            page.setPageSize(pagesize);
            page.setPageNo(1);
            page.setAllEntitiesCount(0);
            page.setAllPagesCount(0);
            page.setPageIndex(0);
        } else {
            page.setPageSize(pagesize);
            if (condition == null || condition.equals("")) {
                page.setPageNo(pageno);
                page.setAllEntitiesCount(total);
                int n = total / pagesize;
                int m = total % pagesize;
                if (m > 0) {
                    n = n + 1;
                }
                page.setAllPagesCount(n);
                int pageindex = (pageno - 1) * pagesize;
                page.setPageIndex(pageindex);
                List<Organization> orgs = orgESO.queryApprovedOrgs(status, pageindex, pagesize);
                page.setPageEntities(orgs.toArray(new Organization[orgs.size()]));
            } else {
                total = orgESO.queryApprovedOrgCounting(condition);
                page.setAllEntitiesCount(total);
                page.setPageNo(pageno);
                int n = total / pagesize;
                int m = total % pagesize;
                if (m > 0) {
                    n = n + 1;
                }
                page.setAllPagesCount(n);
                int pageindex = (pageno - 1) * pagesize;//需要跳过的数据条数
                List<Organization> orgs = orgESO.queryApprovedOrgs(condition, pageindex, pagesize);
                page.setPageEntities(orgs.toArray(new Organization[orgs.size()]));
            }
        }
        return page;
    }

    public void deleteOrganization(String oid) {
        if (!StringUtils.isEmpty(oid)) {

            orgESO.deleteOrganization(oid);
        }

        String storagetype = SystemConfig.getProp("filestorage.type");
        if (storagetype.trim().equals("win")) {
            String syspath = SystemConfig.getProp("windows.filestorage.lib");
            String path = syspath + "/" + oid;
            FileUtil.delDir(path);
        } else if (storagetype.trim().equals("linux")) {
            String syspath = SystemConfig.getProp("linux.filestorage.lib");
            String path = syspath + "/" + oid;
            FileUtil.delDir(path);
        } else { // other type
        }
    }

    /**
     * Get organization status By <code>orgid</code>
     *
     * @param orgid
     * @return
     */
    public int getOrganizationStatus(String orgid) {

        return orgESO.queryOrgStatus(orgid);
    }

    /**
     * This method is used to check whether a user has authorization to
     *
     * @param userid
     * @param auth
     * @param orgid
     * @return
     * @throws Exception
     */
    public int checkStatus(String userid, String auth, String orgid) throws Exception {
        int result = StatusCode.SUCCESS;// 1: success;
        // check organization status;
        result = getOrganizationStatus(orgid);
        if (result != 1) {
            return result;
        }
        // check user status;
        User usr = userESO.queryByPK(userid);
        if (usr == null) {
            // 0: user does not exist
            return StatusCode.USER_NOT_EXISTS; // user name does't exists
        } else if (usr.getIsBanned() == 1) {
            // -10: user has been banned
            return StatusCode.BANNED;
        }
        // check staff status

        // 0: has not authorization; 1: has authorization;
        result = authEso.queryAuthorities(userid, orgid, auth);
        return result;
    }

    public boolean checkDuplicatedOrganizationName(String orgname) throws Exception {
        return this.organizationNameExisted(StringEscapeUtils.unescapeJava(orgname));
    }

    public boolean checkDuplicatedOrganizationEmail(String email) {
        return this.organizationEmailExisted(StringEscapeUtils.unescapeJava(email));
    }

    public boolean checkDuplicatedOrganizationCode(String escapeJava) {
        return this.organizationCodeExisted(StringEscapeUtils.unescapeJava(escapeJava));
    }

    public void setFileParent1(File file, List<FileObject> children, List<FileObject> parents) {
        for (FileObject parent : parents) {// 拿到父节点
            if (file.getName().equals(parent.getName()) && file.getPath().equals(parent.getPath())) {
                if (file.isDirectory()) {
                    parent.setMimeType("Directory");
                    File[] fs = file.listFiles();// 获取该文件夹下所有子文件夹
                    for (int j = 0; j < fs.length; j++) {
                        File tmp = fs[j];
                        for (int i = 0; i < children.size(); i++) {
                            FileObject child = children.get(i);
                            if (tmp.getName().equals(child.getName()) && tmp.getPath().equals(child.getPath())) {
                                if (parent.getOwner() != null) {
                                    child.setOwner(parent.getOwner());
                                } else {
                                    child.setOwner(parent.getId());
                                }
                                if (parent.seekChild(tmp.getName()) == null) {
                                    parent.addChild(child);// 添加子节点
                                    if (tmp.isDirectory()) {
                                        setFileParent1(tmp, children, parents);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }


    // 为了班级老师能够看到所有的学生的作业/习作/作品，添加此方法
    public Staff[] getSubordinateStaffs(String posid) throws Exception {
        Position p = this.posEso.queryByPK(posid);
        if (p == null) {
            ProjectRole r = this.prjrEso.queryByPK(posid);
            ProjectTeam t = projectTeamBlo.getProjectTeamByID(r.getCurrOwner());
            r = (ProjectRole) t.seekChildByID(p.getId());
            List<TreeNode> list = r.getAllChildren();
            List<Staff> staffs = new ArrayList<>();
            for (TreeNode node : list) {
                staffs.addAll(this.posEso.queryStaffByPositionId(node.getId()));
            }
            return staffs.toArray(new Staff[staffs.size()]);
        } else {
            Department d = departmentBlo.getDepartmentByID(p.getCurrOwner());
            p = (Position) d.seekChildByID(p.getId());
            List<TreeNode> list = p.getAllChildren();
            List<Staff> staffs = new ArrayList<>();
            for (TreeNode node : list) {
                staffs.addAll(this.posEso.queryStaffByPositionId(node.getId()));
            }
            return staffs.toArray(new Staff[staffs.size()]);
        }
    }
}
