package com.cloudibpm.blo.om.authorization;

import com.cloudibpm.blo.buildtime.id.BuildtimeIDGenerator;
import com.cloudibpm.core.authorization.AuthorityGroup;
import com.cloudibpm.core.authorization.AuthorityGroupPage;
import com.cloudibpm.core.authorization.GroupMember;
import com.cloudibpm.core.authorization.GroupMemberPage;
import com.cloudibpm.core.repository.BusinessLogicObject;
import com.cloudibpm.eso.om.authorization.AuthorizationEso;
import com.cloudibpm.eso.om.authorization.AutorityGroupEso;
import com.cloudibpm.eso.om.user.WfGroupMemberEso;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
//@Transactional
public class WfAuthorityGroupBlo extends BusinessLogicObject {
	private final BuildtimeIDGenerator buildtimeIDGenerator;
	private final AutorityGroupEso autorityGroupEso;
	private final WfGroupMemberEso wfGroupMemberEso;
	private final AuthorizationEso authorizationEso;


	@Autowired
	public WfAuthorityGroupBlo(BuildtimeIDGenerator buildtimeIDGenerator, AutorityGroupEso autorityGroupEso, WfGroupMemberEso wfGroupMemberEso, AuthorizationEso authorizationEso) {
		this.buildtimeIDGenerator = buildtimeIDGenerator;
		this.autorityGroupEso = autorityGroupEso;
		this.wfGroupMemberEso = wfGroupMemberEso;
		this.authorizationEso = authorizationEso;
	}


	/**
	 * Add a new authority group.
	 *
	 * @param groupname
	 * @throws SQLException
	 */
	public AuthorityGroup add(String groupname, String description, String owner) throws Exception {
		AuthorityGroup group = new AuthorityGroup();
		String id = buildtimeIDGenerator.getNewBuildTimeID();
		group.setId(id);
		group.setName(groupname);
		group.setDescription(description);
		group.setCreateDate(new Date());
		group.setOwner(owner);
		addNewGroup(group);
		return group;
	}

	/**
	 * Add a new authority group.
	 *
	 * @param ag
	 * @throws SQLException
	 */
	public void addNewGroup(AuthorityGroup ag) throws SQLException {

		autorityGroupEso.insert(ag);
	}

	public void updateGroup(AuthorityGroup ag) throws SQLException {

		autorityGroupEso.update(ag);
	}

	public String[] getAuthorizationByStaffId(String staffID) throws SQLException {

		List<String> list = wfGroupMemberEso.queryAuthoritiesByStaffId(staffID);
		if (list.size() > 0) {
			List<String> auths = new ArrayList<String>();
			for (int j = 0; j < list.size(); j++) {
				if (!auths.contains(list.get(j))) {
					auths.add(list.get(j));
				}
			}
			return auths.toArray(new String[auths.size()]);
		}
		return new String[0];
	}

	public GroupMemberPage getAllGroupMembers(String condition, String groupid, int pageno, int pagesize)
			throws SQLException {

		GroupMemberPage page = new GroupMemberPage(pageno, pagesize);
		int total = wfGroupMemberEso.queryAllGroupMemberCounting(groupid);
		if (total == 0) {
			page.setPageSize(pagesize);
			page.setPageNo(0);
			page.setAllEntitiesCount(0);
			page.setAllPagesCount(0);
			page.setPageIndex(0);
		} else {
			page.setPageSize(pagesize);
			if (condition == null || condition.equals("")) {
				page.setPageNo(pageno);
				page.setAllEntitiesCount(total);
				int n = total / pagesize;
				int m = total % pagesize;
				if (m > 0) {
					n = n + 1;
				}
				page.setAllPagesCount(n);
				int pageindex = (pageno - 1) * pagesize;
				page.setPageIndex(pageindex);
				List<GroupMember> members = wfGroupMemberEso.queryAllGroupMembers(condition, groupid, pageindex,
						pagesize);
				page.setPageEntities(members.toArray(new GroupMember[members.size()]));
			} else {
				total = wfGroupMemberEso.queryAllGroupMemberCounting(condition, groupid);
				page.setAllEntitiesCount(total);
				int n = total / pagesize;
				int m = total % pagesize;
				if (m > 0) {
					n = n + 1;
				}
				page.setAllPagesCount(n);
				int pageindex = (pageno - 1) * pagesize;
				List<GroupMember> groups = wfGroupMemberEso.queryAllGroupMembers(condition, groupid, pageindex,
						pagesize);
				page.setPageEntities(groups.toArray(new GroupMember[groups.size()]));
			}
		}
		return page;
	}

