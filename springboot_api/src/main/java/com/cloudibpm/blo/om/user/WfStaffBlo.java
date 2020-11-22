/**
 *
 */
package com.cloudibpm.blo.om.user;

import com.cloudibpm.blo.buildtime.id.BuildtimeIDGenerator;
import com.cloudibpm.blo.om.authorization.WfAuthorityGroupBlo;
import com.cloudibpm.blo.om.category.CategoryBlo;
import com.cloudibpm.blo.om.organization.OrganizationBlo;
import com.cloudibpm.core.WorkflowEntity;
import com.cloudibpm.core.category.Category;
import com.cloudibpm.core.organization.AbstractPosition;
import com.cloudibpm.core.organization.Organization;
import com.cloudibpm.core.organization.Position;
import com.cloudibpm.core.organization.ProjectRole;
import com.cloudibpm.core.repository.BusinessLogicObject;
import com.cloudibpm.core.user.Login;
import com.cloudibpm.core.user.Staff;
import com.cloudibpm.core.user.StaffListPage;
import com.cloudibpm.core.user.User;
import com.cloudibpm.eso.om.organization.WfPositionEso;
import com.cloudibpm.eso.om.organization.WfProjectRoleEso;
import com.cloudibpm.eso.om.user.WfStaffEso;
import com.cloudibpm.eso.om.user.WfUserEso;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.system.SystemProperties;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.Iterator;
import java.util.List;

/**
 * @author Caodahai
 *
 */
@Service
//@Transactional
public class WfStaffBlo extends BusinessLogicObject {
    private final WfStaffEso wfStaffEso;
    private final WfUserEso wfUserEso;
    private final BuildtimeIDGenerator buildtimeIDGenerator;
    private final WfAuthorityGroupBlo wfAuthorityGroupBlo;
    private final OrganizationBlo organizationBlo;
    private final WfPositionEso wfPositionEso;
    private final WfProjectRoleEso wfProjectRoleEso;
    private final CategoryBlo categoryBlo;


    @Autowired
    public WfStaffBlo(WfStaffEso wfStaffEso,
                      WfUserEso wfUserEso,
                      WfPositionEso wfPositionEso,
                      WfProjectRoleEso wfProjectRoleEso,
                      BuildtimeIDGenerator buildtimeIDGenerator,
                      WfAuthorityGroupBlo wfAuthorityGroupBlo,
                      OrganizationBlo organizationBlo, CategoryBlo categoryBlo) {
        this.wfStaffEso = wfStaffEso;
        this.wfUserEso = wfUserEso;
        this.wfPositionEso = wfPositionEso;
        this.wfProjectRoleEso = wfProjectRoleEso;
        this.buildtimeIDGenerator = buildtimeIDGenerator;

        this.wfAuthorityGroupBlo = wfAuthorityGroupBlo;
        this.organizationBlo = organizationBlo;
        this.categoryBlo = categoryBlo;
    }

    /**
     * 通过组织ID 查看所属的用户ID
     * @param orgId
     * @return
     * @throws Exception
     */
    public List<Staff> getAllStaffByOrgId(String orgId) throws Exception {

        return wfStaffEso.queryAllStaffByOrgId(orgId);
    }

    public void updateStaffs(List<Staff> list) throws Exception {
        for (Staff staff : list) {
            wfStaffEso.update(staff);
            wfUserEso.update(staff.getUser());
        }
    }


    public Staff createStaff(User user, WorkflowEntity org, boolean isHidden) throws Exception {
        Staff staff = new Staff();
        staff.setId(buildtimeIDGenerator.getNewBuildTimeID());
        staff.setUser(user);
        staff.setOnBoardingDate(new Date());
        staff.setLastupdate(new Date());
        staff.setOwner(org.getId());
        staff.setHidden(isHidden);
        wfStaffEso.insert(staff);
        return staff;
    }


    public Staff createStaff(User user, WorkflowEntity org) throws Exception {
        Staff staff = new Staff();
        staff.setId(buildtimeIDGenerator.getNewBuildTimeID());
        staff.setUser(user);
        staff.setOnBoardingDate(new Date());
        staff.setLastupdate(new Date());
        staff.setOwner(org.getId());
        staff.setHidden(false);

        wfStaffEso.insert(staff);
        return staff;
    }


    public void createStaff(Staff staff) throws Exception {

        wfStaffEso.insert(staff);
    }


    public void modifyStaff(Staff staff) throws Exception {

        wfStaffEso.update(staff);
    }

    //根据用户ID查询职位ID
    public Staff getUserByUserId(String userid, String orgid) throws Exception {

        return wfStaffEso.queryByUserId(userid, orgid);
    }

