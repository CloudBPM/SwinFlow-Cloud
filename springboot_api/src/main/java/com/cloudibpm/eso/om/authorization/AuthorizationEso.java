/**
 * @author Cao Dahai
 * @version 1.0.0 下午10:47:51
 */
package com.cloudibpm.eso.om.authorization;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.PreparedStatementSetter;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
@Repository
public class AuthorizationEso {
	private final JdbcTemplate jdbcTemplate;

	@Autowired
	public AuthorizationEso(JdbcTemplate jdbcTemplate) {
		this.jdbcTemplate = jdbcTemplate;
	}

	/**
	 * 
	 * @param fk_WfGroup
	 * @return
	 * @throws Exception
	 */
	public String[] queryAuthorityIdsInGroup(String fk_WfGroup) throws SQLException {
		
		String sql = "select Fk_Authority from om_authorization where Fk_AuthGroup=?";
		List<String> lst = jdbcTemplate.query(sql, new String[] { fk_WfGroup }, new RowMapper<String>() {
			public String mapRow(ResultSet rs, int rowNum) throws SQLException {
				return rs.getString(1);
			}
		});
		
		return lst.toArray(new String[lst.size()]);
	}

	/**
	 * Insert new authority into authorization table.
	 * 
	 * @param groupPK1
	 * @param authPK2
	 * @param ownerPK3
	 * @throws SQLException
	 */
	public void insert(final String groupPK1, final String authPK2, final String ownerPK3) throws SQLException {
		
		String sql = "insert into om_authorization (Fk_AuthGroup,Fk_Authority,Fk_Owner) values (?,?,?)";
		jdbcTemplate.update(sql, new PreparedStatementSetter() {
			@Override
			public void setValues(PreparedStatement stmt) throws SQLException {
				stmt.setString(1, groupPK1);
				stmt.setString(2, authPK2);
				stmt.setString(3, ownerPK3);
			}
		});
		
	}

	/**
	 * Delete authorities from an authority group.
	 * 
	 * @param groupPK1
	 * @param authPK2
	 * @param ownerPK3
	 * @throws SQLException
	 */
	public void delete(final String groupPK1, final String authPK2, final String ownerPK3) throws SQLException {
		
		String sql = "delete from om_authorization where Fk_AuthGroup=? and Fk_Authority=? and Fk_Owner=?";
		jdbcTemplate.update(sql, new Object[] { groupPK1, authPK2, ownerPK3 });
		
	}

	/**
	 * 
	 * @param fk_user
	 * @param auth
	 * @param fk_Owner
	 * @return
	 * @throws SQLException
	 */
	public int queryAuthorities(String fk_user, String fk_Owner, String auth) throws SQLException {
		
		String sql = "select count(*) from om_staff,om_authoritygroup_member, om_authoritygroup, om_authorization"
				+ " where om_staff.Fk_User=? and om_staff.Fk_Owner=? and "
				+ "om_staff.Pk_Staff=om_authoritygroup_member.Fk_Staff and "
				+ "om_authoritygroup_member.Fk_AuthGroup=om_authoritygroup.Pk_AuthGroup and "
				+ "om_authoritygroup.Pk_AuthGroup=om_authorization.Fk_AuthGroup and "
				+ "om_authorization.Fk_Authority=?";
		List<Integer> counts = jdbcTemplate.query(sql, new String[] { fk_user, fk_Owner ,auth},
				new RowMapper<Integer>() {
					public Integer mapRow(ResultSet rs, int rowNum) throws SQLException {
						int count = rs.getInt(1);
						return new Integer(count);
					}
				});
		
		return ((Integer) counts.get(0)).intValue();
	}
}
