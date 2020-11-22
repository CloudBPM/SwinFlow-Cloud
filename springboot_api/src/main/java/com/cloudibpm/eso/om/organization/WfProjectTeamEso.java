/**
 * 
 */
package com.cloudibpm.eso.om.organization;

import com.cloudibpm.core.organization.ProjectTeam;
import org.apache.commons.lang.StringEscapeUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.PreparedStatementSetter;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.*;
import java.text.ParseException;
import java.util.List;

/**
 * @author Administrator
 * 
 */
@Repository
public class WfProjectTeamEso {
	private final JdbcTemplate jdbcTemplate;

	@Autowired
	public WfProjectTeamEso(JdbcTemplate jdbcTemplate) {
		this.jdbcTemplate = jdbcTemplate;
	}


	/**
	 * 
	 * @param fk_owner
	 * @return
	 * @throws Exception
	 */
	public List<ProjectTeam> queryAll(String fk_owner) throws Exception {
		String sql = "select * from om_projectteam where Fk_Owner=?";
		List<ProjectTeam> lst = jdbcTemplate.query(sql, new Object[] { fk_owner }, new RowMapper<ProjectTeam>() {
			public ProjectTeam mapRow(ResultSet rs, int rowNum) throws SQLException {
				return getResultSet(new ProjectTeam(), rs);
			}
		});
		return lst;
	}

	public List<ProjectTeam> queryNamesByFk(String fk_owner) throws Exception {
		String sql = "select Pk_ProjectTeam,SerialNumber,NameLocal from om_projectteam where Fk_Owner=? limit 1";
		List<ProjectTeam> lst = jdbcTemplate.query(sql, new Object[] { fk_owner }, new RowMapper<ProjectTeam>() {
			public ProjectTeam mapRow(ResultSet rs, int rowNum) throws SQLException {
				ProjectTeam ro = new ProjectTeam();
				ro.setId(rs.getString("Pk_ProjectTeam"));
				ro.setSerialNumber(rs.getString("SerialNumber"));
				ro.setName(rs.getString("NameLocal"));
				return ro;
			}
		});
		return lst;
	}

	public ProjectTeam queryNameByPK(String primaryKey) throws Exception {
		String sql = "select Pk_ProjectTeam,SerialNumber,NameLocal from om_projectteam where Pk_ProjectTeam=? limit 1";
		List<ProjectTeam> list = jdbcTemplate.query(sql, new String[] { primaryKey }, new RowMapper<ProjectTeam>() {
			public ProjectTeam mapRow(ResultSet rs, int rowNum) throws SQLException {
				ProjectTeam ro = new ProjectTeam();
				ro.setId(rs.getString("Pk_ProjectTeam"));
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

	private ProjectTeam getResultSet(ProjectTeam ro, ResultSet rs) throws SQLException {
		ro.setId(rs.getString("Pk_ProjectTeam"));
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
		ro.setOwner(rs.getString("Fk_Owner"));
		return ro;
	}

	public ProjectTeam queryByPK(String primaryKey) throws Exception {
		String sql = "select * from om_projectteam where Pk_ProjectTeam=?";
		Object ro = jdbcTemplate.queryForObject(sql, new String[] { primaryKey }, new RowMapper<ProjectTeam>() {
			public ProjectTeam mapRow(ResultSet rs, int rowNum) throws SQLException {
				return getResultSet(new ProjectTeam(), rs);
			}
		});
		return (ProjectTeam) ro;
	}

	/**
	 * update project team position structure
	 *
	 * @throws SQLException
	 * @throws ParseException
	 */
	public void update(final ProjectTeam depart) throws Exception {
		String sql = "update om_projectteam set SerialNumber=?,NameLocal=?,AbbrLocal=?,"
				+ "Status=?,Rank=?,CreateDate=?,Lastupdate=?,X0=?,Y0=?,X1=?,Y1=?,Fk_Parent=?,Fk_Owner=?,Fk_Category=? where Pk_ProjectTeam=?";
		jdbcTemplate.update(sql, new PreparedStatementSetter() {
			@Override
			public void setValues(PreparedStatement stmt) throws SQLException {
				stmt.setString(1, depart.getSerialNumber());
				stmt.setString(2, StringEscapeUtils.escapeSql(depart.getName()));
				stmt.setString(3, StringEscapeUtils.escapeSql(depart.getAbbrName()));
				stmt.setInt(4, depart.getStatus());
				stmt.setInt(5, depart.getRank());
				stmt.setTimestamp(6, new Timestamp(depart.getCreateDate()));
				stmt.setTimestamp(7, new Timestamp(depart.getLastupdate()));
				stmt.setDouble(8, depart.getX0());
				stmt.setDouble(9, depart.getY0());
				stmt.setDouble(10, depart.getX1());
				stmt.setDouble(11, depart.getY1());
				if (depart.getParent() != null)
					stmt.setString(12, depart.getParent());
				else
					stmt.setString(12, null);
				stmt.setString(13, depart.getOwner());
				stmt.setString(14, depart.getCategoryId());
				stmt.setString(15, depart.getId());
			}
		});
		
	}

	/**
	 *
	 * @throws SQLException
	 */
	public void insert(final ProjectTeam depart) throws Exception {
		String sql = "insert into om_projectteam(Pk_ProjectTeam,SerialNumber,NameLocal,AbbrLocal,"
				+ "Status,Rank,CreateDate,Lastupdate,X0,Y0,X1,Y1,Fk_Parent,Fk_Owner,Fk_Category) "
				+ "values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
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
				stmt.setString(14, depart.getOwner());
				stmt.setString(15, depart.getCategoryId());
			}
		});
		
	}

	/**
	 * 
	 * @param fk_Owner
	 * @throws SQLException
	 */
	public void deleteAll(String fk_Owner) throws Exception {
		String sql = "delete from om_projectteam where Fk_Owner=?";
		jdbcTemplate.update(sql, new Object[] { fk_Owner });
	}
}
