/**
 *
 */
package com.cloudibpm.blo.release.form;

import com.cloudibpm.core.TreeNode;
import com.cloudibpm.core.WorkflowEntity;
import com.cloudibpm.core.release.form.ReleasedForm;
import com.cloudibpm.core.release.form.ReleasedFormListPage;
import com.cloudibpm.core.repository.BusinessLogicObject;
import com.cloudibpm.core.solr.FormServiceSolrUtils;
import com.cloudibpm.eso.release.form.ReleasedFormEso;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.SQLException;
import java.util.List;

/**
 *
 * @author Caodahai lastupdate at 22:34 on 2018-10-10
 * @version 1.0
 */
@Service
//@Transactional
public class ReleasedFormBlo extends BusinessLogicObject {
    private final ReleasedFormEso releasedFormEso;

    @Autowired
    public ReleasedFormBlo(ReleasedFormEso releasedFormEso) {
        this.releasedFormEso = releasedFormEso;
    }

    /**
     * Returns all the forms from repository.
     *
     * @return
     * @throws Exception
     */
    public ReleasedForm[] getForms(TreeNode parent, WorkflowEntity owner) throws Exception {

        List<ReleasedForm> procRos = releasedFormEso.queryAll(parent.getId(), owner.getId());
        return procRos.toArray(new ReleasedForm[procRos.size()]);
    }

    /**
     * Create new form object into repository.
     *
     * @param form
     *            ReleasedForm
     * @throws SQLException
     */

    public void saveReleasedForm(ReleasedForm form) throws Exception {

        releasedFormEso.delete(form.getId());
        releasedFormEso.insert(form);
    }

    public ReleasedForm getForm(String id) throws Exception {

        return releasedFormEso.queryFormByPk(id);
    }

    public ReleasedForm getReleasedForm(String id) throws Exception {

        return releasedFormEso.queryRlFormByPk(id);
    }

    public void updateForm(ReleasedForm f) throws Exception {

        releasedFormEso.update(f);
    }


    public void updateReleasedForm(ReleasedForm f) throws Exception {
        // save ...

        releasedFormEso.update(f);
    }

    /**
     * @author Dahai Cao last updated at 17:37 on 2018-10-15
     * @param id
     * @param status
     *            0: 已经申请上线（上架），1：还没有申请上线（上架）。
     * @throws Exception
     */

    public void releasedForm(String id, int status) throws Exception {

        ReleasedForm f = releasedFormEso.queryRlFormByPk(id);
        releasedFormEso.update(id, status);
        if (status == 1) { // off line
            FormServiceSolrUtils.deleteSearchIndex(f.getId());
        }
    }

    /**
     * @author Dahai Cao last updated at 17:37 on 2018-10-15
     * @param fid
     * @param status
     *            2: 已经上线（上架）; 0: 申请下线（下架）;
     * @param lastupdate
     * @throws Exception
     */

    public void modifyRlFormStatus(String fid, int status, long lastupdate, String orgname) throws Exception {
        ReleasedForm f = releasedFormEso.queryRlFormByPk(fid);
        releasedFormEso.updateStatus(fid, status, lastupdate);
        // 2:go to live online; 0:offline;
        if (status == 2) { // go to live (online)
            FormServiceSolrUtils.setSearchIndex(f, orgname);
        } else {  // offline
            FormServiceSolrUtils.deleteSearchIndex(f.getId());
        }
    }

    public ReleasedFormListPage searchReleasedForm(int deprecated, String condition, int pageno, int pagesize)
            throws SQLException {

        ReleasedFormListPage page = new ReleasedFormListPage();
        int total = releasedFormEso.queryRlFormCounting(deprecated);
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
                page.setAllEntitiesCount(pagesize);
                int n = total / pagesize;
                int m = total % pagesize;
                if (m > 0) {
                    n = n + 1;
                }
                page.setAllEntitiesCount(n);
                int pageindex = (pageno - 1) * pagesize;
                page.setPageIndex(pageindex);
                List<ReleasedForm> form = releasedFormEso.queryRlForm(deprecated, pageindex, pagesize);
                page.setPageEntities(form.toArray(new ReleasedForm[form.size()]));
            } else {
                total = releasedFormEso.queryRlFormCounting(condition);
                page.setPageNo(pageno);
                page.setAllPagesCount(total);
                int n = total / pagesize;
                int m = total % pagesize;
                if (m > 0) {
                    n = n + 1;
                }
                page.setAllPagesCount(n);
                int pageindex = (pageno - 1) * pagesize;
                List<ReleasedForm> form = releasedFormEso.queryRlForm(condition, pageindex, pagesize);
                page.setPageEntities(form.toArray(new ReleasedForm[form.size()]));
            }
        }
        return page;
    }

    /**
     *
     * @param id
     *            String, primary key of released form
     * @throws Exception
     */
    public void removeForm(String id) throws Exception {

        releasedFormEso.delete(id);
    }

    public void removeForms(String[] ids) throws Exception {

        if (ids != null && ids.length > 0) {
            for (int i = 0; i < ids.length; i++) {
                releasedFormEso.delete(ids[i]);
            }
        }
    }

    /**
     * @author Dahai Cao created at 22:35 on 2018-10-10
     * @param id
     * @param name
     * @param formcontent
     * @param lastupdate
     * @throws Exception
     */
    public void updateRelasedFormName(String id, String name, String formcontent, long lastupdate) throws Exception {

        releasedFormEso.updateFormName(id, name, formcontent, lastupdate);
    }

}
