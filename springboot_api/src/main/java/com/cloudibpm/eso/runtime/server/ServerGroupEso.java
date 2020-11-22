/**
 * 
 */
package com.cloudibpm.eso.runtime.server;

import com.cloudibpm.core.runtime.server.ServerGroupInfoDescriptor;
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
import java.util.Calendar;
import java.util.List;

/**
 * @author Dahai Cao created on 2018-02-05
 *
 */
@Repository
public class ServerGroupEso {

	private final JdbcTemplate jdbcTemplate;

	@Autowired
	public ServerGroupEso(JdbcTemplate jdbcTemplate) {
		this.jdbcTemplate = jdbcTemplate;
	}

	public void insert(final ServerGroupInfoDescriptor desc) throws Exception {
		
		String sql = "insert into sm_server_group (Pk_ServerGroup,GroupName,RegTimestamp,Lastupdate,Fk_Parent,Fk_Owner) values (?,?,?,?,?,?)";
		jdbcTemplate.update(sql, new PreparedStatementSetter() {
			@Override
			public void setValues(PreparedStatement stmt) throws SQLException {
				stmt.setString(1, desc.getId());
				stmt.setString(2, StringEscapeUtils.escapeSql(desc.getName()));
				stmt.setTimestamp(3, new Timestamp(desc.getCreateDatetime().getTime()));
				stmt.setTimestamp(4, new Timestamp(desc.getLastupdate().getTime()));
				stmt.setString(5, desc.getParent());
				stmt.setString(6, desc.getOwner());
			}
		});
		
	}

	public void update(final ServerGroupInfoDescriptor desc) throws Exception {
		
		String sql = "update sm_server_group set Lastupdate=? where Pk_ServerGroup=?";
		jdbcTemplate.update(sql, new PreparedStatementSetter() {
			@Override
			public void setValues(PreparedStatement stmt) throws SQLException {
				stmt.setTimestamp(2, new Timestamp(Calendar.getInstance().getTime().getTime()));
				stmt.setString(3, desc.getId());
			}
		});
		
	}

	public List<ServerGroupInfoDescriptor> queryAll() throws Exception {
		
		String sql = "SELECT * FROM sm_server_group";
		System.out.println(sql);
		List<ServerGroupInfoDescriptor> serverList = jdbcTemplate.query(sql,
				new RowMapper<ServerGroupInfoDescriptor>() {
					public ServerGroupInfoDescriptor mapRow(ResultSet rs, int rowNum) throws SQLException {
						ServerGroupInfoDescriptor info = new ServerGroupInfoDescriptor();
						info.setId(rs.getString("Pk_ServerGroup"));
						info.setName(StringEscapeUtils.escapeSql(rs.getString("GroupName")));
						info.setCreateDatetime(rs.getTimestamp("CreateDatetime"));
						info.setLastupdate(rs.getTimestamp("Lastupdate"));
						info.setParent(rs.getString("Fk_Parent"));
						info.setOwner(rs.getString("Fk_Owner"));
						return info;
					}
				});
		
		return serverList;
	}

}
