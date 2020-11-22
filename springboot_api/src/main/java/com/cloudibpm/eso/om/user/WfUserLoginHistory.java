/**
 * 
 */
package com.cloudibpm.eso.om.user;

import com.cloudibpm.core.user.UserLoginHistory;
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
 * @author Dahai Cao created on 2016-05-20
 *
 */
@Repository
public class WfUserLoginHistory {

	private final JdbcTemplate jdbcTemplate;

	@Autowired
	public WfUserLoginHistory(JdbcTemplate jdbcTemplate) {
		this.jdbcTemplate = jdbcTemplate;
	}

	/**
	 * Insert one workflow user login history record object into current
	 * repository.
	 * 
	 * @date 2016-08-23 12:08 PM
	 * @throws Exception
	 */
	public void insert(final UserLoginHistory history) throws Exception {
		
		String sql = "insert into om_userloginhistory(Pk_LoginHistory, Fk_User, LastLoginTime, Device, DeviceType, DeviceManufacturer,"
				+ "OS, OSType, OSManufacturer, Browser, BrowserVersion, BrowserType, BrowserManufacturer, IPv4, IPv6, Country, Province, City, Town, LoginDescription, StatusCode, SessionID)"
				+ " values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
		jdbcTemplate.update(sql, new PreparedStatementSetter() {
			@Override
			public void setValues(PreparedStatement stmt) throws SQLException {
				stmt.setString(1, history.getId());
				stmt.setString(2, history.getFk_User());
				stmt.setTimestamp(3, new Timestamp(history.getLastLoginTime().getTime()));
				stmt.setString(4, history.getDevice());
				stmt.setString(5, history.getDeviceType());
				stmt.setString(6, history.getDeviceManufacturer());
				stmt.setString(7, history.getOs());
				stmt.setString(8, history.getOsType());
				stmt.setString(9, history.getOsManufacturer());
				stmt.setString(10, history.getBrowser());
				stmt.setString(11, history.getBrowserVersion());
				stmt.setString(12, history.getBrowserType());
				stmt.setString(13, history.getBrowserManufacturer());
				stmt.setString(14, history.getIPv4());
				stmt.setString(15, history.getIPv6());
				stmt.setString(16, history.getCountry());
				stmt.setString(17, history.getProvince());
				stmt.setString(18, history.getCity());
				stmt.setString(19, history.getTown());
				stmt.setString(20, history.getLoginDescription());
				stmt.setInt(21, history.getStatusCode());
				stmt.setString(22, history.getSessionId());
			}
		});
		
	}

	public int getAllLoginHistoryCounting(final String fk_user) throws SQLException {
		
		String sql = "select count(*) from om_userloginhistory where Fk_User=?";
		List<Integer> counts = jdbcTemplate.query(sql, new String[] { fk_user }, new RowMapper<Integer>() {
			public Integer mapRow(ResultSet rs, int rowNum) throws SQLException {
				int count = rs.getInt(1);
				return new Integer(count);
			}
		});
		
		return ((Integer) counts.get(0)).intValue();
	}

	/**
	 * Update one Cloud BPM user in current repository.
	 * 
	 * @date 02/11/2011 11:36:02 AM
	 * @throws SQLException
	 */
	public void update(final Date logouttime, final String sessionid) throws SQLException {
		
		String sql = "update om_userloginhistory set LastLogoutTime=? where SessionID=?";
		jdbcTemplate.update(sql, new PreparedStatementSetter() {
			@Override
			public void setValues(PreparedStatement stmt) throws SQLException {
				stmt.setTimestamp(1, new Timestamp(logouttime.getTime()));
				stmt.setString(2, sessionid);
			}
		});
		
	}

	public List<UserLoginHistory> queryAll(final String userid, final int firstrow, final int pagesize) throws SQLException {
		
		String sql = "SELECT * FROM om_userloginhistory where Fk_User=? ORDER BY LastLoginTime DESC LIMIT ?, ? ";
		List<UserLoginHistory> lst = jdbcTemplate.query(sql, new Object[] { userid, firstrow, pagesize },
				new RowMapper<UserLoginHistory>() {
					public UserLoginHistory mapRow(ResultSet rs, int rowNum) throws SQLException {
						return getResultSet(new UserLoginHistory(), rs);
					}
				});
		
		return lst;
	}

	private UserLoginHistory getResultSet(UserLoginHistory history, ResultSet rs) throws SQLException {
		history.setId(rs.getString("Pk_LoginHistory"));
		history.setFk_User(rs.getString("Fk_User"));
		history.setLastLoginTime(rs.getTimestamp("LastLoginTime"));
		history.setSessionId(rs.getString("SessionID"));
		history.setLastLogoutTime(rs.getTimestamp("LastLogoutTime"));
		history.setStatusCode(rs.getInt("StatusCode"));
		history.setDevice(rs.getString("device"));
		history.setDeviceType(rs.getString("DeviceType"));
		history.setDeviceManufacturer(rs.getString("deviceManufacturer"));
		history.setOs(rs.getString("os"));
		history.setOsType(rs.getString("osType"));
		history.setOsManufacturer(rs.getString("osManufacturer"));
		history.setBrowser(rs.getString("browser"));
		history.setBrowserType(rs.getString("browserType"));
		history.setBrowserVersion(rs.getString("BrowserVersion"));
		history.setBrowserManufacturer(rs.getString("BrowserManufacturer"));
		history.setIPv4(rs.getString("IPv4"));
		history.setIPv6(rs.getString("IPv6"));
		history.setCountry(rs.getString("Country"));
		history.setProvince(rs.getString("Province"));
		history.setCity(rs.getString("City"));
		history.setTown(rs.getString("Town"));
		history.setLoginDescription(rs.getString("LoginDescription"));
		return history;
	}
}
