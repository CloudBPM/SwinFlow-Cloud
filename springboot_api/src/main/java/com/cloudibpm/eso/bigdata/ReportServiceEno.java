package com.cloudibpm.eso.bigdata;

import com.xq.paas.core.bigdata.report.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * @author Dahai Cao created at 14:30 on 2019-01-10
 * lastupdate at 20:50 on 2019-03-03
 */
@Repository

public class ReportServiceEno {
    private final MongoTemplate nosqlTemplate;
    private final String collectionname = "report_service";

    @Autowired
    public ReportServiceEno(MongoTemplate nosqlTemplate) {
        this.nosqlTemplate = nosqlTemplate;
    }

    public void insert(ReportService report) {
        nosqlTemplate.insert(report, collectionname);
    }

    public void update(final ReportService report) throws Exception {
        nosqlTemplate.save(report, collectionname);
    }


    public ReportService query(String primarykey) throws Exception {
        return nosqlTemplate.findById(primarykey, ReportService.class, collectionname);
    }

    public List<ReportService> queryByParent(String fk_Parent) throws Exception {
        Criteria title = Criteria.where("parent").regex(fk_Parent);
        Query query = new Query(title);
        return nosqlTemplate.find(query, ReportService.class, collectionname);
    }

    public List<ReportService> queryByType(String owner, int [] reportType) throws Exception {
        Criteria c0 = new Criteria();
        Criteria [] c01 = new Criteria[reportType.length];
        if (reportType.length > 0) {
            for (int i = 0; i < reportType.length; i++) {
                c01[i] = Criteria.where("reportType").is(reportType[i]);
            }
        }
        c0.orOperator(c01);
        Criteria c1 = Criteria.where("owner").is(owner);
        Query query = new Query(c0.andOperator(c1));
        return nosqlTemplate.find(query, ReportService.class, collectionname);
    }


    /**
     * Update report service name by ID
     *
     * @param id
     * @param entityname
     * @param lastupdate
     */
    public void updateName(String id, String entityname, String lastupdate) {
        Query query = new Query(Criteria.where("id").is(id));
        Update update = new Update().set("name", entityname).set("lastupdate", Long.parseLong(lastupdate));
        nosqlTemplate.updateFirst(query, update, ReportService.class, collectionname);
    }

    /**
     * Delete report service by ID
     *
     * @param id
     */
    public void delete(String id) {
        Query query = new Query(Criteria.where("id").is(id));
        nosqlTemplate.remove(query, ReportService.class, collectionname);
    }

}
