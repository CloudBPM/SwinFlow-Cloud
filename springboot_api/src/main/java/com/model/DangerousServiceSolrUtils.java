/**
 * 
 */
package com.model;

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
import java.util.List;
import java.util.Map;

/**
 * This class is used search the released processes in process store.
 * 
 * @author Dahai Cao created on 2017-01-24
 *
 */
public class DangerousServiceSolrUtils {
	
	public static void setSearchIndex(KlProcess process) throws SolrServerException, IOException {
		String url = SystemConfig.getProp("solr.server.url") + "/" + SystemConfig.getProp("solr.server.knowledge");
		HttpSolrClient.Builder builder = new HttpSolrClient.Builder(url);
		SolrClient client = builder.build();
		SolrInputDocument doc = new SolrInputDocument();
//		String date=new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'").format(process.getLastupdate());
		doc.addField("id", process.getId());
		doc.addField("danger_name", process.getName());
		doc.addField("danger_alias", process.getAlias());
		doc.addField("code", process.getCode());
		doc.addField("danger_type", process.getType());
		doc.addField("recording_time", process.getLastupdate());
		doc.addField("last_update", process.getLastupdate());
		client.add(doc, 1);
		client.commit();
		client.close();
	}
	
	public static void setIndustry(KlProcess process) throws SolrServerException, IOException {
		String url = SystemConfig.getProp("solr.server.url") + "/" + SystemConfig.getProp("solr.server.knowledge");
		HttpSolrClient.Builder builder = new HttpSolrClient.Builder(url);
		SolrClient client = builder.build();
		SolrInputDocument doc = new SolrInputDocument();
//		String date=new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'").format(process.getLastupdate());
		doc.addField("id", process.getId());
		doc.addField("industry_name", process.getIndustryName());
		doc.addField("industry_content", process.getIndustryContent());
		doc.addField("industry_owner", process.getIndustryOwner());
		doc.addField("industry_user", process.getIndustryUser());
		doc.addField("industry_type", process.getIndustryType());
		doc.addField("industry_status", process.getIndustryStatus());
		doc.addField("recording_time", process.getLastupdate());
		doc.addField("last_update", process.getLastupdate());
		client.add(doc, 1);
		client.commit();
		client.close();
	}

	public static void deleteSearchIndex(String indexId) throws SolrServerException, IOException {
		String url = SystemConfig.getProp("solr.server.url") + "/" + SystemConfig.getProp("solr.server.knowledge");
		HttpSolrClient.Builder builder = new HttpSolrClient.Builder(url);
		SolrClient client = builder.build();
		client.deleteById(indexId);
		client.commit();
		client.close();
	}

