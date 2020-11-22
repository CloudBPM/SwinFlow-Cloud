package com.cloudibpm.blo.am.androidapp;

import com.cloudibpm.core.appservice.AndroidAppPlugin;
import com.cloudibpm.core.appservice.AndroidAppPluginPage;
import com.cloudibpm.core.organization.Organization;
import com.cloudibpm.core.repository.BusinessLogicObject;
import com.cloudibpm.core.solr.AppServiceSolrUtils;
import com.cloudibpm.eso.am.appservice.AndroidAppPluginEso;
import com.cloudibpm.eso.om.organization.WfOrganizationEso;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
//@Transactional
public class AndroidAppMsPluginBlo extends BusinessLogicObject {
    public AndroidAppPluginEso pluginEso = null;
    public WfOrganizationEso wfOrganizationEso = null;

    @Autowired
    public AndroidAppMsPluginBlo(AndroidAppPluginEso pluginEso,WfOrganizationEso wfOrganizationEso) {
        this.pluginEso = pluginEso;
        this.wfOrganizationEso = wfOrganizationEso;
    }

    @Transactional
    public void create(AndroidAppPlugin plugin) throws Exception {
        pluginEso.insert(plugin);
    }

    public AndroidAppPlugin getAndroidPlugin(String id) throws Exception {
        return pluginEso.query(id);
    }

    public List<AndroidAppPlugin> getAndroidPlugins(String parent) throws Exception {
        return pluginEso.queryByParent(parent);
    }

    @Transactional
    public void modifyStatus(String id, int status, long date) throws Exception {
        pluginEso.updateStatus(id, status, date);
        if (status == 1 || status == 0) {
            AppServiceSolrUtils.deleteSearchIndex(id);
        } else if (status == 2) {
            AndroidAppPlugin plugin = this.pluginEso.query(id);
            Organization org = this.wfOrganizationEso.queryNameByPK(plugin.getOwner());
            AppServiceSolrUtils.setSearchIndex(plugin, org.getName());
        }
    }

    @Transactional
    public void modify(AndroidAppPlugin plugin) throws Exception {
        pluginEso.update(plugin);
    }

    public AndroidAppPluginPage searchAllPublishedMobilAppMSPlugins(String condition,
                                                                    int pageno,
                                                                    int pagesize,
                                                                    int appStatus) throws Exception {
        AndroidAppPluginPage page = new AndroidAppPluginPage(pageno, pagesize);
        long total = pluginEso.countByAndroidAppMSPluginsbyStatus(appStatus);
        if (total == 0L) {
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
                long n = total / pagesize;
                long m = total % pagesize;
                if (m > 0) {
                    n = n + 1;
                }
                page.setAllPagesCount(n);
                int pageindex = (pageno - 1) * pagesize; // 跳过的数据条数
                page.setPageIndex(pageindex);
                List<AndroidAppPlugin> pluginsList = pluginEso.queryAndroidAppMSPluginsbyStatus(appStatus, pageindex, pagesize); // 查询所有的新闻
                page.setPageEntities(pluginsList.toArray(new AndroidAppPlugin[pluginsList.size()]));
            } else {
                total = pluginEso.queryAndroidAppMSPluginsCounting(condition, appStatus); // 根据条件查询数量
                if (total == 0L) {
                    page.setPageSize(pagesize);
                    page.setPageNo(1);
                    page.setAllEntitiesCount(0);
                    page.setAllPagesCount(0);
                    page.setPageIndex(0);
                } else {
                    page.setAllEntitiesCount(total);
                    page.setPageNo(pageno);
                    long n = total / pagesize;
                    long m = total % pagesize;
                    if (m > 0) {
                        n = n + 1;
                    }
                    page.setAllPagesCount(n);
                    int pageindex = (pageno - 1) * pagesize;// 需要跳过的数据条数
                    List<AndroidAppPlugin> pluginsList = pluginEso.queryAndroidAppMSPlugins(condition, appStatus, pageindex, pagesize);// 按条件查询新闻
                    page.setPageEntities(pluginsList.toArray(new AndroidAppPlugin[pluginsList.size()]));
                }
            }
        }
        return page;
    }


}