package com.cloudibpm.eso.om.user;

import com.cloudibpm.core.authorization.GroupMember;
import org.apache.commons.lang.StringEscapeUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BatchPreparedStatementSetter;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.PreparedStatementSetter;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

/**
 *
 * @author CAO Dahai
 * @version 2.0.0, 17/08/2008
 */

@Repository
public class WfGroupMemberEso {

	private final JdbcTemplate jdbcTemplate;

	@Autowired
	public WfGroupMemberEso(JdbcTemplate jdbcTemplate) {
		this.jdbcTemplate = jdbcTemplate;
	}

	public int queryAllGroupMemberCounting(String fk_group) throws SQLException {

		String sql = "SELECT count(*) from om_authoritygroup_member, om_staff, om_userprofile "
				+ "where om_authoritygroup_member.Fk_AuthGroup=? and om_authoritygroup_member.Fk_Staff = om_staff.Pk_Staff and "
				+ "om_staff.Fk_User = om_userprofile.Pk_User ";
		List<Integer> counts = jdbcTemplate.query(sql, new Object[] { fk_group }, new RowMapper<Integer>() {
			public Integer mapRow(ResultSet rs, int rowNum) throws SQLException {
				int count = rs.getInt(1);
				return new Integer(count);
			}
		});

		return ((Integer) counts.get(0)).intValue();
	}

	/**
	 * Returns all authority group members in one group. This method is used to
	 * support the edit-authority-group-member dialog.
	 *
	 * @param fk_group
	 * @return
	 * @throws SQLException
	 */
	public List<GroupMember> queryAllGroupMembers(String fk_group, String fk_owner) throws SQLException {

		String sql = "select om_authoritygroup_member.Fk_Staff,om_authoritygroup_member.Fk_AuthGroup, "
				+ "om_userprofile.UserName, om_userprofile.FirstName,  om_userprofile.LastName, "
				+ "om_staff.StaffCode, om_staff.OnBoardingDate "
				+ "from om_authoritygroup_member, om_staff, om_userprofile "
				+ "where om_authoritygroup_member.Fk_AuthGroup=? and om_authoritygroup_member.Fk_Staff = om_staff.Pk_Staff"
				+ " and om_staff.Fk_User = om_userprofile.Pk_User and om_staff.Fk_Owner=?";
		List<GroupMember> lst = jdbcTemplate.query(sql, new Object[] { fk_group, fk_owner },
				new RowMapper<GroupMember>() {
					public GroupMember mapRow(ResultSet rs, int rowNum) throws SQLException {
						GroupMember ro = new GroupMember();
						ro.setStaffId(rs.getString("Fk_Staff"));
						ro.setGroupId(rs.getString("Fk_AuthGroup"));
						ro.setUserAccount(rs.getString("UserName"));
						ro.setUserGivenName(rs.getString("FirstName"));
						ro.setUserSurname(rs.getString("LastName"));
						ro.setStaffCode(rs.getString("StaffCode"));
						ro.setBoardDate(rs.getDate("OnBoardingDate"));
						return ro;
					}
				});

		return lst;
	}
	/**
	 *
	 * @param condition
	 * @param fk_group
	 * @return
	 * @throws SQLException
	 */
	public int queryAllGroupMemberCounting(String condition, String fk_group) throws SQLException {

		String sql = "SELECT count(*) from om_authoritygroup_member, om_staff, om_userprofile "
				+ "where om_authoritygroup_member.Fk_AuthGroup=? and "
				+ "om_authoritygroup_member.Fk_Staff = om_staff.Pk_Staff and om_staff.Fk_User = om_userprofile.Pk_User and "
				+ "(om_userprofile.UserName like ? or om_userprofile.FirstName like ? or om_userprofile.LastName like ? or "
				+ "om_userprofile.IdNumber like ? or om_userprofile.Mobile like ?)";
		String c = "%" + StringEscapeUtils.escapeSql(condition) + "%";
		List<Integer> counts = jdbcTemplate.query(sql, new String[] { fk_group, c, c, c, c, c },
				new RowMapper<Integer>() {
					public Integer mapRow(ResultSet rs, int rowNum) throws SQLException {
						int count = rs.getInt(1);
						return new Integer(count);
					}
				});

		return ((Integer) counts.get(0)).intValue();
	}

