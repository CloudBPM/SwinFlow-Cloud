/**
 *
 */
package com.cloudibpm.eso.release.log;

import com.cloudibpm.core.admin.log.approval.SubmittingApprovalLog;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * @author Dahai Cao created at 8:21 on 2018-10-18
 *
 */
@Repository
public class ApproveForReleaseEno {
    private final MongoTemplate nosqlTemplate;

    @Autowired
    public ApproveForReleaseEno(MongoTemplate nosqlTemplate) {
        this.nosqlTemplate = nosqlTemplate;
    }


    /**
     *
     */
    public void insert(SubmittingApprovalLog submitlog) {

        submitlog.setCreateTimeStamp(System.currentTimeMillis());
        nosqlTemplate.insert(submitlog, "approval_history");

    }

    /**
     * 根据id删除日志
     *
     * @param id
     */
    public void delete(String id) {

        Query query = new Query(Criteria.where("objectId").is(id));
        nosqlTemplate.remove(query, SubmittingApprovalLog.class, "approval_history");

    }

    public long countLogs(String objectId) {

        Criteria oid = Criteria.where("objectId").is(objectId);
        Query query = new Query(oid);
        long count = nosqlTemplate.count(query, SubmittingApprovalLog.class, "approval_history");

        return count;
    }

    public List<SubmittingApprovalLog> queryLogs(int pageindex, int pagesize, String objectId) {

        Criteria id = Criteria.where("objectId").is(objectId);
        Query query = new Query(id);
        query.with(new Sort(Direction.DESC, "createTimeStamp"));// ASC升序，DESC降序
        // 这里的skip()还需要优化，当数据量增大以后，查询时间会变得很长--------------------------
        // 参考https://cnodejs.org/topic/559a0bf493cb46f578f0a601
        query.skip(pageindex).limit(pagesize);
        List<SubmittingApprovalLog> list = nosqlTemplate.find(query, SubmittingApprovalLog.class, "approval_history");

        return list;
    }

    public long countLogsByCondition(String condition, String objectId) {

        Criteria objectName = Criteria.where("objectName").regex(condition);
        Criteria comment = Criteria.where("comment").regex(condition);
        Criteria userFullName = Criteria.where("userFullName").regex(condition);
        Criteria position = Criteria.where("position").regex(condition);
        Criteria orgName = Criteria.where("orgName").regex(condition);
        Criteria id = Criteria.where("objectId").is(objectId);
        Criteria cr = new Criteria();
        Query query = new Query(cr.orOperator(objectName, comment, userFullName, position, orgName).andOperator(id));
        long count = nosqlTemplate.count(query, SubmittingApprovalLog.class, "approval_history");

        return count;
    }

    public List<SubmittingApprovalLog> queryLogsByCondition(String condition, int pageindex, int pagesize,
                                                            String objectId) {

        Criteria objectName = Criteria.where("objectName").regex(condition);
        Criteria comment = Criteria.where("comment").regex(condition);
        Criteria userFullName = Criteria.where("userFullName").regex(condition);
        Criteria position = Criteria.where("position").regex(condition);
        Criteria orgName = Criteria.where("orgName").regex(condition);
        Criteria id = Criteria.where("objectId").is(objectId);
        Criteria cr = new Criteria();
        Query query = new Query(cr.orOperator(objectName, comment, userFullName, position, orgName).andOperator(id));
        query.with(new Sort(Direction.DESC, "createTimeStamp"));// ASC升序，DESC降序
        // 这里的skip()还需要优化，当数据量增大以后，查询时间会变得很长--------------------------
        // 参考https://cnodejs.org/topic/559a0bf493cb46f578f0a601
        query.skip(pageindex).limit(pagesize);
        List<SubmittingApprovalLog> list = nosqlTemplate.find(query, SubmittingApprovalLog.class, "approval_history");

        return list;
    }

}
