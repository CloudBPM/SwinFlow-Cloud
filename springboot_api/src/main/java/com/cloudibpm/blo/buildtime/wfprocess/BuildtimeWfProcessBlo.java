package com.cloudibpm.blo.buildtime.wfprocess;

import com.cloudibpm.blo.bigdata.reportservice.ReportServiceBlo;
import com.cloudibpm.blo.buildtime.id.NewBuildtimeEntityIdAssignerBlo;
import com.cloudibpm.blo.folder.WfFolderBlo;
import com.cloudibpm.blo.om.organization.OrganizationBlo;
import com.cloudibpm.core.TreeNode;
import com.cloudibpm.core.WorkflowEntity;
import com.cloudibpm.core.buildtime.release.wfprocess.ReleasedWfProcess;
import com.cloudibpm.core.buildtime.util.json.WfProcess2JSON;
import com.cloudibpm.core.buildtime.util.json.WfProcessJSONParser;
import com.cloudibpm.core.buildtime.wfprocess.WfProcess;
import com.cloudibpm.core.data.expression.ExpressionParser;
import com.cloudibpm.core.folder.Folder;
import com.cloudibpm.core.folder.FolderType;
import com.cloudibpm.core.organization.Organization;
import com.cloudibpm.core.repository.BusinessLogicObject;
import com.cloudibpm.eso.buildtime.wfprocess.BuildtimeWfProcessEso;
import com.xq.paas.core.bigdata.report.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * @author Caodahai
 * @version 1.0
 */
@Service
@Transactional
public class BuildtimeWfProcessBlo extends BusinessLogicObject {
    private final BuildtimeWfProcessEso processEso;
    private final OrganizationBlo organizationBlo;
    private final NewBuildtimeEntityIdAssignerBlo newBuildtimeEntityIdAssignerBlo;
    private final WfFolderBlo wfFolderBlo;
    private final ReleasedWfProcessBlo releasedWfProcessBlo;
    private final ReportServiceBlo reportServiceBlo;

    @Autowired
    public BuildtimeWfProcessBlo(BuildtimeWfProcessEso processEso,
                                 OrganizationBlo organizationBlo,
                                 NewBuildtimeEntityIdAssignerBlo newBuildtimeEntityIdAssignerBlo,
                                 WfFolderBlo wfFolderBlo,
                                 ReleasedWfProcessBlo releasedWfProcessBlo,
                                 ReportServiceBlo reportServiceBlo) {
        this.processEso = processEso;
        this.organizationBlo = organizationBlo;
        this.newBuildtimeEntityIdAssignerBlo = newBuildtimeEntityIdAssignerBlo;
        this.wfFolderBlo = wfFolderBlo;
        this.releasedWfProcessBlo = releasedWfProcessBlo;
        this.reportServiceBlo = reportServiceBlo;
    }


    /**
     * Returns all workflow processes in current repository. Dahai updated on
     * 20170808
     *
     * @param parent
     * @param owner
     * @return
     * @throws Exception
     */
    public WfProcess[] getProcesses(TreeNode parent, WorkflowEntity owner) throws Exception {

        List<WfProcess> procRos = processEso.queryAll(parent.getId(), owner.getId());
        return procRos.toArray(new WfProcess[procRos.size()]);
    }

    /**
     * Return a process through specified <code>id</code>.
     *
     * @param id
     * @return
     * @throws Exception
     */
    public String getProcessContent(String id) throws Exception {

        return processEso.queryProcessContentByPK(id);
    }

    public WfProcess getProcessById(String id) throws Exception {

        return processEso.queryByPK(id);
    }

    /**
     * Arithmetic: delete all the old tasks and old transitions of business
     * process. Save business tasks and transitions of business process. Update
     * time stamp of business process.
     *
     * @param process BusinessProcess
     * @throws Exception
     */

    public String saveWfProcess(WfProcess process) throws Exception {

        processEso.update(process);
        return "1";
    }

    public String[] getAllProcesses(String ownerId) throws Exception {

        List<String> procRos = processEso.queryAllOfOwner(ownerId);
        return procRos.toArray(new String[procRos.size()]);
    }

    /**
     * Create new workflow process definition.
     *
     * @param process BusinessProcess
     * @throws SQLException
     */
    public void createNewWfProcess(WfProcess process) throws Exception {

        processEso.insert(process);
    }

    /**
     * Save a business process that is drafted.
     *
     * @param process draft version business process object.
     * @throws Exception
     */

