/**
 * 
 */
package com.cloudibpm.eso.om.organization;

import com.cloudibpm.core.organization.ProjectRole;
import org.apache.commons.lang.StringEscapeUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.PreparedStatementSetter;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.*;
import java.util.List;

/**
 * @author TKuser
 * 
 */
@Repository
public class WfProjectRoleEso {

	private final JdbcTemplate jdbcTemplate;

	@Autowired
	public WfProjectRoleEso(JdbcTemplate jdbcTemplate) {
		this.jdbcTemplate = jdbcTemplate;
	}

	public ProjectRole queryByPK(String primaryKey) throws Exception {
		String sql = "select * from om_projectrole where Pk_ProjectRole=?";
		List<ProjectRole> lst = jdbcTemplate.query(sql, new String[] { primaryKey }, new RowMapper<ProjectRole>() {
			public ProjectRole mapRow(ResultSet rs, int rowNum) throws SQLException {
				return getResultSet(new ProjectRole(), rs);
			}
		});
		
		if (!lst.isEmpty()) {
			return lst.get(0);
		}
		return null;
	}

	private ProjectRole getResultSet(ProjectRole ro, ResultSet rs) throws SQLException {
		ro.setId(rs.getString("Pk_ProjectRole"));
		ro.setSerialNumber(rs.getString("SerialNumber"));
		ro.setName(rs.getString("NameLocal"));
		ro.setAbbrName(rs.getString("AbbrLocal"));
		ro.setStatus(rs.getInt("Status"));
		ro.setRank(rs.getInt("Rank"));
		ro.setCreateDate(rs.getTimestamp("CreateDate").getTime());
		ro.setLastupdate(rs.getTimestamp("Lastupdate").getTime());
		ro.setX0(rs.getDouble("X0"));
		ro.setY0(rs.getDouble("Y0"));
		ro.setX1(rs.getDouble("X1"));
		ro.setY1(rs.getDouble("Y1"));
		ro.setParent(rs.getString("Fk_Parent"));
		ro.setCurrOwner(rs.getString("Fk_CurrOwner"));
		ro.setOwner(rs.getString("Fk_Owner"));
		ro.setCategoryId(rs.getString("Fk_Category"));
		ro.setOfficeCalendarID(rs.getString("Fk_OfficeCalendar"));
		return ro;
	}

	public List<ProjectRole> queryAll(String fk_currowner) throws Exception {
		String sql = "select * from om_projectrole where Fk_CurrOwner=?";
		List<ProjectRole> lst = jdbcTemplate.query(sql, new String[] { fk_currowner }, new RowMapper<ProjectRole>() {
			public ProjectRole mapRow(ResultSet rs, int rowNum) throws SQLException {
				return getResultSet(new ProjectRole(), rs);
			}
		});
		return lst;
	}

	public List<ProjectRole> queryPositionByStaffId(String id) {
		String sql = "Select * from om_job_assignment ,om_projectrole " +
				"where om_job_assignment.Fk_PositionRole = om_projectrole.Pk_ProjectRole and om_job_assignment.Fk_Staff = ?";
		List<ProjectRole> lst = jdbcTemplate.query(sql, new Object[]{id}, new RowMapper<ProjectRole>() {
			public ProjectRole mapRow(ResultSet rs, int rowNum) throws SQLException {
				return getResultSet(new ProjectRole(), rs);
			}
		});
		return lst;
	}

	public List<ProjectRole> queryNamesByFk(String fk_currowner) throws Exception {
		String sql = "select Pk_ProjectRole,SerialNumber,NameLocal from om_projectrole where Fk_CurrOwner=?";
		List<ProjectRole> lst = jdbcTemplate.query(sql, new String[] { fk_currowner }, new RowMapper<ProjectRole>() {
			public ProjectRole mapRow(ResultSet rs, int rowNum) throws SQLException {
				ProjectRole ro = new ProjectRole();
				ro.setId(rs.getString("Pk_ProjectRole"));
				ro.setSerialNumber(rs.getString("SerialNumber"));
				ro.setName(rs.getString("NameLocal"));
				return ro;
			}
		});
		return lst;
	}

