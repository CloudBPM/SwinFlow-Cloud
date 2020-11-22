/**
 *
 */
package com.cloudibpm.eso.news;

import com.cloudibpm.core.admin.news.Comment;
import com.cloudibpm.core.admin.news.News;
import com.cloudibpm.core.admin.news.NewsStatus;
import com.cloudibpm.core.admin.news.SecondaryComment;
import com.mongodb.BasicDBObject;
import com.mongodb.WriteResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 *
 */
@Repository
public class OrgNewsEno {
    private final MongoTemplate nosqlTemplate;
    private final String collectionname = "news_and_trends";

    @Autowired
    public OrgNewsEno(MongoTemplate nosqlTemplate) {
        this.nosqlTemplate = nosqlTemplate;
    }

    /**
     *
     * @param news
     */
    public void insert(News news) {
        news.setLastUpdate(System.currentTimeMillis());
        nosqlTemplate.insert(news, collectionname);
    }

    /**
     * 需要根据当前页的信息进行查询 pageno : 当前页码 pagesize : 页大小
     *
     * @param pageno
     * @param pagesize
     * @return
     */
    public List<News> queryAll(int pageno, int pagesize) {
        long skipNews = (pageno - 1) * pagesize;
        // 这里的skip()还需要优化，当数据量增大以后，查询时间会变得很长--------------------------
        // 参考https://cnodejs.org/topic/559a0bf493cb46f578f0a601
        Query query = new Query().skip(skipNews).limit(pagesize);
        List<News> list = nosqlTemplate.find(query, News.class, collectionname);
        return list;
    }

    /**
     * 根据条件查询所有的新闻
     *
     * @param condition
     * @param pageindex
     * @param pagesize
     * @param organizationId
     * @param newsState
     * @return
     */
    public List<News> queryByCondition(String condition, int pageindex, int pagesize, String organizationId,
                                       int newsState) {
        Criteria title = Criteria.where("title").regex(condition);
        Criteria brief = Criteria.where("brief").regex(condition);
        Criteria author = Criteria.where("author").regex(condition);
        Criteria content = Criteria.where("content").regex(condition);
        Criteria publisher = Criteria.where("writerName").regex(condition);
        Criteria organizationName = Criteria.where("organizationName").regex(condition);
        Criteria organizationId1 = Criteria.where("organizationId").is(organizationId);
        Criteria status = Criteria.where("newsState").is(newsState);
        Criteria cr = new Criteria();
        Query query = null;
        if (newsState == 99) {
            query = new Query(cr.orOperator(title, content, publisher, organizationName, brief, author)
                    .andOperator(organizationId1));
        } else {
            query = new Query(cr.orOperator(title, content, publisher, organizationName, brief, author)
                    .andOperator(organizationId1, status));
        }
        query.with(new Sort(Direction.DESC, "lastUpdate"));// ASC升序，DESC降序
        // 这里的skip()还需要优化，当数据量增大以后，查询时间会变得很长--------------------------
        // 参考https://cnodejs.org/topic/559a0bf493cb46f578f0a601
        query.skip(pageindex).limit(pagesize);
        List<News> list = nosqlTemplate.find(query, News.class, collectionname);
        return list;
    }

    /**
     * 根据条件查询所有已发布的新闻
     *
     * @param pageindex
     * @param pagesize
     * @param newsState
     * @return
     */
    public List<News> queryByNewsState(int pageindex, int pagesize, int newsState) {
        if (newsState == 99) {
            Criteria status1 = Criteria.where("newsState").ne(0);
            Criteria status2 = Criteria.where("newsState").ne(3);
            Criteria status3 = Criteria.where("newsState").ne(4);
            Query query = new Query(status1.andOperator(status2, status3));
            query.with(new Sort(Direction.DESC, "lastUpdate"));// ASC升序，DESC降序
            // 这里的skip()还需要优化，当数据量增大以后，查询时间会变得很长--------------------------
            // 参考https://cnodejs.org/topic/559a0bf493cb46f578f0a601
            query.skip(pageindex).limit(pagesize);
            List<News> list = nosqlTemplate.find(query, News.class, collectionname);
            return list;
        } else { // newsState is 1 or 2
            Criteria status1 = Criteria.where("newsState").is(newsState);
            Query query = new Query(status1);
            query.with(new Sort(Direction.DESC, "lastUpdate"));// ASC升序，DESC降序
            // 这里的skip()还需要优化，当数据量增大以后，查询时间会变得很长--------------------------
            // 参考https://cnodejs.org/topic/559a0bf493cb46f578f0a601
            query.skip(pageindex).limit(pagesize);
            List<News> list = nosqlTemplate.find(query, News.class, collectionname);
            return list;
        }
    }

