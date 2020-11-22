/**
 *
 */
package com.cloudibpm.core.solr;

import com.cloudibpm.core.buildtime.release.wfprocess.ReleasedWfProcess;
import com.cloudibpm.core.util.SystemConfig;
import org.apache.solr.client.solrj.SolrClient;
import org.apache.solr.client.solrj.SolrQuery;
import org.apache.solr.client.solrj.SolrServerException;
import org.apache.solr.client.solrj.impl.HttpSolrClient;
import org.apache.solr.client.solrj.response.QueryResponse;
import org.apache.solr.client.solrj.response.UpdateResponse;
import org.apache.solr.common.SolrDocument;
import org.apache.solr.common.SolrDocumentList;
import org.apache.solr.common.SolrInputDocument;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * This class is used search the released processes in process store.
 *
 * @author Dahai Cao created on 2017-01-24, last updated at 14:41 on 2019-04-17
 *
 */
public class ProcessServiceSolrUtils {

    public static void setSearchIndex(ReleasedWfProcess process, String orgname) throws SolrServerException, IOException {
        String url = SystemConfig.getProp("solr.server.url") + "/" + SystemConfig.getProp("solr.server.appcore");
        HttpSolrClient.Builder builder = new HttpSolrClient.Builder(url);
        SolrClient client = builder.build();
        SolrInputDocument doc = new SolrInputDocument();
        doc.addField("id", process.getId());
        doc.addField("application_name", process.getName());
        doc.addField("application_url", process.getId()); // reserved field
        doc.addField("business_type", process.getProcessType());
        doc.addField("keywords", process.getKeywords());
        doc.addField("description", process.getDescription());
        doc.addField("author_id", process.getAuthorId());
        doc.addField("author", process.getAuthor());
        doc.addField("version", process.getVersion());
        doc.addField("releaser_id", process.getReleaserId());
        doc.addField("releaser", process.getReleaser());
        doc.addField("release_statement", process.getReleaseStatement());
        doc.addField("release_date", process.getReleaseDate());
        doc.addField("access_level", process.getAccessLevel());
        // 0: automation application service
        // 1: single participant application service
        // 2: multiple participant application service
        // 3: data-collecting UI application service
        // 4: data-presentation UI application service
        // 5: data-listing UI application service
        // 6: data-statistics UI application service
        // 7: micro-service application service
        doc.addField("service_type", process.getWorkflowType());
        doc.addField("create_time", process.getLastupdate());
        doc.addField("last_update", process.getLastupdate());
        doc.addField("organization_id", process.getOwner());
        doc.addField("organization_name", orgname);
        doc.addField("organization_url", ""); // reserved field
        doc.addField("status", process.getDeprecated());
        doc.addField("trail_period", process.getTrialPeriod());
        doc.addField("purchase_price", process.getPurchasePrice());
        doc.addField("usage_price", process.getUsagePrice());
        doc.addField("like_count", process.getLikeCounting());
        doc.addField("total_use_count", process.getTotalUseCounting());
        doc.addField("success_count", process.getSuccessCounting());
        doc.addField("termination_count", process.getTerminationCounting());
        doc.addField("suspension_count", process.getSuspensionCounting());
        doc.addField("total_download_count", process.getTotalDownloading());
        client.add(doc, 1);
        client.commit();
        client.close();
    }

    // 更新索引中多个属性数据
    public static void updateMultipleSearchData(String indexId, Map<String, Object> maps) throws Exception {
        String url = SystemConfig.getProp("solr.server.url") + "/" + SystemConfig.getProp("solr.server.appcore");
        HttpSolrClient.Builder builder = new HttpSolrClient.Builder(url);
        SolrClient client = builder.build();
        Set<String> keys = maps.keySet();
        SolrInputDocument doc = new SolrInputDocument();
        doc.addField("id", indexId);
        for (String key : keys) {
            HashMap<String, Object> oper = new HashMap<String, Object>();
            oper.put("set", maps.get(key));
            doc.addField(key, oper);
        }
        UpdateResponse rsp = client.add(doc, 1);
        UpdateResponse rspCommit = client.commit();
        client.close();
    }

