/**
 * @author Cao Dahai
 * @version 1.0.0 下午10:01:49
 */
package com.cloudibpm.blo.om.organization;

import com.cloudibpm.core.TreeNode;
import com.cloudibpm.core.WorkflowEntity;
import com.cloudibpm.core.organization.Department;
import com.cloudibpm.core.organization.Position;
import com.cloudibpm.core.repository.BusinessLogicObject;
import com.cloudibpm.eso.om.organization.WfDepartmentEso;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
@Service
//@Transactional
public class DepartmentBlo extends BusinessLogicObject {
	private final WfDepartmentEso wfDepartmentEso;
	private final PositionBlo positionBlo;

	@Autowired
	public DepartmentBlo(WfDepartmentEso wfDepartmentEso, PositionBlo positionBlo) {
		this.wfDepartmentEso = wfDepartmentEso;
		this.positionBlo = positionBlo;
	}

	public List<Department> getDepartments(WorkflowEntity owner) throws Exception {
		
		List<Department> list = wfDepartmentEso.queryAll(owner.getId());
		return list;
	}

	public Department getDepartmentByID(String id) throws Exception {
		
		Department department = wfDepartmentEso.queryByPK(id);
		List<Position> positions = positionBlo.getPositions(department);
		Map<String, WorkflowEntity> map = new HashMap<String, WorkflowEntity>();
		for (Position position : positions) {
			map.put(position.getId(), position);
		}
		for (Position position : positions) {
			if (position.getParent() != null) {
				TreeNode parent = (TreeNode) map.get(position.getParent());
				parent.addChild(position);
			} else {
				department.addChild(position);
			}
		}
		return department;
	}

	public void saveDepartmentNode(Department department) throws Exception {
		
		wfDepartmentEso.insert(department);
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

	public void deleteAllDepartments(String id) throws SQLException {
		
		wfDepartmentEso.deleteAll(id);
	}

	public void saveDepartmentStructure(Department department) throws SQLException {
		
		wfDepartmentEso.update(department);
		positionBlo.deleteAllPosition(department.getId());
		savePositions(department.getChildren());
	}
}
