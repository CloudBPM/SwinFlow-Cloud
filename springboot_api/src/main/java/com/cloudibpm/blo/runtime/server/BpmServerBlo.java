/**
 * 
 */
package com.cloudibpm.blo.runtime.server;

import com.cloudibpm.core.repository.BusinessLogicObject;
import com.cloudibpm.core.runtime.server.ServerInfoDescriptor;
import com.cloudibpm.eso.runtime.server.SeverEso;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @author Dahai Cao created on 2018-02-05
 *
 */
@Service
//@Transactional
public class BpmServerBlo extends BusinessLogicObject {
	private final SeverEso severEso;

	@Autowired
	public BpmServerBlo(SeverEso SeverEso) {
		this.severEso = SeverEso;
	}

	public List<ServerInfoDescriptor> getAllServersInGroup(String gruopId) throws Exception {

		return severEso.queryAll(gruopId);
	}
}
