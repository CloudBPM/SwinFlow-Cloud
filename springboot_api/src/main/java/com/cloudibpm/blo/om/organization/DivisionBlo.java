/**
 * 
 */
package com.cloudibpm.blo.om.organization;

import com.cloudibpm.core.TreeNode;
import com.cloudibpm.core.WorkflowEntity;
import com.cloudibpm.core.organization.Division;
import com.cloudibpm.core.organization.Position;
import com.cloudibpm.core.repository.BusinessLogicObject;
import com.cloudibpm.eso.om.organization.WfDivisionEso;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @author Administrator
 * 
 */
@Service
//@Transactional
public class DivisionBlo extends BusinessLogicObject {
	private final WfDivisionEso wfDivisionEso;
	private final PositionBlo positionBlo;

	@Autowired
	public DivisionBlo(WfDivisionEso wfDivisionEso, PositionBlo positionBlo) {
		this.wfDivisionEso = wfDivisionEso;
		this.positionBlo = positionBlo;
	}


	public List<Division> getDivisions(WorkflowEntity owner) throws Exception {
		
		List<Division> list = wfDivisionEso.queryAll(owner.getId());
		return list;
	}

	public Division getDivisionByID(String id) throws Exception {

		Division division = wfDivisionEso.queryByPK(id);
		List<Position> positions = positionBlo.getPositions(division);
		// 将所有的Position对象放入map缓存，用来构造职位树之用。
		Map<String, WorkflowEntity> map = new HashMap<String, WorkflowEntity>();
		for (Position position : positions) {
			map.put(position.getId(), position);
		}
		for (Position position : positions) {
			if (position.getParent() != null) {
				TreeNode parent = (TreeNode) map.get(position.getParent());
				parent.addChild(position);
			} else {
				division.addChild(position);
			}
		}
		return division;
	}

	
	public void saveDivisionNode(Division division) throws SQLException {

		wfDivisionEso.insert(division);
	}

	
	private void savePositions(TreeNode[] nodes) throws SQLException {
		if (nodes != null && nodes.length > 0) {
			for (int i = 0; i < nodes.length; i++) {
				TreeNode node = nodes[i];
				if (node instanceof Position) {
					positionBlo.createNewPosition((Position) node);
				}
				savePositions(node.getChildren());
			}
		}
	}

	
	public void deleteAllDivisions(String id) throws SQLException {

		wfDivisionEso.deleteAll(id);
	}

	
	public void saveDivisionStructure(Division division) throws SQLException {

		wfDivisionEso.update(division);
		positionBlo.deleteAllPosition(division.getId());
		savePositions(division.getChildren());
	}
}