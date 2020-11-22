package com.cloudibpm.eso.om.user;

import com.cloudibpm.core.user.Staff;
import com.cloudibpm.core.user.User;
import org.apache.commons.lang.StringEscapeUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BatchPreparedStatementSetter;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.PreparedStatementSetter;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@Repository
public class WfStaffEso {

	private final JdbcTemplate jdbcTemplate;

	@Autowired
	public WfStaffEso(JdbcTemplate jdbcTemplate) {
		this.jdbcTemplate = jdbcTemplate;
	}

	/**
	 * Insert one workflow staff record object into current repository.
	 *
	 * @date 02/11/2011 11:23:21 AM
	 * @throws Exception
	 */
	public void insert(final Staff userRo) {

		String sql = "insert into om_staff (Pk_Staff, Fk_User, Fk_Owner, ProfessionalTitle,"
				+ "StaffCode, WorkPhoneNumber, WorkMobileNumber, WorkFaxNumber,"
				+ "WorkEmail, OfficeLocation, OnBoardingDate, WorkType, Lastupdate, JobStatus)"
				+ " values (?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
		jdbcTemplate.update(sql, new PreparedStatementSetter() {
			@Override
			public void setValues(PreparedStatement stmt) throws SQLException {
				stmt.setString(1, userRo.getId());
				stmt.setString(2, userRo.getUser().getId());
				stmt.setString(3, userRo.getOwner());
				stmt.setString(4, userRo.getProfessionalTitle());
				stmt.setString(5, userRo.getStaffCode());
				stmt.setString(6, userRo.getWorkPhoneNumber());
				stmt.setString(7, userRo.getWorkMobileNumber());
				stmt.setString(8, userRo.getWorkFaxNumber());
				stmt.setString(9, userRo.getWorkEmail());
				stmt.setString(10, userRo.getOfficeLocation());
				if (userRo.getOnBoardingDate() != null)
					stmt.setDate(11, new Date(userRo.getOnBoardingDate().getTime()));
				else
					stmt.setDate(11, null);
				stmt.setInt(12, userRo.getWorkType());
				stmt.setTimestamp(13, new Timestamp(userRo.getLastupdate().getTime()));
				stmt.setInt(14, userRo.getJobStatus());
			}
		});

	}

	public void update(final Staff userRo) {

		String sql = "update om_staff set ProfessionalTitle=?,StaffCode=?, WorkPhoneNumber=?, WorkMobileNumber=?, "
				+ "WorkFaxNumber=?,WorkEmail=?, OfficeLocation=?, OnBoardingDate=?, WorkType=?, Lastupdate=?, "
				+ "ResignationDate=?, ResignationDescription=?, JobStatus=? where Pk_Staff=?";
		jdbcTemplate.update(sql, new PreparedStatementSetter() {
			@Override
			public void setValues(PreparedStatement stmt) throws SQLException {
				stmt.setString(1, userRo.getProfessionalTitle());
				stmt.setString(2, StringEscapeUtils.escapeSql(userRo.getStaffCode()));
				stmt.setString(3, userRo.getWorkPhoneNumber());
				stmt.setString(4, userRo.getWorkMobileNumber());
				stmt.setString(5, userRo.getWorkFaxNumber());
				stmt.setString(6, StringEscapeUtils.escapeSql(userRo.getWorkEmail()));
				stmt.setString(7, StringEscapeUtils.escapeSql(userRo.getOfficeLocation()));
				if (userRo.getOnBoardingDate() != null)
					stmt.setDate(8, new Date(userRo.getOnBoardingDate().getTime()));
				else
					stmt.setDate(8, null);
				stmt.setInt(9, userRo.getWorkType());
				stmt.setTimestamp(10, new Timestamp(userRo.getLastupdate().getTime()));
				if (userRo.getResignDate() != null)
					stmt.setDate(11, new Date(userRo.getResignDate().getTime()));
				else
					stmt.setDate(11, null);
				stmt.setString(12, StringEscapeUtils.escapeSql(userRo.getResignDescription()));
				stmt.setInt(13, userRo.getJobStatus());
				stmt.setString(14, userRo.getId());
			}
		});

	}

	// 查询在条件范围内Staff
	public ArrayList<String> queryInUserId(ArrayList<String> stafflist, ArrayList<String> stafforglist)
			throws Exception {
		String sql = "select * from OM_STAFF where FK_USER IN(:param) and FK_OWNER IN(:param2)";
		HashMap<String, Object> paraMap = new HashMap<>();
		paraMap.put("param", stafflist);
		paraMap.put("param2", stafforglist);
		NamedParameterJdbcTemplate jdbc = new NamedParameterJdbcTemplate(jdbcTemplate);
		List<Staff> lst = jdbc.query(sql, paraMap, new RowMapper<Staff>() {
			@Override
			public Staff mapRow(ResultSet rs, int rowNum) throws SQLException {
				return getResultSet(new Staff(), rs);
			}
		});
		if (!lst.isEmpty()) {
			ArrayList<String> staffResultList = new ArrayList<String>();
			for (int i = 0; i < lst.size(); i++) {
				staffResultList.add(lst.get(i).getId());
				staffResultList.add(lst.get(i).getUser().getId());
				staffResultList.add(lst.get(i).getOwner());
			}
			return staffResultList;
		} else {
			return null;
		}
	}