    // 更新索引中单个属性数据
    public static void updateSearchData(String indexId, String fieldName, Object fieldValue) throws Exception {
        String url = SystemConfig.getProp("solr.server.url") + "/" + SystemConfig.getProp("solr.server.appcore");
        HttpSolrClient.Builder builder = new HttpSolrClient.Builder(url);
        SolrClient client = builder.build();
        Map<String, Object> oper = new HashMap<String, Object>();
        oper.put("set", fieldValue);
        SolrInputDocument doc = new SolrInputDocument();
        doc.addField("id", indexId);
        doc.addField(fieldName, oper);
        UpdateResponse rsp = client.add(doc, 1);
        UpdateResponse rspCommit = client.commit();
        client.close();
    }

    public static void deleteSearchIndex(String indexId) throws SolrServerException, IOException {
        String url = SystemConfig.getProp("solr.server.url") + "/" + SystemConfig.getProp("solr.server.appcore");
        HttpSolrClient.Builder builder = new HttpSolrClient.Builder(url);
        SolrClient client = builder.build();
        client.deleteById(indexId);
        client.commit();
        client.close();
    }

    // 搜索默认应用服务列表，带高亮。
    public static ProcessServiceSearchResultPage searchApp(
            String[] owners, String[] conditions, int pageno, int pagesize) throws Exception {
        long startTime = System.currentTimeMillis();   //获取开始时间
        String url = SystemConfig.getProp("solr.server.url") + "/" + SystemConfig.getProp("solr.server.appcore");
        HttpSolrClient.Builder builder = new HttpSolrClient.Builder(url);
        SolrClient client = builder.build();
        SolrQuery query = new SolrQuery();
        ProcessServiceSearchResultPage resultPage = new ProcessServiceSearchResultPage();
        String c = "";
        String o = "";
        if (owners != null && owners.length > 0) {

            for (String owner : owners) {
                if (o.equals("")) {
                    o = owner;
                } else {
                    o += " OR " + owner;
                }
            }

            if (conditions != null && conditions.length > 0) {
                for (String condition : conditions) {
                    if (c.equals("")) {
                        c = condition;
                    } else {
                        c += " OR " + condition;
                    }
                }
            }

            //特殊字符处理
            StringBuilder result = new StringBuilder();
            for (int i = 0; i < c.length(); i++) {
                char c1 = c.charAt(i);
                // These characters are part of the query syntax and must be escaped
                if (c1 == '\\' || c1 == '+' || c1 == '-' || c1 == '!' || c1 == '(' || c1 == ')' || c1 == ':'
                        || c1 == '^' || c1 == '[' || c1 == ']' || c1 == '\"' || c1 == '{' || c1 == '}' || c1 == '~'
                        || c1 == '?' || c1 == '|' || c1 == '&' || c1 == ';' || c1 == '/'
                        || Character.isWhitespace(c1)) {
                    result.append('\\');
                }
                result.append(c1);
            }
            c = result + "";
            String gcond = "*:*";
            if (!c.equals("")) {
                String id = "(id:" + c + ")";
                String name = "(application_name:" + c + ")";
                String kw = "(keywords:" + c + ")";
                String comt = "(description:" + c + ")";
                String auth = "(author:" + c + ")";
                gcond = id + " OR " + name + " OR " + kw + " OR " + auth + " OR " + comt;
            }
            if (!o.equals("")) {
                String orgid = "(organization_id:" + o + ")";
                gcond = "(" + gcond + ") AND " + orgid;
            }
            resultPage.setPageNo(pageno);
            resultPage.setPageSize(30);
            query.set("q", gcond);
            query.setFacetLimit(30);
            // params.addSortField( "price", SolrQuery.ORDER.asc );
            query.setStart(pageno);
            query.setRows(pagesize);
            // 设置高亮
            query.setHighlight(true);// 开启高亮组件
            query.addHighlightField("application_name");// 高亮字段
            query.addHighlightField("description");// 高亮字段
            query.addHighlightField("organization_name");// 高亮字段
            query.setHighlightSimplePre("");// 标记，高亮关键字前缀
            query.setHighlightSimplePost("");// 后缀
            query.setHighlight(true).setHighlightSnippets(1);
            query.setHighlightFragsize(150);
            QueryResponse response = client.query(query);
            // Map<String, Map<String, List<String>>> highlightMap =
            // response.getHighlighting();
            // 获取solr查询的结果
            SolrDocumentList results = response.getResults();
            long numFound = results.getNumFound();
            if (numFound > 0) {
                long n = numFound / pagesize;
                long m = numFound % pagesize;
                if (m > 0) {
                    n = n + 1;
                }
                int pageindex = (pageno) * pagesize;
                resultPage.setPageIndex(pageindex);
                resultPage.setAllEntitiesCount(numFound);
                long endTime = System.currentTimeMillis(); //获取结束时间
                if (numFound > 0) {
                    ProcessServiceSearchResult[] services = new ProcessServiceSearchResult[pagesize];
                    int i = 0;
                    // 高亮显示的反回结果
                    Map<String, Map<String, List<String>>> maplist = response.getHighlighting();
                    for (SolrDocument solrDocument : results) {
                        services[i] = new ProcessServiceSearchResult();
                        services[i].setId((String) solrDocument.getFieldValue("id"));
                        Object oid = solrDocument.get("id");
                        Map<String, List<String>> fieldMap = maplist.get(oid);
                        if (conditions[0].equals("*")) {
                            services[i].setProcName((String) solrDocument.getFieldValue("application_name"));
                            services[i].setOrgName((String) solrDocument.getFieldValue("organization_name"));
                        } else {
                            if (fieldMap.get("application_name") != null) {
                                services[i].setProcName((String) fieldMap.get("application_name").toString());
                            }
                            if (services[i].getProcName() == null) {
                                services[i].setProcName((String) solrDocument.getFieldValue("application_name"));
                            }
                            if (fieldMap.get("organization_name") != null) {
                                services[i].setOrgName((String) fieldMap.get("organization_name").toString());
                            }
                            if (services[i].getOrgName() == null) {
                                services[i].setOrgName((String) solrDocument.getFieldValue("organization_name"));
                            }
                        }
                        services[i].setSpendTime(endTime - startTime);
                        services[i].setProcUrl((String) solrDocument.getFieldValue("application_url"));
                        services[i].setProcType((int) solrDocument.getFieldValue("business_type"));
                        services[i].setKeywords((String) solrDocument.getFieldValue("keywords"));
                        services[i].setAccessLevel((int) solrDocument.getFieldValue("access_level"));
                        services[i].setWorkflowType((int) solrDocument.getFieldValue("service_type"));
                        services[i].setDescription((String) solrDocument.getFieldValue("description"));
                        services[i].setAuthorId((String) solrDocument.getFieldValue("author_id"));
                        services[i].setAuthor((String) solrDocument.getFieldValue("author"));
                        services[i].setPurchasePrice((Double) solrDocument.getFieldValue("purchase_price"));
                        services[i].setUsagePrice((Double) solrDocument.getFieldValue("usage_price"));
                        services[i].setCreateDateTime((long) solrDocument.getFieldValue("create_time"));
                        services[i].setLastupdate((long) solrDocument.getFieldValue("last_update"));
                        services[i].setOrgId((String) solrDocument.getFieldValue("organization_id"));
                        services[i].setOrgUrl((String) solrDocument.getFieldValue("organization_url"));
                        services[i].setVersion((String) solrDocument.getFieldValue("version"));
                        services[i].setReleaserId((String) solrDocument.getFieldValue("releaser_id"));
                        services[i].setReleaser((String) solrDocument.getFieldValue("releaser"));
                        services[i].setReleaseStatement((String) solrDocument.getFieldValue("release_statement"));
                        services[i].setReleaseDate((long) solrDocument.getFieldValue("release_date"));
                        services[i].setDeprecated((int) solrDocument.getFieldValue("deprecated"));
                        services[i].setLikeCounting((int) solrDocument.getFieldValue("like_count"));
                        services[i].setTotalUseCounting((int) solrDocument.getFieldValue("total_use_count"));
                        services[i].setSuccessCounting((int) solrDocument.getFieldValue("success_count"));
                        services[i].setTerminationCounting((int) solrDocument.getFieldValue("termination_count"));
                        services[i].setSuspensionCounting((int) solrDocument.getFieldValue("suspension_count"));
                        i++;
                    }
                    resultPage.setPageEntities(services);
                }
                return resultPage;
            }
        }
        resultPage.setPageSize(pagesize);
        resultPage.setPageNo(0);
        resultPage.setAllEntitiesCount(0);
        resultPage.setAllPagesCount(0);
        resultPage.setPageIndex(0);
        return resultPage;
    }

