/**
 * 
 */
package com.cloudibpm.blo.server;

import com.cloudibpm.core.repository.BusinessLogicObject;

/**
 * @author cdh
 * 
 */
public class WfServerInfoBlo extends BusinessLogicObject {
	private final static WfServerInfoBlo instance = new WfServerInfoBlo();

	/**
	 * 
	 */
	private WfServerInfoBlo() {
	}

	public static WfServerInfoBlo getInstance() {
		return instance;
	}

//	public WorkflowServerDescriptor getServerInfo(String serverId, String cloudZoneId,
//			String regionId) throws Exception {
//		WfServersEso servEso = new WfServersEso();
//		List<RecordObject> ros = servEso.queryByIds(serverId, cloudZoneId,
//				regionId);
//		if (ros.size() > 0) {
//			RecordObject descriptor = (RecordObject) ros.get(0);
//			return (WorkflowServerDescriptor) descriptor.getEntity();
//		}
//		return null;
//	}
//
//	public WorkflowServerDescriptor getServerObjects(String serverId,
//			String cloudZoneId, String regionId) throws Exception {
//		WfServersEso servEso = new WfServersEso();
//		RecordObject ros = servEso.queryById(serverId, cloudZoneId,
//				regionId);
//		if (ros!=null) {
//			return (WorkflowServerDescriptor) ros.getEntity();
//		} 
//		return null;
//	}
//
//	public void registerNewServerInfo(WorkflowServerDescriptor descriptor)
//			throws Exception {
//		WfServersEso servEso = new WfServersEso();
//		WorkflowServersRo servRo = new WorkflowServersRo();
//		servRo.setRecordObject(descriptor);
//		servEso.insert(servRo);
//	}
}
