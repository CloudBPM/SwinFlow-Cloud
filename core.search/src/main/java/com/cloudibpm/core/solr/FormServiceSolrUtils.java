package com.cloudibpm.core.solr;

import com.cloudibpm.core.release.form.ReleasedForm;
import com.cloudibpm.core.util.SystemConfig;
import org.apache.solr.client.solrj.SolrClient;
import org.apache.solr.client.solrj.SolrQuery;
import org.apache.solr.client.solrj.SolrServerException;
import org.apache.solr.client.solrj.impl.HttpSolrClient;
import org.apache.solr.client.solrj.response.QueryResponse;
import org.apache.solr.common.SolrDocument;
import org.apache.solr.common.SolrDocumentList;
import org.apache.solr.common.SolrInputDocument;

import java.io.IOException;

/**
 *
 */
public class FormServiceSolrUtils {

	public static void setSearchIndex(ReleasedForm frm, String orgname)
			throws SolrServerException, IOException {
		String url = SystemConfig.getProp("solr.server.url") + "/" + SystemConfig.getProp("solr.server.appcore");
		HttpSolrClient.Builder builder = new HttpSolrClient.Builder(url);
		SolrClient client = builder.build();
		SolrInputDocument doc = new SolrInputDocument();
		doc.addField("id", frm.getId());
		doc.addField("application_name", frm.getName());
		doc.addField("application_url", ""); // reserved field
		doc.addField("business_type", frm.getFormType());
		doc.addField("keywords", frm.getKeywords());
		doc.addField("description", frm.getDescription());
		doc.addField("author_id", frm.getAuthorId());
		doc.addField("author", frm.getAuthor());
		doc.addField("version", frm.getVersion());
		doc.addField("releaser_id", frm.getReleaserId());
		doc.addField("releaser", frm.getReleaser());
		doc.addField("release_statement", frm.getReleaseStatement());
		doc.addField("release_date", frm.getReleaseDate());
		doc.addField("access_level", frm.getAccessLevel());
		// 0: automation application service
		// 1: single participant application service
		// 2: multiple participant application service
		// 3: data-collecting UI application service
		// 4: data-presentation UI application service
		// 5: data-listing UI application service
		// 6: data-statistics UI application service
		// 7: micro-service application service
		doc.addField("service_type", frm.getServiceType());
		doc.addField("create_time", frm.getCreateDatetime());
		doc.addField("last_update", frm.getLastupdate());
		doc.addField("organization_id", frm.getOwner());
		doc.addField("organization_name", orgname);
		doc.addField("organization_url", ""); // reserved field
		doc.addField("status", frm.getDeprecated());
		doc.addField("trail_period", frm.getTrialPeriod());
		doc.addField("purchase_price", frm.getPurchasePrice());
		doc.addField("usage_price", frm.getUsagePrice());
		doc.addField("like_count", frm.getLikeCounting());
		doc.addField("total_use_count", frm.getTotalUseCounting());
		doc.addField("success_count", frm.getSuccessCounting());
		doc.addField("termination_count", 0);
		doc.addField("suspension_count", 0);
		doc.addField("total_download_count", 0);
		client.add(doc, 1);
		client.commit();
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
	
	public static FormServiceSearchResultPage searchApp(String [] owners, String[] conditions, int pageno, int pagesize)
			throws SolrServerException, IOException {
		long startTime = System.currentTimeMillis();   //获取开始时间
		String url = SystemConfig.getProp("solr.server.url") + "/" + SystemConfig.getProp("solr.server.appcore");
		HttpSolrClient.Builder builder = new HttpSolrClient.Builder(url);
		SolrClient client = builder.build();
		SolrQuery query = new SolrQuery();
		FormServiceSearchResultPage resultPage = new FormServiceSearchResultPage();
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
			gcond = gcond + " && (service_type:3 || service_type:4 || service_type:5 || service_type:6) ";
			resultPage.setPageNo(pageno);
			resultPage.setPageSize(30);
			query.set("q", gcond);
			query.setFacetLimit(30);
			// params.addSortField( "price", SolrQuery.ORDER.asc );
			query.setStart(pageno);
			query.setRows(pagesize);
			// 设置高亮
//			query.setHighlight(true);// 开启高亮组件
//			query.addHighlightField("application_name");// 高亮字段
//			query.addHighlightField("description");// 高亮字段
//			query.addHighlightField("organization_name");// 高亮字段
//			query.setHighlightSimplePre("<font color='red'>");// 标记，高亮关键字前缀
//			query.setHighlightSimplePost("</font>");// 后缀
//			query.setHighlight(true).setHighlightSnippets(1);
//			query.setHighlightFragsize(150);
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
					FormServiceSearchResult[] services = new FormServiceSearchResult[pagesize];
					int i = 0;
					for (SolrDocument solrDocument : results) {
						services[i] = new FormServiceSearchResult();
						services[i].setId((String) solrDocument.getFieldValue("id"));
						services[i].setFrmName((String) solrDocument.getFieldValue("application_name"));
						services[i].setOrgName((String) solrDocument.getFieldValue("organization_name"));
						services[i].setSpendTime(endTime - startTime);
						services[i].setFrmUrl((String) solrDocument.getFieldValue("application_url"));
						services[i].setFrmType((int) solrDocument.getFieldValue("business_type"));
						services[i].setKeywords((String) solrDocument.getFieldValue("keywords"));
						services[i].setAccessLevel((int) solrDocument.getFieldValue("access_level"));
						services[i].setServiceType((int) solrDocument.getFieldValue("service_type"));
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
						//services[i].setTerminationCounting((long) solrDocument.getFieldValue("termination_count"));
						//services[i].setSuspensionCounting((long) solrDocument.getFieldValue("suspension_count"));
						//services[i].setDownloadCount((long) solrDocument.getFieldValue("total_download_count"));
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
}
