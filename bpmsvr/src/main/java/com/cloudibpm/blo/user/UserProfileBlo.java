/**
 * 
 */
package com.cloudibpm.blo.user;

import java.util.List;

import com.cloudibpm.core.organization.Organization;
import com.cloudibpm.core.organization.OrganizationRelationship;
import com.cloudibpm.core.repository.BusinessLogicObject;
import com.cloudibpm.core.runtime.user.Contact;
import com.cloudibpm.core.user.User;
import com.cloudibpm.eso.runtime.organization.OrganizationRelationshipEso;
import com.cloudibpm.eso.user.UserProfileEso;

/**
 * @author Dahai Cao on 2018-02-14
 *
 */
public class UserProfileBlo extends BusinessLogicObject {
	private final static UserProfileBlo instance = new UserProfileBlo();

	/**
	 * 
	 */
	private UserProfileBlo() {
	}

	public static UserProfileBlo getInstance() {
		return instance;
	}

	/**
	 * Check whether the userId is in repository.
	 * 
	 * @param userId
	 * @return
	 * @throws Exception
	 */
	public User getUserById(String userId) throws Exception {
		UserProfileEso upEso = new UserProfileEso();
		return upEso.queryByPK(userId);
	}

	public boolean checkUserStaff(String userId, String owner) throws Exception {
		UserProfileEso upEso = new UserProfileEso();
		return upEso.queryStaff(userId, owner);
	}

	/**
	 * 
	 * @param owner
	 * @return
	 * @throws Exception
	 */
	public List<Contact> getAllStaff(String owner) throws Exception {
		UserProfileEso upEso = new UserProfileEso();
		return upEso.queryAllStaff(owner);
	}

	/**
	 * 
	 * @param owner
	 * @return
	 * @throws Exception
	 */
	public List<Contact> getAllStaffWithOrganizations(String owner) throws Exception {
		UserProfileEso upEso = new UserProfileEso();
		List<Contact> staffs = upEso.queryAllStaff(owner);
		OrganizationRelationshipEso rEso = new OrganizationRelationshipEso();
		List<OrganizationRelationship> relationships = rEso.queryAllforSelect(owner, 1, new int[] { 0, 1, 2, 3, 4 });
		if (!relationships.isEmpty()) {
			for (int i = 0; i < relationships.size(); i++) {
				List<Contact> staffs1 = upEso.queryAllStaff(relationships.get(i).getOrgBId());
				if (!staffs1.isEmpty()) {
					staffs.addAll(staffs1);
				}
			}
		}
		return staffs;
	}

}
