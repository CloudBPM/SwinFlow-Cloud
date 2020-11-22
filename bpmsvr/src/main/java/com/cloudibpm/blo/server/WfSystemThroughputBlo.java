/**
 * 
 */
package com.cloudibpm.blo.server;

import com.cloudibpm.core.repository.BusinessLogicObject;

/**
 * @author dcao
 * 
 */
public class WfSystemThroughputBlo extends BusinessLogicObject {
	private final static WfSystemThroughputBlo instance = new WfSystemThroughputBlo();

	/**
	 * 
	 */
	private WfSystemThroughputBlo() {
	}

	public static WfSystemThroughputBlo getInstance() {
		return instance;
	}

//	public void save(WorkflowThroughput[] throughputs) throws Exception {
//		CaseThroughputRo[] throughputRos = new CaseThroughputRo[throughputs.length];
//		for (int i = 0; i < throughputRos.length; i++) {
//			if (throughputs[i] != null) {
//				throughputRos[i] = new CaseThroughputRo();
//				throughputRos[i].setRecordObject(throughputs[i]);
//			}
//		}
//		WfSystemThroughputEso thrEso = new WfSystemThroughputEso();
//		thrEso.insert(throughputRos);
//	}
//
//	public void save(WorkflowThroughput throughput) throws Exception {
//		CaseThroughputRo throughputRo = new CaseThroughputRo();
//		throughputRo.setRecordObject(throughput);
//		WfSystemThroughputEso thrEso = new WfSystemThroughputEso();
//		thrEso.insert(throughputRo);
//	}
//
//	public List<WorkflowThroughput> getThroughputsBySQL(String sql)
//			throws Exception {
//		WfSystemThroughputEso thrEso = new WfSystemThroughputEso();
//		List<RecordObject> resultRos = thrEso.queryByIds(sql);
//		List<WorkflowThroughput> thrPuts = new ArrayList<WorkflowThroughput>();
//		for (RecordObject result : resultRos) {
//			thrPuts.add((WorkflowThroughput) result.getEntity());
//		}
//		return thrPuts;
//	}
}
