package com.cloudibpm.blo.news;

import com.cloudibpm.blo.release.log.ApproveForReleaseBlo;
import com.cloudibpm.core.admin.news.Comment;
import com.cloudibpm.core.admin.news.News;
import com.cloudibpm.core.admin.news.NewsListPage;
import com.cloudibpm.core.admin.news.SecondaryComment;
import com.cloudibpm.core.organization.Organization;
import com.cloudibpm.core.repository.BusinessLogicObject;
import com.cloudibpm.eso.news.OrgNewsEno;
import com.cloudibpm.eso.om.organization.WfOrganizationEso;
import org.apache.commons.lang3.StringUtils;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
//@Transactional
public class OrgNewsBlo extends BusinessLogicObject {
	private final OrgNewsEno newsEno;
	private final OrgNewsEno orgNewsEno;
	private final ApproveForReleaseBlo approveForReleaseBlo;
	public WfOrganizationEso wfOrganizationEso = null;

	@Autowired
	public OrgNewsBlo(OrgNewsEno newsEno, OrgNewsEno orgNewsEno,
					  ApproveForReleaseBlo approveForReleaseBlo,
					  WfOrganizationEso wfOrganizationEso) {
		this.newsEno = newsEno;
		this.orgNewsEno = orgNewsEno;
		this.approveForReleaseBlo = approveForReleaseBlo;
		this.wfOrganizationEso = wfOrganizationEso;
	}


	public void createNews(News news) {
		newsEno.insert(news);
	}

	// public List<News> getAllNews() {
	// 
	// return newsEno.queryAll();
	// }

	// public List<News> getAllNews(String condition, int pageindex, int
	// pagesize) {
	// 
	// return newsEno.queryByCondition(condition, pageindex, pagesize);
	// }

	public void modify(News news) {
		newsEno.update(news);
	}

	/**
	 * 提交新闻申请发布
	 * 
	 * @param newsId
	 * @param status
	 * @param comment
	 * @param lastUpdate
	 * @param owner
	 * @param userId
	 * @param userfullname
	 * @param ownername
	 * @throws Exception
	 */
	
	public void submittingNewsForApproving(String newsId, int status, String comment, long lastUpdate, String owner,
			String userId, String userfullname, String ownername) throws Exception {
		newsEno.updateNewsStatusById(newsId, status, lastUpdate);
		News news = newsEno.queryById(newsId);
		Organization org = wfOrganizationEso.queryByPK(news.getOrganizationId());
		// 创建日志 Dahai Cao at 15:30 on 2018-10-18
		approveForReleaseBlo.createSubmittingApproveLog(newsId, "新闻动态", org.getId(), org.getName(),
				News.class.getSimpleName(), status, comment, lastUpdate, owner, userId, userfullname, ownername);
	}

	/**
	 * 审核新闻
	 * 
	 * @param newsId
	 * @param status
	 * @param comment
	 * @param lastUpdate
	 * @param owner
	 * @param userId
	 * @param userfullname
	 * @param ownername
	 * @throws Exception
	 */
	
	public void approveNews(String newsId, int status, String comment, long lastUpdate, String owner, String userId,
			String userfullname, String ownername) throws Exception {
		
		newsEno.updateNewsStatusById(newsId, status, lastUpdate);
		News news = newsEno.queryById(newsId);
		Organization org = wfOrganizationEso.queryByPK(news.getOrganizationId());

		// 创建日志 Dahai Cao at 15:30 on 2018-10-18
		approveForReleaseBlo.createApprovingLog(newsId, "新闻动态", org.getId(), org.getName(),
				News.class.getSimpleName(), status, comment, lastUpdate, owner, userId, userfullname, ownername);
	}

	// 根据id删除新闻
	public void removeById(String id) {
		
		newsEno.delete(id);
		approveForReleaseBlo.deleteLog(id);
	}

	public void removeOneAttachmentsById(String nid, String fid, String filename, String lastupdate) {
		
		News news = newsEno.queryById(nid);
		if (news != null) {
			String attachments = news.getAttachments();
			if (!StringUtils.isEmpty(attachments) && attachments.contains(filename)) {
				JSONArray attach = new JSONArray(attachments);
				if (attach.length() > 0) {
					for (int i = 0; i < attach.length(); i++) {
						JSONObject o = attach.getJSONObject(i);
						if (o.getString("id").equals(fid)) {
							attach.remove(i);
							break;
						}
					}
					if (attach.length() > 0) {
						newsEno.updateNewsAttachments(nid, attach.toString());
					} else {
						newsEno.updateNewsAttachments(nid, null);
					}
				}
			}
		}
	}

	// 根据id查找新闻
	public News queryById(String id) {
		
		return newsEno.queryById(id);
	}

