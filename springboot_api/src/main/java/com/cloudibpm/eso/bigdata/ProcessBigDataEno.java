package com.cloudibpm.eso.bigdata;

import com.cloudibpm.core.admin.news.News;
import com.cloudibpm.core.runtime.wfprocess.WfProcessInstance;
import com.xq.paas.core.bigdata.report.ReportField;
import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

/**
 * @author Dahai Cao created at 16:04 on 2019-02-21
 * @author Dahai Cao created on 2018-03-21
 * https://segmentfault.com/a/1190000005829384
 * https://blog.csdn.net/congcong68/article/details/47183209
 */
@Repository
public class ProcessBigDataEno {
    private final MongoTemplate nosqlTemplate;
    private final String collectionname = "process_instance";

    @Autowired
    public ProcessBigDataEno(MongoTemplate nosqlTemplate) {
        this.nosqlTemplate = nosqlTemplate;
    }

    /**
     * @param id process instance Id
     * @return
     */
    public void delete(String id) {
        Query query = new Query(Criteria.where("id").is(id));
        this.nosqlTemplate.remove(query, WfProcessInstance.class, collectionname);
    }

    /**
     * @param id
     * @return
     */
    public WfProcessInstance queryById(String id) {
        WfProcessInstance pi = nosqlTemplate.findById(id, WfProcessInstance.class, collectionname);
        return pi;
    }

    public WfProcessInstance queryInstance(String piid) throws Exception {
        return nosqlTemplate.findById(piid, WfProcessInstance.class, collectionname);
    }

    public List<WfProcessInstance> queryCompletedInstances(
            String condition, String[] versions, ReportField[] fields) throws Exception {
        Criteria c0 = new Criteria();
        Criteria [] c01 = new Criteria[versions.length];
        if (versions.length > 0) {
            for (int i = 0; i < versions.length; i++) {
                c01[i] = Criteria.where("version").is(versions[i]);
            }
        }
        c0.orOperator(c01);
        Criteria[] c1 = new Criteria[fields.length];
        if (fields.length > 0) {
            for (int i = 0; i < fields.length; i++) {
                c1[i] = Criteria.where("children.definitionId").is(fields[i].getId());
            }
        }
        Query query = new Query(c0.andOperator(c1)); // 只查询某种状态的新闻
        List<WfProcessInstance> l = nosqlTemplate.find(query, WfProcessInstance.class, collectionname);
        return l;
    }

    /**
     * @param condition
     * @param versions
     * @param fields
     * @return
     */
    public long count(String[] versions, ReportField[] fields) {
        Criteria c0 = new Criteria();
        Criteria [] c01 = new Criteria[versions.length];
        if (versions.length > 0) {
            for (int i = 0; i < versions.length; i++) {
                c01[i] = Criteria.where("version").is(versions[i]);
            }
        }
        c0.orOperator(c01);
        Criteria[] c1 = new Criteria[fields.length];
        if (fields.length > 0) {
            for (int i = 0; i < fields.length; i++) {
                c1[i] = Criteria.where("children.definitionId").is(fields[i].getId());
            }
        }
        Query query = new Query(c0.andOperator(c1)); // 只查询某种状态的新闻
        long count = nosqlTemplate.count(query, WfProcessInstance.class, collectionname);
        return count;
    }

    public List<WfProcessInstance> queryByCondition(String[] versions, ReportField[] fields,
                                                    int pageindex, int pagesize) {
        Criteria c0 = new Criteria();
        Criteria [] c01 = new Criteria[versions.length];
        if (versions.length > 0) {
            for (int i = 0; i < versions.length; i++) {
                c01[i] = Criteria.where("version").is(versions[i]);
            }
        }
        c0.orOperator(c01);
        Criteria[] c1 = new Criteria[fields.length];
        if (fields.length > 0) {
            for (int i = 0; i < fields.length; i++) {
                c1[i] = Criteria.where("children.definitionId").is(fields[i].getId());
            }
        }
        Query query = new Query(c0.andOperator(c1)); // 只查询某种状态的新闻
        query.skip(pageindex).limit(pagesize);
        List<WfProcessInstance> list = nosqlTemplate.find(query, WfProcessInstance.class, collectionname);
        return list;
    }

    public long countByCondition(String search, String[] versions, ReportField[] fields) {
        Criteria c0 = new Criteria();
        Criteria [] c01 = new Criteria[versions.length];
        if (versions.length > 0) {
            for (int i = 0; i < versions.length; i++) {
                c01[i] = Criteria.where("version").is(versions[i]);
            }
        }
        c0.orOperator(c01);
        Criteria[] cs = new Criteria[fields.length];
        if (fields.length > 0) {
            for (int i = 0; i < fields.length; i++) {
                Criteria c1 = Criteria.where("children.value").regex(search);
                Criteria c2 = Criteria.where("children.definitionId").is(fields[i].getId());
                cs[i] = c1.orOperator(c2);
            }
        }
        Query query = new Query(c0.andOperator(cs)); // 只查询某种状态的新闻
        long count = nosqlTemplate.count(query, News.class, collectionname);
        return count;
    }

    public List<WfProcessInstance> queryByCondition(String search,
                                                    String[] versions, ReportField[] fields,
                                                    int pageindex, int pagesize) {
        Criteria c0 = new Criteria();
        Criteria [] c01 = new Criteria[versions.length];
        if (versions.length > 0) {
            for (int i = 0; i < versions.length; i++) {
                c01[i] = Criteria.where("version").is(versions[i]);
            }
        }
        c0.orOperator(c01);
        Criteria[] cs = new Criteria[fields.length];
        if (fields.length > 0) {
            for (int i = 0; i < fields.length; i++) {
                Criteria c1 = Criteria.where("children.value").regex(search);
                Criteria c2 = Criteria.where("children.definitionId").is(fields[i].getId());
                cs[i] = c1.orOperator(c2);
            }
        }
        Query query = new Query(c0.andOperator(cs)); // 只查询某种状态的新闻
        query.skip(pageindex).limit(pagesize);
        List<WfProcessInstance> list = nosqlTemplate.find(query, WfProcessInstance.class, collectionname);
        return list;
    }

    public List<String> queryAllVersions(String proccode) {
        List<String> list = new ArrayList<>();
        Criteria c0 = Criteria.where("code").is(proccode);
        Aggregation agg = Aggregation.newAggregation(
                Aggregation.match(c0), Aggregation.group("version", "releaseDate").count().as("versionsum"));
        AggregationResults<Document> outputType = nosqlTemplate.aggregate(agg, collectionname, Document.class);
        // List<Document> resultList = outputType.getMappedResults();
        for (Iterator<Document> iterator = outputType.iterator(); iterator.hasNext(); ) {
            Document obj = iterator.next();
            Object o = obj.get("version");
            Object o1 = obj.get("versionsum");
            Object o2 = obj.get("releaseDate");
            String s = o.toString() + "#" + o1.toString() + "#" + o2.toString();
            list.add(s);
        }
        return list;
    }


}
