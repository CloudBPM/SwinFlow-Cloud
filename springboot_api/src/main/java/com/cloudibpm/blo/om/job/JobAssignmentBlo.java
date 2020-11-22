package com.cloudibpm.blo.om.job;

import com.cloudibpm.blo.om.organization.PositionBlo;
import com.cloudibpm.blo.om.organization.ProjectRoleBlo;
import com.cloudibpm.core.job.JobAssignment;
import com.cloudibpm.core.job.JobAssignmentEditList;
import com.cloudibpm.core.organization.AbstractPosition;
import com.cloudibpm.core.repository.BusinessLogicObject;
import com.cloudibpm.eso.om.job.JobAssignmentEso;
import com.cloudibpm.eso.om.job.JobAssignmentHistoryEso;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.SQLException;
import java.util.Date;
import java.util.List;
@Service
//@Transactional
public class JobAssignmentBlo extends BusinessLogicObject {
	private final JobAssignmentEso jobAssignmentEso;
	private final JobAssignmentHistoryEso jobAssignmentHistoryEso;
	private final PositionBlo positionBlo;
	private final ProjectRoleBlo projectRoleBlo;

	@Autowired
	public JobAssignmentBlo(JobAssignmentEso jobAssignmentEso, JobAssignmentHistoryEso jobAssignmentHistoryEso, PositionBlo positionBlo, ProjectRoleBlo projectRoleBlo) {
		this.jobAssignmentEso = jobAssignmentEso;
		this.jobAssignmentHistoryEso = jobAssignmentHistoryEso;
		this.positionBlo = positionBlo;
		this.projectRoleBlo = projectRoleBlo;
	}


	public AbstractPosition[] getPosition(String userId, String orgId) throws Exception {
		
		List<JobAssignment> list = jobAssignmentEso.queryAssignments(orgId, userId);
		if (!list.isEmpty()) {
			AbstractPosition[] positions = new AbstractPosition[list.size()];
			for (int i = 0; i < list.size(); i++) {
				positions[i] = positionBlo.getPosition(list.get(i).getPositionId());
				if (positions[i] == null) {
					positions[i] =projectRoleBlo.getProjectRole(list.get(i).getPositionId());
				}
			}
			return positions;
		}
		return null;
	}

	public JobAssignment[] getAssignments(String positionid, String orgid) throws Exception {
		
		List<JobAssignment> list = jobAssignmentEso.queryAssignments(positionid, orgid);
		return list.toArray(new JobAssignment[list.size()]);
	}

	public JobAssignmentEditList getAssignmentEditList(String positionid, String orgid) throws SQLException {
		JobAssignmentEditList list = new JobAssignmentEditList();
		
		List<JobAssignment> leftmembers = jobAssignmentEso.queryAssignments(positionid, orgid);
		List<JobAssignment> rightmembers = jobAssignmentEso.queryAllNonAssignments(positionid, orgid);
		list.setPositionId(positionid);
		list.setLeftList(leftmembers.toArray(new JobAssignment[leftmembers.size()]));
		list.setRightList(rightmembers.toArray(new JobAssignment[rightmembers.size()]));
		return list;
	}

	public void updateJobAssignmentEditList(JobAssignmentEditList editlist) throws SQLException {


		Date changeDate = new Date();
		if (editlist.getAddedStaffIds() != null && editlist.getAddedStaffIds().length > 0) {
			for (int i = 0; i < editlist.getAddedStaffIds().length; i++) {
				jobAssignmentEso.insert(editlist.getPositionId(), editlist.getAddedStaffIds()[i], changeDate,
						editlist.getOwnerId());
				jobAssignmentHistoryEso.insert(editlist.getPositionId(), editlist.getAddedStaffIds()[i], editlist.getSource(),
						changeDate, editlist.getDescription(), editlist.getOwnerId());
			}
		}
		if (editlist.getRemovedStaffIds() != null && editlist.getRemovedStaffIds().length > 0) {
			for (int i = 0; i < editlist.getRemovedStaffIds().length; i++) {
				jobAssignmentEso.delete(editlist.getPositionId(), editlist.getRemovedStaffIds()[i]);
				jobAssignmentHistoryEso.update(editlist.getPositionId(), editlist.getRemovedStaffIds()[i], changeDate,
						editlist.getDescription());
			}
		}
	}

	/**
	 * 获取List<JobAssignment>
	 * @param fk_owner
	 * @param fk_user
	 * @return
	 * @throws Exception
	 */
	public List<JobAssignment> getJobAssignment(String fk_owner,String fk_user)throws Exception{
		return jobAssignmentEso.queryJobAssignments(fk_owner, fk_user);
	}
}