	// public long count() {
	// 
	// return newsEno.count();
	// }

	public static void main(String[] args) throws Exception {
		// // 增
		// News news = new News();
		// news.setId(BuildtimeIDGenerator.getInstance().getNewRunTimeID());
		// news.setTitle("我的新闻部标题");
		// news.setContent("俄罗斯世界，屡次爆冷，墨西哥打败。敬请关注！");
		// news.setPushisher("曹大海");
		// news.setOrganizationName("杭州轩琦科技");
		// news.setLastupdate(System.currentTimeMillis());
		// System.out.println("插入成功");
		// OrgNewsBlo.getInstance().createNews(news);
		//
		// News news2 = new News();
		// news2.setId("333333");
		// news2.setTitle("我的新闻部标题");
		// news2.setContent("俄罗斯世界，屡次爆冷，墨西哥打败。敬请关注！");
		// news2.setPushisher("曹大海");
		// news2.setOrganizationName("杭州轩琦科技");
		// news2.setLastupdate(System.currentTimeMillis());
		// System.out.println("插入成功");
		// OrgNewsBlo.getInstance().createNews(news2);

		// 查
		// List<News> list = OrgNewsBlo.getInstance().getAllNews();
		// System.out.println(list.size());
		// for (int i=0;i<list.size();i++) {
		// News news1 = list.get(i);
		// System.out.println(news1.getId());
		// System.out.println(news1.getTitle());
		// System.out.println(news1.getContent());
		// System.out.println(news1.getNewsState());
		// System.out.println(news1.getOrganizationName());
		// System.out.println("chaxun");
		// }
		// System.out.println("//-------------------------------------------------------");
		////
		// // 根据条件查询
		// List<News> listByCondition =
		// OrgNewsBlo.getInstance().getAllNews("我的", 2, 3);
		// System.out.println(listByCondition.size());
		// for (int i=0;i<listByCondition.size();i++) {
		// News news1 = listByCondition.get(i);
		// System.out.println(news1.getId());
		// System.out.println(news1.getTitle());
		// System.out.println(news1.getContent());
		// System.out.println(news1.getPushisher());
		// System.out.println(news1.getOrganizationName());
		// System.out.println("chaxun");
		// }

		// 改
		// News news = new News();
		// news.setId("111111111");
		// news.setTitle("我的新闻我的标题");
		// OrgNewsBlo.getInstance().updateStateByid("000000000000000000000000000001c4",
		// "1");
		// System.out.println("修改状态");

		// 删
		// News news3 = new News();
		// news3.setId("22222");
		// OrgNewsBlo.getInstance().removeById(news3.getId());
		// News news4 = new News();
		// news4.setId("3333");
		// OrgNewsBlo.getInstance().removeById(news4.getId());
		// News news5 = new News();
		// news5.setId("333333");
		// OrgNewsBlo.getInstance().removeById(news5.getId());

		// long count = OrgNewsBlo.getInstance().count();
		// System.out.println("数量");
		// System.out.println(count);
		//
		//
	}

	/**
	 * 来源于OrganizationBlo.java
	 * 
	 * @author sunjian 20180725
	 * @param condition
	 *            search condition
	 * @param pageno
	 *            page number当前页码
	 * @param pagesize
	 *            page size每一页包含的数据条数
	 * @param organizationId
	 *            organizationId 组织的id
	 * @param newsState
	 *            newsState 新闻的状态
	 * @return OrgnizationListPage
	 * @throws Exception
	 */
	public NewsListPage searchNews(String condition, int pageno, int pagesize, String organizationId, int newsState)
			throws Exception {
		
		NewsListPage page = new NewsListPage(pageno, pagesize);
		long total = 0L;
		total = orgNewsEno.count(organizationId, newsState);
		if (total == 0L) {
			page.setPageSize(pagesize);
			page.setPageNo(1);
			page.setAllEntitiesCount(0);
			page.setAllPagesCount(0);
			page.setPageIndex(0);
		} else {
			page.setPageSize(pagesize);
			if (condition == null || condition.equals("")) {
				condition = "";
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
				List<News> newsList = orgNewsEno.queryByCondition(condition, pageindex, pagesize, organizationId,
						newsState); // 查询所有的新闻
				page.setPageEntities(newsList.toArray(new News[newsList.size()]));
			} else {
				total = orgNewsEno.countByCondition(condition, organizationId, newsState); // 根据条件查询数量
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
					List<News> newsList = orgNewsEno.queryByCondition(condition, pageindex, pagesize, organizationId,
							newsState);// 按条件查询新闻
					page.setPageEntities(newsList.toArray(new News[newsList.size()]));
				}

			}
		}

