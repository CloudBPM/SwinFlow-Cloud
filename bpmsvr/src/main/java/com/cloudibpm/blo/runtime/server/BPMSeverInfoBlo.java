package com.cloudibpm.blo.runtime.server;

import com.cloudibpm.blo.runtime.id.RuntimeIDGenerator;
import com.cloudibpm.core.repository.BusinessLogicObject;
import com.cloudibpm.core.runtime.server.ServerInfoDescriptor;
import com.cloudibpm.eso.runtime.servers.SeverEso;

public class BPMSeverInfoBlo extends BusinessLogicObject {

	private final static BPMSeverInfoBlo instance = new BPMSeverInfoBlo();

	private BPMSeverInfoBlo() {
	}

	public static BPMSeverInfoBlo getInstance() {
		return instance;
	}

	public void regServer(ServerInfoDescriptor info) throws Exception {
		SeverEso sEso = new SeverEso();
		info.setId(RuntimeIDGenerator.getInstance().getNewRunTimeID());
		if (sEso.existsServer(info) == 0) {
			sEso.insert(info);
		} else {
			sEso.update(info);
		}
	}

}
