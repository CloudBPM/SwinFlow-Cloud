/**
 * 
 */
package com.cloudibpm.core.user;

import com.cloudibpm.core.organization.AbstractPosition;
import com.cloudibpm.core.user.preference.MyPreference;

import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;


/**
 * @author Caodahai
 *
 */
public class Login implements Serializable {
	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = 2429399997771327283L;
	private int statusCode = 0;
	private User user = null;
	private Staff[] staffships = new Staff[0];
	private AbstractPosition[] positions = new AbstractPosition[0];

	private Map<String, Object> attributes = new HashMap<String, Object>();
	private long lastupdate = 0L;
	private long createDatetime = 0L;
	private MyPreference prefer = null;

	/**
	 * 
	 */
	public Login() {
	}

	/**
	 * 
	 */
	public Login(int statusCode, User user, Staff[] staffships) {
		this();
		this.statusCode = statusCode;
		this.user = user;
		this.staffships = staffships;
	}

	/**
	 * @return the staffships
	 */
	public Staff[] getStaffships() {
		return staffships;
	}

	/**
	 * @param staffships
	 *            the staffships to set
	 */
	public void setStaffships(Staff[] staffships) {
		this.staffships = staffships;
	}

	/**
	 * @return the user
	 */
	public User getUser() {
		return user;
	}

	/**
	 * @param user
	 *            the user to set
	 */
	public void setUser(User user) {
		this.user = user;
	}

	/**
	 * @return the statusCode
	 */
	public int getStatusCode() {
		return statusCode;
	}

	/**
	 * @param statusCode
	 *            the statusCode to set
	 */
	public void setStatusCode(int statusCode) {
		this.statusCode = statusCode;
	}

	public AbstractPosition[] getPositions() {
		return positions;
	}

	public void setPositions(AbstractPosition[] positions) {
		this.positions = positions;
	}

	public Map<String, Object> getAttributes() {
		return attributes;
	}

	public void setAttributes(Map<String, Object> attributes) {
		this.attributes = attributes;
	}

	public long getLastupdate() {
		return lastupdate;
	}

	public void setLastupdate(long lastupdate) {
		this.lastupdate = lastupdate;
	}

	public long getCreateDatetime() {
		return createDatetime;
	}

	public void setCreateDatetime(long createDatetime) {
		this.createDatetime = createDatetime;
	}

	public String toString() {
		if (user != null) {
			return user.getSurname() + user.getGivenname();
		}
		return "Unknow user";
	}

	public MyPreference getPrefer() {
		return prefer;
	}

	public void setPrefer(MyPreference prefer) {
		this.prefer = prefer;
	}
}
