/**
 * 
 */
package com.cloudibpm.eso.om.job;

import com.cloudibpm.core.job.JobAssignmentHistory;
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

/**
 * @author dev
 *
 */
@Repository
public class JobAssignmentHistoryEso {

	private final JdbcTemplate jdbcTemplate;

	@Autowired
	public JobAssignmentHistoryEso(JdbcTemplate jdbcTemplate) {
		this.jdbcTemplate = jdbcTemplate;
	}

	public int getAllJobAssignmentHistoryCounting(final String fk_staff) throws SQLException {

		String sql = "select count(*) from om_job_assignment_history where Fk_Staff=?";
		List<Integer> counts = jdbcTemplate.query(sql, new String[] { fk_staff }, new RowMapper<Integer>() {
			public Integer mapRow(ResultSet rs, int rowNum) throws SQLException {
				int count = rs.getInt(1);
				return new Integer(count);
			}
		});
		return ((Integer) counts.get(0)).intValue();
	}

	public List<JobAssignmentHistory> queryAll(final String staffid, final int firstrow, final int pagesize)
			throws SQLException {
		
		String sql = "SELECT * FROM om_userloginhistory join om_position on "
				+ " om_userloginhistory.Fk_PositionRole = om_position.Pk_Position "
				+ " where Fk_User = ? ORDER BY StartDate DESC LIMIT ?, ? ";
		List<JobAssignmentHistory> lst = jdbcTemplate.query(sql, new Object[] { staffid, firstrow, pagesize },
				new RowMapper<JobAssignmentHistory>() {
					public JobAssignmentHistory mapRow(ResultSet rs, int rowNum) throws SQLException {
						return null;
					}
				});
		
		return lst;
	}

	/**
	 * Insert one job assignment history record
	 * 
	 * @date 20116-09-19 11:23:21 AM
	 * @throws Exception
	 */
	public void insert(final String fk_positionrole, final String fk_staff, final int source, final Date onjobdatetime,
			final String desc, final String fk_owner) {
		
		String sql = "insert into om_job_assignment_history (Fk_PositionRole, Fk_Staff, Source, "
				+ "StartDate, StartDescription, Fk_Owner) values (?,?,?,?,?,?)";
		jdbcTemplate.update(sql, new PreparedStatementSetter() {
			@Override
			public void setValues(PreparedStatement stmt) throws SQLException {
				stmt.setString(1, fk_positionrole);
				stmt.setString(2, fk_staff);
				stmt.setInt(3, source);
				stmt.setTimestamp(4, new Timestamp(onjobdatetime.getTime()));
				stmt.setString(5, desc);
				stmt.setString(6, fk_owner);
			}
		});
		
	}

	/**
	 * Update one job assignment history record
	 * 
	 * @date 20116-09-19 11:23:21 AM
	 * @param fk_positionrole
	 * @param fk_staff
	 * @param offjobdatetime
	 * @param desc
	 * @throws Exception
	 */
	public void update(final String fk_positionrole, final String fk_staff, final Date offjobdatetime,
			final String desc) {
		
		String sql = "update om_job_assignment_history set EndDate=?, "
				+ "EndDescription=? where Fk_PositionRole=? and Fk_Staff=?";
		jdbcTemplate.update(sql, new PreparedStatementSetter() {
			@Override
			public void setValues(PreparedStatement stmt) throws SQLException {
				stmt.setTimestamp(1, new Timestamp(offjobdatetime.getTime()));
				stmt.setString(2, desc);
				stmt.setString(3, fk_positionrole);
				stmt.setString(4, fk_staff);
			}
		});
		
	}

}