    public void updateProcessName(WfProcess process) throws Exception {

        processEso.updateName(process.getId(), process.getName(), process.getProcessContent(), process.getLastupdate());
    }

    public void moveWfProcess(String pid, String parent, String content) throws Exception {

        processEso.updateParent(pid, parent, content, new Date());

    }

    /**
     * Gets all organizations for process explorer tree in process perspective.
     * These organizations include all process folders that may contain
     * processes. And the processes are in the folders.
     *
     * @return
     * @throws Exception
     * @date 2011-11-1 下午09:31:58
     */
    public List<Organization> getOrganizationsForProcessViewer() throws Exception {
        List<Organization> orgs = organizationBlo.getOrganizations();
        for (Organization org : orgs) {
            int[] types = {Folder.PROCESS_FOLDER, Folder.RELEASED_PROCESS_FOLDER};
            wfFolderBlo.getChildrenFoldersForOrgViewer(org, types);
            for (TreeNode child : org.getChildren()) {
                if (((Folder) child).getType() == Folder.PROCESS_FOLDER) {
                    getLeafProcesses(child);
                } else if (((Folder) child).getType() == Folder.RELEASED_PROCESS_FOLDER) {
                    getLeafReleasedProcesses(child);
                }
            }
        }
        return orgs;
    }

    // this method is used administration organization viewer
    public List<Organization> getOrganizationsForAdminViewer() throws Exception {
        List<Organization> orgs = organizationBlo.getOrganizations();
        for (Organization org : orgs) { // Folder.REMINDER_FOLDER,
            int[] types = {Folder.RELEASED_PROCESS_FOLDER, Folder.MS_APPROVAL_FOLDER, Folder.APP_APPROVAL_FOLDER,
                    Folder.FORM_APPROVAL_FOLDER, Folder.NOTICE_FOLDER, Folder.NEWS_FOLDER, Folder.NEWS_APPROVAL_FOLDER,
                    Folder.ORG_APPROVAL_FOLDER, Folder.APPROVAL_FOLDER, FolderType.COMMUNITY_FOLDER,
                    FolderType.HELP_FOLDER, FolderType.CUSTOMER_SERVICE_FOLDER, FolderType.USER_MANAGEMENT_FOLDER,
                    FolderType.MOBILE_APP_APPROVAL_FOLDER, FolderType.INVOICE_APP_APPROVAL_FOLDER};
            wfFolderBlo.getChildrenFoldersForOrgViewer(org, types);
            for (TreeNode child : org.getChildren()) {
                if (((Folder) child).getType() == Folder.RELEASED_PROCESS_FOLDER) {
                    getLeafReleasedProcesses(child);
                }
            }
        }
        return orgs;
    }

    // this method is used administration organization viewer
    public List<Organization> getOrganizationsForBigDataViewer() throws Exception {
        List<Organization> orgs = organizationBlo.getOrganizations();
        for (Organization org : orgs) { // Folder.REMINDER_FOLDER,
            int[] types = {Folder.RELEASED_PROCESS_FOLDER};
            wfFolderBlo.getChildrenFoldersForOrgViewer(org, types);
            for (TreeNode child : org.getChildren()) {
                if (((Folder) child).getType() == Folder.RELEASED_PROCESS_FOLDER) {
                    getLeafRlProcesses(child);
                }
            }
        }
        return orgs;
    }

    public List<Organization> getOrganizationsForBigDataViewer(String[] ids) throws Exception {
        List<Organization> orgs = organizationBlo.getOrganizationsByIds(ids);
        for (Organization org : orgs) {
            int[] types = {Folder.RELEASED_PROCESS_FOLDER};
            wfFolderBlo.getChildrenFoldersForOrgViewer(org, types);
            for (TreeNode child : org.getChildren()) {
                if (((Folder) child).getType() == Folder.RELEASED_PROCESS_FOLDER) {
                    getLeafRlProcesses(child);
                }
            }
        }
        return orgs;
    }


    public List<Organization> getPulishFoldersForProcessViewer(String id) throws Exception {
        List<Organization> orgs = new ArrayList<Organization>();
        orgs.add(organizationBlo.getOrganizationDetailsById(id));
        for (Organization org : orgs) {
            int[] types = {Folder.RELEASED_PROCESS_FOLDER};
            wfFolderBlo.getChildrenFoldersForOrgViewer(org, types);
        }
        return orgs;
    }

