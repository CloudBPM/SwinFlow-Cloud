package com.cloudibpm.eso.update;

import com.model.AppUpdate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Dahai Cao last updated at 21:08 on 2019-03-03
 */
@Repository
public class AppUpdateEno {
	private final MongoTemplate nosqlTemplate;
	private final String collectionname = "mobile_app_version";

	@Autowired
	public AppUpdateEno(MongoTemplate nosqlTemplate) {
		this.nosqlTemplate = nosqlTemplate;
	}

	/*
	 * 插入一条记录
	 */
	public void insert(final AppUpdate appUpdate) {
		nosqlTemplate.save(appUpdate, collectionname);
	}

	//取最后一条上架的app的信息
	public AppUpdate queryLastUpdate(String appName) {
//		Criteria name = Criteria.where("appName").is(appName);
//		Criteria online = Criteria.where("online").is(1);
//		Query query = new Query(name.andOperator(online));
//		query.with(new Sort(Sort.Direction.DESC, "updateTime"));// ASC升序，DESC降序
//		query.limit(1);
//		if (notes.isEmpty()) {
//			return null;
//		} else if (notes.size() > 0) {
//			// list contains exactly 1 element
//			return notes.get(0);
//		}
		Query query=new Query(Criteria.where("appName").is(appName).and("online").is(1)).with(new Sort(Sort.Direction.DESC,"updateTime")).limit(1);
		List<AppUpdate> list = nosqlTemplate.find(query, AppUpdate.class, collectionname);
		if(list!=null&&list.size()>0){
			return list.get(0);
		}
		return null;
	}

}
