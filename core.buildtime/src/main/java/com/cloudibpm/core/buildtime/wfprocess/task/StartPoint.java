/**
 * 
 */
package com.cloudibpm.core.buildtime.wfprocess.task;

import com.cloudibpm.core.data.variable.AccessibleVariable;

/**
 * @author Dahai Cao 2008-09-09
 * 
 */
public class StartPoint extends AbstractTask {

	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = 5638968420238537831L;
	// 0: launch form; 1: launch UI url
	private int launchUIType = 0;
	// launch form content (process home page) for process accessing
	private Object launchFormContent = null;
	// The launch UI.
	private String launchUIUrl = null;
	private AccessibleVariable[] accessibleVars = new AccessibleVariable[0]; 
	/**
	 * 
	 */
	public StartPoint() {
		setName("Start Point");
		setClasstypename(this.getClass().getSimpleName());
	}

	/**
	 * @return the launchUIUrl
	 */
	public String getLaunchUIUrl() {
		return launchUIUrl;
	}

	/**
	 * @param launchUIUrl
	 *            the launchUIUrl to set
	 */
	public void setLaunchUIUrl(String launchUIUrl) {
		this.launchUIUrl = launchUIUrl;
	}

	/**
	 * @return the launchFormContent
	 */
	public Object getLaunchFormContent() {
		return launchFormContent;
	}

	/**
	 * @param launchFormContent
	 *            the launchFormContent to set
	 */
	public void setLaunchFormContent(Object launchFormContent) {
		this.launchFormContent = launchFormContent;
	}

	/**
	 * @return the launchUIType
	 */
	public int getLaunchUIType() {
		return launchUIType;
	}

	/**
	 * @param launchUIType
	 *            the launchUIType to set
	 */
	public void setLaunchUIType(int launchUIType) {
		this.launchUIType = launchUIType;
	}

	/**
	 * @return the accessibleVars
	 */
	public AccessibleVariable[] getAccessibleVars() {
		return accessibleVars;
	}

	/**
	 * @param accessibleVars
	 *            the accessibleVars to set
	 */
	public void setAccessibleVars(AccessibleVariable[] accessibleVars) {
		this.accessibleVars = accessibleVars;
	}
}