	public AuthorityGroupPage getAllAuthorizationGroups(String condition, String ownerid, int pageno, int pagesize)
			throws Exception {

		AuthorityGroupPage page = new AuthorityGroupPage(pageno, pagesize);
		int total = autorityGroupEso.getAllAuthorityGroupCounting(ownerid);
		if (total == 0) {
			page.setPageSize(pagesize);
			page.setPageNo(0);
			page.setAllEntitiesCount(0);
			page.setAllPagesCount(0);
			page.setPageIndex(0);
		} else {
			page.setPageSize(pagesize);
			if (condition == null || condition.equals("")) {
				page.setPageNo(pageno);
				page.setAllEntitiesCount(total);
				int n = total / pagesize;
				int m = total % pagesize;
				if (m > 0) {
					n = n + 1;
				}
				page.setAllPagesCount(n);
				int pageindex = (pageno - 1) * pagesize;
				page.setPageIndex(pageindex);
				List<AuthorityGroup> groups = autorityGroupEso.queryAllAuthorityGroups(ownerid, pageindex, pagesize);
				for (AuthorityGroup group : groups) {
					group.setAuthoritiesIds(authorizationEso.queryAuthorityIdsInGroup(group.getId()));
				}
				page.setPageEntities(groups.toArray(new AuthorityGroup[groups.size()]));
			} else {
				total = autorityGroupEso.getAllAuthorityGroupCounting(condition, ownerid);
				page.setAllEntitiesCount(total);
				int n = total / pagesize;
				int m = total % pagesize;
				if (m > 0) {
					n = n + 1;
				}
				page.setAllPagesCount(n);
				int pageindex = (pageno - 1) * pagesize;
				List<AuthorityGroup> groups = autorityGroupEso.queryAllAuthorityGroups(condition, ownerid, pageindex, pagesize);
				for (AuthorityGroup group : groups) {
					group.setAuthoritiesIds(authorizationEso.queryAuthorityIdsInGroup(group.getId()));
				}
				page.setPageEntities(groups.toArray(new AuthorityGroup[groups.size()]));
			}
		}
		return page;
	}

	public String [] updateAuthorityList(final AuthorityGroup group) throws SQLException {
		if (group.getAddedAuthIds() != null && group.getAddedAuthIds().length > 0) {
			for (int i = 0; i < group.getAddedAuthIds().length; i++) {
				authorizationEso.insert(group.getId(), group.getAddedAuthIds()[i], group.getOwner());
			}
		}
		if (group.getRemovedAuthIds() != null && group.getRemovedAuthIds().length > 0) {
			for (int i = 0; i < group.getRemovedAuthIds().length; i++) {
				authorizationEso.delete(group.getId(), group.getRemovedAuthIds()[i], group.getOwner());
			}
		}
		return authorizationEso.queryAuthorityIdsInGroup(group.getId());
	}

	// public List<Group> getGroups(TreeNode parent, WorkflowEntity owner)
	// throws Exception {
	// List<Group> groups = getAllGroups(parent, owner);
	// for (Group group : groups) {
	// assembly(groups, getMember(group), getAuthorization(group));
	// }
	// return groups;
	// }

	// private void assembly(List<Group> groups, List<RecordObject> memberRos,
	// List<RecordObject> authorizationRos)
	// throws Exception {
	// for (Group group : groups) {
	// for (int i = 0; i < memberRos.size(); i++) {
	// WfGroupMemberRo ro = (WfGroupMemberRo) memberRos.get(i);
	// group.getUsers().add(WfUserBlo.getInstance().getUserByID(ro.getUserForeignKey()));
	// }
	// for (int i = 0; i < authorizationRos.size(); i++) {
	// WfAuthorizationRo ro = (WfAuthorizationRo) authorizationRos.get(i);
	// group.getAuthorities().add(WfAuthorityBlo.getInstance().getAuthority(ro.getAuthorityForeignKey()));
	// }
	// }
	// }

	// private List<RecordObject> getAuthorization(Group group) throws
	// SQLException {
	// WfAuthorizationEso authorizationEso = new WfAuthorizationEso();
	// return authorizationEso.queryAll(group.getId());
	// }
	//
	// private List<RecordObject> getMember(Group group) throws SQLException {
	// WfGroupMemberEso memberEso = new WfGroupMemberEso();
	// return memberEso.queryAll(group.getId());
	// }
	//
	// /**
	// * Get page count of all records of workflow users.
	// *
	// * @param pagesize
	// * @return
	// */
	// private int getPageCount(int pagesize, List<User> users) {
	// int count = users.size();
	// int p = count / pagesize;
	// int r = count % pagesize;
	// int pagecount = 0;
	// if (r == 0)
	// pagecount = p;
	// else
	// pagecount = p + 1;
	// return pagecount;
	// }

