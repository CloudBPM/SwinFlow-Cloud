/**
 * 
 */
package com.cloudibpm.eso.runtime.wfprocessinstance;

import com.cloudibpm.core.runtime.wfprocess.WfProcessInstance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Repository;

/**
 * @author Dahai Cao created on 2018-03-21
 *         https://segmentfault.com/a/1190000005829384
 *         https://blog.csdn.net/congcong68/article/details/47183209
 */
@Repository
public class ProcessInstanceEso {
	private final String collectionname = "process_instance";
	private final MongoTemplate nosqlTemplate;
	/**
	 * 
	 */
	@Autowired
	public ProcessInstanceEso(MongoTemplate nosqlTemplate) {
		this.nosqlTemplate = nosqlTemplate;
	}


	public WfProcessInstance queryInstanceById(String piid) {
		return nosqlTemplate.findById(piid, WfProcessInstance.class, collectionname);
	}


}