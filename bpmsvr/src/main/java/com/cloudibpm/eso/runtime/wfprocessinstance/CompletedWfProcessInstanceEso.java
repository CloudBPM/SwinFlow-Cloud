/**
 * 
 */
package com.cloudibpm.eso.runtime.wfprocessinstance;

import com.cloudibpm.core.repository.ExecuteNoSQLObject;
import com.cloudibpm.core.runtime.wfprocess.WfProcessInstance;
import org.apache.log4j.Logger;

/**
 * @author Dahai Cao created on 2018-03-21
 *         https://segmentfault.com/a/1190000005829384
 *         https://blog.csdn.net/congcong68/article/details/47183209
 */
public class CompletedWfProcessInstanceEso extends ExecuteNoSQLObject {
	private final String collectionname = "process_instance";
	/**
	 * 
	 */
	public CompletedWfProcessInstanceEso() {
		super();
		logger = Logger.getLogger(CompletedWfProcessInstanceEso.class.getName());
	}

	public void insert(WfProcessInstance instanceString) throws Exception {
		nosqlTemplate.save(instanceString, collectionname);
	}

	public WfProcessInstance query(String piid) {
		return nosqlTemplate.findById(piid, WfProcessInstance.class, collectionname);
	}
}