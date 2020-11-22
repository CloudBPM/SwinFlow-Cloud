package com.cloudibpm.eso.om.authorization;

import com.cloudibpm.core.authorization.AuthorityGroup;
import org.apache.commons.lang.StringEscapeUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.PreparedStatementSetter;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.List;

@Repository
public class AutorityGroupEso  {
	private final JdbcTemplate jdbcTemplate;

	@Autowired
	public AutorityGroupEso(JdbcTemplate jdbcTemplate) {
		this.jdbcTemplate = jdbcTemplate;
	}


	public void insert(final AuthorityGroup agRO) throws SQLException {
		
		String sql = "insert into om_authoritygroup"
				+ "(Pk_AuthGroup, GroupName, GroupDescription, CreateDate, Fk_Owner) values (?,?,?,?,?)";
		jdbcTemplate.update(sql, new PreparedStatementSetter() {
			@Override
			public void setValues(PreparedStatement stmt) throws SQLException {
				stmt.setString(1, agRO.getId());
				stmt.setString(2, agRO.getName());
				stmt.setString(3, agRO.getDescription());
				stmt.setTimestamp(4, new Timestamp(agRO.getCreateDate().getTime()));
				stmt.setString(5, agRO.getOwner());
			}
		});
		
	}

	public void update(final AuthorityGroup agRO) throws SQLException {
		
		String sql = "update om_authoritygroup set GroupName=?, GroupDescription=? where Pk_AuthGroup=?";
		jdbcTemplate.update(sql, new PreparedStatementSetter() {
			@Override
			public void setValues(PreparedStatement stmt) throws SQLException {
				stmt.setString(1, agRO.getName());
				stmt.setString(2, agRO.getDescription());
				stmt.setString(3, agRO.getId());
			}
		});
		
	}
	
	//查询公司非系统管理组ID
		public AuthorityGroup queryByOwner(String organizationId) throws Exception {
			
			String sql = "select * from om_authoritygroup where Fk_Owner=? and GroupName='普通用户组'";
			List<AuthorityGroup> lst = jdbcTemplate.query(sql, new String[]{organizationId}, new RowMapper<AuthorityGroup>() {
	            public AuthorityGroup mapRow(ResultSet rs, int rowNum) throws SQLException {
	                return getResultSet(new AuthorityGroup(), rs);

	            }
	        });
			
			if (!lst.isEmpty()) {
	            return lst.get(0);
	        } else {
	            return null;
	        }
		}

	public int getAllAuthorityGroupCounting(String fk_owner) throws SQLException {
		
		String sql = "select count(*) from om_authoritygroup where Fk_Owner=?";
		List<Integer> counts = jdbcTemplate.query(sql, new String[] { fk_owner }, new RowMapper<Integer>() {
			public Integer mapRow(ResultSet rs, int rowNum) throws SQLException {
				int count = rs.getInt(1);
				return new Integer(count);
			}
		});
		
		return ((Integer) counts.get(0)).intValue();
	}

	public int getAllAuthorityGroupCounting(String condition, String fk_owner) throws SQLException {
		
		String sql = "SELECT count(*) FROM om_authoritygroup where Fk_Owner=? and (GroupName ? and GroupDescription like ?)";
		String c = "%" + StringEscapeUtils.escapeSql(condition) + "%";
		List<Integer> counts = jdbcTemplate.query(sql, new String[] { fk_owner, c, c }, new RowMapper<Integer>() {
			public Integer mapRow(ResultSet rs, int rowNum) throws SQLException {
				int count = rs.getInt(1);
				return new Integer(count);
			}
		});
		
		return ((Integer) counts.get(0)).intValue();
	}

	/**
	 * Get all authority groups without any condition.
	 * 
	 * @param fk_owner
	 * @return
	 * @throws Exception
	 */
	public List<AuthorityGroup> queryAllAuthorityGroups(String fk_Owner, int firstrow, int pagesize) throws Exception {
		
		String sql = "select * from om_authoritygroup where Fk_Owner=? order by GroupName asc LIMIT ?, ?";
		List<AuthorityGroup> lst = jdbcTemplate.query(sql, new Object[] { fk_Owner, firstrow, pagesize },
				new RowMapper<AuthorityGroup>() {
					public AuthorityGroup mapRow(ResultSet rs, int rowNum) throws SQLException {
						return getResultSet(new AuthorityGroup(), rs);
					}
				});
		
		return lst;
	}

	/**
	 * Get all authority groups without any condition.
	 * 
	 * @param fk_owner
	 * @return
	 * @throws Exception
	 */
	public List<AuthorityGroup> queryAllAuthorityGroups(String condition, String fk_Owner, int firstrow, int pagesize)
			throws Exception {
		
		String sql = "select * from om_authoritygroup where Fk_Owner=? and (GroupName like ? or GroupDescription like ?) order by GroupName asc LIMIT ?, ?";
		String c = "%" + StringEscapeUtils.escapeSql(condition) + "%";
		List<AuthorityGroup> lst = jdbcTemplate.query(sql, new Object[] { fk_Owner, c, c, firstrow, pagesize },
				new RowMapper<AuthorityGroup>() {
					public AuthorityGroup mapRow(ResultSet rs, int rowNum) throws SQLException {
						return getResultSet(new AuthorityGroup(), rs);
					}
				});
		
		return lst;
	}

	public AuthorityGroup getResultSet(AuthorityGroup group, ResultSet rs) throws SQLException {
		group.setId(rs.getString("Pk_AuthGroup"));
		group.setName(rs.getString("GroupName"));
		group.setDescription(rs.getString("GroupDescription"));
		group.setCreateDate(rs.getTimestamp("CreateDate"));
		group.setOwner(rs.getString("Fk_Owner"));
		return group;
	}
}