    public List<Organization> getFoldersForProcessViewer(String id) throws Exception {
        List<Organization> orgs = new ArrayList<Organization>();
        orgs.add(organizationBlo.getOrganizationDetailsById(id));
        for (Organization org : orgs) {
            int[] types = {Folder.PROCESS_FOLDER};
            wfFolderBlo.getChildrenFoldersForOrgViewer(org, types);
        }
        return orgs;
    }

    // new
    public List<Organization> getOrganizationsForProcessViewer(String[] ids) throws Exception {
        List<Organization> orgs = organizationBlo.getOrganizationsByIds(ids);
        for (Organization org : orgs) {
            int[] types = {Folder.PROCESS_FOLDER, Folder.RELEASED_PROCESS_FOLDER};
            wfFolderBlo.getChildrenFoldersForOrgViewer(org, types);
            for (TreeNode child : org.getChildren()) {
                if (((Folder) child).getType() == Folder.PROCESS_FOLDER) {
                    getLeafProcesses(child);
                } else if (((Folder) child).getType() == Folder.RELEASED_PROCESS_FOLDER) {
                    getLeafReleasedProcesses(child);
                }
            }
        }
        return orgs;
    }

    public List<Organization> getOrganizationsForAdminViewer(String[] ids) throws Exception {
        List<Organization> orgs = organizationBlo.getOrganizationsByIds(ids);
        for (Organization org : orgs) {
            int[] types = {Folder.RELEASED_PROCESS_FOLDER};
            wfFolderBlo.getChildrenFoldersForOrgViewer(org, types);
            for (TreeNode child : org.getChildren()) {
                if (((Folder) child).getType() == Folder.RELEASED_PROCESS_FOLDER) {
                    getLeafReleasedProcesses(child);
                }
            }
        }
        return orgs;
    }

    /**
     * @param parent
     * @throws Exception
     * @date 2011-11-1 下午09:58:20
     */
    private void getLeafRlProcesses(TreeNode parent) throws Exception {
        for (TreeNode child : parent.getChildren()) {
            getLeafRlProcesses(child);
        }
        for (ReleasedWfProcess process : releasedWfProcessBlo.getProcesses(parent,
                new WorkflowEntity(parent.getOwner()))) {
            parent.addChild(process);
            List<ReportService> list = this.reportServiceBlo.getReportServices(process.getId());
            if (!list.isEmpty())
                process.append(list.toArray(new ReportService[list.size()]));
        }
    }

    /**
     * @param parent
     * @throws Exception
     * @date 2011-11-1 下午09:58:20
     */
    private void getLeafReleasedProcesses(TreeNode parent) throws Exception {
        for (TreeNode child : parent.getChildren()) {
            getLeafReleasedProcesses(child);
        }
        for (ReleasedWfProcess process : releasedWfProcessBlo.getProcesses(parent,
                new WorkflowEntity(parent.getOwner()))) {
            parent.addChild(process);
        }
    }

    /**
     * @param parent
     * @throws Exception
     * @date 2011-11-1 下午09:58:20
     */
    private void getLeafProcesses(TreeNode parent) throws Exception {
        for (TreeNode child : parent.getChildren()) {
            getLeafProcesses(child);
        }
        for (WfProcess process : this.getProcesses(parent,
                new WorkflowEntity(parent.getOwner()))) {
            parent.addChild(process);
        }
    }

    /**
     * Delete a wfprocess.
     *
     * @param processId
     * @throws Exception
     */

    public void deleteWfProcess(String processId) throws Exception {

        processEso.delete(processId);
    }

    /**
     * Delete multiple wfprocess.
     *
     * @param processIds
     * @throws Exception
     */

    public void deleteWfProcesses(String[] processIds) throws Exception {

        if (processIds != null && processIds.length > 0) {
            for (String id : processIds) {
                processEso.delete(id);
            }
        }
    }


    public void copyNewWfProcess(WfProcess process) throws SQLException {

        processEso.insert(process);
    }

    public WfProcess copyWfProcess(String pid) throws Exception {

        WfProcess p = processEso.queryByPK(pid);
        WfProcess proc = WfProcessJSONParser.parseWfProcess(p.getProcessContent());
        proc.setName(p.getName() + "_副本");
        ExpressionParser.parseExpressions(proc);
        // assign new ID and change process ID.
        newBuildtimeEntityIdAssignerBlo.assignNewEntityId(proc);
        // AssignOwnerIDUtil.changeCurrOwner(proc, proc.getId());
        String processContent = WfProcess2JSON.toPJSON(proc);
        proc.setProcessContent(processContent);
        processEso.insert(proc);
        return proc;
    }
}
