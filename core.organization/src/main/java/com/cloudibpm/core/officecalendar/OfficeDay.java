/**
 * 
 */
package com.cloudibpm.core.officecalendar;

import com.cloudibpm.core.TreeNode;

/**
 * 这个类是Office Calendar表model.
 * 
 */
public class OfficeDay extends TreeNode {

	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = 1395407026594900454L;
	// 1: Monday;2:Tuesday;3:Wednesday;4:Thursday;
	// 5:Friday;6:Saturday;7:Sunday
	private int weekkDay = 1;
	// 0: is work day; 1: is not work day
	private int isWorkDay = 1;

	public int getWeekkDay() {
		return weekkDay;
	}

	public void setWeekkDay(int weekkDay) {
		this.weekkDay = weekkDay;
	}

	public int getIsWorkDay() {
		return isWorkDay;
	}

	public void setIsWorkDay(int isWorkDay) {
		this.isWorkDay = isWorkDay;
	}
}