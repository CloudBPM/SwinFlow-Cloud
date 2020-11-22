package com.cloudibpm.core.solr;

import org.apache.solr.client.solrj.SolrClient;
import org.apache.solr.client.solrj.SolrServerException;
import org.apache.solr.client.solrj.impl.HttpSolrClient;

import java.io.IOException;

/**
 * This is just a sample for insert a index into Solr.
 * 
 * 关于Solr安装的文档： http://www.jcold.com/blog/3.html
 * 
 * 使用Java操作Solr实现增、删和查询数据
 * http://crazyhoney.github.io/2016/04/27/%E4%BD%BF%E7%94%A8Java%E6%93%8D%E4%BD%
 * 9CSolr%E5%AE%9E%E7%8E%B0%E5%A2%9E%E3%80%81%E5%88%A0%E5%92%8C%E6%9F%A5%E8%AF%
 * A2%E6%95%B0%E6%8D%AE/
 * 
 * Solr 6.0 学习（二）创建core并插入索引
 * http://www.voidcn.com/blog/upxiaofeng/article/p-5972329.html
 * 
 * solr教程，值得刚接触搜索开发人员一看 http://blog.csdn.net/awj3584/article/details/16963525
 * Solr 以及MYSQL数据库集成 http://www.luoshengsha.com/245.html
 * http://blog.csdn.net/upxiaofeng/article/details/51426401
 * http://www.cnblogs.com/luxiaoxun/p/4442770.html
 * https://blog.fliaping.com/how-to-import-data-from-mysql-by-using-solr-
 * dataimporthandler/ http://microe.blog.51cto.com/3332651/1606717
 * http://blog.csdn.net/u010942465/article/details/51339970
 * http://www.cnblogs.com/liaidai/p/4906714.html
 * 
 * @author Dahai Cao
 *
 */
public class InsertProgarm {
	// solr 服务器地址
	public static final String solrServerUrl = "http://101.200.154.42:8983/solr";
	// solrhome下的core
	public static final String solrCroeHome = "xqappcore";
	// 待索引、查询字段
	public static String[] docs = { "Solr是一个独立的企业级搜索应用服务器", "它对外提供类似于Web-service的API接口", "用户可以通过http请求",
			"向搜索引擎服务器提交一定格式的XML文件生成索引", "也可以通过Http Get操作提出查找请求", "并得到XML格式的返回结果" };

	public static void main(String[] args) {
		HttpSolrClient.Builder builder = new HttpSolrClient.Builder(solrServerUrl + "/" + solrCroeHome);
		SolrClient client = builder.build();
		//int i = 0;
//		List<SolrInputDocument> solrDocs = new ArrayList<SolrInputDocument>();
//		// for (String content : docs) {
//		SolrInputDocument doc = new SolrInputDocument();
//
//		doc.addField("id", "000000003");
//		doc.addField("app_name", "我的第三个微服务：身份证验证查询");
//		doc.addField("keywords", "Web,应用,服务等");
//		doc.addField("access_type", "1");
//		doc.addField("comments", "该应用提供公共的身份证查询，该应用来自公安部门。");
//		doc.addField("password", "N");
//		doc.addField("price", 3.00);
//		doc.addField("create_time", new Date());
//		doc.addField("last_update", new Date());
//		doc.addField("owner", "北京海量流程科技有限公司");
//		solrDocs.add(doc);
//		
//		doc = new SolrInputDocument();
//		doc.addField("id", "000000004");
//		doc.addField("app_name", "我的第三个微服务：工商管理社会统一信用代码查询");
//		doc.addField("keywords", "Web,应用,服务等");
//		doc.addField("access_type", "2");
//		doc.addField("comments", "该应用提供公共的社会企业的工商社会统一信用代码查询服务。");
//		doc.addField("password", "Y");
//		doc.addField("price", 5.00);
//		doc.addField("create_time", new Date());
//		doc.addField("last_update", new Date());
//		doc.addField("owner", "北京海量流程科技有限公司");
//		solrDocs.add(doc);
		
		// }
		try {
			client.deleteById("00000000000002En");
			//client.add(solrDocs);
			client.commit();
		} catch (SolrServerException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}

//		try {
//			AppServiceSearchResultPage p = AppServiceSolrUtils.search(new String[]{"第", "北京"}, 0, 30);
//		} catch (SolrServerException e) {
//			e.printStackTrace();
//		} catch (IOException e) {
//			e.printStackTrace();
//		}
	}

}
