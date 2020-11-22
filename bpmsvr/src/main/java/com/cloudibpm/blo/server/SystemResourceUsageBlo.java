/**
 * 
 */
package com.cloudibpm.blo.server;

import com.cloudibpm.core.repository.BusinessLogicObject;



/**
 * @author cdh
 * 
 */
public class SystemResourceUsageBlo extends BusinessLogicObject {
	private final static SystemResourceUsageBlo instance = new SystemResourceUsageBlo();

	/**
	 * 
	 */
	private SystemResourceUsageBlo() {
	}

	public static SystemResourceUsageBlo getInstance() {
		return instance;
	}

//	public void save(OsResourceUsageDescriptor[] descriptors) throws Exception {
//		SystemResourceUsageRo[] descriptorRos = new SystemResourceUsageRo[descriptors.length];
//		for (int i = 0; i < descriptorRos.length; i++) {
//			if (descriptors[i] != null) {
//				descriptorRos[i] = new SystemResourceUsageRo();
//				//descriptorRos[i].setRecordObject(descriptors[i]);
//			}
//		}
//		SystemResourceUsageHistoryEso sysEso = new SystemResourceUsageHistoryEso();
//		sysEso.insert(descriptorRos);
//	}
//
//	public List<OsResourceUsageDescriptor> querySystemResourceUsageBySQL(
//			String sql) throws Exception {
//		SystemResourceUsageHistoryEso sysEso = new SystemResourceUsageHistoryEso();
//		List<RecordObject> list = sysEso.queryByIds(sql);
//		List<OsResourceUsageDescriptor> descriptors = new ArrayList<OsResourceUsageDescriptor>();
//		for (RecordObject ro : list) {
//			//descriptors.add((OsResourceUsageDescriptor) ro.getEntity());
//		}
//		return descriptors;
//	}
}
