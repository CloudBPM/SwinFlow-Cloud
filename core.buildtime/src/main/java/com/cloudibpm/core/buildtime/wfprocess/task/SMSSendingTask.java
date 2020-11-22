/**
 * 
 */
package com.cloudibpm.core.buildtime.wfprocess.task;

/**
 * @author dev
 *
 */
public class SMSSendingTask extends AbstractTask {

	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = 2414708295776969447L;
	private String templateId = null; // template ID.
	private String template = null;
	private MessageReceiver[] receivers = new MessageReceiver[0];

	/**
	 * 
	 */
	public SMSSendingTask() {
		setName("SMS Sending Task");
		setClasstypename(this.getClass().getSimpleName());
	}

	/**
	 * @param id
	 */
	public SMSSendingTask(String id) {
		super(id);
		setName("SMS Sending Task");
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

}