	// 批量插入staff
	@SuppressWarnings("all")
	public boolean updateBatchStaff(ArrayList<String> stafflist, Date date) throws Exception {
		String sql = "insert into om_staff (Pk_Staff, Fk_User, Fk_Owner, ProfessionalTitle,"
				+ "StaffCode, WorkPhoneNumber, WorkMobileNumber, WorkFaxNumber,"
				+ "WorkEmail, OfficeLocation, OnBoardingDate, WorkType, Lastupdate, JobStatus, Hidden)"
				+ " values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
		jdbcTemplate.batchUpdate(sql, new BatchPreparedStatementSetter() {
			@Override
			public void setValues(PreparedStatement preparedStatement, int i) throws SQLException {
				i = i * 4;
				preparedStatement.setString(1, stafflist.get(i));
				preparedStatement.setString(2, stafflist.get(i + 1));
				preparedStatement.setString(3, stafflist.get(i + 2));
				preparedStatement.setString(4, null);
				preparedStatement.setString(5, null);
				preparedStatement.setString(6, null);
				preparedStatement.setString(7, null);
				preparedStatement.setString(8, null);
				preparedStatement.setString(9, null);
				preparedStatement.setString(10, null);
				preparedStatement.setString(11, null);
				preparedStatement.setInt(12, 1);
				preparedStatement.setTimestamp(13, new Timestamp(date.getTime()));
				preparedStatement.setInt(14, 1);
				preparedStatement.setString(15, "N");
			}

			@Override
			public int getBatchSize() {
				return stafflist.size() / 4;
			}
		});
		String thisMethodName = new Exception().getStackTrace()[0].getMethodName();
		int line = new Exception().getStackTrace()[0].getLineNumber();
		return true;
	}

	public List<Staff> queryByUserName(String username) throws SQLException {

		String sql = "select * from om_userprofile, om_staff, om_organization "
				+ "where om_userprofile.Pk_User = om_staff.Fk_User and "
				+ "om_userprofile.UserName=? and om_staff.JobStatus=1 and "
				+ "om_staff.Fk_Owner = om_organization.Pk_Organization and om_organization.status=4";
		List<Staff> lst = jdbcTemplate.query(sql, new String[] { username }, new RowMapper<Staff>() {
			public Staff mapRow(ResultSet rs, int rowNum) throws SQLException {
				return getResultSet(new Staff(), rs);
			}
		});

		return lst;
	}

	private Staff getResultSet(Staff staff, User user, ResultSet rs) throws SQLException {
		staff.setId(rs.getString("om_staff.Pk_Staff"));
		staff.setUser(new User(rs.getString("om_staff.Fk_User")));
		staff.setOwner(rs.getString("om_staff.Fk_Owner"));
		staff.setProfessionalTitle(rs.getString("om_staff.ProfessionalTitle"));
		staff.setStaffCode(rs.getString("om_staff.StaffCode"));
		staff.setOfficeLocation(rs.getString("om_staff.OfficeLocation"));
		staff.setWorkPhoneNumber(rs.getString("om_staff.WorkPhoneNumber"));
		staff.setWorkMobileNumber(rs.getString("om_staff.WorkMobileNumber"));
		staff.setWorkEmail(rs.getString("om_staff.WorkEmail"));
		staff.setWorkFaxNumber(rs.getString("om_staff.WorkFaxNumber"));
		staff.setOnBoardingDate(rs.getDate("om_staff.OnBoardingDate"));
		staff.setResignDate(rs.getDate("om_staff.ResignationDate"));
		staff.setResignDescription(rs.getString("om_staff.ResignationDescription"));
		staff.setWorkType(rs.getInt("om_staff.WorkType"));
		staff.setWorkStatus(rs.getInt("om_staff.WorkStatus"));
		staff.setJobStatus(rs.getInt("om_staff.JobStatus"));
		staff.setLastupdate(rs.getTimestamp("om_staff.Lastupdate"));

		user.setId(rs.getString("om_userprofile.Pk_User"));
		user.setName(rs.getString("om_userprofile.UserName"));
		user.setPasswdExpirationDate(rs.getTimestamp("om_userprofile.PasswdExpirationDate"));
		user.setLoginCounting(rs.getInt("om_userprofile.LoginCounting"));
		user.setGivenname(rs.getString("om_userprofile.FirstName"));
		user.setSurname(rs.getString("om_userprofile.LastName"));
		user.setGender(rs.getString("om_userprofile.Gender"));
		user.setBirthday(rs.getDate("om_userprofile.Birthday"));
		user.setIdType(rs.getString("om_userprofile.IdType"));
		user.setIdNumber(rs.getString("om_userprofile.IdNumber"));
		user.setCountry(rs.getString("om_userprofile.Country"));
		user.setProvince(rs.getString("om_userprofile.Province"));
		user.setCity(rs.getString("om_userprofile.City"));
		user.setCounty(rs.getString("om_userprofile.County"));
		user.setAddress(rs.getString("om_userprofile.Address"));
		user.setPostcode(rs.getString("om_userprofile.PostCode"));
		user.setRegistrationDate(rs.getTimestamp("om_userprofile.RegistrationDate"));
		user.setEmail(rs.getString("om_userprofile.Email"));
		user.setMobile(rs.getString("om_userprofile.Mobile"));
		user.setLastupdate(rs.getTimestamp("om_userprofile.Lastupdate"));
		staff.setUser(user);
		return staff;
	}