    /**
     * 根据条件查询所有已发布的新闻
     *
     * @param condition
     * @param pageindex
     * @param pagesize
     * @param newsState
     * @return
     */
    public List<News> queryByNewsState(String condition, int pageindex, int pagesize, int newsState) {
        if (newsState == 99) {
            Criteria title = Criteria.where("title").regex(condition);
            Criteria brief = Criteria.where("brief").regex(condition);
            Criteria author = Criteria.where("author").regex(condition);
            Criteria content = Criteria.where("content").regex(condition);
            Criteria publisher = Criteria.where("writerName").regex(condition);
            Criteria organizationName = Criteria.where("organizationName").regex(condition);
            Criteria status1 = Criteria.where("newsState").ne(0);
            Criteria status2 = Criteria.where("newsState").ne(3);
            Criteria status3 = Criteria.where("newsState").ne(4);
            Criteria cr = new Criteria();
            Query query = new Query(cr.orOperator(title, content, publisher, organizationName, brief, author)
                    .andOperator(status1, status2, status3));
            query.with(new Sort(Direction.DESC, "lastUpdate"));// ASC升序，DESC降序
            // 这里的skip()还需要优化，当数据量增大以后，查询时间会变得很长--------------------------
            // 参考https://cnodejs.org/topic/559a0bf493cb46f578f0a601
            query.skip(pageindex).limit(pagesize);
            List<News> list = nosqlTemplate.find(query, News.class, collectionname);

            return list;
        } else { // newsState is 1 or 2
            Criteria title = Criteria.where("title").regex(condition);
            Criteria brief = Criteria.where("brief").regex(condition);
            Criteria author = Criteria.where("author").regex(condition);
            Criteria content = Criteria.where("content").regex(condition);
            Criteria publisher = Criteria.where("writerName").regex(condition);
            Criteria organizationName = Criteria.where("organizationName").regex(condition);
            Criteria organizationId1 = Criteria.where("newsState").is(newsState);
            Criteria cr = new Criteria();
            Query query = new Query(cr.orOperator(title, content, publisher, organizationName, brief, author)
                    .andOperator(organizationId1));
            query.with(new Sort(Direction.DESC, "lastUpdate"));// ASC升序，DESC降序
            // 这里的skip()还需要优化，当数据量增大以后，查询时间会变得很长--------------------------
            // 参考https://cnodejs.org/topic/559a0bf493cb46f578f0a601
            query.skip(pageindex).limit(pagesize);
            List<News> list = nosqlTemplate.find(query, News.class, collectionname);
            return list;
        }
    }

    /**
     *
     * @param id
     * @return
     */
    public News queryById(String id) {
        News news = nosqlTemplate.findById(id, News.class, collectionname);
        return news;
    }

    /**
     *
     * <pre>
     * // 新闻动态标题
     * private String title = null;
     * // 简介
     * private String brief = null;
     * // 标题照片
     * private String titleImage = null;
     * // 原作者
     * private String author = null;
     * // 发表时间
     * private long publishDateTime = null;
     * // 新闻动态内容
     * private String content = null;
     * // 录入人ID
     * private String writerId = null;
     * // 录入人
     * private String writerName = null;
     * // 发布单位ID
     * private String organizationId = null;
     * // 发布单位名称
     * private String organizationName = null;
     * // 发布日期时间
     * private long lastUpdate;
     * // 新闻动态状态
     * private int newsState = NewsStatus.unpublished; // 默认为未发布状态
     * // 0: 新闻动态；1：消息快讯；2：资讯；3：公告；4：文献资料；5：广告；6：评论
     * private int newsCategory = 0;
     * // 新闻小类
     * private int newsClass = 0;
     * // 0: 公开发布的新闻动态，所有用户都可以看到，（对外动态）
     * // 1：组织内部的公开发布新闻动态，非组织内部职员无法看到，（内部动态）
     * // 2：组织内部个别圈子内发布的新闻动态，（内部参考）
     * private int accessLevel = 0;
     * // 新闻动态内容所附图片、视频、文档资料
     * private String attachments = null;
     * </pre>
     *
     * @param news
     */
    public void update(News news) {
        Query query = new Query(Criteria.where("id").is(news.getId()));
        Update update = new Update().set("title", news.getTitle()).set("brief", news.getBrief())
                .set("titleImage", news.getTitleImage()).set("author", news.getAuthor())
                .set("publishDateTime", news.getPublishDateTime()).set("content", news.getContent())
                .set("writerId", news.getWriterId()).set("writerName", news.getWriterName())
                .set("organizationId", news.getOrganizationId()).set("organizationName", news.getOrganizationName())
                .set("lastUpdate", news.getLastUpdate()).set("newsState", news.getNewsState())
                .set("newsCategory", news.getNewsCategory()).set("newsClass", news.getNewsClass())
                .set("accessLevel", news.getAccessLevel()).set("attachments", news.getAttachments());
        nosqlTemplate.updateFirst(query, update, News.class, collectionname);
    }