	public static DangerousServiceSearchResultPage search(String[] conditions, int pageno, int pagesize)
			throws SolrServerException, IOException {
		String url = SystemConfig.getProp("solr.server.url") + "/" + SystemConfig.getProp("solr.server.knowledge");
		HttpSolrClient.Builder builder = new HttpSolrClient.Builder(url);
		SolrClient client = builder.build();
		SolrQuery query = new SolrQuery();
		DangerousServiceSearchResultPage resultPage = new DangerousServiceSearchResultPage();
		String c = "";
		if (conditions != null && conditions.length > 0) {
			for (String condition : conditions) {
				if (c.equals("")) {
					c = condition;
				} else {
					c += " OR " + condition;
				}
			}
			//特殊字符处理
			StringBuilder sb = new StringBuilder();
		    for (int i = 0; i < c.length(); i++) {
		      char c1 = c.charAt(i);
		      // These characters are part of the query syntax and must be escaped
		      if (c1 == '\\' || c1 == '+' || c1 == '-' || c1 == '!'  || c1 == '(' || c1 == ')' || c1 == ':'
		        || c1 == '^' || c1 == '[' || c1 == ']' || c1 == '\"' || c1 == '{' || c1 == '}' || c1 == '~'
		        || c1 == '?' || c1 == '|' || c1 == '&'  || c1 == ';' || c1 == '/'
		        || Character.isWhitespace(c1)) {
		        sb.append('\\');
		      }
		      sb.append(c1);
		    }
		    String name =sb+"";
			name = "(danger_name:" + sb + ")";	 
			resultPage.setPageNo(pageno);
			resultPage.setPageSize(pagesize);
			query.set("q", name);

//			query.setFacet(true);// 设置facet=on
//			query.setFacetLimit(50);// 限制facet返回的数量
//			query.setFacetMissing(false);// 不统计null的值
//			query.setFacetMinCount(1);// 设置返回的数据中每个分组的数据最小值，比如设置为1，则统计数量最小为1，不然不显示
			// params.addSortField( "price", SolrQuery.ORDER.asc );
			query.setStart(pageno*pagesize);
			query.setRows(pagesize);
			// 设置高亮
			query.setHighlight(true);// 开启高亮组件
			query.addHighlightField("danger_name");// 高亮字段
			query.setHighlightSimplePre("<font color='red'>");// 标记，高亮关键字前缀
			query.setHighlightSimplePost("</font>");// 后缀
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
				if (numFound > 0) {
					DangerousServiceSearchResult[] services = new DangerousServiceSearchResult[pagesize];
					int i = 0;
					// 高亮显示的反回结果
			        Map<String, Map<String, List<String>>> maplist = response.getHighlighting();
					for (SolrDocument solrDocument : results) {
						services[i] = new DangerousServiceSearchResult();
						services[i].setId((String) solrDocument.getFieldValue("id"));
//						services[i].setProcName((String) solrDocument.get("proc_name"));
						Object oid = solrDocument.get("id");
			            Map<String, List<String>> fieldMap = maplist.get(oid);
			            if(conditions[0].equals("*")){
			            	services[i].setDangerName((String) solrDocument.get("danger_name").toString());
			            }else{
			            	services[i].setDangerName((String) fieldMap.get("danger_name").toString());
			            }			            
						services[i].setDangerUrl((String) solrDocument.getFieldValue("danger_url"));
						services[i].setDangerAlias((String) solrDocument.getFieldValue("danger_alias"));
						services[i].setDangerEname((String) solrDocument.getFieldValue("danger_ename"));
						services[i].setDangerType((String) solrDocument.getFieldValue("danger_type"));
						services[i].setDescription((String) solrDocument.getFieldValue("description"));
						services[i].setDangerFormula((String) solrDocument.getFieldValue("danger_formula"));
						services[i].setCode((String) solrDocument.getFieldValue("code"));
						services[i].setRecordingTime((long) solrDocument.getFieldValue("recording_time"));
						services[i].setLastupdate((long) solrDocument.getFieldValue("last_update"));
						services[i].setVersion((String) solrDocument.getFieldValue("version"));
						i++;
					}
					resultPage.setPageEntities(services);
				}
				return resultPage;
			}
		}
		resultPage.setPageSize(pagesize);
		resultPage.setPageNo(pageno);
		resultPage.setAllEntitiesCount(0);
		resultPage.setAllPagesCount(0);
		resultPage.setPageIndex(0);
		return resultPage;
	}
	
	public static DangerousServiceSearchResultPage searchIndustry(String[] conditions, int pageno, int pagesize)
			throws SolrServerException, IOException {
		String url = SystemConfig.getProp("solr.server.url") + "/" + SystemConfig.getProp("solr.server.knowledge");
		HttpSolrClient.Builder builder = new HttpSolrClient.Builder(url);
		SolrClient client = builder.build();
		SolrQuery query = new SolrQuery();
		DangerousServiceSearchResultPage resultPage = new DangerousServiceSearchResultPage();
		String c = "";
		if (conditions != null && conditions.length > 0) {
			for (String condition : conditions) {
				if (c.equals("")) {
					c = condition;
				} else {
					c += " OR " + condition;
				}
			}
			//特殊字符处理
			StringBuilder sb = new StringBuilder();
		    for (int i = 0; i < c.length(); i++) {
		      char c1 = c.charAt(i);
		      // These characters are part of the query syntax and must be escaped
		      if (c1 == '\\' || c1 == '+' || c1 == '-' || c1 == '!'  || c1 == '(' || c1 == ')' || c1 == ':'
		        || c1 == '^' || c1 == '[' || c1 == ']' || c1 == '\"' || c1 == '{' || c1 == '}' || c1 == '~'
		        || c1 == '?' || c1 == '|' || c1 == '&'  || c1 == ';' || c1 == '/'
		        || Character.isWhitespace(c1)) {
		        sb.append('\\');
		      }
		      sb.append(c1);
		    }
		    pageno=pageno-1;
		    String name =sb+"";
			name = "(industry_name:" + sb + ")";
//			name = "(industry_name:*)";	 
			resultPage.setPageNo(pageno+1);
			resultPage.setPageSize(pagesize);
			query.set("q", name);			

//			query.setFacet(true);// 设置facet=on
//			query.setFacetLimit(50);// 限制facet返回的数量
//			query.setFacetMissing(false);// 不统计null的值
//			query.setFacetMinCount(1);// 设置返回的数据中每个分组的数据最小值，比如设置为1，则统计数量最小为1，不然不显示
			// params.addSortField( "price", SolrQuery.ORDER.asc );
			query.setStart(pageno*pagesize);
			query.setRows(pagesize);
			// 设置高亮
			query.setHighlight(true);// 开启高亮组件
			query.addHighlightField("industry_name");// 高亮字段
			query.setHighlightSimplePre("<font color='red'>");// 标记，高亮关键字前缀
			query.setHighlightSimplePost("</font>");// 后缀
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
				if (numFound > 0) {
					DangerousServiceSearchResult[] services = new DangerousServiceSearchResult[pagesize];
					int i = 0;
					// 高亮显示的反回结果
			        Map<String, Map<String, List<String>>> maplist = response.getHighlighting();
					for (SolrDocument solrDocument : results) {
						services[i] = new DangerousServiceSearchResult();
						services[i].setId((String) solrDocument.getFieldValue("id"));
//						services[i].setProcName((String) solrDocument.get("proc_name"));
						Object oid = solrDocument.get("id");
			            Map<String, List<String>> fieldMap = maplist.get(oid);
			            if(conditions[0].equals("*")){
			            	services[i].setIndustryName((String) solrDocument.get("industry_name").toString());
			            }else{
			            	services[i].setIndustryName((String) fieldMap.get("industry_name").toString());
			            }		            
						services[i].setIndustryContent((String) solrDocument.getFieldValue("industry_content"));
						services[i].setIndustryOwner((String) solrDocument.getFieldValue("industry_owner"));
						services[i].setIndustryUser((String) solrDocument.getFieldValue("industry_user"));
						services[i].setIndustryType((String) solrDocument.getFieldValue("industry_type"));
						services[i].setIndustryStatus((String) solrDocument.getFieldValue("industry_status"));
						services[i].setRecordingTime((long) solrDocument.getFieldValue("recording_time"));
						services[i].setLastupdate((long) solrDocument.getFieldValue("last_update"));
						services[i].setVersion((String) solrDocument.getFieldValue("version"));
						i++;
					}
					resultPage.setPageEntities(services);
				}
				return resultPage;
			}
		}
		resultPage.setPageSize(pagesize);
		resultPage.setPageNo(pageno);
		resultPage.setAllEntitiesCount(0);
		resultPage.setAllPagesCount(0);
		resultPage.setPageIndex(0);
		return resultPage;
	}
}