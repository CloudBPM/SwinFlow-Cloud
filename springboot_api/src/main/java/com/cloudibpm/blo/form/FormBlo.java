/**
 *
 */
package com.cloudibpm.blo.form;

import com.cloudibpm.blo.folder.WfFolderBlo;
import com.cloudibpm.blo.om.organization.OrganizationBlo;
import com.cloudibpm.blo.reference.ReferenceBlo;
import com.cloudibpm.blo.release.form.ReleasedFormBlo;
import com.cloudibpm.core.TreeNode;
import com.cloudibpm.core.WorkflowEntity;
import com.cloudibpm.core.folder.Folder;
import com.cloudibpm.core.form.Form;
import com.cloudibpm.core.organization.Organization;
import com.cloudibpm.core.reference.Reference;
import com.cloudibpm.core.release.form.ReleasedForm;
import com.cloudibpm.core.repository.BusinessLogicObject;
import com.cloudibpm.eso.form.FormEso;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

/**
 * @author Caodahai
 * @version 1.0
 */
@Service
//@Transactional
public class FormBlo extends BusinessLogicObject {
    private final OrganizationBlo organizationBlo;
    private final WfFolderBlo wfFolderBlo;
    private final FormEso formEso;
    private final ReferenceBlo referenceBlo;
    private final ReleasedFormBlo releasedFormBlo;

    @Autowired
    public FormBlo(OrganizationBlo organizationBlo, WfFolderBlo wfFolderBlo, FormEso formEso, ReferenceBlo referenceBlo, ReleasedFormBlo releasedFormBlo) {
        this.organizationBlo = organizationBlo;
        this.wfFolderBlo = wfFolderBlo;
        this.formEso = formEso;
        this.referenceBlo = referenceBlo;
        this.releasedFormBlo = releasedFormBlo;
    }

    /**
     * Gets all organizations for form explorer tree in data & form perspective.
     * These organizations include all form folders that may contain forms and
     * the forms.
     *
     * @return
     * @throws Exception
     * @date 2011-11-2 下午09:31:58
     */
    public List<Organization> getOrganizationsForFormViewer() throws Exception {
        List<Organization> orgs = organizationBlo.getOrganizations();
        for (Organization org : orgs) {
            int[] types = {Folder.FORM_FOLDER, Folder.BASIC_DATA_FOLDER, Folder.REFERENCE_DATA_FOLDER,
                    Folder.RELEASED_FORM_FOLDER,};
            wfFolderBlo.getChildrenFoldersForOrgViewer(org, types);
            for (TreeNode child : org.getChildren()) {
                if (((Folder) child).getType() == Folder.BASIC_DATA_FOLDER) {

                } else if (((Folder) child).getType() == Folder.FORM_FOLDER) {
                    getLeafForms(child);
                } else if (((Folder) child).getType() == Folder.RELEASED_FORM_FOLDER) {
                    getLeafReleasedForms(child);
                } else if (((Folder) child).getType() == Folder.REFERENCE_DATA_FOLDER) {
                    getLeafReference(child);
                }
            }
        }
        return orgs;
    }

    // new
    public List<Organization> getOrganizationsForFormViewer(String[] ids) throws Exception {
        List<Organization> orgs = organizationBlo.getOrganizationsByIds(ids);
        for (Organization org : orgs) {
            int[] types = {Folder.FORM_FOLDER, Folder.BASIC_DATA_FOLDER, Folder.REFERENCE_DATA_FOLDER,
                    Folder.RELEASED_FORM_FOLDER,};
            wfFolderBlo.getChildrenFoldersForOrgViewer(org, types);
            for (TreeNode child : org.getChildren()) {
                if (((Folder) child).getType() == Folder.BASIC_DATA_FOLDER) {

                } else if (((Folder) child).getType() == Folder.FORM_FOLDER) {
                    getLeafForms(child);
                } else if (((Folder) child).getType() == Folder.RELEASED_FORM_FOLDER) {
                    getLeafReleasedForms(child);
                } else if (((Folder) child).getType() == Folder.REFERENCE_DATA_FOLDER) {
                    getLeafReference(child);
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
    private void getLeafReference(TreeNode parent) throws Exception {
        for (TreeNode child : parent.getChildren()) {
            getLeafReference(child);
        }
        for (Reference ref : referenceBlo.getReferences(parent.getId(), parent.getOwner())) {
            parent.addChild(ref);
        }
    }

    /**
     * @param parent
     * @throws Exception
     * @date 2011-11-1 下午09:58:20
     */
    private void getLeafForms(TreeNode parent) throws Exception {
        for (TreeNode child : parent.getChildren()) {
            getLeafForms(child);
        }
        for (Form form : this.getForms(parent, new WorkflowEntity(parent.getOwner()))) {
            parent.addChild(form);
        }
    }

    /**
     * @param parent
     * @throws Exception
     * @date 2011-11-1 下午09:58:20
     */
    private void getLeafReleasedForms(TreeNode parent) throws Exception {
        for (TreeNode child : parent.getChildren()) {
            getLeafReleasedForms(child);
        }
        for (ReleasedForm form : releasedFormBlo.getForms(parent,
                new WorkflowEntity(parent.getOwner()))) {
            parent.addChild(form);
        }
    }

    /**
     * Returns all the forms from repository.
     *
     * @return
     * @throws Exception
     */
    public Form[] getForms(TreeNode parent, WorkflowEntity owner) throws Exception {

        List<Form> procRos = formEso.queryAll(parent.getId(), owner.getId());
        return procRos.toArray(new Form[procRos.size()]);
    }

    /**
     * Create new form object into repository.
     *
     * @param form Form
     * @throws SQLException
     */

    public void createNewForm(Form form) throws Exception {

        formEso.delete(form.getId());
        formEso.insert(form);
    }

    public Form getForm(String id) throws Exception {

        return formEso.queryByPk(id);
    }

    public void updateForm(Form f) throws Exception {

        formEso.update(f);
    }

    public List<Organization> getPulishFoldersForFormViewer(String id) throws Exception {
        List<Organization> orgs = new ArrayList<Organization>();
        orgs.add(organizationBlo.getOrganizationDetailsById(id));
        for (Organization org : orgs) {
            int[] types = {Folder.RELEASED_FORM_FOLDER};
            wfFolderBlo.getChildrenFoldersForOrgViewer(org, types);
        }
        return orgs;
    }

    public void removeForm(String id) throws Exception {

        formEso.delete(id);
    }

    public void removeForms(String[] ids) throws Exception {

        if (ids != null && ids.length > 0) {
            for (int i = 0; i < ids.length; i++) {
                formEso.delete(ids[i]);
            }
        }
    }
}