    public void updateNewsAttachments(String nid, String attahments) {
        Query query = new Query(Criteria.where("id").is(nid));
        Update update = new Update().set("attachments", attahments);
        nosqlTemplate.updateFirst(query, update, News.class, collectionname);
    }

    /**
     * 根据新闻的id修改状态
     *
     * @param newsId
     * @param newsStatus
     * @param lastUpdate
     */
    public void updateNewsStatusById(String newsId, int newsStatus, long lastUpdate) {
        Query query = new Query(Criteria.where("id").is(newsId));
        Update update = new Update().set("newsState", newsStatus).set("lastUpdate", lastUpdate);
        nosqlTemplate.updateFirst(query, update, News.class, collectionname);
    }

    /**
     * 根据id删除新闻
     *
     * @param id
     */
    public void delete(String id) {
        Query query = new Query(Criteria.where("id").is(id));
        nosqlTemplate.remove(query, News.class, collectionname);
    }

    /**
     * 根据组织id和新闻的状态查询新闻数量
     *
     * @param organizationId
     * @param newsState
     * @return
     */
    public long count(String organizationId, int newsState) {
        Criteria oid = Criteria.where("organizationId").is(organizationId);
        Criteria status = Criteria.where("newsState").is(newsState);
        Criteria cr = new Criteria();
        Query query = null;
        if (newsState == 99) { // 查询所有状态的新闻
            query = new Query(oid);
        } else {
            query = new Query(cr.andOperator(oid, status)); // 只查询某种状态的新闻
        }
        long count = nosqlTemplate.count(query, News.class, collectionname);
        return count;
    }

    /**
     * 根据新闻状态查询新闻数量
     *
     * @param newsState
     * @return
     */
    public long countByNewsState(int newsState) {
        if (newsState == 99) {
            Criteria status1 = Criteria.where("newsState").ne(0);
            Criteria status2 = Criteria.where("newsState").ne(3);
            Criteria status3 = Criteria.where("newsState").ne(4);
            Query query = new Query(status1.andOperator(status2, status3));
            long count = nosqlTemplate.count(query, News.class, collectionname);
            // long count = list.size();
            return count;
        } else {
            Query query = new Query(Criteria.where("newsState").is(newsState));
            long count = nosqlTemplate.count(query, News.class, collectionname);
            // long count = list.size();
            return count;
        }
    }

    /**
     * 根据新闻状态查询新闻数量
     *
     * @param newsState
     * @return
     */
    public long countPublishedCategorizedNews(int[] category, String[] accessRanges) {
        Criteria[] status1 = new Criteria[category.length];
        if (category.length > 0) {
            for (int i = 0; i < category.length; i++) {
                status1[i] = Criteria.where("newsCategory").is(category[i]);
            }
        }
        Criteria status2 = Criteria.where("newsState").is(NewsStatus.published);
        Query query = new Query(status2.orOperator(status1));
        long count = nosqlTemplate.count(query, News.class, collectionname);
        // long count = list.size();
        return count;
    }

