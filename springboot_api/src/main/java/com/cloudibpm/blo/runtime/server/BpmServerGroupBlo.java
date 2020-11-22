/**
 * 
 */
package com.cloudibpm.blo.runtime.server;

import com.cloudibpm.core.repository.BusinessLogicObject;
import com.cloudibpm.core.runtime.server.ServerGroupInfoDescriptor;
import com.cloudibpm.eso.runtime.server.ServerGroupEso;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @author Dahai Cao created on 2018-02-05
 *
 */
@Service
//@Transactional
public class BpmServerGroupBlo extends BusinessLogicObject {

	private final ServerGroupEso serverGroupEso;

	@Autowired
	public BpmServerGroupBlo(ServerGroupEso serverGroupEso) {
		this.serverGroupEso = serverGroupEso;
	}


	public List<ServerGroupInfoDescriptor> getAllServers() throws Exception {

		return serverGroupEso.queryAll();
	}

}