	public ProjectRole queryNameByPK(String primaryKey) throws Exception {
		String sql = "select Pk_ProjectRole,SerialNumber,NameLocal from om_projectrole where Pk_ProjectRole=? limit 1";
		List<ProjectRole> list = jdbcTemplate.query(sql, new String[] { primaryKey }, new RowMapper<ProjectRole>() {
			public ProjectRole mapRow(ResultSet rs, int rowNum) throws SQLException {
				ProjectRole ro = new ProjectRole();
				ro.setId(rs.getString("Pk_ProjectRole"));
				ro.setSerialNumber(rs.getString("SerialNumber"));
				ro.setName(rs.getString("NameLocal"));
				return ro;
			}
		});
		if (list.isEmpty()) {
			return null;
		} else { // list contains exactly 1 element
			return list.get(0);
		}
	}

//	/**
//	 * @author Dahai Cao created at 19:29 on 2019-01-03
//	 * @param depart
//	 * @throws SQLException
//	 */
//	public void update(final ProjectRole depart) throws SQLException {
//		String sql = "update om_projectrole set SerialNumber=?,NameLocal=?,AbbrLocal=?,Status=?,Rank=?,CreateDate=?,Lastupdate=?,"
//				+ "X0=?,Y0=?,X1=?,Y1=?,Fk_Parent=?,Fk_CurrOwner=?,Fk_Owner=?, Fk_Category=? where Pk_ProjectRole=?";
//		jdbcTemplate.update(sql, new PreparedStatementSetter() {
//			@Override
//			public void setValues(PreparedStatement stmt) throws SQLException {
//				stmt.setString(1, depart.getSerialNumber());
//				stmt.setString(2, StringEscapeUtils.escapeSql(depart.getName()));
//				stmt.setString(3, StringEscapeUtils.escapeSql(depart.getAbbrName()));
//				stmt.setInt(4, depart.getStatus());
//				stmt.setInt(5, depart.getRank());
//				stmt.setTimestamp(6, new Timestamp(depart.getCreateDate()));
//				stmt.setTimestamp(7, new Timestamp(depart.getLastupdate()));
//				stmt.setDouble(8, depart.getX0());
//				stmt.setDouble(9, depart.getY0());
//				stmt.setDouble(10, depart.getX1());
//				stmt.setDouble(11, depart.getY1());
//				if (depart.getParent() != null)
//					stmt.setString(12, depart.getParent());
//				else
//					stmt.setString(12, null);
//				stmt.setString(13, depart.getCurrOwner());
//				stmt.setString(14, depart.getOwner());
//				stmt.setString(15, depart.getCategoryId());
//				stmt.setString(16, depart.getId());
//			}
//		});
//	}

	public void insert(final ProjectRole depart) throws SQLException {
		String sql = "insert into om_projectrole(Pk_ProjectRole,SerialNumber,NameLocal,AbbrLocal,Status,Rank,CreateDate,Lastupdate,"
				+ "X0,Y0,X1,Y1,Fk_Parent,Fk_CurrOwner,Fk_Owner,Fk_Category,Fk_OfficeCalendar)values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
		jdbcTemplate.update(sql, new PreparedStatementSetter() {
			@Override
			public void setValues(PreparedStatement stmt) throws SQLException {
				stmt.setString(1, depart.getId());
				stmt.setString(2, depart.getSerialNumber());
				stmt.setString(3, StringEscapeUtils.escapeSql(depart.getName()));
				stmt.setString(4, StringEscapeUtils.escapeSql(depart.getAbbrName()));
				stmt.setInt(5, depart.getStatus());
				stmt.setInt(6, depart.getRank());
				stmt.setTimestamp(7, new Timestamp(depart.getCreateDate()));
				stmt.setTimestamp(8, new Timestamp(depart.getLastupdate()));
				stmt.setDouble(9, depart.getX0());
				stmt.setDouble(10, depart.getY0());
				stmt.setDouble(11, depart.getX1());
				stmt.setDouble(12, depart.getY1());
				if (depart.getParent() != null)
					stmt.setString(13, depart.getParent());
				else
					stmt.setString(13, null);
				stmt.setString(14, depart.getCurrOwner());
				stmt.setString(15, depart.getOwner());
				stmt.setString(16, depart.getCategoryId());
				stmt.setString(17, depart.getOfficeCalendarID());
			}
		});
	}

	public void deleteAll(String fk_currOwner) throws SQLException {
		String sql = "delete from om_projectrole where Fk_CurrOwner=?";
		jdbcTemplate.update(sql, new Object[] { fk_currOwner });
		
	}
}