    public List<News> queryPublishedCategorizedNews(int pageindex, int pagesize, int[] category, String[] accessRanges) {
        Criteria[] status1 = new Criteria[category.length];
        if (category.length > 0) {
            for (int i = 0; i < category.length; i++) {
                status1[i] = Criteria.where("newsCategory").is(category[i]);
            }
        }
        Criteria status2 = Criteria.where("newsState").is(NewsStatus.published);
        Query query = new Query(status2.orOperator(status1));
        query.with(new Sort(Direction.DESC, "lastUpdate"));// ASC升序，DESC降序
        // 这里的skip()还需要优化，当数据量增大以后，查询时间会变得很长--------------------------
        // 参考https://cnodejs.org/topic/559a0bf493cb46f578f0a601
        query.skip(pageindex).limit(pagesize);
        List<News> list = nosqlTemplate.find(query, News.class, collectionname);
        return list;
    }

    /**
     * 根据条件查询所有已发布的新闻数量
     *
     * @param condition
     * @param newsState
     * @return
     */
    public long countPublishedCategorizedNews(String condition, int category[], String[] accessRanges) {
        Criteria title = Criteria.where("title").regex(condition);
        Criteria brief = Criteria.where("brief").regex(condition);
        Criteria author = Criteria.where("author").regex(condition);
        Criteria content = Criteria.where("content").regex(condition);
        Criteria publisherName = Criteria.where("writerName").regex(condition);
        Criteria organizationName = Criteria.where("organizationName").regex(condition);
        Criteria[] status1 = new Criteria[category.length];
        if (category.length > 0) {
            for (int i = 0; i < category.length; i++) {
                status1[i] = Criteria.where("newsCategory").is(category[i]);
            }
        }
        Criteria newsState1 = Criteria.where("newsState").is(NewsStatus.published);
        Criteria cr = new Criteria();
        Query query = new Query(cr.orOperator(title, content, publisherName, organizationName, author, brief)
                .andOperator(newsState1).orOperator(status1));
        long count = nosqlTemplate.count(query, News.class, collectionname);
        return count;
    }

    /**
     *
     * @param condition
     * @param pageindex
     * @param pagesize
     * @param category
     * @param accessRanges
     * @return
     */
    public List<News> queryPublishedCategorizedNews(String condition, int pageindex, int pagesize,
                                                    int[] category, String[] accessRanges) {
        Criteria title = Criteria.where("title").regex(condition);
        Criteria brief = Criteria.where("brief").regex(condition);
        Criteria author = Criteria.where("author").regex(condition);
        Criteria content = Criteria.where("content").regex(condition);
        Criteria publisher = Criteria.where("writerName").regex(condition);
        Criteria organizationName = Criteria.where("organizationName").regex(condition);
        Criteria[] status2 = new Criteria[category.length];
        if (category.length > 0) {
            for (int i = 0; i < category.length; i++) {
                status2[i] = Criteria.where("newsCategory").is(category[i]);
            }
        }
        Criteria status1 = Criteria.where("newsState").is(NewsStatus.published);
        Criteria cr = new Criteria();
        Query query = new Query(cr.orOperator(title, content, publisher, organizationName, brief, author)
                .andOperator(status1).orOperator(status2));
        query.with(new Sort(Direction.DESC, "lastUpdate"));// ASC升序，DESC降序
        // 这里的skip()还需要优化，当数据量增大以后，查询时间会变得很长--------------------------
        // 参考https://cnodejs.org/topic/559a0bf493cb46f578f0a601
        query.skip(pageindex).limit(pagesize);
        List<News> list = nosqlTemplate.find(query, News.class, collectionname);
        return list;
    }

    /**
     * 根据条件查询新闻数量
     *
     * @param condition
     * @param organizationId
     * @param newsState
     * @return
     */
    public long countByCondition(String condition, String organizationId, int newsState) {
        Criteria title = Criteria.where("title").regex(condition);
        Criteria brief = Criteria.where("brief").regex(condition);
        Criteria author = Criteria.where("author").regex(condition);
        Criteria content = Criteria.where("content").regex(condition);
        Criteria publisherName = Criteria.where("writerName").regex(condition);
        Criteria organizationName = Criteria.where("organizationName").regex(condition);
        Criteria organizationId1 = Criteria.where("organizationId").is(organizationId);
        Criteria status = Criteria.where("newsState").is(newsState);
        Criteria cr = new Criteria();
        Query query = null;
        if (newsState == 99) {
            query = new Query(cr.orOperator(title, content, publisherName, organizationName, author, brief)
                    .andOperator(organizationId1));
        } else {
            query = new Query(cr.orOperator(title, content, publisherName, organizationName, author, brief)
                    .andOperator(organizationId1, status));
        }
        long count = nosqlTemplate.count(query, News.class, collectionname);
        return count;
    }

