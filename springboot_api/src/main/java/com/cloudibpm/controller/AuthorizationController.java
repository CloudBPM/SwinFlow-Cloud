/**
 * 
 */
package com.cloudibpm.controller;

import com.cloudibpm.blo.om.authorization.WfAuthorityBlo;
import com.cloudibpm.blo.om.authorization.WfAuthorityGroupBlo;
import com.cloudibpm.blo.om.authorization.WfGroupMemberBlo;
import com.cloudibpm.core.authorization.*;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * This service is used for user's access control.
 * 
 * @author Dahai Cao
 * @date 20160907
 */
@RestController
@RequestMapping("/service6")
public class AuthorizationController {
	private final WfAuthorityGroupBlo wfAuthorityGroupBlo;
	private final WfAuthorityBlo wfAuthorityBlo;
	private final WfGroupMemberBlo wfGroupMemberBlo;

	@Autowired
	public AuthorizationController(WfAuthorityGroupBlo wfAuthorityGroupBlo, WfAuthorityBlo wfAuthorityBlo, WfGroupMemberBlo wfGroupMemberBlo) {
		this.wfAuthorityGroupBlo = wfAuthorityGroupBlo;
		this.wfAuthorityBlo = wfAuthorityBlo;
		this.wfGroupMemberBlo = wfGroupMemberBlo;
	}

	/**
	 * Find all authority group with or without any condition from repository.
	 * 
	 * @return User array
	 */
	@RequestMapping(value = "/api0", method = RequestMethod.GET, produces = "application/json")
	@ResponseBody
	public AuthorityGroupPage getAllAuthorizationGroups(String condition, String ownerid, int pageno, int pagesize) {
		try {
			return wfAuthorityGroupBlo.getAllAuthorizationGroups(condition, ownerid, pageno, pagesize);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	@RequestMapping(value = "/api1", method = RequestMethod.GET, produces = "application/json")
	@ResponseBody
	public GroupMemberPage getAllGroupMembers(String condition, String groupid, int pageno, int pagesize) {
		try {
			return wfAuthorityGroupBlo.getAllGroupMembers(condition, groupid, pageno, pagesize);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	@RequestMapping(value = "/api2", method = RequestMethod.GET, produces = "application/json")
	@ResponseBody
	public Authority[] getAllAuthorities() {
		try {
			return wfAuthorityBlo.getAllAuthorities();
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

//	/**
//	 * This method can be used to create a new authority group object or save a
//	 * updated authority group object.
//	 * 
//	 * @param group
//	 * @return
//	 */
//	@RequestMapping(value = "/api2", method = RequestMethod.POST, headers = "Accept=application/json")
//	@ResponseBody
//	@Transactional
//	public AuthorityGroup saveAuthorityGroup(String group) {
//		try {
//			AuthorityGroup authgroup = new AuthorityGroup();
//			JSONObject obj = new JSONObject(group);
//			boolean newone = false;
//			if (obj.isNull("id")) {
//				authgroup.setId(BuildtimeIDGenerator.getInstance().getNewBuildTimeID());
//				newone = true;
//			} else {
//				authgroup.setId(obj.getString("id"));
//				newone = false;
//			}
//			authgroup.setName(obj.getString("name"));
//			authgroup.setDescription(obj.getString("description"));
//			authgroup.setCreateDate(DateUtility.parseDatetime(obj.getString("createDate")));
//			authgroup.setOwner(obj.getString("owner"));
//			if (newone) {
//				wfAuthorityGroupBlo.addNewGroup(authgroup);
//			} else {
//				wfAuthorityGroupBlo.updateGroup(authgroup);
//			}
//			return null;
//
//		} catch (Exception e) {
//			e.printStackTrace();
//			return null;
//		}
//	}

	@RequestMapping(value = "/api3", method = RequestMethod.POST, headers = "Accept=application/json")
	@ResponseBody
	@Transactional
	public String updateAuthorityList(String group) {
		try {
			AuthorityGroup authgroup = new AuthorityGroup();
			JSONObject obj = new JSONObject(group);
			authgroup.setId(obj.getString("id"));
			authgroup.setOwner(obj.getString("owner"));
			JSONArray addedAuthIds = obj.getJSONArray("addedAuthIds");
			if (addedAuthIds.length() > 0) {
				List<String> l = new ArrayList<String>();
				for (int i = 0; i < addedAuthIds.length(); i++) {
					l.add((String) addedAuthIds.get(i));
				}
				authgroup.setAddedAuthIds(l.toArray(new String[l.size()]));
			}
			JSONArray removedAuthIds = obj.getJSONArray("removedAuthIds");
			if (removedAuthIds.length() > 0) {
				List<String> l = new ArrayList<String>();
				for (int i = 0; i < removedAuthIds.length(); i++) {
					l.add((String) removedAuthIds.get(i));
				}
				authgroup.setRemovedAuthIds(l.toArray(new String[l.size()]));
			}
			String[] r = wfAuthorityGroupBlo.updateAuthorityList(authgroup);

			JSONArray mJSONArray = new JSONArray(Arrays.asList(r));
			return "{\"status\": \"1\", \"authids\": " + mJSONArray.toString() + "}"; // success
		} catch (Exception e) {
			e.printStackTrace();
			return "{\"status\": \"0\"}"; // success
		}
	}

	@RequestMapping(value = "/api4", method = RequestMethod.GET, produces = "application/json")
	@ResponseBody
	public GroupMemberEditList getAllGroupMemberEditList(String groupid, String owner) {
		try {
			return wfGroupMemberBlo.getGroupMemberEditList(groupid, owner);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	@RequestMapping(value = "/api5", method = RequestMethod.POST, headers = "Accept=application/json")
	@ResponseBody
	@Transactional
	public String updateGroupMemberList(String editlist) {
		try {
			GroupMemberEditList gmeditlist = new GroupMemberEditList();
			JSONObject obj = new JSONObject(editlist);
			gmeditlist.setGroupId(obj.getString("groupId"));
			gmeditlist.setOwnerId(obj.getString("ownerId"));
			JSONArray addedStaffIds = obj.getJSONArray("addedMemberIds");
			if (addedStaffIds.length() > 0) {
				List<String> l = new ArrayList<String>();
				for (int i = 0; i < addedStaffIds.length(); i++) {
					l.add((String)addedStaffIds.get(i));
				}
				gmeditlist.setAddedMemberIds(l.toArray(new String[l.size()]));
			}
			JSONArray removedStaffIds = obj.getJSONArray("removedMemberIds");
			if (removedStaffIds.length() > 0) {
				List<String> l = new ArrayList<String>();
				for (int i = 0; i < removedStaffIds.length(); i++) {
					l.add((String)removedStaffIds.get(i));
				}
				gmeditlist.setRemovedMemberIds(l.toArray(new String[l.size()]));
			}
			wfGroupMemberBlo.updateAuthorityGroupMemberEditList(gmeditlist);
			return "{\"status\": \"1\"}"; // success
		} catch (Exception e) {
			e.printStackTrace();
			return "{\"status\": \"0\"}"; // success
		}
	}
}
