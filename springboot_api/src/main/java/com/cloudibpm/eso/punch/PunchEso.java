package com.cloudibpm.eso.punch;

import com.model.Punch;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class PunchEso {
    private final MongoTemplate mongoTemplate;
    private final String collectionName = "punch_information";

    @Autowired
    public PunchEso(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    public void savePunchInfo(Punch punch) {
        mongoTemplate.insert(punch, collectionName);
    }
}
