/**
 * 
 */
package com.cloudibpm.eso.om.organization;

import com.cloudibpm.core.organization.Division;
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
public class WfDivisionEso  {
	private final JdbcTemplate jdbcTemplate;

	@Autowired
	public WfDivisionEso(JdbcTemplate jdbcTemplate) {
		this.jdbcTemplate = jdbcTemplate;
	}

	/**
	 * 
	 * @param fk_owner
	 * @return
	 * @throws Exception
	 */
	public List<Division> queryAll(String fk_owner) throws Exception {
		String sql = "select * from om_division where Fk_Owner=?";
		List<Division> lst = jdbcTemplate.query(sql, new String[] { fk_owner }, new RowMapper<Division>() {
			public Division mapRow(ResultSet rs, int rowNum) throws SQLException {
				return getResultSet(new Division(), rs);
			}
		});
		return lst;
	}

	public List<Division> queryNamesByFk(String fk_owner) throws Exception {
		
		String sql = "select Pk_Division,SerialNumber,NameLocal from om_division where Fk_Owner=? limit 1";
		List<Division> lst = jdbcTemplate.query(sql, new String[] { fk_owner }, new RowMapper<Division>() {
			public Division mapRow(ResultSet rs, int rowNum) throws SQLException {
				Division ro = new Division();
				ro.setId(rs.getString("Pk_Division"));
				ro.setSerialNumber(rs.getString("SerialNumber"));
				ro.setName(rs.getString("NameLocal"));
				return ro;
			}
		});
		
		return lst;
	}

	public Division queryNameByPK(String primaryKey) throws Exception {
		
		String sql = "select Pk_Division,SerialNumber,NameLocal from om_division where Pk_Division=? limit 1";
		List<Division> list = jdbcTemplate.query(sql, new String[] { primaryKey }, new RowMapper<Division>() {
			public Division mapRow(ResultSet rs, int rowNum) throws SQLException {
				Division ro = new Division();
				ro.setId(rs.getString("Pk_Division"));
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

	public Division queryByPK(String primaryKey) throws Exception {
		
		String sql = "select * from om_division where Pk_Division=?";
		Division ro = jdbcTemplate.queryForObject(sql, new String[] { primaryKey }, new RowMapper<Division>() {
			public Division mapRow(ResultSet rs, int rowNum) throws SQLException {
				return getResultSet(new Division(), rs);
			}
		});
		
		return (Division) ro;
	}

	private Division getResultSet(Division ro, ResultSet rs) throws SQLException {
		ro.setId(rs.getString("Pk_Division"));
		ro.setSerialNumber(rs.getString("SerialNumber"));
		ro.setName(rs.getString("NameLocal"));
		ro.setAbbrName(rs.getString("AbbrLocal"));
		ro.setAddress(rs.getString("Address"));
		ro.setPostCode(rs.getString("Postcode"));
		ro.setPhoneNumber(rs.getString("PhoneNumber"));
		ro.setFaxNumber(rs.getString("FaxNumber"));
		ro.setEmail(rs.getString("Email"));
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

	/**
	 * 
	 * @param fk_Owner
	 * @throws SQLException
	 */
	public void deleteAll(String fk_Owner) throws SQLException {
		
		String sql = "delete from om_division where Fk_Owner=?";
		jdbcTemplate.update(sql, new Object[] { fk_Owner });
		
	}

	/**
	 * update division position structure
	 *
	 * @throws SQLException
	 * @throws ParseException
	 */
	public void update(final Division depart) throws SQLException {
		
		String sql = "update om_division set SerialNumber=?,NameLocal=?,AbbrLocal=?,Address=?,Postcode=?,PhoneNumber=?,FaxNumber=?,Email=?,"
				+ "Status=?,Rank=?,CreateDate=?,Lastupdate=?,X0=?,Y0=?,X1=?,Y1=?,Fk_Parent=?,Fk_Owner=?,Fk_Category=? where Pk_Division=?";
		jdbcTemplate.update(sql, new PreparedStatementSetter() {
			@Override
			public void setValues(PreparedStatement stmt) throws SQLException {
				stmt.setString(1, depart.getSerialNumber());
				stmt.setString(2, StringEscapeUtils.escapeSql(depart.getName()));
				stmt.setString(3, StringEscapeUtils.escapeSql(depart.getAbbrName()));
				stmt.setString(4, StringEscapeUtils.escapeSql(depart.getAddress()));
				stmt.setString(5, depart.getPostCode());
				stmt.setString(6, depart.getPhoneNumber());
				stmt.setString(7, depart.getFaxNumber());
				stmt.setString(8, depart.getEmail());
				stmt.setInt(9, depart.getStatus());
				stmt.setInt(10, depart.getRank());
				stmt.setTimestamp(11, new Timestamp(depart.getCreateDate()));
				stmt.setTimestamp(12, new Timestamp(depart.getLastupdate()));
				stmt.setDouble(13, depart.getX0());
				stmt.setDouble(14, depart.getY0());
				stmt.setDouble(15, depart.getX1());
				stmt.setDouble(16, depart.getY1());
				if (depart.getParent() != null)
					stmt.setString(17, depart.getParent());
				else
					stmt.setString(17, null);
				stmt.setString(18, depart.getOwner());
				stmt.setString(19, depart.getCategoryId());
				stmt.setString(20, depart.getId());
			}
		});
		
	}

	public void insert(final Division depart) throws SQLException {
		
		String sql = "insert into om_division(Pk_Division,SerialNumber,NameLocal,AbbrLocal,Address,Postcode,PhoneNumber,FaxNumber,Email,"
				+ "Status,Rank,CreateDate,Lastupdate,X0,Y0,X1,Y1,Fk_Parent,Fk_Owner,Fk_Category) "
				+ "values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
		jdbcTemplate.update(sql, new PreparedStatementSetter() {
			@Override
			public void setValues(PreparedStatement stmt) throws SQLException {
				stmt.setString(1, depart.getId());
				stmt.setString(2, depart.getSerialNumber());
				stmt.setString(3, StringEscapeUtils.escapeSql(depart.getName()));
				stmt.setString(4, StringEscapeUtils.escapeSql(depart.getAbbrName()));
				stmt.setString(5, StringEscapeUtils.escapeSql(depart.getAddress()));
				stmt.setString(6, depart.getPostCode());
				stmt.setString(7, depart.getPhoneNumber());
				stmt.setString(8, depart.getFaxNumber());
				stmt.setString(9, depart.getEmail());
				stmt.setInt(10, depart.getStatus());
				stmt.setInt(11, depart.getRank());
				stmt.setTimestamp(12, new Timestamp(depart.getCreateDate()));
				stmt.setTimestamp(13, new Timestamp(depart.getLastupdate()));
				stmt.setDouble(14, depart.getX0());
				stmt.setDouble(15, depart.getY0());
				stmt.setDouble(16, depart.getX1());
				stmt.setDouble(17, depart.getY1());
				if (depart.getParent() != null)
					stmt.setString(18, depart.getParent());
				else
					stmt.setString(18, null);
				stmt.setString(19, depart.getOwner());
				stmt.setString(20, depart.getCategoryId());
			}
		});
		
	}

	public boolean exists(String primaryKey) throws SQLException {
		
		String sql = "select count(*) from om_division where Pk_Division=?";
		List<Integer> counts = jdbcTemplate.query(sql, new String[] { primaryKey }, new RowMapper<Integer>() {
			public Integer mapRow(ResultSet rs, int rowNum) throws SQLException {
				int count = rs.getInt(1);
				return new Integer(count);
			}
		});
		
		return counts.get(0).intValue() > 0 ? true : false;
	}

}