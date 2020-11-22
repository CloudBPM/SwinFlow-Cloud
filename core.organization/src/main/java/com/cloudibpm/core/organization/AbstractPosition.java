/**
 * 
 */
package com.cloudibpm.core.organization;

/**
 * 
 * @author CAO Dahai
 * @date 2016-07-27 16:20pm
 */
public class AbstractPosition extends AbstractOrganizationComponent {

	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = 2624707301799394785L;
	/**
	 * this position is using the office calendar
	 */
	private String officeCalendarID = null;
	/**
	 * 0:no holiday;1:has holiday;
	 */
	private int hasHoliday = 0;

	/**
	 * 
	 */
	public AbstractPosition() {
	}

	/**
	 * @param id
	 */
	public AbstractPosition(String id) {
		super(id);
	}

	public String getOfficeCalendarID() {
		return officeCalendarID;
	}

	public void setOfficeCalendarID(String officeCalendarID) {
		this.officeCalendarID = officeCalendarID;
	}

	public int getHasHoliday() {
		return hasHoliday;
	}

	public void setHasHoliday(int hasHoliday) {
		this.hasHoliday = hasHoliday;
	}
}
