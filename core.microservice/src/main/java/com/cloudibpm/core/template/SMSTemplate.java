/**
 * 
 */
package com.cloudibpm.core.template;

import com.cloudibpm.core.TreeNode;

/**
 * @author dev
 *
 */
public class SMSTemplate extends TreeNode {

	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = -9210733356703291904L;
	private String smsContent = null;
	// 0: invalid; 1:valid
	private int status = 0;
	private int useCounting = 0;
	private long createDateTime = 0L;
	private long lastupdate = 0L;
	private long onlineDateTime = -1;
	private long offlineDateTime = -1;

	/**
	 * 
	 */
	public SMSTemplate() {
	}

	/**
	 * @param id
	 */
	public SMSTemplate(String id) {
		super(id);
	}

	public String getSmsContent() {
		return smsContent;
	}

	public void setSmsContent(String smsContent) {
		this.smsContent = smsContent;
	}

	public int getStatus() {
		return status;
	}

	public void setStatus(int status) {
		this.status = status;
	}

	public int getUseCounting() {
		return useCounting;
	}

	public void setUseCounting(int useCounting) {
		this.useCounting = useCounting;
	}

	public long getCreateDateTime() {
		return createDateTime;
	}

	public void setCreateDateTime(long createDateTime) {
		this.createDateTime = createDateTime;
	}

	public long getLastupdate() {
		return lastupdate;
	}

	public void setLastupdate(long lastupdate) {
		this.lastupdate = lastupdate;
	}

	/**
	 * @return the onlineDateTime
	 */
	public long getOnlineDateTime() {
		return onlineDateTime;
	}

	/**
	 * @param onlineDateTime
	 *            the onlineDateTime to set
	 */
	public void setOnlineDateTime(long onlineDateTime) {
		this.onlineDateTime = onlineDateTime;
	}

	/**
	 * @return the offlineDateTime
	 */
	public long getOfflineDateTime() {
		return offlineDateTime;
	}

	/**
	 * @param offlineDateTime
	 *            the offlineDateTime to set
	 */
	public void setOfflineDateTime(long offlineDateTime) {
		this.offlineDateTime = offlineDateTime;
	}

}
