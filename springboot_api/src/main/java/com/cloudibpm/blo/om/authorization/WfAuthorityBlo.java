/**
 * 
 */
package com.cloudibpm.blo.om.authorization;

import com.cloudibpm.core.authorization.Authority;
import com.cloudibpm.core.repository.BusinessLogicObject;
import com.cloudibpm.eso.om.authorization.AuthorityEso;
import com.cloudibpm.eso.om.authorization.AuthorizationEso;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.SQLException;
import java.util.List;

/**
 * @author CAO Dahai
 * @version 2.0.0
 */
@Service
//@Transactional
public class WfAuthorityBlo extends BusinessLogicObject {
	private final AuthorizationEso auESO;
	private final AuthorityEso authESO;

	@Autowired
	public WfAuthorityBlo(AuthorizationEso auESO, AuthorityEso authESO) {
		this.authESO = authESO;
		this.auESO = auESO;
	}


	public Authority[] getAllAuthorities() throws Exception {
		List<Authority> authorities = authESO.queryAllAuthorities();
		return authorities.toArray(new Authority[authorities.size()]);
	}

	// public Authority getAuthority(String id) throws Exception {
	// WfAuthorityEso auESO = new WfAuthorityEso();
	// RecordObject ro = auESO.query(id);
	// Authority auth = (Authority) ro.getEntity();
	// return auth;
	// }

	/**
	 * Authorization all group
	 * 
	 * @param authID
	 * @param authGroupID
	 * @throws SQLException
	 */
	public void authorization(String authGroupID, String authID, String ownerID) throws SQLException {
		auESO.insert(authGroupID, authID, ownerID);
	}

	/**
	 * Delete all authorities of group ID.
	 * 
	 * @param authGroupID
	 * @throws SQLException
	 */
	// public void deleteAuthorities(String authGroupID) throws SQLException {
	// WfAuthorizationEso auESO = new WfAuthorizationEso();
	// auESO.delete(authGroupID);
	// }
}
