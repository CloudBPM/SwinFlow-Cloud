/**
 * 
 */
package com.cloudibpm.blo.runtime.eventlog;

import com.cloudibpm.core.repository.BusinessLogicObject;

/**
 * @author cdh
 * 
 */
public class BpmSystemEventBlo extends BusinessLogicObject {
	private static BpmSystemEventBlo instance = new BpmSystemEventBlo();

	/**
	 * 
	 */
	private BpmSystemEventBlo() {
	}

	public static BpmSystemEventBlo getInstance() {
		return instance;
	}

//	public List<SystemEvent> getAllEventLog(String ownerId) throws Exception {
//		List<SystemEvent> events = new ArrayList<SystemEvent>();
//		RuntimeWfSystemEventLogEso eventLogEso = new RuntimeWfSystemEventLogEso();
//		List<RecordObject> eventLogRos = eventLogEso.queryAll();
//		for (RecordObject ro : eventLogRos) {
//			events.add((SystemEvent) ro.getEntity());
//		}
//		return events;
//	}
//
//	public void createEventLog(SystemEvent event) throws Exception {
//		RuntimeWfSystemEventLogEso eventLogEso = new RuntimeWfSystemEventLogEso();
//		SystemEventLogRo eventRo = new SystemEventLogRo();
//		eventRo.setRecordObject(event);
//		eventLogEso.insert(eventRo);
//	}
}