	public int getAllStaffCounting(String fk_owner) throws SQLException {

		String sql = "select count(*) from om_staff where Fk_Owner=?";
		List<Integer> counts = jdbcTemplate.query(sql, new String[] { fk_owner }, new RowMapper<Integer>() {
			public Integer mapRow(ResultSet rs, int rowNum) throws SQLException {
				int count = rs.getInt(1);
				return new Integer(count);
			}
		});

		return ((Integer) counts.get(0)).intValue();
	}

	/**
	 * Gets all Staff By orgId
	 * @param orgId
	 * @return
	 * @throws SQLException
	 */
	public List<Staff> queryStaffByOrgId(String orgId) throws SQLException{
		String sql = "SELECT Fk_User FROM om_staff WHERE Fk_Owner = ?";
		List<Staff> lists = jdbcTemplate.query(sql, new Object[] {orgId},
				new RowMapper<Staff>() {
					@Override
					public Staff mapRow(ResultSet rs, int rowNum) throws SQLException {
						return getResultSet(new Staff(), new User(), rs);
					}
				});
		return lists;
	}

	/**
	 * Gets all workflow users in one organization from content repository.
	 *
	 * @param fk_Owner
	 * @return
	 * @throws SQLException
	 */
	public List<Staff> queryAll(String fk_Owner, int firstrow, int pagesize) throws SQLException {

		String sql = "SELECT * FROM om_staff, om_userprofile where om_staff.Fk_Owner=? and "
				+ "om_staff.Fk_User = om_userprofile.Pk_User LIMIT ?, ?";
		List<Staff> lst = jdbcTemplate.query(sql, new Object[] { fk_Owner, firstrow, pagesize },
				new RowMapper<Staff>() {
					@Override
					public Staff mapRow(ResultSet rs, int rowNum) throws SQLException {
						return getResultSet(new Staff(), new User(), rs);
					}
				});

		return lst;
	}

	/**
	 * 通过组织ID查找所属的用户ID
	 * @param orgId
	 * @return
	 * @throws SQLException
	 */
	public List<Staff> queryAllStaffByOrgId(String orgId) throws SQLException {

		String sql = "SELECT * FROM om_staff where Fk_Owner = ?";
		List<Staff> lists = jdbcTemplate.query(sql, new Object[] { orgId },
				new RowMapper<Staff>() {
					@Override
					public Staff mapRow(ResultSet rs, int rowNum) throws SQLException {
						return getResultSet(new Staff(), new User(), rs);
					}
				});

		return lists;
	}

	public int getAllStaffCounting(String condition, String fk_owner) throws SQLException {

		String sql = "SELECT count(*) FROM om_staff, om_userprofile where (om_staff.StaffCode like ? or "
				+ "om_staff.WorkPhoneNumber like ? or om_staff.WorkMobileNumber like ? or "
				+ "om_staff.WorkEmail like ? or om_staff.OfficeLocation like ? or "
				+ "om_userprofile.UserName like ? or om_userprofile.FirstName like ? or om_userprofile.LastName like ? or "
				+ "om_userprofile.IdNumber like ? or om_userprofile.Address like ? or "
				+ "om_userprofile.Email like ? or om_userprofile.Mobile like ? or "
				+ "CONCAT(om_userprofile.FirstName, om_userprofile.LastName) like ? or "
				+ "CONCAT(om_userprofile.LastName, om_userprofile.FirstName) like ? or "
				+ "CONCAT_WS(' ', om_userprofile.FirstName, om_userprofile.LastName) like ? or "
				+ "CONCAT_WS(',', om_userprofile.LastName, om_userprofile.FirstName) like ?) and "
				+ "om_staff.Fk_Owner=? and om_staff.Fk_User = om_userprofile.Pk_User";
		String c = "%" + StringEscapeUtils.escapeSql(condition) + "%";
		List<Integer> counts = jdbcTemplate.query(sql,
				new String[] { c, c, c, c, c, c, c, c, c, c, c, c, c, c, c, c, fk_owner }, new RowMapper<Integer>() {
					@Override
					public Integer mapRow(ResultSet rs, int rowNum) throws SQLException {
						int count = rs.getInt(1);
						return new Integer(count);
					}
				});

		return ((Integer) counts.get(0)).intValue();
	}

