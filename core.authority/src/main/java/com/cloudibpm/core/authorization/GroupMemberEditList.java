/**
 * 
 */
package com.cloudibpm.core.authorization;

/**
 * @author dev
 *
 */
public class GroupMemberEditList implements java.io.Serializable {

	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = -1131237713242210277L;
	private String[] addedMemberIds = null; // newly added staff ID array
	private String[] removedMemberIds = null; // removed staff ID array

	private String groupId = null; // authority group ID
	private String ownerId = null; // organization ID

	// current staff array list in authority group
	private GroupMember[] leftList = null;
	// current staff array list NOT in authority group
	private GroupMember[] rightList = null;

	/**
	 * 
	 */
	public GroupMemberEditList() {
	}

	public String[] getAddedMemberIds() {
		return addedMemberIds;
	}

	public void setAddedMemberIds(String[] addedMemberIds) {
		this.addedMemberIds = addedMemberIds;
	}

	public String[] getRemovedMemberIds() {
		return removedMemberIds;
	}

	public void setRemovedMemberIds(String[] removedMemberIds) {
		this.removedMemberIds = removedMemberIds;
	}

	public String getGroupId() {
		return groupId;
	}

	public void setGroupId(String groupId) {
		this.groupId = groupId;
	}

	public GroupMember[] getLeftList() {
		return leftList;
	}

	public void setLeftList(GroupMember[] leftList) {
		this.leftList = leftList;
	}

	public GroupMember[] getRightList() {
		return rightList;
	}

	public void setRightList(GroupMember[] rightList) {
		this.rightList = rightList;
	}

	public String getOwnerId() {
		return ownerId;
	}

	public void setOwnerId(String ownerId) {
		this.ownerId = ownerId;
	}

}
