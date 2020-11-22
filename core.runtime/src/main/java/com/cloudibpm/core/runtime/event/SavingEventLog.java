/**
 * 
 */
package com.cloudibpm.core.runtime.event;

/**
 * @author Dahai Cao created on 2013-03-27, last updated on 2018-3-23, at 20:16
 *         on 2018-08-13
 * 
 */
public class SavingEventLog extends Event {

	/**
	 * TreeNode
	 */
	private static final long serialVersionUID = 797435326778848120L;
	/**
	 * Special server event;
	 */
//	public static final int SAVING_CACHE = 1;
	/**
	 * Special server event;
	 */
	public static final int SAVING_HISTORY = 2;
	private String wfProcessCode = null;
	private Object content = null;// JSON String

	/**
	 * 
	 */
	public SavingEventLog() {
	}

	public SavingEventLog(int type, String code, Object content) {
		this.setType(type);
		this.setWfProcessCode(code);
		this.setContent(content);
	}

	/**
	 * @return the content
	 */
	public Object getContent() {
		return content;
	}

	/**
	 * @param content
	 *            the content to set
	 */
	public void setContent(Object content) {
		this.content = content;
	}

	/**
	 * @return the wfProcessCode
	 */
	public String getWfProcessCode() {
		return wfProcessCode;
	}

	/**
	 * @param wfProcessCode
	 *            the wfProcessCode to set
	 */
	public void setWfProcessCode(String wfProcessCode) {
		this.wfProcessCode = wfProcessCode;
	}

	public String toString() {
		return super.toString();
	}
}