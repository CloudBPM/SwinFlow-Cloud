/**
 * 
 */
package com.cloudibpm.core.job;

import java.io.Serializable;

/**
 * @author dev
 *
 */
public class JobAssignmentEditList implements Serializable {

	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = -4549090663315271876L;
	// newly added staff ID array on the position or the project role
	private String[] addedStaffIds = null;
	// removed staff ID array on the position or the project role
	private String[] removedStaffIds = null;

	// the position ID or project role ID
	private String positionId = null;
	private String staffId = null;
	// 0 means that the positionId is a position ID, 1 means that positionId is
	// a project role ID.
	private int source = 0;
	// organization ID
	private String ownerId = null;

	// current staff array list on the position and the project role
	private JobAssignment[] leftList = null;
	// current staff array list NOT on the position and the project role
	private JobAssignment[] rightList = null;

	// the description for changed assignments
	private String description = null;

	/**
	 * 
	 */
	public String getStaffId() {
		return staffId;
	}

	public void setStaffId(String staffId) {
		this.staffId = staffId;
	}
	
	public JobAssignmentEditList() {
	}

	public String[] getAddedStaffIds() {
		return addedStaffIds;
	}

	public void setAddedStaffIds(String[] addedStaffIds) {
		this.addedStaffIds = addedStaffIds;
	}

	public String[] getRemovedStaffIds() {
		return removedStaffIds;
	}

	public void setRemovedStaffIds(String[] removedStaffIds) {
		this.removedStaffIds = removedStaffIds;
	}

	public String getPositionId() {
		return positionId;
	}

	public void setPositionId(String positionId) {
		this.positionId = positionId;
	}

	public String getOwnerId() {
		return ownerId;
	}

	public void setOwnerId(String ownerId) {
		this.ownerId = ownerId;
	}

	public JobAssignment[] getLeftList() {
		return leftList;
	}

	public void setLeftList(JobAssignment[] leftList) {
		this.leftList = leftList;
	}

	public JobAssignment[] getRightList() {
		return rightList;
	}

	public void setRightList(JobAssignment[] rightList) {
		this.rightList = rightList;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public int getSource() {
		return source;
	}

	public void setSource(int source) {
		this.source = source;
	}

}
