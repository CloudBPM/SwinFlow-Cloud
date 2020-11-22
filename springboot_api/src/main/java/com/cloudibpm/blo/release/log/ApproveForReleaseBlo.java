/**
 * 
 */
package com.cloudibpm.blo.release.log;

import com.cloudibpm.blo.buildtime.id.BuildtimeIDGenerator;
import com.cloudibpm.blo.om.job.JobAssignmentBlo;
import com.cloudibpm.core.admin.log.approval.SubmittingApprovalLog;
import com.cloudibpm.core.admin.log.approval.SubmittingApprovalLogPage;
import com.cloudibpm.core.organization.AbstractPosition;
import com.cloudibpm.core.repository.BusinessLogicObject;
import com.cloudibpm.eso.release.log.ApproveForReleaseEno;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @author Dahai Cao created at 9:53 on 2018-10-18
 *
 */
@Service
//@Transactional
public class ApproveForReleaseBlo extends BusinessLogicObject {
	private final BuildtimeIDGenerator buildtimeIDGenerator;
	private final JobAssignmentBlo jobAssignmentBlo;
	private final ApproveForReleaseEno approveForReleaseEno;

	@Autowired
	public ApproveForReleaseBlo(BuildtimeIDGenerator buildtimeIDGenerator,
								JobAssignmentBlo jobAssignmentBlo,
								ApproveForReleaseEno approveForReleaseEno) {
		this.buildtimeIDGenerator = buildtimeIDGenerator;
		this.jobAssignmentBlo = jobAssignmentBlo;
		this.approveForReleaseEno = approveForReleaseEno;
	}


	public void createSubmittingApproveLog(String newsId, String objectName, String orgId, String orgName,
			String objectClass, int status, String comment, long lastUpdate, String owner, String userId,
			String userfullname, String ownername) throws Exception {
		SubmittingApprovalLog submitlog = new SubmittingApprovalLog();
		submitlog.setId(buildtimeIDGenerator.getNewRunTimeID());
		// 这个属性是指什么对象ID的审核日志，如流程对象ID，组织对象ID，邮件模板对象ID，
		// 短信模板对象ID，表单对象ID，微服务对象ID，新闻/动态对象ID
		submitlog.setObjectId(newsId);
		// 这个属性是指什么对象的类如WfProcess，Organization，EmailTemplate，
		// SMSTemplate，Form，Microservice，News
		submitlog.setObjectClass(objectClass);
		// 这个属性是指什么对象名称的审核日志，如流程对象，组织对象，邮件模板对象，
		// 短信模板对象，表单对象，微服务对象，新闻/动态对象
		submitlog.setObjectName(objectName);
		// 被审核的对象的状态。
		submitlog.setStatus(status);
		// 这个属性是指审核意见
		submitlog.setComment(comment);
		// 创建时间戳
		submitlog.setCreateTimeStamp(lastUpdate);
		// 提交人ID
		submitlog.setSubmitterId(userId);
		// 提交人姓名
		submitlog.setSubmitter(userfullname);
		AbstractPosition[] pos = jobAssignmentBlo.getPosition(userId, owner);
		if (pos != null && pos.length > 0 && pos[0] != null) {
			// 提交人员岗位
			submitlog.setSubmitterPosition(pos[0].getName());
			// 提交人员岗位ID
			submitlog.setSubmitterPositionId(pos[0].getId());
		} else {
			// 提交人员岗位
			submitlog.setSubmitterPosition("");
			// 提交人员岗位ID
			submitlog.setSubmitterPositionId("");
		}
		// 被审核对象所在组织ID
		submitlog.setSubmittingOrgID(orgId);
		// 被审核对象所在组织名称
		submitlog.setSubmittingOrg(orgName);

		createApproveLog(submitlog);
	}
	
