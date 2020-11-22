/**
 * 
 */
package com.cloudibpm.eso.user;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.jdbc.core.RowMapper;

import com.cloudibpm.core.repository.ExecuteSQLObject;
import com.cloudibpm.core.runtime.user.Contact;
import com.cloudibpm.core.user.User;

/**
 * @author Dahai Cao created on 2018-02-14
 *
 */
public class UserProfileEso extends ExecuteSQLObject {

	/**
	 * 
	 */
	public UserProfileEso() {
		super();
		logger = Logger.getLogger(UserProfileEso.class.getName());
	}

	/**
	 * Gets a user by <code>primary</code> in user profile table from content
	 * repository.
	 * 
	 * @return User
	 * @throws SQLException
	 */
	public User queryByPK(final String primary) throws SQLException {
		spendtime = System.currentTimeMillis();
		String sql = "select * from om_userprofile where Pk_User=?";
		List<User> lst = jdbcTemplate.query(sql, new String[] { primary }, new RowMapper<User>() {
			public User mapRow(ResultSet rs, int rowNum) throws SQLException {
				return getResultSet(new User(), rs);
			}
		});
		logger.info((System.currentTimeMillis() - spendtime) + "ms");
		if (lst.size() > 0) {
			return lst.get(0);
		} else {
			return null;
		}
	}

	public List<Contact> queryAllStaff(final String owner) throws SQLException {
		spendtime = System.currentTimeMillis();
		String sql = "select om_userprofile.Pk_User,om_userprofile.LastName,om_userprofile.FirstName,"
				+ "om_staff.WorkMobileNumber,om_staff.Pk_Staff,om_staff.WorkEmail,om_userprofile.Mobile,om_userprofile.Email "
				+ "from om_staff,om_userprofile where om_staff.Fk_User = om_userprofile.Pk_User and om_staff.Fk_Owner=?";
		List<Contact> lst = jdbcTemplate.query(sql, new String[] { owner }, new RowMapper<Contact>() {
			public Contact mapRow(ResultSet rs, int rowNum) throws SQLException {
				Contact c = new Contact();
				c.setId(rs.getString("om_userprofile.Pk_User"));
				c.setStaffId(rs.getString("om_staff.Pk_Staff"));
				c.setSurname(rs.getString("om_userprofile.LastName"));
				c.setGivenName(rs.getString("om_userprofile.FirstName"));
				c.setWorkMobile(rs.getString("om_staff.WorkMobileNumber"));
				c.setWorkEmail(rs.getString("om_staff.WorkEmail"));
				c.setPrivateMobile(rs.getString("om_userprofile.Mobile"));
				c.setPrivateEmail(rs.getString("om_userprofile.Email"));
				return c;
			}
		});
		logger.info((System.currentTimeMillis() - spendtime) + "ms");
		return lst;
	}

	public boolean queryStaff(final String userFk, final String owner) throws SQLException {
		spendtime = System.currentTimeMillis();
		String sql = "select Pk_Staff from om_staff where Fk_User=? and Fk_Owner=?";
		List<String> lst = jdbcTemplate.query(sql, new String[] { userFk, owner }, new RowMapper<String>() {
			public String mapRow(ResultSet rs, int rowNum) throws SQLException {
				return rs.getString("Pk_Staff");
			}
		});
		logger.info((System.currentTimeMillis() - spendtime) + "ms");
		if (lst.size() > 0) {
			return true;
		} else {
			return false;
		}
	}

	private User getResultSet(final User user, final ResultSet rs) throws SQLException {
		user.setId(rs.getString("Pk_User"));
		user.setName(rs.getString("UserName"));
		user.setPasswd(null);
		user.setPasswdExpirationDate(rs.getTimestamp("PasswdExpirationDate"));
		user.setGivenname(rs.getString("FirstName"));
		user.setSurname(rs.getString("LastName"));
		user.setGender(rs.getString("Gender"));
		user.setBirthday(rs.getDate("RegistrationDate"));
		user.setIdType(rs.getString("IdType"));
		user.setIdNumber(rs.getString("IdNumber"));
		user.setCountry(rs.getString("Country"));
		user.setProvince(rs.getString("Province"));
		user.setCity(rs.getString("City"));
		user.setCounty(rs.getString("County"));
		user.setAddress(rs.getString("Address"));
		user.setPostcode(rs.getString("PostCode"));
		user.setRegistrationDate(rs.getTimestamp("RegistrationDate"));
		user.setEmail(rs.getString("Email"));
		user.setMobile(rs.getString("Mobile"));
		user.setLastupdate(rs.getTimestamp("Lastupdate"));
		user.setIsBanned(rs.getInt("IsBanned"));
		user.setBanningDescription(rs.getString("BanningDescription"));
		return user;
	}

}
