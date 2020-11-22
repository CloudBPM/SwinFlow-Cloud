/**
 * 
 */
package com.cloudibpm.eso.om.authorization;

import com.cloudibpm.core.authorization.Authority;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

/**
 * @author CAO Dahai
 * 
 */
@Repository
public class AuthorityEso{
	@Autowired
	private JdbcTemplate jdbcTemplate;
	

	/**
	 * 获得所有的权限列表。这个方法要改的，要能根据权限设定来获取权限列表。
	 * 
	 * @return
	 * @throws Exception
	 */
	public List<Authority> queryAllAuthorities() throws Exception {
		
		String sql = "select * from om_authority";
		List<Authority> lst = jdbcTemplate.query(sql, new RowMapper<Authority>() {
			public Authority mapRow(ResultSet rs, int rowNum) throws SQLException {
				Authority ro = new Authority();
				ro.setId(rs.getString("Pk_Authority"));
				ro.setName(rs.getString("AuthorityName"));
				ro.setDescription(rs.getString("Description"));
				ro.setType(rs.getInt("Type"));
				ro.setParent(rs.getString("Fk_Parent"));
				return ro;
			}
		});
		
		return lst;
	}

	// public RecordObject query(String pk_authority) throws Exception {
	// 
	// String sql = "select * where Pk_WfAuthority=?";
	// Object ro = jdbcTemplate.queryForObject(sql, new String[] { pk_authority
	// }, new RowMapper() {
	// public Object mapRow(ResultSet rs, int rowNum) throws SQLException {
	// try {
	// WfAuthorityRo ro = new WfAuthorityRo();
	// ro.setPrimaryKey(rs.getString("Pk_WfAuthority"));
	// ro.setAuthorityName(rs.getString("AuthorityName"));
	// ro.setAuthorityDesc(rs.getString("Description"));
	// ro.setAuthType(rs.getInt("Type"));
	// ro.setFk_Parent(rs.getString("Fk_Parent"));
	// return ro;
	// } catch (Exception e) {
	// logger.error("query wait task exception", e);
	// }
	// return new Object();
	// }
	// });
	// 
	// return (RecordObject) ro;
	// }

}