	public void createApprovingLog(String newsId, String objectName, String orgId, String orgName,
			String objectClass, int status, String comment, long lastUpdate, String owner, String userId,
			String userfullname, String ownername) throws Exception {
		SubmittingApprovalLog submitlog = new SubmittingApprovalLog();
		submitlog.setId(buildtimeIDGenerator.getNewRunTimeID());
		// 这个属性是指什么对象ID的审核日志，如流程对象ID，组织对象ID，邮件模板对象ID，
		// 短信模板对象ID，表单对象ID，微服务对象ID，新闻/动态对象ID
		submitlog.setObjectId(newsId);
		// 这个属性是指什么对象的类如WfProcess，Organization，EmailTemplate，
		// SMSTemplate，Form，Microservice，News
		submitlog.setObjectClass(objectClass);
		// 这个属性是指什么对象名称的审核日志，如流程对象，组织对象，邮件模板对象，
		// 短信模板对象，表单对象，微服务对象，新闻/动态对象
		submitlog.setObjectName(objectName);
		// 被审核的对象的状态。
		submitlog.setStatus(status);
		// 这个属性是指审核意见
		submitlog.setComment(comment);
		// 创建时间戳
		submitlog.setCreateTimeStamp(lastUpdate);
		// 审核人ID
		submitlog.setApproverId(userId);
		// 审核人姓名
		submitlog.setApprover(userfullname);
		AbstractPosition[] pos = jobAssignmentBlo.getPosition(userId, owner);
		if (pos != null && pos.length > 0 && pos[0] != null) {
			// 审核人员岗位
			submitlog.setApproverPosition(pos[0].getName());
			// 审核人员岗位ID
			submitlog.setApproverPositionId(pos[0].getId());
		} else {
			// 审核人员岗位
			submitlog.setApproverPosition("");
			// 审核人员岗位ID
			submitlog.setApproverPositionId("");
		}
		// 被审核对象所在组织ID
		submitlog.setOwner(orgId);
		// 被审核对象所在组织名称
		submitlog.setApproverOrg(orgName);
		
		createApproveLog(submitlog);
	}

	/**
	 * 
	 * @param submitlog
	 */
	public void createApproveLog(SubmittingApprovalLog submitlog) {
		
		approveForReleaseEno.insert(submitlog);
	}

	public void deleteLog(String id) {
		
		approveForReleaseEno.delete(id);
	}

	/**
	 * 
	 * @param condition
	 *            search condition
	 * @param pageno
	 *            first page number
	 * @param pagesize
	 *            the size (data row number) of each page
	 * @param objectId
	 *            the limit condition
	 * @return Page
	 * @throws Exception
	 */
	public SubmittingApprovalLogPage searchLog(String condition, int pageno, int pagesize, String objectId)
			throws Exception {
		
		SubmittingApprovalLogPage page = new SubmittingApprovalLogPage();
		long total = approveForReleaseEno.countLogs(objectId);
		if (total == 0) {
			page.setPageSize(pagesize);
			page.setPageNo(1);
			page.setAllEntitiesCount(0);
			page.setAllPagesCount(0);
			page.setPageIndex(0);
		} else {
			page.setPageSize(pagesize);
			if (condition == null || condition.equals("")) {
				page.setPageNo(pageno);
				page.setAllEntitiesCount(pagesize);
				long n = total / pagesize;
				long m = total % pagesize;
				if (m > 0) {
					n = n + 1;
				}
				page.setAllEntitiesCount(n);
				int pageindex = (pageno - 1) * pagesize;
				page.setPageIndex(pageindex);
				List<SubmittingApprovalLog> form = approveForReleaseEno.queryLogs(pageindex, pagesize, objectId);
				page.setPageEntities(form.toArray(new SubmittingApprovalLog[form.size()]));
			} else {
				total = approveForReleaseEno.countLogsByCondition(condition, objectId);
				if (total == 0L) {
					page.setPageSize(pagesize);
					page.setPageNo(1);
					page.setAllEntitiesCount(0);
					page.setAllPagesCount(0);
					page.setPageIndex(0);
				} else {
					page.setPageNo(pageno);
					page.setAllPagesCount(total);
					long n = total / pagesize;
					long m = total % pagesize;
					if (m > 0) {
						n = n + 1;
					}
					page.setAllPagesCount(n);
					int pageindex = (pageno - 1) * pagesize;
					List<SubmittingApprovalLog> list = approveForReleaseEno.queryLogsByCondition(condition, pageindex, pagesize,
							objectId);
					page.setPageEntities(list.toArray(new SubmittingApprovalLog[list.size()]));
				}
			}
		}
		return page;
	}
}
