/**
 * 
 */
package com.cloudibpm.blo.om.organization;

import com.cloudibpm.core.WorkflowEntity;
import com.cloudibpm.core.organization.ProjectRole;
import com.cloudibpm.core.repository.BusinessLogicObject;
import com.cloudibpm.eso.om.organization.WfProjectRoleEso;
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
public class ProjectRoleBlo extends BusinessLogicObject {
	private final WfProjectRoleEso projectRoleEso;

	@Autowired
	public ProjectRoleBlo(WfProjectRoleEso projectRoleEso) {
		this.projectRoleEso = projectRoleEso;
	}


	public ProjectRole getProjectRole(String id) throws Exception {
		
		return projectRoleEso.queryByPK(id);
	}

	public List<ProjectRole> getProjectRoles(WorkflowEntity owner) throws Exception {
		
		return projectRoleEso.queryAll(owner.getId());
	}

	public void createNewPosition(ProjectRole projectRole) throws SQLException {

		projectRoleEso.insert(projectRole);
	}

	public void deleteAllPosition(String id) throws SQLException {

		projectRoleEso.deleteAll(id);
	}

}
