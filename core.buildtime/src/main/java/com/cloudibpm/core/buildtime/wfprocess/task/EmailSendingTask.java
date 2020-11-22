package com.cloudibpm.core.buildtime.wfprocess.task;

public class EmailSendingTask extends AbstractTask {

	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = 6016531843195953574L;
	private String subject = null;
	// template content
	private String template = null;
	private MessageReceiver[] receivers = new MessageReceiver[0];
	private String templateId = null; // template ID.
	private Object[] variables = new Object[0];
	// the attachments only lists those in process in custom
	private Object[] attachments = new Object[0];

	public EmailSendingTask() {
		setName("Email Sending Task");
		setClasstypename(this.getClass().getSimpleName());
	}

	public EmailSendingTask(String id) {
		super(id);
		setName("Email Sending Task");
		setClasstypename(this.getClass().getSimpleName());
	}

	/**
	 * @return the template
	 */
	public String getTemplate() {
		return template;
	}

	/**
	 * @param template
	 *            the template to set
	 */
	public void setTemplate(String template) {
		this.template = template;
	}

	/**
	 * @return the receivers
	 */
	public MessageReceiver[] getReceivers() {
		return receivers;
	}

	/**
	 * @param receivers
	 *            the receivers to set
	 */
	public void setReceivers(MessageReceiver[] receivers) {
		this.receivers = receivers;
	}

	/**
	 * @return the templateId
	 */
	public String getTemplateId() {
		return templateId;
	}

	/**
	 * @param templateId
	 *            the templateId to set
	 */
	public void setTemplateId(String templateId) {
		this.templateId = templateId;
	}

	/**
	 * @return the variables
	 */
	public Object[] getVariables() {
		return variables;
	}

	/**
	 * @param variables
	 *            the variables to set
	 */
	public void setVariables(Object[] variables) {
		this.variables = variables;
	}

	/**
	 * @return the attachments
	 */
	public Object[] getAttachments() {
		return attachments;
	}

	/**
	 * @param attachments
	 *            the attachments to set
	 */
	public void setAttachments(Object[] attachments) {
		this.attachments = attachments;
	}

	/**
	 * @return the subject
	 */
	public String getSubject() {
		return subject;
	}

	/**
	 * @param subject the subject to set
	 */
	public void setSubject(String subject) {
		this.subject = subject;
	}

}
