/**
 * 
 */
package com.cloudibpm.blo.om.organization;

import com.cloudibpm.core.WorkflowEntity;
import com.cloudibpm.core.organization.Position;
import com.cloudibpm.core.repository.BusinessLogicObject;
import com.cloudibpm.eso.om.organization.WfPositionEso;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.SQLException;
import java.util.List;

/**
 * @author TKuser
 * 
 */
@Service
//@Transactional
public class PositionBlo extends BusinessLogicObject {
	private final WfPositionEso positionEso;

	@Autowired
	public PositionBlo(WfPositionEso positionEso) {
		this.positionEso = positionEso;
	}


	public Position getPosition(String id) throws Exception {
		
		return positionEso.queryByPK(id);
	}

	public List<Position> getPositions(WorkflowEntity owner) throws Exception {
		
		return positionEso.queryAll(owner.getId());
	}

	public void createNewPosition(Position position) throws SQLException {
		
		positionEso.insert(position);
	}

	public void deleteAllPosition(String id) throws SQLException {
		
		positionEso.deleteAll(id);
	}
}