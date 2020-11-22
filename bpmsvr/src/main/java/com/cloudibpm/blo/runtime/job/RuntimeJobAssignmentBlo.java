package com.cloudibpm.blo.runtime.job;

import com.cloudibpm.core.repository.BusinessLogicObject;
import com.cloudibpm.eso.runtime.job.RuntimeJobAssignmentEso;

public class RuntimeJobAssignmentBlo extends BusinessLogicObject {

	private final static RuntimeJobAssignmentBlo instance = new RuntimeJobAssignmentBlo();

	private RuntimeJobAssignmentBlo() {
	}

	public static RuntimeJobAssignmentBlo getInstance() {
		return instance;
	}

	public String[] getAllStaffsOnPosition(String positionId) throws Exception {
		return new RuntimeJobAssignmentEso().getAssignedStaffs(positionId);
	}

}
