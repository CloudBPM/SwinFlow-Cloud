/**
 *
 */
package com.cloudibpm.blo.runtime.eventlog;

import com.cloud.core.session.redis.JedisUtil;
import com.cloudibpm.core.repository.BusinessLogicObject;
import com.cloudibpm.core.runtime.event.Event;
import com.cloudibpm.core.runtime.event.SavingEventLog;
import com.cloudibpm.core.runtime.wfprocess.WfProcessInstance;
import com.cloudibpm.eso.runtime.wfprocessinstance.CompletedWfProcessInstanceEso;

/**
 * @author Dahai Cao last updated on 20180328
 *
 */
public class RuntimeEventBlo extends BusinessLogicObject {
    private static RuntimeEventBlo instance = new RuntimeEventBlo();

    /**
     *
     */
    private RuntimeEventBlo() {
    }

    public static RuntimeEventBlo getInstance() {
        return instance;
    }

    // public List<WorkflowEvent> getAllEventLog(String ownerId) throws
    // Exception {
    // List<WorkflowEvent> events = new ArrayList<WorkflowEvent>();
    // RuntimeWfEventLogEso eventLogEso = new RuntimeWfEventLogEso();
    // List<RecordObject> eventLogRos = eventLogEso.queryAll(ownerId);
    // for (RecordObject ro : eventLogRos) {
    // events.add((WorkflowEvent) ro.getEntity());
    // }
    // return events;
    // }
    //
    // public void createEventLog(Event event) throws Exception {
    // RuntimeWfEventLogEso eventLogEso = new RuntimeWfEventLogEso();
    // String eventId = RuntimeIDGenerator.getInstance().getNewRID();
    // WfEventLogRo eventRo = new WfEventLogRo();
    // eventRo.setPrimaryKey(eventId);
    // eventRo.setRecordObject(event);
    // eventLogEso.insert(eventRo);
    // }

    public void saveLog(Event event) throws Exception {
        if (event instanceof SavingEventLog) {
            WfProcessInstance pi = (WfProcessInstance) ((SavingEventLog) event).getContent();
//            if (event.getType() == SavingEventLog.SAVING_CACHE) {
////						ProcessInstanceEso piEso = new ProcessInstanceEso();
////						piEso.save(pi, "running_instances");
//                //将过程序列化，并保存到redis中
//                String processInstance = WfProcessInstance2JSON.toJSONString(pi);
//                JedisUtil.getInstance().set("TPROCESS_" + pi.getId(), processInstance);
//            } else
            if (event.getType() == SavingEventLog.SAVING_HISTORY) {
                //过程结束后，删除redis储存的信息
                JedisUtil.getInstance().del("TPROCESS_" + pi.getId());
                CompletedWfProcessInstanceEso piEso = new CompletedWfProcessInstanceEso();
                //piEso.insert(pi, ((SavingEventLog) events[i]).getWfProcessCode());
                piEso.insert(pi);
            }
        } else {

        }
    }

    public void saveLogs(Event[] events) throws Exception {
        for (int i = 0; i < events.length; i++) {
            if (events[i] != null) {
                saveLog(events[i]);
            }
        }
    }

}