    // 默认搜索到特定组织内部的所有的应用列表。
    // 不带高亮的。
    public static ProcessServiceSearchResultPage search(
            String[] owners, String[] conditions, int pageno, int pagesize) throws Exception {
        long startTime = System.currentTimeMillis();   //获取开始时间
        String url = SystemConfig.getProp("solr.server.url") + "/" + SystemConfig.getProp("solr.server.appcore");
        HttpSolrClient.Builder builder = new HttpSolrClient.Builder(url);
        SolrClient client = builder.build();
        SolrQuery query = new SolrQuery();
        ProcessServiceSearchResultPage resultPage = new ProcessServiceSearchResultPage();
        String c = "";
        String o = "";
        if (owners != null && owners.length > 0) {
            for (String owner : owners) {
                if (o.equals("")) {
                    o = owner;
                } else {
                    o += " || " + owner;
                }
            }

            if (conditions != null && conditions.length > 0) {
                for (String condition : conditions) {
                    if (c.equals("")) {
                        c = condition;
                    } else {
                        c += " || " + condition;
                    }
                }
            }

            //特殊字符处理
            StringBuilder result = new StringBuilder();
            for (int i = 0; i < c.length(); i++) {
                char c1 = c.charAt(i);
                // These characters are part of the query syntax and must be escaped
                if (c1 == '\\' || c1 == '+' || c1 == '-' || c1 == '!' || c1 == '(' || c1 == ')' || c1 == ':'
                        || c1 == '^' || c1 == '[' || c1 == ']' || c1 == '\"' || c1 == '{' || c1 == '}' || c1 == '~'
                        || c1 == '?' || c1 == '|' || c1 == '&' || c1 == ';' || c1 == '/'
                        || Character.isWhitespace(c1)) {
                    result.append('\\');
                }
                result.append(c1);
            }
            c = result.toString() + "";
            String gcond = "*:*";
            if (!c.equals("")) {
                String id = "(id:" + c + ")";
                String name = "(application_name:" + c + ")";
                String kw = "(keywords:" + c + ")";
                String comt = "(description:" + c + ")";
                String auth = "(author:" + c + ")";
                gcond = id + " || " + name + " || " + kw + " || " + auth + " || " + comt;
            }
            if (!o.equals("")) {
                String orgid = "(organization_id:" + o + ")";
                gcond = "(" + gcond + ") && " + orgid;
            }
            gcond = gcond + " && (service_type:1 || service_type:2 || service_type:3 " +
                    "|| service_type:4 || service_type:5  || service_type:6)";
            resultPage.setPageNo(pageno);
            resultPage.setPageSize(30);
            query.set("q", gcond);
            query.setFacetLimit(30);
            // params.addSortField( "price", SolrQuery.ORDER.asc );
            query.setStart(pageno);
            query.setRows(pagesize);
            // 设置高亮
            QueryResponse response = client.query(query);
            SolrDocumentList results = response.getResults();
            long numFound = results.getNumFound();
            if (numFound > 0) {
                long n = numFound / pagesize;
                long m = numFound % pagesize;
                if (m > 0) {
                    n = n + 1;
                }
                int pageindex = (pageno) * pagesize;
                resultPage.setPageIndex(pageindex);
                resultPage.setAllEntitiesCount(numFound);
                long endTime = System.currentTimeMillis(); //获取结束时间
                if (numFound > 0) {
                    ProcessServiceSearchResult[] services = new ProcessServiceSearchResult[pagesize];
                    int i = 0;
                    // 高亮显示的反回结果
                    //Map<String, Map<String, List<String>>> maplist = response.getHighlighting();
                    for (SolrDocument solrDocument : results) {
                        services[i] = new ProcessServiceSearchResult();
                        services[i].setId((String) solrDocument.getFieldValue("id"));
                        services[i].setProcName((String) solrDocument.getFieldValue("application_name"));
                        services[i].setOrgName((String) solrDocument.getFieldValue("organization_name"));
                        services[i].setSpendTime(endTime - startTime);
                        services[i].setProcUrl((String) solrDocument.getFieldValue("application_url"));
                        services[i].setProcType((int) solrDocument.getFieldValue("business_type"));
                        services[i].setKeywords((String) solrDocument.getFieldValue("keywords"));
                        services[i].setAccessLevel((int) solrDocument.getFieldValue("access_level"));
                        services[i].setWorkflowType((int) solrDocument.getFieldValue("service_type"));
                        services[i].setDescription((String) solrDocument.getFieldValue("description"));
                        services[i].setAuthorId((String) solrDocument.getFieldValue("author_id"));
                        services[i].setAuthor((String) solrDocument.getFieldValue("author"));
                        services[i].setPurchasePrice((Double) solrDocument.getFieldValue("purchase_price"));
                        services[i].setUsagePrice((Double) solrDocument.getFieldValue("usage_price"));
                        services[i].setCreateDateTime((long) solrDocument.getFieldValue("create_time"));
                        services[i].setLastupdate((long) solrDocument.getFieldValue("last_update"));
                        services[i].setOrgId((String) solrDocument.getFieldValue("organization_id"));
                        services[i].setOrgUrl((String) solrDocument.getFieldValue("organization_url"));
                        services[i].setVersion((String) solrDocument.getFieldValue("version"));
                        services[i].setReleaserId((String) solrDocument.getFieldValue("releaser_id"));
                        services[i].setReleaser((String) solrDocument.getFieldValue("releaser"));
                        services[i].setReleaseStatement((String) solrDocument.getFieldValue("release_statement"));
                        services[i].setReleaseDate((long) solrDocument.getFieldValue("release_date"));
                        services[i].setDeprecated((int) solrDocument.getFieldValue("status"));
                        services[i].setLikeCounting((long) solrDocument.getFieldValue("like_count"));
                        services[i].setTotalUseCounting((long) solrDocument.getFieldValue("total_use_count"));
                        services[i].setSuccessCounting((long) solrDocument.getFieldValue("success_count"));
                        services[i].setTerminationCounting((long) solrDocument.getFieldValue("termination_count"));
                        services[i].setSuspensionCounting((long) solrDocument.getFieldValue("suspension_count"));
                        services[i].setDownloadCount((long) solrDocument.getFieldValue("total_download_count"));
                        services[i].setTrailPeriod((int) solrDocument.getFieldValue("trail_period"));
                        i++;
                    }
                    resultPage.setPageEntities(services);
                }
                return resultPage;
            }
        }
        resultPage.setPageSize(pagesize);
        resultPage.setPageNo(0);
        resultPage.setAllEntitiesCount(0);
        resultPage.setAllPagesCount(0);
        resultPage.setPageIndex(0);
        return resultPage;
    }