		return page;
	}

	/**
	 * 来源于OrganizationBlo.java
	 * 
	 * @author sunjian 20180725
	 * @param condition
	 *            search condition
	 * @param pageno
	 *            page number当前页码
	 * @param pagesize
	 *            page size每一页包含的数据条数
	 * @param newsState
	 *            newsState 新闻的状态
	 * @return OrgnizationListPage
	 * @throws Exception
	 */
	public NewsListPage searchAllPublishedNews(String condition, int pageno, int pagesize, int newsState)
			throws Exception {
		
		NewsListPage page = new NewsListPage(pageno, pagesize);
		long total = orgNewsEno.countByNewsState(newsState);
		if (total == 0L) {
			page.setPageSize(pagesize);
			page.setPageNo(1);
			page.setAllEntitiesCount(0);
			page.setAllPagesCount(0);
			page.setPageIndex(0);
		} else {
			page.setPageSize(pagesize);
			if (condition == null || condition.equals("")) {
				condition = "";
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
				List<News> newsList = orgNewsEno.queryByNewsState(pageindex, pagesize, newsState); // 查询所有的新闻
				page.setPageEntities(newsList.toArray(new News[newsList.size()]));
			} else {
				total = orgNewsEno.countByNewsState(condition, newsState); // 根据条件查询数量
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
					List<News> newsList = orgNewsEno.queryByNewsState(condition, pageindex, pagesize, newsState);// 按条件查询新闻
					page.setPageEntities(newsList.toArray(new News[newsList.size()]));
				}

			}
		}
		return page;
	}


	/**
	 * 来源于OrganizationBlo.java
	 *
	 * @author sunjian 20180725
	 * @param condition
	 *            search condition
	 * @oaram catory
	 *            新闻分类 0: 新闻动态；1：消息快讯；2：资讯；3：公告；4：文献资料；5：广告；6：评论
	 * @param accessRanges
	 *            组织/部门/分类ID的数组
	 * @param pageno
	 *            page number当前页码
	 * @param pagesize
	 *            page size每一页包含的数据条数
	 * @param newsState
	 *            newsState 新闻的状态
	 * @return OrgnizationListPage
	 * @throws Exception
	 */
	public NewsListPage searchAllPublishedNews(String condition,  int [] catory,
											   String [] accessRanges, int pageno,
											   int pagesize) throws Exception {
		NewsListPage page = new NewsListPage(pageno, pagesize);
		long total = orgNewsEno.countPublishedCategorizedNews(catory, accessRanges);
		if (total == 0L) {
			page.setPageSize(pagesize);
			page.setPageNo(1);
			page.setAllEntitiesCount(0);
			page.setAllPagesCount(0);
			page.setPageIndex(0);
		} else {
			page.setPageSize(pagesize);
			if (condition == null || condition.equals("")) {
				condition = "";
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
				List<News> newsList = orgNewsEno.queryPublishedCategorizedNews(
						pageindex, pagesize, catory, accessRanges); // 查询所有的新闻
				page.setPageEntities(newsList.toArray(new News[newsList.size()]));
			} else {
				total = orgNewsEno.countPublishedCategorizedNews(condition, catory, accessRanges); // 根据条件查询数量
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
					List<News> newsList = orgNewsEno.queryPublishedCategorizedNews(condition, pageindex,
							pagesize, catory, accessRanges);// 按条件查询新闻
					page.setPageEntities(newsList.toArray(new News[newsList.size()]));
				}

			}
		}
		return page;
	}

	/**
	 * 添加一条评论
	 *
	 * @param newsId  新闻ID
	 * @param comment 评论对象
	 * @return
	 */
	public void insertComment(String newsId, Comment comment){
		orgNewsEno.insertComment(newsId,comment);
	}

	/**
	 * 添加一条二级条评论
	 *
	 * @param newsId  新闻ID
	 * @param comment 评论对象
	 * @return
	 */
	public void insertSecondaryComment(String newsId, String commentId,SecondaryComment secondaryComment){
		orgNewsEno.insertSecondaryComment(newsId,commentId,secondaryComment);
	}

	/**
	 * 删除一条评论
	 *
	 * @param newsId  	文章ID
	 * @param commentId	评论ID
	 * @return
	 */
	public void delComment(String newsId, String commentId){
		orgNewsEno.delComment(newsId, commentId);
	}

	/**
	 * 删除一条二级评论
	 *
	 * @param newsId  	文章ID
	 * @param commentId	评论ID
	 * @return
	 */
	public void delSecondaryComment(String newsId, String commentId, String secondaryCommentId){
		orgNewsEno.delSecondaryComment(newsId, commentId, secondaryCommentId);
	}

}
