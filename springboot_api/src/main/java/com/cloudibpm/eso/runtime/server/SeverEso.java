/**
 * 
 */
package com.cloudibpm.eso.runtime.server;

import com.cloudibpm.core.runtime.server.ServerInfoDescriptor;
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
 * @author Dahai Cao on 2018-02-05
 *
 */
@Repository
public class SeverEso{
	private final JdbcTemplate jdbcTemplate;

	@Autowired
	public SeverEso(JdbcTemplate jdbcTemplate) {
		this.jdbcTemplate = jdbcTemplate;
	}

	public int existsServer(ServerInfoDescriptor info) throws Exception {
		
		String sql = "SELECT count(*) FROM sm_servers WHERE ServerIPv4=?";
		System.out.println(sql);
		List<Integer> counts = jdbcTemplate.query(sql, new String[] { info.getIpv4() }, new RowMapper<Integer>() {
			public Integer mapRow(ResultSet rs, int rowNum) throws SQLException {
				int count = rs.getInt(1);
				return new Integer(count);
			}
		});
		
		return ((Integer) counts.get(0)).intValue();
	}

	public void insert(final ServerInfoDescriptor desc) throws Exception {
		
		String sql = "insert into sm_servers (Pk_Server,ServerName,ServerIPv4,ServerIPv6,Status,RegTimestamp,Lastupdate,Fk_Parent,Fk_Owner)"
				+ "values (?,?,?,?,?,?,?,?,?)";
		jdbcTemplate.update(sql, new PreparedStatementSetter() {
			@Override
			public void setValues(PreparedStatement stmt) throws SQLException {
				stmt.setString(1, desc.getId());
				stmt.setString(2, StringEscapeUtils.escapeSql(desc.getName()));
				stmt.setString(3, desc.getIpv4());
				stmt.setString(4, desc.getIpv6());
				stmt.setInt(5, desc.getStatus());
				stmt.setTimestamp(6, new Timestamp(Calendar.getInstance().getTime().getTime()));
				stmt.setTimestamp(7, new Timestamp(Calendar.getInstance().getTime().getTime()));
				stmt.setString(8, desc.getParent());
				stmt.setString(9, desc.getOwner());
			}
		});
		
	}

	public void update(final ServerInfoDescriptor desc) throws Exception {
		
		String sql = "update sm_servers set Status=?,Lastupdate=? " + "where ServerIPv4=?";
		jdbcTemplate.update(sql, new PreparedStatementSetter() {
			@Override
			public void setValues(PreparedStatement stmt) throws SQLException {
				stmt.setInt(1, desc.getStatus());
				stmt.setTimestamp(2, new Timestamp(Calendar.getInstance().getTime().getTime()));
				stmt.setString(3, desc.getIpv4());
			}
		});
		
	}

	public List<ServerInfoDescriptor> queryAll(String pk_parent) throws Exception {
		
		String sql = "SELECT * FROM sm_servers where Fk_Parent=?";
		System.out.println(sql);
		List<ServerInfoDescriptor> serverList = jdbcTemplate.query(sql, new Object[] { pk_parent },
				new RowMapper<ServerInfoDescriptor>() {
					public ServerInfoDescriptor mapRow(ResultSet rs, int rowNum) throws SQLException {
						ServerInfoDescriptor info = new ServerInfoDescriptor();
						info.setId(rs.getString("Pk_Server"));
						info.setName(rs.getString("ServerName"));
						info.setIpv4(rs.getString("ServerIPv4"));
						info.setIpv6(rs.getString("ServerIPv6"));
						info.setStatus(rs.getInt("Status"));
						info.setRegDatetime(rs.getTimestamp("RegTimestamp"));
						info.setLastupdate(rs.getTimestamp("Lastupdate"));
						info.setParent(rs.getString("Fk_Parent"));
						info.setOwner(rs.getString("Fk_Owner"));
						return info;
					}
				});
		
		return serverList;
	}

	public ServerInfoDescriptor queryByPk(String pk) throws Exception {
		
		String sql = "SELECT * FROM sm_servers where Pk_Server=?";
		System.out.println(sql);
		List<ServerInfoDescriptor> serverList = jdbcTemplate.query(sql, new Object[] { pk },
				new RowMapper<ServerInfoDescriptor>() {
					public ServerInfoDescriptor mapRow(ResultSet rs, int rowNum) throws SQLException {
						ServerInfoDescriptor info = new ServerInfoDescriptor();
						info.setId(rs.getString("Pk_Server"));
						info.setName(rs.getString("ServerName"));
						info.setIpv4(rs.getString("ServerIPv4"));
						info.setIpv6(rs.getString("ServerIPv6"));
						info.setStatus(rs.getInt("Status"));
						info.setRegDatetime(rs.getTimestamp("RegTimestamp"));
						info.setLastupdate(rs.getTimestamp("Lastupdate"));
						info.setParent(rs.getString("Fk_Parent"));
						info.setOwner(rs.getString("Fk_Owner"));
						return info;
					}
				});
		
		if (!serverList.isEmpty()) {
			return serverList.get(0);
		} else
			return null;
	}

}
