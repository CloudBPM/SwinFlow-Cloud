/**
 * 
 */
package com.cloudibpm.core.admin.log.approval;

import com.cloudibpm.core.WorkflowEntity;

/**
 * @author Dahai Cao created at 21:42 on 2018-10-17
 *
 */
public class SubmittingApprovalLog extends WorkflowEntity {

	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = -277512338617329465L;
	/**
	 * 这个属性是指什么对象ID的审核日志，如流程对象ID，组织对象ID，邮件模板对象ID，
	 * 短信模板对象ID，表单对象ID，微服务对象ID，新闻/动态对象ID
	 */
	private String objectId = null;
	/**
	 * 这个属性是指什么对象名称的审核日志，如流程对象，组织对象，邮件模板对象， 短信模板对象，表单对象，微服务对象，新闻/动态对象
	 */
	private String objectName = null;
	/**
	 * 这个属性是指什么对象的类如WfProcess，Organization，EmailTemplate，SMSTemplate，Form，Microservice，News
	 */
	private String objectClass = null;
	/**
	 * 提交人ID
	 */
	private String submitterId = null;
	/**
	 * 提交人姓名
	 */
	private String submitter = null;
	/**
	 * 提交人职位ID
	 */
	private String submitterPositionId = null;
	/**
	 * 提交人职位
	 */
	private String submitterPosition = null;
	/**
	 * 提交组织ID
	 */
	private String submittingOrgID = null;
	/**
	 * 提交组织名称
	 */
	private String submittingOrg = null;
	/**
	 * 被审核的对象的状态。
	 */
	private int status = -1;
	/**
	 * 这个属性是指审核意见
	 */
	private String comment = null;
	/**
	 * 创建事件戳
	 */
	private long createTimeStamp = 0;
	/**
	 * 审核人ID
	 */
	private String approverId = null;
	/**
	 * 审核人姓名
	 */
	private String approver = null;
	/**
	 * 审核人员岗位ID
	 */
	private String approverPositionId = null;
	/**
	 * 审核人员岗
	 */
	private String approverPosition = null;
	/**
	 * 审核人组织名称
	 */
	private String approverOrg = null;

	/**
	 * 
	 */
	public SubmittingApprovalLog() {
	}

	/**
	 * @param id
	 */
	public SubmittingApprovalLog(String id) {
		super(id);
	}

	/**
	 * @return the objectId
	 */
	public String getObjectId() {
		return objectId;
	}

	/**
	 * @param objectId
	 *            the objectId to set
	 */
	public void setObjectId(String objectId) {
		this.objectId = objectId;
	}

	/**
	 * @return the objectName
	 */
	public String getObjectName() {
		return objectName;
	}

	/**
	 * @param objectName
	 *            the objectName to set
	 */
	public void setObjectName(String objectName) {
		this.objectName = objectName;
	}

	/**
	 * @return the objectClass
	 */
	public String getObjectClass() {
		return objectClass;
	}

	/**
	 * @param objectClass
	 *            the objectClass to set
	 */
	public void setObjectClass(String objectClass) {
		this.objectClass = objectClass;
	}

	/**
	 * @return the status
	 */
	public int getStatus() {
		return status;
	}

	/**
	 * @param status
	 *            the status to set
	 */
	public void setStatus(int status) {
		this.status = status;
	}

	/**
	 * @return the submitterId
	 */
	public String getSubmitterId() {
		return submitterId;
	}

	/**
	 * @param submitterId
	 *            the submitterId to set
	 */
	public void setSubmitterId(String submitterId) {
		this.submitterId = submitterId;
	}

	/**
	 * @return the submitter
	 */
	public String getSubmitter() {
		return submitter;
	}

	/**
	 * @param submitter
	 *            the submitter to set
	 */
	public void setSubmitter(String submitter) {
		this.submitter = submitter;
	}

	/**
	 * @return the submitterPositionId
	 */
	public String getSubmitterPositionId() {
		return submitterPositionId;
	}

	/**
	 * @param submitterPositionId
	 *            the submitterPositionId to set
	 */
	public void setSubmitterPositionId(String submitterPositionId) {
		this.submitterPositionId = submitterPositionId;
	}

	/**
	 * @return the submitterPosition
	 */
	public String getSubmitterPosition() {
		return submitterPosition;
	}

	/**
	 * @param submitterPosition
	 *            the submitterPosition to set
	 */
	public void setSubmitterPosition(String submitterPosition) {
		this.submitterPosition = submitterPosition;
	}

	/**
	 * @return the submittingOrgID
	 */
	public String getSubmittingOrgID() {
		return submittingOrgID;
	}

	/**
	 * @param submittingOrgID
	 *            the submittingOrgID to set
	 */
	public void setSubmittingOrgID(String submittingOrgID) {
		this.submittingOrgID = submittingOrgID;
	}

	/**
	 * @return the submittingOrg
	 */
	public String getSubmittingOrg() {
		return submittingOrg;
	}

	/**
	 * @param submittingOrg
	 *            the submittingOrg to set
	 */
	public void setSubmittingOrg(String submittingOrg) {
		this.submittingOrg = submittingOrg;
	}

	/**
	 * @return the comment
	 */
	public String getComment() {
		return comment;
	}

	/**
	 * @param comment
	 *            the comment to set
	 */
	public void setComment(String comment) {
		this.comment = comment;
	}

	/**
	 * @return the createTimeStamp
	 */
	public long getCreateTimeStamp() {
		return createTimeStamp;
	}

	/**
	 * @param createTimeStamp
	 *            the createTimeStamp to set
	 */
	public void setCreateTimeStamp(long createTimeStamp) {
		this.createTimeStamp = createTimeStamp;
	}

	/**
	 * @return the approverId
	 */
	public String getApproverId() {
		return approverId;
	}

	/**
	 * @param approverId
	 *            the approverId to set
	 */
	public void setApproverId(String approverId) {
		this.approverId = approverId;
	}

	/**
	 * @return the approver
	 */
	public String getApprover() {
		return approver;
	}

	/**
	 * @param approver
	 *            the approver to set
	 */
	public void setApprover(String approver) {
		this.approver = approver;
	}

	/**
	 * @return the approverPositionId
	 */
	public String getApproverPositionId() {
		return approverPositionId;
	}

	/**
	 * @param approverPositionId
	 *            the approverPositionId to set
	 */
	public void setApproverPositionId(String approverPositionId) {
		this.approverPositionId = approverPositionId;
	}

	/**
	 * @return the approverPosition
	 */
	public String getApproverPosition() {
		return approverPosition;
	}

	/**
	 * @param approverPosition
	 *            the approverPosition to set
	 */
	public void setApproverPosition(String approverPosition) {
		this.approverPosition = approverPosition;
	}

	/**
	 * @return the approverOrg
	 */
	public String getApproverOrg() {
		return approverOrg;
	}

	/**
	 * @param approverOrg
	 *            the approverOrg to set
	 */
	public void setApproverOrg(String approverOrg) {
		this.approverOrg = approverOrg;
	}

}
