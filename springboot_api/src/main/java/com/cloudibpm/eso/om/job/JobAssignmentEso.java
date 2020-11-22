package com.cloudibpm.eso.om.job;

import com.cloudibpm.core.job.JobAssignment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.PreparedStatementSetter;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.Date;
import java.util.List;

@Repository
public class JobAssignmentEso {
	private final JdbcTemplate jdbcTemplate;

	@Autowired
	public JobAssignmentEso(JdbcTemplate jdbcTemplate) {
		this.jdbcTemplate = jdbcTemplate;
	}

	/**
	 * Insert one job assignment record
	 * 
	 * @date 02/11/2011 11:23:21 AM
	 * @throws Exception
	 */
	public void insert(final String fk_positionrole, final String fk_staff, final Date onjobdatetime,
			final String fk_owner) {
		
		String sql = "insert into om_job_assignment (Fk_PositionRole, Fk_Staff, OnJobDateTime, Fk_Owner) values (?,?,?,?)";
		jdbcTemplate.update(sql, new PreparedStatementSetter() {
			@Override
			public void setValues(PreparedStatement stmt) throws SQLException {
				stmt.setString(1, fk_positionrole);
				stmt.setString(2, fk_staff);
				stmt.setTimestamp(3, new Timestamp(onjobdatetime.getTime()));
				stmt.setString(4, fk_owner);
			}
		});
		
	}

	/**
	 * Delete a job assignment record.
	 * 
	 * @param fk_positionrole
	 *            String
	 * @param fk_staff
	 *            String
	 * @throws SQLException
	 */
	public void delete(final String fk_positionrole, final String fk_staff) throws SQLException {
		
		String sql = "delete from om_job_assignment where Fk_PositionRole=? and Fk_Staff=?";
		jdbcTemplate.update(sql, new Object[] { fk_positionrole, fk_staff });
		
	}

	public List<JobAssignment> queryJobAssignments(final String fk_owner, final String fk_user) throws SQLException {
		
		String sql = "SELECT * FROM om_job_assignment, om_staff, om_userprofile where "
				+ "om_job_assignment.Fk_Staff = om_staff.Pk_Staff and om_staff.Fk_User=om_userprofile.Pk_User and "
				+ "om_staff.Hidden='N' and om_staff.Fk_Owner=? and om_staff.Fk_User=?";
		List<JobAssignment> lst = jdbcTemplate.query(sql, new Object[] { fk_owner, fk_user },
				new RowMapper<JobAssignment>() {
					public JobAssignment mapRow(ResultSet rs, int rowNum) throws SQLException {
						JobAssignment assignment = new JobAssignment();
						assignment.setUserId(rs.getString("Pk_User"));
						assignment.setPositionId(rs.getString("Fk_PositionRole"));
						assignment.setStaffId(rs.getString("Fk_Staff"));
						assignment.setStaffCode(rs.getString("StaffCode"));
						assignment.setUserName(rs.getString("UserName"));
						// 在这里之所以这样写代码，是因为为将来国际化，系统需要适应不用的语言文化环境下的姓名格式的要求
						String givenname = rs.getString("FirstName");
						String lastname = rs.getString("LastName");
						String fname = lastname + givenname;// 中国姓名格式
						assignment.setStaffFullName(fname);
						assignment.setOnJobDate(rs.getTimestamp("OnJobDateTime"));
						assignment.setOwnerId(rs.getString("Fk_Owner"));
						return assignment;
					}
				});
		
		return lst;
	}

	public List<JobAssignment> queryAssignments(final String fk_position, final String fk_owner) throws SQLException {
		
		String sql = "SELECT * FROM om_job_assignment, om_staff, om_userprofile where om_job_assignment.Fk_PositionRole=? and "
				+ "om_job_assignment.Fk_Staff = om_staff.Pk_Staff and om_staff.Fk_User=om_userprofile.Pk_User and om_staff.Hidden='N' and om_staff.Fk_Owner=?";
		List<JobAssignment> lst = jdbcTemplate.query(sql, new Object[] { fk_position, fk_owner },
				new RowMapper<JobAssignment>() {
					public JobAssignment mapRow(ResultSet rs, int rowNum) throws SQLException {
						JobAssignment assignment = new JobAssignment();
						assignment.setPositionId(rs.getString("Fk_PositionRole"));
						assignment.setStaffId(rs.getString("Fk_Staff"));
						assignment.setStaffCode(rs.getString("StaffCode"));
						assignment.setUserName(rs.getString("UserName"));
						// 在这里之所以这样写代码，是因为为将来国际化，系统需要适应不用的语言文化环境下的姓名格式的要求
						String givenname = rs.getString("FirstName");
						String lastname = rs.getString("LastName");
						String fname = lastname + givenname;// 中国姓名格式
						assignment.setStaffFullName(fname);
						assignment.setOnJobDate(rs.getTimestamp("OnJobDateTime"));
						assignment.setOwnerId(rs.getString("Fk_Owner"));
						return assignment;
					}
				});
		
		return lst;
	}

	public List<JobAssignment> queryAllNonAssignments(final String fk_position, final String fk_owner)
			throws SQLException {
		
		String sql = "select om_staff.Pk_Staff, om_userprofile.UserName, om_userprofile.FirstName, om_userprofile.LastName,"
				+ " om_staff.StaffCode, om_staff.OnBoardingDate, om_staff.Fk_Owner "
				+ "from om_staff, om_userprofile where om_staff.Fk_User = om_userprofile.Pk_User and om_staff.Hidden='N' and om_staff.Fk_Owner=? and "
				+ "om_staff.Pk_Staff not in (select Fk_Staff from om_job_assignment where Fk_PositionRole=?)";
		List<JobAssignment> lst = jdbcTemplate.query(sql, new Object[] { fk_owner, fk_position },
				new RowMapper<JobAssignment>() {
					public JobAssignment mapRow(ResultSet rs, int rowNum) throws SQLException {
						JobAssignment assignment = new JobAssignment();
						assignment.setStaffId(rs.getString("Pk_Staff"));
						assignment.setUserName(rs.getString("UserName"));
						// 在这里之所以这样写代码，是因为为将来国际化，系统需要适应不用的语言文化环境下的姓名格式的要求
						String givenname = rs.getString("FirstName");
						String lastname = rs.getString("LastName");
						String fname = lastname + givenname;// 中国姓名格式
						assignment.setStaffFullName(fname);
						assignment.setStaffCode(rs.getString("StaffCode"));
						assignment.setOnJobDate(rs.getDate("OnBoardingDate"));
						assignment.setOwnerId(rs.getString("Fk_Owner"));
						return assignment;
					}
				});
		
		return lst;
	}
}
