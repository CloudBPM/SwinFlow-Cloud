/**
 *
 */
package com.cloudibpm.eso.sysnotice;

import com.cloudibpm.core.admin.news.News;
import com.cloudibpm.core.sysnotice.SystemNotice;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.List;

/**
 * @author Dahai Cao created at 20:19 on 2018-10-11
 *
 */
@Repository
public class SystemNoticeEno {
    private final MongoTemplate nosqlTemplate;
    private final String collectionname = "system_message";

    @Autowired
    public SystemNoticeEno(MongoTemplate nosqlTemplate) {
        this.nosqlTemplate = nosqlTemplate;
    }

    public int insert(final SystemNotice note) throws Exception {
        nosqlTemplate.insert(note, collectionname);
        return 1;
    }

    public int update(final SystemNotice note) throws SQLException {
        nosqlTemplate.save(note, collectionname);
        return 1;
    }

    // this method is used to cancel the message from bulletin board
    public int updateStatus(final String pk_notice, final int liveStatus, final long lastupdate) throws SQLException {
        Query query = new Query(Criteria.where("id").is(pk_notice));
        Update update = new Update().set("liveStatus", liveStatus).set("lastupdate", lastupdate);
        nosqlTemplate.updateFirst(query, update, SystemNotice.class, collectionname);
        return 1;
    }

    public void updateAllLiveStatus(int liveStatus, String owner, long lastupdate) throws SQLException {
        Query query = new Query(Criteria.where("owner").is(owner));
        Update update = new Update().set("liveStatus", liveStatus).set("lastupdate", lastupdate);
        nosqlTemplate.updateFirst(query, update, SystemNotice.class, collectionname);
    }

    public void delete(String pk_notice) throws SQLException {
        Query query = new Query(Criteria.where("id").is(pk_notice));
        nosqlTemplate.remove(query, SystemNotice.class, collectionname);
    }

    public void deleteAll(String owner) throws SQLException {
        Query query = new Query(Criteria.where("owner").is(owner));
        nosqlTemplate.remove(query, SystemNotice.class, collectionname);
    }

    private SystemNotice getResultSet(final SystemNotice note, final ResultSet rs) throws SQLException {
        note.setId(rs.getString("Pk_Notice"));
        note.setName(rs.getString("NoticeTitle"));
        note.setPcContent(rs.getString("PCContent"));
        note.setMobileContent(rs.getString("MbContent"));
        note.setKeywords(rs.getString("Keywords"));
        note.setPublisherId(rs.getString("Fk_Publisher"));
        note.setPublisher(rs.getString("PublisherName"));
        note.setLiveStatus(rs.getInt("Live"));
        note.setCreateDatetime(rs.getTimestamp("CreateDatetime").getTime());
        note.setLastupdate(rs.getTimestamp("Lastupdate").getTime());
        note.setOrganizationName(rs.getString("OwnerName"));
        note.setOwner(rs.getString("Fk_Owner"));
        note.setBanned(rs.getInt("Banned"));
        Timestamp ts1 = rs.getTimestamp("BanStartTime");
        if (ts1 != null) {
            note.setBanStartTime(ts1.getTime());
        }
        Timestamp ts2 = rs.getTimestamp("BanEndTime");
        if (ts2 != null) {
            note.setBanEndTime(ts2.getTime());
        }
        note.setLevel(rs.getInt("NoticeLevel"));
        return note;
    }

    public SystemNotice queryLastLiveNotice() throws SQLException {
        Query query = new Query(Criteria.where("liveStatus").is(1));
        query.with(new Sort(Sort.Direction.DESC, "lastupdate"));// ASC升序，DESC降序
        // 这里的skip()还需要优化，当数据量增大以后，查询时间会变得很长--------------------------
        // 参考https://cnodejs.org/topic/559a0bf493cb46f578f0a601
        query.limit(1);
        List<SystemNotice> list = nosqlTemplate.find(query, SystemNotice.class, collectionname);
        if (!list.isEmpty()) {
            return list.get(0);
        }
        return null;
    }

    public List<SystemNotice> queryAllLiveNotices(String owner) throws SQLException {
        Query query = new Query(Criteria.where("owner").is(owner));
        query.with(new Sort(Sort.Direction.DESC, "lastupdate"));// ASC升序，DESC降序
        // 这里的skip()还需要优化，当数据量增大以后，查询时间会变得很长--------------------------
        // 参考https://cnodejs.org/topic/559a0bf493cb46f578f0a601
        query.limit(1);
        List<SystemNotice> list = nosqlTemplate.find(query, SystemNotice.class, collectionname);
        return list;
    }

    public int getAllNoteCounting(String owner) throws SQLException {
        Criteria cowner = Criteria.where("owner").is(owner);
        Query query = new Query(cowner); // 只查询某种状态的新闻
        long count = nosqlTemplate.count(query, SystemNotice.class, collectionname);
        return Integer.parseInt(String.valueOf(count));
    }

    public List<SystemNotice> queryAll(String owner, int firstrow, int pagesize) throws SQLException {
        Criteria status2 = Criteria.where("owner").is(owner);
        Query query = new Query(status2);
        // 这里的skip()还需要优化，当数据量增大以后，查询时间会变得很长--------------------------
        // 参考https://cnodejs.org/topic/559a0bf493cb46f578f0a601
        query.skip(firstrow).limit(pagesize);
        List<SystemNotice> list = nosqlTemplate.find(query, SystemNotice.class, collectionname);
        return list;
    }

    public int getAllNoteCounting(String condition, String owner) throws SQLException {
        //String c = "%" + StringEscapeUtils.escapeSql(condition) + "%";
        Criteria title = Criteria.where("name").regex(condition);
        Criteria brief = Criteria.where("pcContent").regex(condition);
        Criteria author = Criteria.where("mobileContent").regex(condition);
        Criteria content = Criteria.where("keywords").regex(condition);
        Criteria publisherName = Criteria.where("organizationName").regex(condition);
        Criteria organizationName = Criteria.where("publisher").regex(condition);

        Criteria newsState1 = Criteria.where("owner").is(owner);
        Criteria cr = new Criteria();
        Query query = new Query(cr.orOperator(title, content, publisherName, organizationName, author, brief)
                .andOperator(newsState1));
        long count = nosqlTemplate.count(query, News.class, collectionname);
        return Integer.parseInt(String.valueOf(count));
    }

    public List<SystemNotice> queryAll(String condition, String owner, int firstrow, int pagesize)
            throws SQLException {
        Criteria title = Criteria.where("name").regex(condition);
        Criteria brief = Criteria.where("pcContent").regex(condition);
        Criteria author = Criteria.where("mobileContent").regex(condition);
        Criteria content = Criteria.where("keywords").regex(condition);
        Criteria publisherName = Criteria.where("organizationName").regex(condition);
        Criteria organizationName = Criteria.where("publisher").regex(condition);

        Criteria newsState1 = Criteria.where("owner").is(owner);
        Criteria cr = new Criteria();
        Query query = new Query(cr.orOperator(title, content, publisherName, organizationName, author, brief)
                .andOperator(newsState1));
        List<SystemNotice> list = nosqlTemplate.find(query, SystemNotice.class, collectionname);
        return list;
    }

}