    // 统计一个人所开发或发布的所有的应用的数量
    public static long searchCount(String id) throws Exception {
        if (id == null || id.trim().equals(""))
            return 0;
        String url = SystemConfig.getProp("solr.server.url") + "/" + SystemConfig.getProp("solr.server.appcore");
        HttpSolrClient.Builder builder = new HttpSolrClient.Builder(url);
        SolrClient client = builder.build();
        SolrQuery query = new SolrQuery();

        String gcond = "*:*";
        String orgid = "(author_id:" + id + ") || (releaser_id:" + id + ")";
        gcond = "(" + orgid + ")";
        gcond = gcond + " && (service_type:1 || service_type:2 || service_type:6)";
        query.set("q", gcond);
        query.setFacetLimit(100);
        // 设置高亮
        QueryResponse response = client.query(query);
        SolrDocumentList results = response.getResults();
        long numFound = results.getNumFound();
        return numFound;
    }

    public static ProcessServiceSearchResultPage searchAllAppsByUserId(
            String id, int pageno, int pagesize) throws Exception {
        long startTime = System.currentTimeMillis();   //获取开始时间
        String url = SystemConfig.getProp("solr.server.url") + "/" + SystemConfig.getProp("solr.server.appcore");
        HttpSolrClient.Builder builder = new HttpSolrClient.Builder(url);
        SolrClient client = builder.build();
        SolrQuery query = new SolrQuery();
        ProcessServiceSearchResultPage resultPage = new ProcessServiceSearchResultPage();
        String gcond = "*:*";
        String orgid = "(author_id:" + id + ") || (releaser_id:" + id + ")";
        gcond = "(" + orgid + ")";
        gcond = gcond + " && (service_type:1 || service_type:2 || service_type:6)";
        resultPage.setPageNo(pageno);
        resultPage.setPageSize(30);
        query.set("q", gcond);
        query.setFacetLimit(30);
        query.setStart(pageno);
        query.setRows(pagesize);
        QueryResponse response = client.query(query);
        SolrDocumentList results = response.getResults();
        long numFound = results.getNumFound();
        if (numFound > 0) {
            long n = numFound / pagesize;
            long m = numFound % pagesize;
            if (m > 0) {
                n = n + 1;
            }
            int pageindex = (pageno) * pagesize;
            resultPage.setPageIndex(pageindex);
            resultPage.setAllEntitiesCount(numFound);
            long endTime = System.currentTimeMillis(); //获取结束时间
            if (numFound > 0) {
                ProcessServiceSearchResult[] services = new ProcessServiceSearchResult[pagesize];
                int i = 0;
                // 高亮显示的反回结果
                for (SolrDocument solrDocument : results) {
                    services[i] = new ProcessServiceSearchResult();
                    services[i].setId((String) solrDocument.getFieldValue("id"));
                    services[i].setProcName((String) solrDocument.getFieldValue("application_name"));
                    services[i].setOrgName((String) solrDocument.getFieldValue("organization_name"));
                    services[i].setSpendTime(endTime - startTime);
                    services[i].setProcUrl((String) solrDocument.getFieldValue("application_url"));
                    services[i].setProcType((int) solrDocument.getFieldValue("business_type"));
                    services[i].setKeywords((String) solrDocument.getFieldValue("keywords"));
                    services[i].setAccessLevel((int) solrDocument.getFieldValue("access_level"));
                    services[i].setWorkflowType((int) solrDocument.getFieldValue("service_type"));
                    services[i].setDescription((String) solrDocument.getFieldValue("description"));
                    services[i].setAuthorId((String) solrDocument.getFieldValue("author_id"));
                    services[i].setAuthor((String) solrDocument.getFieldValue("author"));
                    services[i].setPurchasePrice((Double) solrDocument.getFieldValue("purchase_price"));
                    services[i].setUsagePrice((Double) solrDocument.getFieldValue("usage_price"));
                    services[i].setCreateDateTime((long) solrDocument.getFieldValue("create_time"));
                    services[i].setLastupdate((long) solrDocument.getFieldValue("last_update"));
                    services[i].setOrgId((String) solrDocument.getFieldValue("organization_id"));
                    services[i].setOrgUrl((String) solrDocument.getFieldValue("organization_url"));
                    services[i].setVersion((String) solrDocument.getFieldValue("version"));
                    services[i].setReleaserId((String) solrDocument.getFieldValue("releaser_id"));
                    services[i].setReleaser((String) solrDocument.getFieldValue("releaser"));
                    services[i].setReleaseStatement((String) solrDocument.getFieldValue("release_statement"));
                    services[i].setReleaseDate((long) solrDocument.getFieldValue("release_date"));
                    services[i].setDeprecated((int) solrDocument.getFieldValue("status"));
                    services[i].setLikeCounting((long) solrDocument.getFieldValue("like_count"));
                    services[i].setTotalUseCounting((long) solrDocument.getFieldValue("total_use_count"));
                    services[i].setSuccessCounting((long) solrDocument.getFieldValue("success_count"));
                    services[i].setTerminationCounting((long) solrDocument.getFieldValue("termination_count"));
                    services[i].setSuspensionCounting((long) solrDocument.getFieldValue("suspension_count"));
                    services[i].setDownloadCount((long) solrDocument.getFieldValue("total_download_count"));
                    services[i].setTrailPeriod((int) solrDocument.getFieldValue("trail_period"));
                    i++;
                }
                resultPage.setPageEntities(services);
            }
            return resultPage;
        }
        resultPage.setPageSize(pagesize);
        resultPage.setPageNo(0);
        resultPage.setAllEntitiesCount(0);
        resultPage.setAllPagesCount(0);
        resultPage.setPageIndex(0);
        return resultPage;
    }
}