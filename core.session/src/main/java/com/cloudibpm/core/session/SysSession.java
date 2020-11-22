/**
 * 
 */
package com.cloudibpm.core.session;

import com.cloudibpm.core.WorkflowEntity;
import com.cloudibpm.core.organization.Position;
import com.cloudibpm.core.user.Staff;
import com.cloudibpm.core.user.User;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpSession;
import javax.servlet.http.HttpSessionContext;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;

/**
 * @author Dahai Cao created at 08:45 on 2018-10-25
 *
 */
public class SysSession extends WorkflowEntity implements HttpSession {

	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = 7366527716004457599L;
	private Map<String, Object> attributes = new HashMap<String, Object>();
	private long lastupdate = 0L;
	private long createDatetime = 0L;
	private User user = null;
	private Staff[] staffships = new Staff[0];
	private Position[] positions = new Position[0];

	/**
	 * 
	 */
	public SysSession() {
	}

	/**
	 * @param id
	 */
	public SysSession(String id) {
		super(id);
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

	public Position[] getPositions() {
		return positions;
	}

	public void setPositions(Position[] positions) {
		this.positions = positions;
	}

	public long getCreationTime() {
		return createDatetime;
	}

	public long getLastAccessedTime() {
		return lastupdate;
	}

	public ServletContext getServletContext() {
		return null;
	}

	public void setMaxInactiveInterval(int interval) {
	}

	public int getMaxInactiveInterval() {
		return 0;
	}

	@SuppressWarnings("deprecation")
	public HttpSessionContext getSessionContext() {
		return null;
	}

	public Object getAttribute(String name) {
		return null;
	}

	public Object getValue(String name) {
		return null;
	}

	public Enumeration<String> getAttributeNames() {
		return null;
	}

	public String[] getValueNames() {
		return null;
	}

	public void setAttribute(String name, Object value) {
		attributes.put(name, value);
	}

	public void putValue(String name, Object value) {
		attributes.put(name, value);
	}

	public void removeAttribute(String name) {
		attributes.remove(name);
	}

	public void removeValue(String name) {
		attributes.remove(name);
	}

	public void invalidate() {
	}

	public boolean isNew() {
		return false;
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

}
