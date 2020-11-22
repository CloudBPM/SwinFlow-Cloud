package com.cloudibpm.blo.om.authorization;

import com.cloudibpm.core.authorization.AuthorityGroup;
import com.cloudibpm.core.authorization.GroupMember;
import com.cloudibpm.core.authorization.GroupMemberEditList;
import com.cloudibpm.core.repository.BusinessLogicObject;
import com.cloudibpm.core.user.Staff;
import com.cloudibpm.eso.om.user.WfGroupMemberEso;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.SQLException;
import java.util.List;

@Service
//@Transactional
public class WfGroupMemberBlo extends BusinessLogicObject {
	private final WfGroupMemberEso wfGroupMemberEso;

	@Autowired
	public WfGroupMemberBlo(WfGroupMemberEso wfGroupMemberEso) {
		this.wfGroupMemberEso = wfGroupMemberEso;
	}

	/**
	 * Add staff into an authority group.
	 *
	 * @param staff
	 * @param ag
	 * @throws SQLException
	 */
	public void addUserIntoGroup(Staff staff, AuthorityGroup ag) throws SQLException {

		wfGroupMemberEso.insert(staff.getId(), ag.getId(), ag.getOwner());
	}

	public void updateAuthorityGroupMemberEditList(GroupMemberEditList editlist) throws SQLException {

		if (editlist.getAddedMemberIds() != null && editlist.getAddedMemberIds().length > 0) {
			for (int i = 0; i < editlist.getAddedMemberIds().length; i++) {
				wfGroupMemberEso.insert(editlist.getAddedMemberIds()[i], editlist.getGroupId(), editlist.getOwnerId());
			}
		}
		if (editlist.getRemovedMemberIds() != null && editlist.getRemovedMemberIds().length > 0) {
			for (int i = 0; i < editlist.getRemovedMemberIds().length; i++) {
				wfGroupMemberEso.delete(editlist.getRemovedMemberIds()[i], editlist.getGroupId());
			}
		}
	}

	public GroupMemberEditList getGroupMemberEditList(String groupId, String owner) throws SQLException {
		GroupMemberEditList list = new GroupMemberEditList();

		List<GroupMember> leftmembers = wfGroupMemberEso.queryAllGroupMembers(groupId, owner);
		List<GroupMember> rightmembers = wfGroupMemberEso.queryAllNonGroupMembers(groupId, owner);
		list.setGroupId(groupId);
		list.setLeftList(leftmembers.toArray(new GroupMember[leftmembers.size()]));
		list.setRightList(rightmembers.toArray(new GroupMember[rightmembers.size()]));
		return list;
	}


}
