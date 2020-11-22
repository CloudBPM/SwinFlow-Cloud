package com.cloudibpm.eso.am.appservice;

import com.cloudibpm.core.appservice.AppServiceAccessControl;
import org.apache.commons.lang.StringEscapeUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.PreparedStatementSetter;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.List;
@Repository
public class AppServiceAccessControlEso {
	private final JdbcTemplate jdbcTemplate;


	@Autowired
	public AppServiceAccessControlEso(JdbcTemplate jdbcTemplate, NamedParameterJdbcTemplate namedParameterJdbcTemplate) {
		this.jdbcTemplate = jdbcTemplate;

	}

	/**
	 * @date Dahai Cao created on 2016-11-15
	 * @param control
	 * @throws Exception
	 */
	public void insert(final AppServiceAccessControl control) throws Exception {
		
		String sql = "insert into am_app_access_control (Fk_AppService,Fk_Organization,CreateDateTime,Fk_Owner)"
				+ "values (?,?,?,?)";
		jdbcTemplate.update(sql, new PreparedStatementSetter() {
			@Override
			public void setValues(PreparedStatement stmt) throws SQLException {
				stmt.setString(1, control.getAppServiceId());
				stmt.setString(2, control.getOrganizationId());
				stmt.setTimestamp(3, new Timestamp(control.getCreateDateTime().getTime()));
				stmt.setString(4, control.getOwner());
			}
		});
		
	}

	public int getAccessControlCounting(String fk_appService) throws SQLException {
		
		String sql = "select count(*) from am_app_access_control where Fk_AppService=?";
		List<Integer> counts = jdbcTemplate.query(sql, new String[] { fk_appService }, new RowMapper<Integer>() {
			public Integer mapRow(ResultSet rs, int rowNum) throws SQLException {
				int count = rs.getInt(1);
				return new Integer(count);
			}
		});
		
		return ((Integer) counts.get(0)).intValue();
	}

	public AppServiceAccessControl queryAccessControls(String fk_appservice, String fk_organization) throws Exception {
		
		String sql = "select Fk_AppService,Fk_Organization,CreateDateTime,Fk_Owner "
				+ "from am_app_access_control where Fk_AppService=? and Fk_Organization=?";
		List<AppServiceAccessControl> lst = jdbcTemplate.query(sql, new Object[] { fk_appservice, fk_organization },
				new RowMapper<AppServiceAccessControl>() {
					public AppServiceAccessControl mapRow(ResultSet rs, int rowNum) throws SQLException {
						AppServiceAccessControl control = new AppServiceAccessControl();
						control.setAppServiceId(rs.getString("am_app_access_control.Fk_AppService"));
						control.setOrganizationId(rs.getString("am_app_access_control.Fk_Organization"));
						control.setCreateDateTime(rs.getTimestamp("am_app_access_control.CreateDatetime"));
						control.setOwner(rs.getString("am_app_access_control.Fk_Owner"));
						return control;
					}
				});
		
		if (!lst.isEmpty())
			return lst.get(0);
		else
			return null;
	}

	/**
	 * @date Dahai Cao created on 2017-01-10
	 * @param fk_appservice
	 * @return
	 * @throws Exception
	 */
	public List<AppServiceAccessControl> queryAllAccessControls(String fk_appservice) throws Exception {
		
		String sql = "select am_app_access_control.Fk_AppService,am_app_access_control.Fk_Organization,"
				+ "am_app_access_control.CreateDateTime,am_app_access_control.Fk_Owner,om_organization.NameLocal "
				+ "from am_app_access_control left join om_organization on am_app_access_control.Fk_Organization=om_organization.Pk_Organization "
				+ "where am_app_access_control.Fk_AppService=? order by om_organization.NameLocal asc";
		List<AppServiceAccessControl> lst = jdbcTemplate.query(sql, new Object[] { fk_appservice },
				new RowMapper<AppServiceAccessControl>() {
					public AppServiceAccessControl mapRow(ResultSet rs, int rowNum) throws SQLException {
						return getAccessControlFromResultSet(rs);
					}
				});
		
		return lst;
	}

	public int getAccessControlCounting(String condition, String fk_appService) throws SQLException {
		
		String sql = "SELECT count(*) FROM am_app_access_control, om_organization "
				+ "where am_app_access_control.Fk_AppService=? and "
				+ "am_app_access_control.Fk_Organization = 'ALLORGANIZATIONS' or "
				+ "(am_app_access_control.Fk_Organization=om_organization.Pk_Organization and "
				+ "(om_organization.NameLocal like ? or om_organization.AbbrLocal like ? or "
				+ "om_organization.NameInternational like ? or om_organization.AbbrInternational like ?))";
		String c = "%" + StringEscapeUtils.escapeSql(condition) + "%";
		List<Integer> counts = jdbcTemplate.query(sql, new String[] { fk_appService, c, c, c, c },
				new RowMapper<Integer>() {
					public Integer mapRow(ResultSet rs, int rowNum) throws SQLException {
						int count = rs.getInt(1);
						return new Integer(count);
					}
				});
		
		return ((Integer) counts.get(0)).intValue();
	}

