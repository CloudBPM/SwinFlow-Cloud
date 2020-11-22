/**
 * 
 */
package com.cloudibpm.eso.runtime.servers;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.Calendar;
import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.jdbc.core.PreparedStatementSetter;
import org.springframework.jdbc.core.RowMapper;

import com.cloudibpm.core.repository.ExecuteSQLObject;
import com.cloudibpm.core.runtime.server.ServerInfoDescriptor;

/**
 * @author Dahai Cao on 2018-02-05
 *
 */
public class SeverEso extends ExecuteSQLObject {

	/**
	 * 
	 */
	public SeverEso() {
		super();
		logger = Logger.getLogger(SeverEso.class.getName());
	}

	public int existsServer(ServerInfoDescriptor info) throws Exception {
		spendtime = System.currentTimeMillis();
		String sql = "SELECT count(*) FROM sm_servers WHERE ServerIPv4=?";
		System.out.println(sql);
		List<Integer> counts = jdbcTemplate.query(sql, new String[] { info.getIpv4() }, new RowMapper<Integer>() {
			public Integer mapRow(ResultSet rs, int rowNum) throws SQLException {
				int count = rs.getInt(1);
				return new Integer(count);
			}
		});
		logger.info((System.currentTimeMillis() - spendtime) + "ms");
		return ((Integer) counts.get(0)).intValue();
	}

	public void insert(final ServerInfoDescriptor desc) throws Exception {
		spendtime = System.currentTimeMillis();
		String sql = "insert into sm_servers (Pk_Server,ServerName,ServerIPv4,ServerIPv6,Status,RegTimestamp,Lastupdate,Fk_Parent,Fk_Owner)"
				+ "values (?,?,?,?,?,?,?,?,?)";
		jdbcTemplate.update(sql, new PreparedStatementSetter() {
			@Override
			public void setValues(PreparedStatement stmt) throws SQLException {
				stmt.setString(1, desc.getId());
				stmt.setString(2, desc.getName());
				stmt.setString(3, desc.getIpv4());
				stmt.setString(4, desc.getIpv6());
				stmt.setInt(5, desc.getStatus());
				stmt.setTimestamp(6, new Timestamp(Calendar.getInstance().getTime().getTime()));
				stmt.setTimestamp(7, new Timestamp(Calendar.getInstance().getTime().getTime()));
				stmt.setString(8, desc.getParent());
				stmt.setString(9, desc.getOwner());
			}
		});
		logger.info((System.currentTimeMillis() - spendtime) + "ms");
	}
	
	public void update(final ServerInfoDescriptor desc) throws Exception {
		spendtime = System.currentTimeMillis();
		String sql = "update sm_servers set Status=?,Lastupdate=? "
				+ "where ServerIPv4=?";
		jdbcTemplate.update(sql, new PreparedStatementSetter() {
			@Override
			public void setValues(PreparedStatement stmt) throws SQLException {
				stmt.setInt(1, desc.getStatus());
				stmt.setTimestamp(2, new Timestamp(Calendar.getInstance().getTime().getTime()));
				stmt.setString(3, desc.getIpv4());
			}
		});
		logger.info((System.currentTimeMillis() - spendtime) + "ms");
	}

}