	/**
	 * Gets workflow user list of current page. The condition firstly filters
	 * out available users according to organization <code>owner</code>, if
	 * <code>owner</code> is not null, and return users of No
	 * <code>currentpage</code> page according to the specified
	 * <code>pagesize</code>.
	 *
	 * @param pagesize
	 * @param currentpage
	 * @param condition
	 * @param owner
	 * @return
	 * @throws SQLException
	 */
	// public Page getCurrentPageUsersIn(int pagesize, int currentpage, String
	// condition, User[] wfusers) {
	// Page currentPage = new Page();
	// List<User> allPagesUsersList = getUsersByCondition(condition, wfusers);
	// currentPage.setCurrentPageNumber(currentpage);
	// currentPage.setPageCount(getPageCount(pagesize, allPagesUsersList));
	// currentPage.setCurrentPageEntities(filterCurrentPageUsers(allPagesUsersList,
	// pagesize, currentpage));
	// return currentPage;
	// }
	//
	// public Page getCurrentPageUsersNotIn(int pagesize, int currentpage,
	// String condition, User[] wfusers) {
	// Page currentPage = new Page();
	// List<User> allPagesNotInUsersList = getUsersByConditionNotIn(condition,
	// wfusers);
	// currentPage.setCurrentPageNumber(currentpage);
	// currentPage.setPageCount(getPageCount(pagesize, allPagesNotInUsersList));
	// currentPage.setCurrentPageEntities(filterCurrentPageUsers(allPagesNotInUsersList,
	// pagesize, currentpage));
	// return currentPage;
	// }

	// private User[] filterCurrentPageUsers(List<User> users, int pagesize, int
	// currentpage) {
	// List<User> userList = new ArrayList<User>();
	// int start = (currentpage - 1) * pagesize;
	// int end = currentpage * pagesize;
	// for (int i = start; i < end; i++) {
	// if (i <= users.size() - 1) {
	// userList.add(users.get(i));
	// }
	// }
	// if (userList.size() > 0) {
	// User[] wfusers = new User[userList.size()];
	// for (int i = 0; i < wfusers.length; i++) {
	// wfusers[i] = (User) userList.get(i);
	// }
	// return wfusers;
	// }
	// return null;
	// }

	// private List<User> getUsersByCondition(String condition, User[] users) {
	// List<User> userList = new ArrayList<User>();
	// for (int i = 0; i < users.length; i++) {
	// User user = (User) users[i];
	// if (condition != null && !condition.equals("")) {
	// if (user.getUserCode().indexOf(condition) > 0 ||
	// user.getFullName().indexOf(condition) > 0
	// || user.getName().indexOf(condition) > 0) {
	// userList.add(user);
	// }
	// } else {
	// userList.add(user);
	// }
	// }
	// return userList;
	// }
	//
	// private List<User> getUsersByConditionNotIn(String condition, User[]
	// allUsers) {
	// List<User> userList = new ArrayList<User>();
	// for (int i = 0; i < allUsers.length; i++) {
	// User user = (User) allUsers[i];
	// if (condition != null && !condition.equals("")) {
	// if (user.getUserCode().indexOf(condition) > 0 ||
	// user.getFullName().indexOf(condition) > 0
	// || user.getName().indexOf(condition) > 0) {
	// userList.add(user);
	// }
	// } else {
	// userList.add(user);
	// }
	// }
	// return userList;
	// }

	// public User[] addAllUsersToGroup(Group group) throws Exception {
	// try {
	// WorkflowEntity[] users = group.getUsers().getAll();
	// if (users != null && users.length > 0) {
	// User[] rightUsers = new User[users.length];
	// for (int i = 0; i < users.length; i++) {
	// rightUsers[i] = (User) users[i];
	// }
	// User[] leftUsers = WfUserBlo.getInstance().getNotInGroupUsers(rightUsers,
	// (Group) group);
	// return leftUsers;
	// }
	// } catch (Exception e) {
	// e.printStackTrace();
	// }
	// return null;
	// }

	// public void addUsersToGroup(AuthorityGroup group, String condition) {
	// }

	// /**
	// * Get all authority groups.
	// *
	// * @return
	// * @throws Exception
	// */
	// public List<Group> getAllGroups(TreeNode parent, WorkflowEntity owner)
	// throws Exception {
	// List<Group> groups = new ArrayList<Group>();
	// WfAutorityGroupEso auESO = new WfAutorityGroupEso();
	// List<RecordObject> groupRos = auESO.queryAll(parent.getId(),
	// owner.getId());
	// for (RecordObject ro : groupRos) {
	// groups.add((Group) ro.getEntity(owner));
	// }
	// return groups;
	// }
	//
	// /**
	// *
	// * @param ag
	// * @throws SQLException
	// */
	// public static void deleteAuthorityGroup(Group ag) throws SQLException {
	// // the first, delete all authorizations;
	//
	// // the second, delete all group users;
	// WfGroupMemberEso gmb = new WfGroupMemberEso();
	// gmb.deleteAllGroupUser(ag.getId());
	// // the third, delete this group object;
	// WfAutorityGroupEso auESO = new WfAutorityGroupEso();
	// auESO.delete(ag.getId());
	// }
	//
	// /**
	// * Modify authority group information.
	// *
	// * @param ag
	// * @throws SQLException
	// */
	// public static void modifyAuthorityGroup(Group ag) throws SQLException {
	// WfAuthorityGroupRo agRO = new WfAuthorityGroupRo();
	// agRO.setPrimaryKey(ag.getId());
	// agRO.setGroupName(ag.getName());
	// agRO.setCreatetime(DateUtility.getCurDateTime());
	// WfAutorityGroupEso auESO = new WfAutorityGroupEso();
	// auESO.update(agRO);
	// }
}