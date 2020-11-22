package com.cloudibpm.blo.runtime.wfprocessinstance;

import com.cloudibpm.core.repository.BusinessLogicObject;
import com.cloudibpm.core.runtime.util.WfProcessInstanceUncloner;
import com.cloudibpm.core.runtime.wfprocess.WfProcessInstance;
import com.cloudibpm.eso.runtime.wfprocessinstance.CompletedWfProcessInstanceEso;

import javax.transaction.Transactional;

/**
 * 未使用
 */
@Transactional
public class ProcessInstanceBlo extends BusinessLogicObject {

	private final static ProcessInstanceBlo instance = new ProcessInstanceBlo();

	private ProcessInstanceBlo() {
	}

	public static ProcessInstanceBlo getInstance() {
		return instance;
	}

	public WfProcessInstance getProcessInstance(String piid) throws Exception {
        CompletedWfProcessInstanceEso piEso = new CompletedWfProcessInstanceEso();
		WfProcessInstance instance = piEso.query(piid);
		return WfProcessInstanceUncloner.unclone(instance);
    }
}