	public List<AppServiceAccessControl> queryAllAccessControls(String condition, String fk_appservice)
			throws Exception {
		
		String sql = "select am_app_access_control.Fk_AppService,am_app_access_control.Fk_Organization,"
				+ "am_app_access_control.CreateDateTime,am_app_access_control.Fk_Owner,om_organization.NameLocal "
				+ "from am_app_access_control left join om_organization on am_app_access_control.Fk_Organization=om_organization.Pk_Organization where am_app_access_control.Fk_AppService=? and "
				+ "(om_organization.NameLocal like ? or om_organization.AbbrLocal like ? or "
				+ "om_organization.NameInternational like ? or om_organization.AbbrInternational like ?) order by om_organization.NameLocal asc";
		String c = "%" + StringEscapeUtils.escapeSql(condition) + "%";
		List<AppServiceAccessControl> lst = jdbcTemplate.query(sql, new Object[] { fk_appservice, c, c, c, c },
				new RowMapper<AppServiceAccessControl>() {
					public AppServiceAccessControl mapRow(ResultSet rs, int rowNum) throws SQLException {
						return getAccessControlFromResultSet(rs);
					}
				});
		
		return lst;
	}

	/**
	 * @date Dahai Cao created on 2016-11-15
	 * @param fk_appservice
	 * @return
	 * @throws Exception
	 */
	public List<AppServiceAccessControl> queryAllAccessControls(String fk_appservice, int firstrow, int pagesize)
			throws Exception {
		
		String sql = "select am_app_access_control.Fk_AppService,am_app_access_control.Fk_Organization,"
				+ "am_app_access_control.CreateDateTime,am_app_access_control.Fk_Owner,om_organization.NameLocal "
				+ "from am_app_access_control left join om_organization on am_app_access_control.Fk_Organization=om_organization.Pk_Organization "
				+ "where am_app_access_control.Fk_AppService=? order by om_organization.NameLocal asc LIMIT ?, ?";
		List<AppServiceAccessControl> lst = jdbcTemplate.query(sql, new Object[] { fk_appservice, firstrow, pagesize },
				new RowMapper<AppServiceAccessControl>() {
					public AppServiceAccessControl mapRow(ResultSet rs, int rowNum) throws SQLException {
						return getAccessControlFromResultSet(rs);
					}
				});
		
		return lst;
	}

	public List<AppServiceAccessControl> queryAllAccessControls(String condition, String fk_appservice, int firstrow,
			int pagesize) throws Exception {
		
		String sql = "select am_app_access_control.Fk_AppService,am_app_access_control.Fk_Organization,"
				+ "am_app_access_control.CreateDateTime,am_app_access_control.Fk_Owner,om_organization.NameLocal "
				+ "from am_app_access_control left join om_organization on am_app_access_control.Fk_Organization=om_organization.Pk_Organization "
				+ " where am_app_access_control.Fk_AppService=? and (om_organization.NameLocal like ? or om_organization.AbbrLocal like ? or "
				+ "om_organization.NameInternational like ? or om_organization.AbbrInternational like ?) order by om_organization.NameLocal asc LIMIT ?, ?";
		String c = "%" + StringEscapeUtils.escapeSql(condition) + "%";
		List<AppServiceAccessControl> lst = jdbcTemplate.query(sql,
				new Object[] { fk_appservice, c, c, c, c, firstrow, pagesize },
				new RowMapper<AppServiceAccessControl>() {
					public AppServiceAccessControl mapRow(ResultSet rs, int rowNum) throws SQLException {
						return getAccessControlFromResultSet(rs);
					}
				});
		
		return lst;
	}

	private AppServiceAccessControl getAccessControlFromResultSet(ResultSet rs) throws SQLException {
		AppServiceAccessControl control = new AppServiceAccessControl();
		control.setAppServiceId(rs.getString("am_app_access_control.Fk_AppService"));
		control.setOrganizationId(rs.getString("am_app_access_control.Fk_Organization"));
		control.setOrganizationName(rs.getString("om_organization.NameLocal"));
		control.setCreateDateTime(rs.getTimestamp("am_app_access_control.CreateDatetime"));
		control.setOwner(rs.getString("am_app_access_control.Fk_Owner"));
		return control;
	};

	/**
	 * @date Dahai Cao created on 2016-11-15
	 * @param pk_appService
	 * @param pk_organization
	 * @throws SQLException
	 */
	public void delete(String pk_appService, String pk_organization) throws SQLException {
		
		String sql = "delete from am_app_access_control where Fk_AppService=? and Fk_Organization=?";
		jdbcTemplate.update(sql, new Object[] { pk_appService, pk_organization });
		
	}
}