	/**
	 * Gets all workflow users in one organization from content repository.
	 *
	 * @param fk_Owner
	 * @return
	 * @throws SQLException
	 */
	public List<Staff> queryAll(String condition, String fk_Owner, int firstrow, int pagesize) throws SQLException {

		String sql = "SELECT * FROM om_staff, om_userprofile where "
				+ "(om_staff.StaffCode like ? or om_staff.WorkPhoneNumber like ? or "
				+ "om_staff.WorkMobileNumber like ? or om_staff.WorkEmail like ? or "
				+ "om_staff.OfficeLocation like ? or om_userprofile.UserName like ? or "
				+ "om_userprofile.FirstName like ? or om_userprofile.LastName like ? or om_userprofile.IdNumber like ? or "
				+ "om_userprofile.Address like ? or om_userprofile.Email like ? or om_userprofile.Mobile like ? or "
				+ "CONCAT(om_userprofile.FirstName,om_userprofile.LastName) like ? or "
				+ "CONCAT(om_userprofile.LastName,om_userprofile.FirstName) like ? or "
				+ "CONCAT_WS(' ', om_userprofile.FirstName,om_userprofile.LastName) like ? or "
				+ "CONCAT_WS(',', om_userprofile.LastName,om_userprofile.FirstName) like ?) and "
				+ "om_staff.Fk_Owner=? and om_staff.Fk_User = om_userprofile.Pk_User LIMIT ?, ? ";
		String c = "%" + StringEscapeUtils.escapeSql(condition) + "%";
		List<Staff> lst = jdbcTemplate.query(sql,
				new Object[] { c, c, c, c, c, c, c, c, c, c, c, c, c, c, c, c, fk_Owner, firstrow, pagesize },
				new RowMapper<Staff>() {
					public Staff mapRow(ResultSet rs, int rowNum) throws SQLException {
						return getResultSet(new Staff(), new User(), rs);
					}
				});

		return lst;
	}

	/**
	 * Gets staff in one organization from content repository.
	 *
	 * @param fk_Owner
	 * @return
	 * @throws SQLException
	 */
	public Staff queryByUserId(String fk_User, String fk_Owner) throws SQLException {

		String sql = "SELECT * FROM om_staff where Fk_User=? and Fk_Owner=?";
		List<Staff> lst = jdbcTemplate.query(sql, new String[] { fk_User, fk_Owner }, new RowMapper<Staff>() {
			public Staff mapRow(ResultSet rs, int rowNum) throws SQLException {
				return getResultSet(new Staff(), rs);
			}
		});

		if (lst.size() > 0) {
			return lst.get(0);
		} else
			return null;
	}

	private Staff getResultSet(Staff staff, ResultSet rs) throws SQLException {
		staff.setId(rs.getString("om_staff.Pk_Staff"));
		staff.setUser(new User(rs.getString("om_staff.Fk_User")));
		staff.setOwner(rs.getString("om_staff.Fk_Owner"));
		staff.setProfessionalTitle(rs.getString("om_staff.ProfessionalTitle"));
		staff.setStaffCode(rs.getString("om_staff.StaffCode"));
		staff.setOfficeLocation(rs.getString("om_staff.OfficeLocation"));
		staff.setWorkPhoneNumber(rs.getString("om_staff.WorkPhoneNumber"));
		staff.setWorkMobileNumber(rs.getString("om_staff.WorkMobileNumber"));
		staff.setWorkEmail(rs.getString("om_staff.WorkEmail"));
		staff.setWorkFaxNumber(rs.getString("om_staff.WorkFaxNumber"));
		staff.setOnBoardingDate(rs.getDate("om_staff.OnBoardingDate"));
		staff.setResignDate(rs.getDate("om_staff.ResignationDate"));
		staff.setResignDescription(rs.getString("om_staff.ResignationDescription"));
		staff.setWorkType(rs.getInt("om_staff.WorkType"));
		staff.setWorkStatus(rs.getInt("om_staff.WorkStatus"));
		staff.setJobStatus(rs.getInt("om_staff.JobStatus"));
		staff.setLastupdate(rs.getTimestamp("om_staff.Lastupdate"));
		return staff;
	}

}
