/**
 *
 */
package com.cloudibpm.core.runtime.wfprocess.task;

import com.cloudibpm.core.buildtime.wfprocess.task.ManualTask;

/**
 *
 * @author CAODAHAI 05/08/2009, last updated on 20180221
 *
 */
public class ManualTaskInstance extends ManualTask {

	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = -5249029660043088007L;
	private long enabledTime = -1;
	private long startTime = -1;
	private long endTime = -1;
	private String definitionId = null;
	private long expiryDateTime = -1;
	private long alarmDateTime = -1;
	private String expiryHandlerInstanceId = null;
	/**
	 * Manual task instance submission phases:
	 * <UL>
	 * <li>-1: by default;</li>
	 * <li>0: wait for fetching;</li>
	 * <li>1: fetched but not submit yet;</li>
	 * <li>2: submitted;</li>
	 * <li>3: returned;</li>
	 * </UL>
	 */
	private int phase = -1;
	private String submitterId = null;
	private String submitter = null; // task executor
	private String submitterIp = null;
	/**
	 * work assignment priority:
	 * <UL>
	 * <li>-1: by default;</li>
	 * <li>0: normal; (low priority or general priority)</li>
	 * <li>1: important; (higher priority)</li>
	 * <li>2: urgent; (high priority)</li>
	 * </UL>
	 */
	private int priority = -1;
	private String[] candidates = new String[0];
	/**
	 * 这个属性是用来描述会商邀请的，该数组中放置的都是收到会商邀请的人的user Id。
	 */
	private String[] invitations = new String[0];

	/**
	 * Manual task constructor
	 */
	public ManualTaskInstance() {
		super();
		setName("Manual Task Instance");
		setClasstypename("ManualTaskInstance");
	}

	/**
	 * Manual task constructor with the task id.
	 *
	 * @param id
	 *            String
	 */
	public ManualTaskInstance(String id) {
		super(id);
		setName("Manual Task Instance");
		setClasstypename("ManualTaskInstance");
	}

	@Override
	public Object clone() throws CloneNotSupportedException {
		ManualTaskInstance clone = (ManualTaskInstance) super.clone();
		cloneChildren(this);
		return clone;
	}

	/**
	 * Sets the participant that executes this manual task. This participant is
	 * object of user.
	 *
	 * @param submitterId
	 *            The submitter Id, it is a user staff Id
	 */
	public void setSubmitterId(String submitterId) {
		this.submitterId = submitterId;
	}

	/**
	 * Returns the participant that executes this manual task. This participant
	 * is object of user.
	 *
	 * @return String
	 */
	public String getSubmitterId() {
		return submitterId;
	}


	public String getSubmitter() {
		return submitter;
	}

	public void setSubmitter(String submitter) {
		this.submitter = submitter;
	}

	/**
	 * Sets expire date for this task. When this task is instantiated, system
	 * will compute a real expire date according to deadline and its unit and
	 * set the date to this property.
	 *
	 * @param expiryDate
	 *            Date
	 */
	public void setExpiryDateTime(long expiryDateTime) {
		this.expiryDateTime = expiryDateTime;
	}

	/**
	 * Returns expire date for this task. When this task is instantiated, system
	 * will compute a real expire date according to deadline and its unit and
	 * set the date to this property.
	 *
	 * @return
	 */
	public long getExpiryDateTime() {
		return this.expiryDateTime;
	}

	/**
	 * Returns real alarm date for this task. When this task is instantiated,
	 * system will compute a real alarm date according to alarm and its unit and
	 * set the date to this property.
	 *
	 * @return Date
	 */
	public long getAlarmDateTime() {
		return this.alarmDateTime;
	}

	/**
	 * Returns machine host IP address that accesses this manual task. If the
	 * machine locked this task, then its IP will be recorded in this property.
	 *
	 * @return String
	 */
	public String getSubmitterIp() {
		return this.submitterIp;
	}

	/**
	 * Sets an expiration handling business process for this task. When
	 * expiration emerges, system will transfer this process to the handling
	 * process for exception processing.
	 *
	 * @return BusinessProcess
	 */
	public String getExpiryHandlerInstanceId() {
		return this.expiryHandlerInstanceId;
	}

	/**
	 * Sets alarm date for this task. When this task is instantiated, system
	 * will compute a real alarm date according to alarm and its unit and set
	 * the date to this property.
	 *
	 * @param alarmDateTime
	 *            Date
	 */
	public void setAlarmDateTime(long alarmDateTime) {
		this.alarmDateTime = alarmDateTime;
	}

	/**
	 * Sets machine host IP address that accesses this manual task. If the
	 * machine locked this task, then its IP will be recorded in this property.
	 *
	 * @param ip
	 *            String
	 */
	public void setSubmitterIp(String submitterIp) {
		this.submitterIp = submitterIp;
	}

	/**
	 * Returns an expiration handling business process for this task. When
	 * expiration emerges, system will transfer this process to the handling
	 * process for exception processing.
	 *
	 * @param expiryHandlerProcess
	 *            WfProcessInstance ID
	 */
	public void setExpiryHandlerInstanceId(String expiryHandlerInstanceId) {
		this.expiryHandlerInstanceId = expiryHandlerInstanceId;
	}

	public int getPhase() {
		return phase;
	}

	public void setPhase(int phase) {
		this.phase = phase;
	}

	/**
	 * @return the startTime
	 */
	public long getStartTime() {
		return startTime;
	}

	/**
	 * @param startTime
	 *            the startTime to set
	 */
	public void setStartTime(long startTime) {
		this.startTime = startTime;
	}

	/**
	 * @return the endTime
	 */
	public long getEndTime() {
		return endTime;
	}

	/**
	 * @param endTime
	 *            the endTime to set
	 */
	public void setEndTime(long endTime) {
		this.endTime = endTime;
	}

	/**
	 * @return the definitionId
	 */
	public String getDefinitionId() {
		return definitionId;
	}

	/**
	 * @param definitionId
	 *            the definitionId to set
	 */
	public void setDefinitionId(String definitionId) {
		this.definitionId = definitionId;
	}

	/**
	 * @return the enabledTime
	 */
	public long getEnabledTime() {
		return enabledTime;
	}

	/**
	 * @param enabledTime
	 *            the enabledTime to set
	 */
	public void setEnabledTime(long enabledTime) {
		this.enabledTime = enabledTime;
	}

	/**
	 * @return the candidates
	 */
	public String[] getCandidates() {
		return candidates;
	}

	/**
	 * @param candidates
	 *            the candidates to set
	 */
	public void setCandidates(String[] candidates) {
		this.candidates = candidates;
	}

	/**
	 * @return the priority
	 */
	public int getPriority() {
		return priority;
	}

	/**
	 * @param priority
	 *            the priority to set
	 */
	public void setPriority(int priority) {
		this.priority = priority;
	}

	/**
	 * @return the invitations
	 */
	public String[] getInvitations() {
		return invitations;
	}

	/**
	 * @param invitations
	 *            the invitations to set
	 */
	public void setInvitations(String[] invitations) {
		this.invitations = invitations;
	}

	public void resetRuntimeProps() {
		this.setInvitations(new String[0]);
		this.setStartTime(-1);
		this.setPhase(-1);
		this.setSubmitterId(null);
		this.setSubmitterIp(null);
		this.setSubmitter(null);
		this.setPriority(-1);
	}
}