	/**
	 * Returns all authority group members in one group under the specified
	 * condition with multiple pages.
	 *
	 * @param fk_group
	 * @return
	 * @throws SQLException
	 */
	public List<GroupMember> queryAllGroupMembers(String condition, String fk_group, int firstrow, int pagesize)
			throws SQLException {

		String sql = "select om_authoritygroup_member.Fk_Staff,om_authoritygroup_member.Fk_AuthGroup, "
				+ "om_userprofile.UserName, om_userprofile.FirstName,  om_userprofile.LastName, om_staff.StaffCode, om_staff.OnBoardingDate "
				+ "from om_authoritygroup_member, om_staff, om_userprofile "
				+ "where om_authoritygroup_member.Fk_AuthGroup=? and om_authoritygroup_member.Fk_Staff = om_staff.Pk_Staff"
				+ " and om_staff.Fk_User = om_userprofile.Pk_User and "
				+ "(om_userprofile.UserName like ? or om_userprofile.FirstName like ? or om_userprofile.LastName like ? or "
				+ "om_userprofile.IdNumber like ? or om_userprofile.Mobile like ?) Limit ?, ?";
		String c = "%" + StringEscapeUtils.escapeSql(condition) + "%";
		List<GroupMember> lst = jdbcTemplate.query(sql, new Object[] { fk_group, c, c, c, c, c, firstrow, pagesize },
				new RowMapper<GroupMember>() {
					public GroupMember mapRow(ResultSet rs, int rowNum) throws SQLException {
						GroupMember ro = new GroupMember();
						ro.setStaffId(rs.getString("Fk_Staff"));
						ro.setGroupId(rs.getString("Fk_AuthGroup"));
						ro.setUserAccount(rs.getString("UserName"));
						ro.setUserGivenName(rs.getString("FirstName"));
						ro.setUserSurname(rs.getString("LastName"));
						ro.setStaffCode(rs.getString("StaffCode"));
						ro.setBoardDate(rs.getDate("OnBoardingDate"));
						return ro;
					}
				});

		return lst;
	}

	/**
	 * 批量插入staff
	 *
	 * @param stafflist
	 * @return
	 * @throws SQLException
	 */
	@SuppressWarnings("all")
	public boolean updateBatchAuthorityGroup(ArrayList<String> stafflist) throws Exception {
		String sql = "insert into om_authoritygroup_member (Fk_Staff, Fk_AuthGroup, Fk_Owner) values (?,?,?)";
		jdbcTemplate.batchUpdate(sql, new BatchPreparedStatementSetter() {
			@Override
			public void setValues(PreparedStatement preparedStatement, int i) throws SQLException {
				i=i*4;
				preparedStatement.setString(1, stafflist.get(i));
				preparedStatement.setString(2, stafflist.get(i + 3));
				preparedStatement.setString(3, stafflist.get(i + 2));
			}

			@Override
			public int getBatchSize() {
				return stafflist.size()/4;
			}
		});
		String thisMethodName = new Exception().getStackTrace()[0].getMethodName();
		int line = new Exception().getStackTrace()[0].getLineNumber();
		return true;
	}

	/**
	 * Returns all authority group members in one group. This method is used to
	 * support the edit-authority-group-member dialog.
	 *
	 * @param fk_group
	 * @return
	 * @throws SQLException
	 */
	public List<GroupMember> queryAllGroupMembers(String fk_group) throws SQLException {

		String sql = "select om_authoritygroup_member.Fk_Staff,om_authoritygroup_member.Fk_AuthGroup, "
				+ "om_userprofile.UserName, om_userprofile.FirstName,  om_userprofile.LastName, "
				+ "om_staff.StaffCode, om_staff.OnBoardingDate "
				+ "from om_authoritygroup_member, om_staff, om_userprofile "
				+ "where om_authoritygroup_member.Fk_AuthGroup=? and om_authoritygroup_member.Fk_Staff = om_staff.Pk_Staff"
				+ " and om_staff.Fk_User = om_userprofile.Pk_User";
		List<GroupMember> lst = jdbcTemplate.query(sql, new Object[] { fk_group }, new RowMapper<GroupMember>() {
			public GroupMember mapRow(ResultSet rs, int rowNum) throws SQLException {
				GroupMember ro = new GroupMember();
				ro.setStaffId(rs.getString("Fk_Staff"));
				ro.setGroupId(rs.getString("Fk_AuthGroup"));
				ro.setUserAccount(rs.getString("UserName"));
				ro.setUserGivenName(rs.getString("FirstName"));
				ro.setUserSurname(rs.getString("LastName"));
				ro.setStaffCode(rs.getString("StaffCode"));
				ro.setBoardDate(rs.getDate("OnBoardingDate"));
				return ro;
			}
		});

		return lst;
	}

