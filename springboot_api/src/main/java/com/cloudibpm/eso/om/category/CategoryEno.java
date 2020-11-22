/**
 * 
 */
package com.cloudibpm.eso.om.category;

import com.cloudibpm.core.category.Category;
import com.cloudibpm.core.ui.mobile.MobileUI;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Repository;

import java.sql.SQLException;
import java.util.List;

/**
 * @author Dahai Cao created at 20:52 on 2018-11-02; last updated at 20:27 on 2018-03-06
 *
 */
@Repository
public class CategoryEno {
	private final MongoTemplate nosqlTemplate;
	private final String collectionname = "work_permission";

	@Autowired
	public CategoryEno(MongoTemplate nosqlTemplate) {
		this.nosqlTemplate = nosqlTemplate;
	}

	/**
	 * Insert a new reference into repository. This method will insert or update
	 * values into all fields of fm_reference.
	 *
	 * @param cate
	 *            Category
	 * @throws SQLException
	 */
	public void insert(final Category cate) throws SQLException {
		nosqlTemplate.insert(cate, collectionname);
	}

	public void update(final Category cate) throws SQLException {
		nosqlTemplate.save(cate, collectionname);
	}

	public void update(String categoryId, String parent,
					   String root_catgoryId, String assign_catgoryId) throws SQLException {
		Query query = new Query(Criteria.where("id").is(categoryId));
		Update update = new Update().set("parent", parent).set("rootCategoryId", root_catgoryId)
				.set("assignCategoryId", assign_catgoryId);
		nosqlTemplate.updateFirst(query, update, Category.class, collectionname);
	}

	public void updateName(String cateId, String newname, long lastupdate) throws SQLException {
		Query query = new Query(Criteria.where("id").is(cateId));
		Update update = new Update().set("name", newname).set("lastupdate", lastupdate);
		nosqlTemplate.updateFirst(query, update, Category.class, collectionname);
	}

	public List<Category> queryAllCategories(String parent, String owner) throws Exception {
		Criteria cparent = Criteria.where("parent").is(parent);
		Criteria cowner = Criteria.where("owner").is(owner);
		Criteria cr = new Criteria();
		Query query = new Query(cr.andOperator(cparent, cowner));
		List<Category> list = nosqlTemplate.find(query, Category.class, collectionname);
		return list;
	}

	public List<Category> queryAllCategoriesByIDs(String [] ids) throws Exception {
		Criteria[] status1 = new Criteria[ids.length];
		if (ids.length > 0) {
			for (int i = 0; i < ids.length; i++) {
				status1[i] = Criteria.where("id").is(ids[i]);
			}
		}
		Criteria cr = new Criteria();
		Query query = new Query(cr.orOperator(status1));
		List<Category> list = nosqlTemplate.find(query, Category.class, collectionname);
		return list;
	}

	public List<Category> queryAllCategoriesByType(String categoryType, String owner) throws Exception {
		Criteria oid = Criteria.where("categoryType").is(Integer.parseInt(categoryType));
		Criteria cname = Criteria.where("owner").is(owner);
		Criteria cr = new Criteria();
		Query query = new Query(cr.andOperator(oid, cname));
		List<Category> list = nosqlTemplate.find(query, Category.class, collectionname);
		return list;
	}

	public boolean existCategoryName(String name, String owner) throws Exception {
		Criteria oid = Criteria.where("owner").is(owner);
		Criteria cname = Criteria.where("name").is(name);
		Criteria cr = new Criteria();
		Query query = new Query(cr.andOperator(oid, cname));
		long count = nosqlTemplate.count(query, Category.class, collectionname);
		return count > 0 ? true : false;
	}

	public List<Category> queryAllCategories(String owner) throws Exception {
		Criteria oid = Criteria.where("owner").is(owner);
		Query query = new Query(oid);
		List<Category> list = nosqlTemplate.find(query, Category.class, collectionname);
		return list;
	}

	public Category queryByPk(String pk) throws Exception {
		Category news = nosqlTemplate.findById(pk, Category.class, collectionname);
		return news;
	}

	public void delete(final String categoryId) throws SQLException {
		Query query = new Query(Criteria.where("id").is(categoryId));
		nosqlTemplate.remove(query, Category.class, collectionname);
	}
	
	public void deleteChildren(final String categoryId) throws SQLException {
		Query query = new Query(Criteria.where("parent").is(categoryId));
		nosqlTemplate.remove(query, Category.class, collectionname);
	}

	public void updateCatetoryMbUIContent(String cateId, MobileUI mbuicontent, long lastupdate)
			throws SQLException {
		Query query = new Query(Criteria.where("id").is(cateId));
		Update update = new Update().set("mbUIContent", mbuicontent).set("lastupdate", lastupdate);
		nosqlTemplate.updateFirst(query, update, Category.class, collectionname);
	}
}