    /**
     * 根据条件查询所有已发布的新闻数量
     *
     * @param condition
     * @param newsState
     * @return
     */
    public long countByNewsState(String condition, int newsState) {
        if (newsState == 99) {
            Criteria title = Criteria.where("title").regex(condition);
            Criteria brief = Criteria.where("brief").regex(condition);
            Criteria author = Criteria.where("author").regex(condition);
            Criteria content = Criteria.where("content").regex(condition);
            Criteria publisherName = Criteria.where("writerName").regex(condition);
            Criteria organizationName = Criteria.where("organizationName").regex(condition);
            Criteria status1 = Criteria.where("newsState").ne(0);
            Criteria status2 = Criteria.where("newsState").ne(3);
            Criteria status3 = Criteria.where("newsState").ne(4);
            Criteria cr = new Criteria();
            Query query = new Query(cr.orOperator(title, content, publisherName, organizationName, author, brief)
                    .andOperator(status1, status2, status3));
            long count = nosqlTemplate.count(query, News.class, collectionname);
            return count;
        } else {
            Criteria title = Criteria.where("title").regex(condition);
            Criteria brief = Criteria.where("brief").regex(condition);
            Criteria author = Criteria.where("author").regex(condition);
            Criteria content = Criteria.where("content").regex(condition);
            Criteria publisherName = Criteria.where("writerName").regex(condition);
            Criteria organizationName = Criteria.where("organizationName").regex(condition);
            Criteria newsState1 = Criteria.where("newsState").is(newsState);
            Criteria cr = new Criteria();
            Query query = new Query(cr.orOperator(title, content, publisherName, organizationName, author, brief)
                    .andOperator(newsState1));
            long count = nosqlTemplate.count(query, News.class, collectionname);
            return count;
        }
    }

    /**
     * 添加一条评论
     *
     * @param newsId  	新闻ID
     * @param comment	评论对象
     * @return
     */
    public void insertComment(String newsId, Comment comment){
        Query query = new Query(Criteria.where("_id").is(newsId));
        Update update = new Update();
        update.push("comments",comment);
        nosqlTemplate.upsert(query, update, News.class, collectionname);
    }

    /**
     * 添加一条二级评论
     *
     * @param newsId  	新闻ID
     * @param comment	评论对象
     * @return
     */
    public void insertSecondaryComment(String newsId, String commentId,SecondaryComment secondaryComment){
        Query query = new Query(new Criteria().andOperator(Criteria.where("_id").is(newsId),
                Criteria.where("comments").elemMatch(Criteria.where("commentId").is(commentId))));
        Update update = new Update();
        update.addToSet("comments.$.twoComments",secondaryComment);
        nosqlTemplate.upsert(query, update, News.class, collectionname);
    }

    /**
     * 删除一条评论
     *
     * @param newsId  	文章ID
     * @param commentId	评论ID
     * @return
     */
    public void delComment(String newsId, String commentId){
        Query query = new Query(Criteria.where("_id").is(newsId));
        Update update = new Update();
        BasicDBObject basicDBObject = new BasicDBObject();
        basicDBObject.put("commentId",commentId);
        update.pull("comments",basicDBObject);
        nosqlTemplate.updateFirst(query,update,News.class,collectionname);
    }

    /**
     * 删除一条二级评论
     *
     * @param newsId  	文章ID
     * @param commentId	评论ID
     * @return
     */
    public void delSecondaryComment(String newsId, String commentId, String secondaryCommentId){
        Query query = new Query(new Criteria().andOperator(Criteria.where("_id").is(newsId),
                Criteria.where("comments").elemMatch(Criteria.where("commentId").is(commentId))));
        Update update = new Update();
        BasicDBObject basicDBObject = new BasicDBObject();
        basicDBObject.put("commentId",secondaryCommentId);
        update.pull("comments.$.twoComments",basicDBObject);
        nosqlTemplate.updateFirst(query,update,News.class,collectionname);
    }
}