/**
 * 
 */
function SubmittingApprovalLog() {
	this.id = null;
	this.name = null;

	// 这个属性是指什么对象ID的审核日志，如流程对象ID，组织对象ID，邮件模板对象ID，
	// 短信模板对象ID，表单对象ID，微服务对象ID，新闻/动态对象ID
	this.objectId = null;
	// 这个属性是指什么对象名称的审核日志，如流程对象，组织对象，邮件模板对象，
	// 短信模板对象，表单对象，微服务对象，新闻/动态对象
	this.objectName = null;
	// 这个属性是指什么对象的类如WfProcess，Organization，EmailTemplate，
	// SMSTemplate，Form，Microservice，News
	this.objectClass = null;
	// 被审核的对象的状态。
	this.status = -1;
	// 这个属性是指审核意见
	this.comment = null;
	// 创建事件戳
	this.createTimeStamp = 0;
	//提交人姓名
	this.submitter = null;
	// 提交人职位ID
	this.submitterPositionId = null;
	// 提交人职位
	this.submitterPosition = null;
	// 提交组织ID
	this.submittingOrgID = null;
	// 提交组织名称
	this.submittingOrg = null;
	// 这个属性是指审核意见
	this.comment = null;
	// 创建事件戳
	this.createTimeStamp = 0;
	// 审核人ID
	this.approverId = null;
	// 审核人姓名
	this.approver = null;
	// 审核人员岗位ID
	this.approverPositionId = null;
    // 审核人员岗
	this.approverPosition = null;
	// 审核人组织名称
	this.approverOrg = null;
	this.currOwner = null;
	// 审核人组织ID
	this.owner = null;
	this.classtypename = "SubmittingApprovalLog";
};

SubmittingApprovalLog.prototype = new WorkflowEntity();

SubmittingApprovalLog.prototype.parseFromJSON = function(json) {
	this.id = json.id;
	this.name = json.name;

	this.objectId = json.objectId;
	this.objectName = json.objectName;
	this.objectClass = json.objectClass;
	this.status = json.status;
	this.comment = json.comment;
	this.createTimeStamp = Utils.getDateTime(json.createTimeStamp);

	this.submitter = json.submitter;
	this.submitterPositionId = json.submitterPositionId;
	this.submitterPosition = json.submitterPosition;
	this.submittingOrgID = json.submittingOrgID;
	this.submittingOrg = json.submittingOrg;
	this.comment = json.comment;
	this.approverId = json.approverId;
	this.approver = json.approver;
	this.approverPositionId = json.approverPositionId;
	this.approverPosition = json.approverPosition;
	this.approverOrg = json.approverOrg;
	this.currOwner = json.currOwner;
	this.owner = json.currOwner;
};