    // This is a sample program for use in future. We will remove all record
    // objects.
    public Login getStaffShips(Login login) throws Exception {
        List<AbstractPosition> allPosition = new ArrayList<>();
        List<Staff> staffList = wfStaffEso.queryByUserName(login.getUser().getName());
        boolean isAdminStaff = false;
        if (staffList.size() > 0) {
            // getting all authorizations for every staff ship.
            for (Iterator<Staff> iter = staffList.iterator(); iter.hasNext(); ) {
                Staff staff = iter.next();
                String orgName = organizationBlo.getOrganizationDetailsById(staff.getOwner()).getName();
                staff.setOrganizationName(orgName);
                List<Position> positions = wfPositionEso.queryPositionByStaffId(staff.getId());
                for (Position position : positions) {
                    if (position != null) {
                        if (position.getCategoryId() != null) {
                            Category cate = this.categoryBlo.getCategory(position.getCategoryId());
                            if (cate != null)  {
                                position.setCategory(cate.getName());
                            }
                        }
                        allPosition.add(position);
                    }
                }
                List<ProjectRole> roles = wfProjectRoleEso.queryPositionByStaffId(staff.getId());
                for (ProjectRole role : roles) {
                    if (role != null) {
                        allPosition.add(role);
                    }
                }
                if (staff.getOwner().equals(SystemProperties.get("admin.corp.id"))) {
                    isAdminStaff = true;
                    break;
                }
            }
        }
        if (isAdminStaff) {
            // if you are admin staff, you will see all corps info in your
            // authorization
            //staffList = staffEso.queryAdminStaffByUserName(login.getUser().getName());
            String[] authorizations = null;
            User user = null;
            for (Iterator<Staff> iter = staffList.iterator(); iter.hasNext(); ) {
                Staff staff = iter.next();
                user = staff.getUser();
                authorizations = wfAuthorityGroupBlo.getAuthorizationByStaffId(staff.getId());
                staff.setAuthorizations(authorizations);
            }
            // 为了管理所有的组织，轩琦用户可以假定自己是每一个组织的职员，这样可以登录进任何一个组织，并对其进行管理
            // 该职员在轩琦有什么权限，在其他组织就有什么权限，不会多也不会少。
            Organization[] list = organizationBlo.getAllOtherOrganizations(SystemProperties.get("admin.corp.id"));
            if (list != null && list.length > 0) {
                for (int i = 0; i < list.length; i++) {
                    Staff staff = new Staff();
                    staff.setUser(user);
                    staff.setJobStatus(1);
                    staff.setOrganizationName(list[i].getName());
                    staff.setOwner(list[i].getId());
                    staff.setAuthorizations(authorizations);
                    staffList.add(staff);
                }
            }
        } else {
            for (Iterator<Staff> iter = staffList.iterator(); iter.hasNext(); ) {
                Staff staff = iter.next();
                String[] authorizations = wfAuthorityGroupBlo.getAuthorizationByStaffId(staff.getId());
                if (authorizations.length > 0) {
                    // has authorizations
                    staff.setAuthorizations(authorizations);
                } else {
                    // if no authorizations, remove from staff list.
                    iter.remove();
                }
            }
        }
        if (staffList.size() > 0) {
            Staff[] staffs = staffList.toArray(new Staff[staffList.size()]);
            login.setStaffships(staffs);
            AbstractPosition[] ps = allPosition.toArray(new AbstractPosition[allPosition.size()]);
            if (ps.length > 0) {
                login.setPositions(ps);
            }
        }
        // -3: be a staff in some organization but has no authorizations in
        // the organization yet;
        //		else {
//			login.setStatusCode(-3);
//			login.setStaffships(null);
//		}

        return login;
    }

    public StaffListPage searchStaff(String condition, String ownerid, int pageno, int pagesize) throws Exception {

        StaffListPage page = new StaffListPage(pageno, pagesize);
        int total = wfStaffEso.getAllStaffCounting(ownerid);
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
                List<Staff> staffs = wfStaffEso.queryAll(ownerid, pageindex, pagesize);
                page.setPageEntities(staffs.toArray(new Staff[staffs.size()]));
            } else {
                total = wfStaffEso.getAllStaffCounting(condition, ownerid);
                page.setPageNo(pageno);
                page.setAllEntitiesCount(total);
                int n = total / pagesize;
                int m = total % pagesize;
                if (m > 0) {
                    n = n + 1;
                }
                page.setAllPagesCount(n);
                int pageindex = (pageno - 1) * pagesize;
                List<Staff> staffs = wfStaffEso.queryAll(condition, ownerid, pageindex, pagesize);
                page.setPageEntities(staffs.toArray(new Staff[staffs.size()]));
            }
        }
        return page;
    }

    public Staff checkStaffforUser(String userid, String ownerId) throws Exception {

        return wfStaffEso.queryByUserId(userid, ownerId);
    }

}