	/**
	 * Returns all authority group members in one group. This method is used to
	 * support the edit-authority-group-member dialog.
	 *
	 * @param fk_group
	 * @return
	 * @throws SQLException
	 */
	public List<GroupMember> queryAllNonGroupMembers(String fk_group, String fk_owner) throws SQLException {

		String sql = "select om_staff.Pk_Staff, om_userprofile.UserName, om_userprofile.FirstName, om_userprofile.LastName, om_staff.StaffCode, om_staff.OnBoardingDate "
				+ "from om_staff, om_userprofile where om_staff.Fk_User = om_userprofile.Pk_User and om_staff.Fk_Owner=? and "
				+ "om_staff.Pk_Staff not in (select Fk_Staff from om_authoritygroup_member where Fk_AuthGroup=?)";
		List<GroupMember> lst = jdbcTemplate.query(sql, new Object[] { fk_owner, fk_group },
				new RowMapper<GroupMember>() {
					public GroupMember mapRow(ResultSet rs, int rowNum) throws SQLException {
						GroupMember ro = new GroupMember();
						ro.setStaffId(rs.getString("Pk_Staff"));
						ro.setUserAccount(rs.getString("UserName"));
						ro.setUserGivenName(rs.getString("FirstName"));
						ro.setUserSurname(rs.getString("LastName"));
						ro.setStaffCode(rs.getString("StaffCode"));
						ro.setBoardDate(rs.getDate("OnBoardingDate"));
						return ro;
					}
				});

		return lst;
	}
	/**
	 *
	 * @param fk_group
	 * @return
	 * @throws SQLException
	 */
	public List<String> queryAuthoritiesByStaffId(String fk_staff) throws SQLException {

		String sql = "select om_authoritygroup_member.Fk_Staff,om_authoritygroup_member.Fk_AuthGroup,"
				+ "om_authorization.Fk_Authority from om_authoritygroup_member, om_authorization"
				+ " where om_authoritygroup_member.Fk_AuthGroup = om_authorization.Fk_AuthGroup and om_authoritygroup_member.Fk_Staff=?";
		List<String> lst = jdbcTemplate.query(sql, new String[] { fk_staff }, new RowMapper<String>() {
			public String mapRow(ResultSet rs, int rowNum) throws SQLException {
				return rs.getString("om_authorization.Fk_Authority");
			}
		});

		return lst;
	}

	/**
	 * 将用户添加到组织中。
	 *
	 * @param pk1
	 * @param pk2
	 * @param pk3
	 * @throws SQLException
	 */
	public void insert(final String pk1, final String pk2, final String pk3) throws SQLException {

		String sql = "insert into om_authoritygroup_member (Fk_Staff, Fk_AuthGroup, Fk_Owner) values (?,?,?)";
		jdbcTemplate.update(sql, new PreparedStatementSetter() {
			@Override
			public void setValues(PreparedStatement stmt) throws SQLException {
				stmt.setString(1, pk1);
				stmt.setString(2, pk2);
				stmt.setString(3, pk3);
			}
		});

	}

	/**
	 *
	 * @param pk1
	 *            String
	 * @param pk2
	 *            String
	 * @throws SQLException
	 */
	public void delete(String pk1, String pk2) throws SQLException {

		String sql = "delete from om_authoritygroup_member where Fk_Staff=? and Fk_AuthGroup=?";
		jdbcTemplate.update(sql, new Object[] { pk1, pk2 });

	}
}
