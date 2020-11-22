/**
 * 
 */
package com.cloudibpm.eso.runtime.organization;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.jdbc.core.RowMapper;

import com.cloudibpm.core.repository.ExecuteSQLObject;
import com.cloudibpm.core.runtime.user.Contact;

/**
 * @author Dahai Cao created at 18:42 on 2018-08-28
 *
 */
public class PositionEso extends ExecuteSQLObject {

	/**
	 * 
	 */
	public PositionEso() {
		super();
		logger = Logger.getLogger(PositionEso.class.getName());
	}

	public Contact getStaff(String positionid) {
		spendtime = System.currentTimeMillis();
		String sql = "select om_userprofile.Pk_User,om_userprofile.LastName,om_userprofile.FirstName,"
				+ "om_staff.WorkMobileNumber,om_staff.Pk_Staff,om_staff.WorkEmail,om_userprofile.Mobile,om_userprofile.Email "
				+ "from om_job_assignment,om_staff,om_userprofile where "
				+ "om_job_assignment.Fk_PositionRole = ? and om_job_assignment.Fk_Staff = om_staff.Pk_Staff and "
				+ "om_staff.Fk_User = om_userprofile.Pk_User";
		List<Contact> lst = jdbcTemplate.query(sql, new String[] { positionid }, new RowMapper<Contact>() {
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
		if (lst.size() > 0) {
			return lst.get(0);
		} else {
			return null;
		}
	}

}
