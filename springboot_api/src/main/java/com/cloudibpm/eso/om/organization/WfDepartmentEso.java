/**
 * 
 */
package com.cloudibpm.eso.om.organization;

import com.cloudibpm.core.organization.Department;
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
public class WfDepartmentEso {

	private final JdbcTemplate jdbcTemplate;

	@Autowired
	public WfDepartmentEso(JdbcTemplate jdbcTemplate) {
		this.jdbcTemplate = jdbcTemplate;
	}

	public List<Department> queryAll(String fk_owner) throws Exception {
		
		String sql = "select * from om_department where Fk_Owner=?";
		List<Department> lst = jdbcTemplate.query(sql, new String[] { fk_owner }, new RowMapper<Department>() {
			public Department mapRow(ResultSet rs, int rowNum) throws SQLException {
				return getResultSet(new Department(), rs);
			}
		});
		
		return lst;
	}
	
	//查找公司安防中心
		public Department queryByOwner(String organizationId) throws Exception {
			
			String sql = "select * from om_department where Fk_Owner=? and NameLocal='安防中心'";
			Department ro = jdbcTemplate.queryForObject(sql, new String[] { organizationId }, new RowMapper<Department>() {
				public Department mapRow(ResultSet rs, int rowNum) throws SQLException {
					return getResultSet(new Department(), rs);
				}
			});
			
			return (Department) ro;
		}

	public List<Department> queryNamesByFk(String fk_owner) throws Exception {
		
		String sql = "select Pk_Department,SerialNumber,NameLocal from om_department where Fk_Owner=?";
		List<Department> lst = jdbcTemplate.query(sql, new String[] { fk_owner }, new RowMapper<Department>() {
			public Department mapRow(ResultSet rs, int rowNum) throws SQLException {
				Department ro = new Department();
				ro.setId(rs.getString("Pk_Department"));
				ro.setSerialNumber(rs.getString("SerialNumber"));
				ro.setName(rs.getString("NameLocal"));
				return ro;
			}
		});
		
		return lst;
	}

	public Department queryNameByPK(String primaryKey) throws Exception {
		
		String sql = "select Pk_Department,SerialNumber,NameLocal from om_department where Pk_Department=?";
		List<Department> list = jdbcTemplate.query(sql, new String[] { primaryKey }, new RowMapper<Department>() {
			public Department mapRow(ResultSet rs, int rowNum) throws SQLException {
				Department ro = new Department();
				ro.setId(rs.getString("Pk_Department"));
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

	private Department getResultSet(Department ro, ResultSet rs) throws SQLException {
		ro.setId(rs.getString("Pk_Department"));
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
		ro.setCategoryId(rs.getString("Fk_Category"));
		return ro;
	}

	public Department queryByPK(String primaryKey) throws Exception {
		
		String sql = "select * from om_department where Pk_Department=?";
		Department ro = jdbcTemplate.queryForObject(sql, new String[] { primaryKey }, new RowMapper<Department>() {
			public Department mapRow(ResultSet rs, int rowNum) throws SQLException {
				return getResultSet(new Department(), rs);
			}
		});
		
		return (Department) ro;
	}

	/**
	 * update department position structure
	 *
	 * @throws SQLException
	 * @throws ParseException
	 */
	public void update(final Department depart) throws SQLException {
		
		String sql = "update om_department set SerialNumber=?,NameLocal=?,AbbrLocal=?,"
				+ "Status=?,Rank=?,CreateDate=?,Lastupdate=?,X0=?,Y0=?,X1=?,Y1=?,Fk_Parent=?,Fk_Owner=?,Fk_Category=? where Pk_Department=?";
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

	public void insert(final Department depart) throws SQLException {
		
		String sql = "insert into om_department(Pk_Department,SerialNumber,NameLocal,AbbrLocal,"
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

	public void deleteAll(String id) throws SQLException {
		
		String sql = "delete from om_department where Fk_Owner=?";
		jdbcTemplate.update(sql, new Object[] { id });
		
	}
}