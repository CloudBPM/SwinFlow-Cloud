/**
 * 
 */
package com.cloudibpm.eso.news;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.SQLException;

/**
 * 本系统现在在用的是Spring framework封装后的MongoDB访问接口，
 * 这个类是用原生的MongoDB的接口来访问。
 * 之所以保留该类在系统中，是要向大家展示，用原生接口来访问是什么样的。
 *
 * for more information, please further refer to:
 * https://blog.csdn.net/ruishenh/article/details/12842331
 * https://www.jianshu.com/p/dd7b5a0e2f64
 * @author xq0002
 * 
 */
@Repository
public class NewsEno {
	private final JdbcTemplate jdbcTemplate;

	@Autowired
	public NewsEno(JdbcTemplate jdbcTemplate) {
		this.jdbcTemplate = jdbcTemplate;
	}

	public void insert(final Object ro) throws SQLException {


		//nosqlTemplate.createCollection("news");

	

	
	
	/*public Collection<News> queryAll(String fk_parent, String fk_owner)
	throws Exception {
		spendtime = System.currentTimeMillis();
		
		String newsName = mongoTemplate.getCollectionName(News.class);
		
		String jsonSql = "{distinct:'news',key:'title'}";
		CommandResult commandResult = mongoTemplate.executeCommand(jsonSql);
		System.out.println();
		BasicDBList list = (BasicDBList)commandResult.get("values");
		  for (int i = 0; i < list.size(); i++) {
			  System.out.println(list.get(i));
		  }
		System.out.println();
		
		//find Query query = new Query();
		final Query query =new Query();
	       Criteria criteria =new Criteria();
	       criteria.and("title").is("我的新闻");
	       mongoTemplate.executeQuery(query,"news",new DocumentCallbackHandler() {
	           //处理自己的逻辑，这种为了有特殊需要功能的留的开放接口命令模式
	           public void processDocument(DBObject dbObject) throws MongoException,
	                  DataAccessException {
	              mongoTemplate.updateFirst(query, Update.update("title","我的新闻题目"),"news");
	           }
	        });
	      

//	       News news=mongoTemplate.execute(new DbCallback<News>() {
//           public News doInDB(DB db)throws MongoException, DataAccessException {
//              News n=new News();
//              //自己写逻辑和查询处理
//              n.setId(id);
//              n.setTitle(title);
//              n.setContent(content);
//              n.setPushisher(pushisher);
//              n.setDate(date);
//              return n;
//           }
//       });
	   

	       News news=mongoTemplate.execute(News.class,new CollectionCallback<News>() {
           public News doInCollection(DBCollection collection)
                  throws MongoException, DataAccessException {
        	   News n=new News();
              //自己取值然后处理返回对应的处理  collection.find();
        	   n.setId(id);
               n.setTitle(title);
               n.setContent(content);
               n.setPushisher(pushisher);
               n.setDate(date);
               return n;
           }
       });
	       
	    DBCollection collection=mongoTemplate.getCollection("news");
	    //MongoCollection<Document> collection = mongoDatabase.getCollection("news");

	    mongoTemplate.findAll(News.class);
	    mongoTemplate.findAll(News.class,"news");
		

		logger.info((System.currentTimeMillis() - spendtime) + "ms");
		

}*/

	}
}
