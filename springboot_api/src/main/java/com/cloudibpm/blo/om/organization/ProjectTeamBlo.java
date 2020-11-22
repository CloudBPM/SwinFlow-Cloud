/**
 * @author Cao Dahai
 * @version 1.0.0 下午10:07:21
 */
package com.cloudibpm.blo.om.organization;

import com.cloudibpm.core.TreeNode;
import com.cloudibpm.core.WorkflowEntity;
import com.cloudibpm.core.organization.ProjectRole;
import com.cloudibpm.core.organization.ProjectTeam;
import com.cloudibpm.core.repository.BusinessLogicObject;
import com.cloudibpm.eso.om.organization.WfProjectTeamEso;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
@Service
//@Transactional
public class ProjectTeamBlo extends BusinessLogicObject {
	private final WfProjectTeamEso wfProjectTeamEso;
	private final ProjectRoleBlo projectRoleBlo;

	@Autowired
	public ProjectTeamBlo(WfProjectTeamEso wfProjectTeamEso, ProjectRoleBlo projectRoleBlo) {
		this.wfProjectTeamEso = wfProjectTeamEso;
		this.projectRoleBlo = projectRoleBlo;
	}


	public List<ProjectTeam> getProjectTeams(WorkflowEntity owner) throws Exception {
		
		List<ProjectTeam> list = wfProjectTeamEso.queryAll(owner.getId());
		return list;
	}

	public ProjectTeam getProjectTeamByID(String id) throws Exception {
		
		ProjectTeam projectTeam = wfProjectTeamEso.queryByPK(id);
		Map<String, WorkflowEntity> map = new HashMap<String, WorkflowEntity>();
		List<ProjectRole> roles = projectRoleBlo.getProjectRoles(projectTeam);
		for (ProjectRole role : roles) {
			map.put(role.getId(), role);
		}
		for (ProjectRole node : roles) {
			if (node.getParent() != null) {
				TreeNode parent = (TreeNode) map.get(node.getParent());
				parent.addChild(node);
			} else {
				projectTeam.addChild(node);
			}
		}
		return projectTeam;
	}

	public void saveProjectTeamNode(ProjectTeam team) throws Exception {
		
		wfProjectTeamEso.insert(team);
	}

	private void saveRole(TreeNode[] nodes) throws SQLException {
		if (nodes != null && nodes.length > 0) {
			for (int i = 0; i < nodes.length; i++) {
				TreeNode node = nodes[i];
				if (node instanceof ProjectRole) {
					projectRoleBlo.createNewPosition((ProjectRole) node);
				}
				saveRole(node.getChildren());
			}
		}
	}

	public void deleteAllProjectTeams(String id) throws Exception {
		
		wfProjectTeamEso.deleteAll(id);
	}

	public void saveProjectTeamStructure(ProjectTeam team) throws Exception {
		
		wfProjectTeamEso.update(team);
		projectRoleBlo.deleteAllPosition(team.getId());
		saveRole(team.getChildren());
	}
}