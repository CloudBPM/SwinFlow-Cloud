/**
 * 
 */
package com.cloudibpm.core.solr;

import com.cloudibpm.core.MicroService;
import com.cloudibpm.core.appservice.AndroidAppPlugin;
import com.cloudibpm.core.appservice.WebAppService;
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
 * This util is used to operate Solr search engine.
 * 
 * @author Dahai Cao created on 2017-01-17
 *
 */
public class AppServiceSolrUtils {

	public static void setSearchIndex(MicroService eas, String orgname) throws SolrServerException, IOException {
		String url = SystemConfig.getProp("solr.server.url") + "/" + SystemConfig.getProp("solr.server.appcore");
		HttpSolrClient.Builder builder = new HttpSolrClient.Builder(url);
		SolrClient client = builder.build();
		SolrInputDocument doc = new SolrInputDocument();
		doc.addField("id", eas.getId());
		doc.addField("application_name", eas.getName());
		doc.addField("application_url", ""); // reserved field
		doc.addField("business_type", 0);
		doc.addField("keywords", eas.getKeywords());
		doc.addField("description", eas.getComments());
		doc.addField("author_id", "");
		doc.addField("author", "");
		doc.addField("version", "");
		doc.addField("releaser_id", "");
		doc.addField("releaser", "");
		doc.addField("release_statement", "");
		doc.addField("release_date", 0);
		doc.addField("access_level", eas.getAccessType());
		// 0: automation application service
		// 1: single participant application service
		// 2: multiple participant application service
		// 3: data-collecting UI application service
		// 4: data-presentation UI application service
		// 5: data-listing UI application service
		// 6: data-statistics UI application service
		// 7：web micro-service；
		// 8：Android APP micro-service plugin (APK)
		// 9：iOS APP micro-service plugin
		// 5：sms template；
		// 6：email template；
		if (eas instanceof WebAppService) {
			doc.addField("service_type", 7);
		} else if (eas instanceof AndroidAppPlugin) {
			doc.addField("service_type", 8);
			//} else if (eas instanceof AndroidAppPlugin) {
		} else {
			doc.addField("service_type", -1);
		}
		doc.addField("create_time", eas.getLastupdate());
		doc.addField("last_update", eas.getLastupdate());
		doc.addField("organization_id", eas.getOwner());
		doc.addField("organization_name", orgname);
		doc.addField("organization_url", ""); // reserved field
		doc.addField("status", eas.getStatus());
		doc.addField("trail_period", 0);
		doc.addField("purchase_price", 0);// eas.getPrice());
		doc.addField("usage_price", 0.0);
		doc.addField("like_count", 0);
		doc.addField("total_use_count", 0);
		doc.addField("success_count", 0);
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

	public static AppServiceSearchResultPage searchApp(String [] owners, String[] conditions, int pageno, int pagesize)
			throws SolrServerException, IOException {
		long startTime = System.currentTimeMillis();   //获取开始时间
		String url = SystemConfig.getProp("solr.server.url") + "/" + SystemConfig.getProp("solr.server.appcore");
		HttpSolrClient.Builder builder = new HttpSolrClient.Builder(url);
		SolrClient client = builder.build();
		SolrQuery query = new SolrQuery();
		AppServiceSearchResultPage resultPage = new AppServiceSearchResultPage();
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
			gcond = gcond + " && (service_type: 7)";
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
//			query.addHighlightField("comments");// 高亮字段
//			query.addHighlightField("organization_name");// 高亮字段
//			query.setHighlightSimplePre("<font color='red'>");// 标记，高亮关键字前缀
//			query.setHighlightSimplePost("</font>");// 后缀
//			query.setHighlight(true).setHighlightSnippets(1);
			// 获取高亮分片数，一般搜索词可能分布在文章中的不同位置，
			// 其所在一定长度的语句即为一个片段，默认为1，但根据业务需要有时候需要多取出几个分片。
			// - 此处设置决定下文中titleList, contentList中元素的个数
			// 每个分片的最大长度，默认为100。适当设置此值，
			// 如果太小，高亮的标题可能会显不全；设置太大，摘要可能会太长。
			query.setHighlightFragsize(150);
			QueryResponse response = client.query(query);
			// Map<String, Map<String, List<String>>> highlightMap =
			// response.getHighlighting();
			// 获取solr查询的结果
			SolrDocumentList results = response.getResults();
			// 这个返回的是一个数据总数
			// 注意：获取查询数据总数的话，需要使用getNumFound，
			// 如果直接获取SolrDocumentList的长度的话，只能返回一页数据的数量
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
					AppServiceSearchResult[] services = new AppServiceSearchResult[pagesize];
					int i = 0;
					for (SolrDocument solrDocument : results) {
						services[i] = new AppServiceSearchResult();
						services[i].setId((String) solrDocument.getFieldValue("id"));
						services[i].setAppName((String) solrDocument.getFieldValue("application_name"));
						services[i].setOrgName((String) solrDocument.getFieldValue("organization_name"));
						services[i].setSpendTime(endTime - startTime);
						services[i].setAppUrl((String) solrDocument.getFieldValue("application_url"));
						services[i].setAppType("");
						services[i].setKeywords((String) solrDocument.getFieldValue("keywords"));
						services[i].setAccessType(((int) solrDocument.getFieldValue("access_level")));
						services[i].setAccessLevel(((int) solrDocument.getFieldValue("access_level")));
						services[i].setServiceType((int) solrDocument.getFieldValue("service_type"));
						services[i].setComments((String) solrDocument.getFieldValue("description"));
						services[i].setAuthorId((String) solrDocument.getFieldValue("author_id"));
						services[i].setAuthor((String) solrDocument.getFieldValue("author"));
						services[i].setPurchasePrice((Double) solrDocument.getFieldValue("purchase_price"));
						services[i].setUsagePrice((Double) solrDocument.getFieldValue("usage_price"));
						services[i].setCreateDateTime((long) solrDocument.getFieldValue("create_time"));
						services[i].setLastupdate((long) solrDocument.getFieldValue("last_update"));
						services[i].setOrgId((String) solrDocument.getFieldValue("organization_id"));
						services[i].setOrgUrl((String) solrDocument.getFieldValue("organization_url"));
						services[i].setVersion((String) solrDocument.getFieldValue("version"));
						services[i].setReleaser((String) solrDocument.getFieldValue("releaser"));
						services[i].setReleaserId((String) solrDocument.getFieldValue("releaser_id"));
						services[i].setReleaseStatement((String) solrDocument.getFieldValue("release_statement"));
						services[i].setReleaseDate((long) solrDocument.getFieldValue("release_date"));
						services[i].setStatus((int) solrDocument.getFieldValue("status"));
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
