/**
 * 
 */
package com.cloudibpm.eso.am.appservice;

import com.cloudibpm.core.appservice.WebAppService;
import com.cloudibpm.core.data.*;
import com.cloudibpm.core.data.variable.Parameter;
import com.cloudibpm.core.microservice.HTTPHeader;
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

/**
 * @author Dahai Cao created on 2016-12-02
 *
 */
@Repository
public class WebAppServiceEso {

	private final JdbcTemplate jdbcTemplate;

	@Autowired
	public WebAppServiceEso(JdbcTemplate jdbcTemplate) {
		this.jdbcTemplate = jdbcTemplate;
	}

	/**
	 * @date (updated on 2016-12-01)
	 * @param ws
	 *            web service
	 * @throws Exception
	 */
	public void insert(final WebAppService ws) throws Exception {
		
		String sql = "insert into am_web_app_service "
				+ "(Pk_WebAppService,WebAppServiceName,HTTPMethod,CreateDatetime,Lastupdate,Fk_Parent,Fk_Owner) "
				+ "values (?,?,?,?,?,?,?)";
		jdbcTemplate.update(sql, new PreparedStatementSetter() {
			@Override
			public void setValues(PreparedStatement stmt) throws SQLException {
				stmt.setString(1, ws.getId());
				stmt.setString(2, ws.getName());
				stmt.setString(3, ws.getMethodName());
				stmt.setTimestamp(4, new Timestamp(ws.getCreateDateTime()));
				stmt.setTimestamp(5, new Timestamp(ws.getLastupdate()));
				stmt.setString(6, ws.getParent());
				stmt.setString(7, ws.getOwner());
			}
		});
		
	}

	/**
	 * Update a web application service object.
	 * 
	 * @param ras
	 * @throws SQLException
	 */
	public void update(final WebAppService ras) throws SQLException {
		
		String sql = "update am_web_app_service set WebAppServiceName=?,Keywords=?,IsRESTfulRequest=?,"
				+ "AccessType=?,HTTPMethod=?,Host=?,URL=?,PathParameters=?,AuthenticationType=?,Authentication=?,"
				+ "HTTPHeaders=?,FormParameters=?,Comments=?,Lastupdate=?,SecurityAccessKey=?,Price=?,ReturnType=?,ReturnTypeDescription=? "
				+ "where Pk_WebAppService=?";
		jdbcTemplate.update(sql, new PreparedStatementSetter() {
			@Override
			public void setValues(PreparedStatement stmt) throws SQLException {
				stmt.setString(1, ras.getName());
				stmt.setString(2, ras.getKeywords());
				stmt.setInt(3, ras.getRestful());
				stmt.setInt(4, ras.getAccessType());
				stmt.setString(5, ras.getMethodName());
				stmt.setString(6, ras.getHost());
				stmt.setString(7, ras.getUrl());
				String pathParams = null;
				if (ras.getPathParams() != null && ras.getPathParams().length > 0) {
					for (int i = 0; i < ras.getPathParams().length; i++) {
						if (pathParams == null)
							pathParams = ras.getPathParams()[i].toStoreString();
						else
							pathParams += "&" + ras.getPathParams()[i].toStoreString();
					}
				}
				stmt.setString(8, pathParams);
				stmt.setInt(9, ras.getAuthenticationType());
				String authString = null;
				if (ras.getAuthentication() != null && ras.getAuthentication().length > 0) {
					for (int i = 0; i < ras.getAuthentication().length; i++) {
						if (authString == null)
							authString = ras.getAuthentication()[i].toString();
						else
							authString += "\r\n" + ras.getAuthentication()[i].toString();
					}
				}
				stmt.setString(10, authString);
				String headerString = null;
				if (ras.getHeaders() != null && ras.getHeaders().length > 0) {
					for (int i = 0; i < ras.getHeaders().length; i++) {
						if (headerString == null)
							headerString = ras.getHeaders()[i].toString();
						else
							headerString += "\r\n" + ras.getHeaders()[i].toString();
					}
				}
				stmt.setString(11, headerString);
				String formParams = null;
				if (ras.getFormParams() != null && ras.getFormParams().length > 0) {
					for (int i = 0; i < ras.getFormParams().length; i++) {
						if (formParams == null)
							formParams = ras.getFormParams()[i].toStoreString();
						else
							formParams += "&" + ras.getFormParams()[i].toStoreString();
					}
				}
				stmt.setString(12, formParams);
				stmt.setString(13, ras.getComments());
				stmt.setTimestamp(14, new Timestamp(ras.getLastupdate()));
				stmt.setString(15, ras.getSecurityAccessKey());
				stmt.setDouble(16, ras.getPrice());
				stmt.setInt(17, ras.getReturnType());
				stmt.setString(18, ras.getReturnTypeDescription());
				stmt.setString(19, ras.getId());
			}
		});
		
	}

	private WebAppService getWebAppServiceFromResultSet(ResultSet rs) throws SQLException {
		WebAppService ws = new WebAppService();
		ws.setId(rs.getString("Pk_WebAppService"));
		ws.setName(rs.getString("WebAppServiceName"));
		ws.setKeywords(rs.getString("Keywords"));
		ws.setRestful(rs.getInt("IsRESTfulRequest"));
		ws.setAccessType(rs.getInt("AccessType"));
		ws.setComments(rs.getString("Comments"));
		ws.setMethodName(rs.getString("HTTPMethod"));
		ws.setHost(rs.getString("Host"));
		ws.setUrl(rs.getString("URL"));
		String pathparas = rs.getString("PathParameters");
		Parameter[] pparaObjs = null;
		if (pathparas != null) {
			String[] paras = pathparas.split("&");
			if (paras != null && paras.length > 0) {
				pparaObjs = new Parameter[paras.length];
				for (int i = 0; i < paras.length; i++) {
					String[] p = paras[i].split(":");
					pparaObjs[i] = new Parameter();
					if (p.length > 0)
						pparaObjs[i].setName(p[0]);
					if (p.length > 1) {
						pparaObjs[i].setDatatype(p[1]);
						if (p.length > 2) {
							if (p[1].equals("int") || p[1].equals("Integer")) {
								pparaObjs[i].setValue(new IntegerConstant(p[2]));
							} else if (p[1].equals("boolean")) {
								pparaObjs[i].setValue(new BooleanConstant(p[2]));
							} else if (p[1].toLowerCase().equals("double") || p[1].toLowerCase().equals("float")) {
								pparaObjs[i].setValue(new DoubleConstant(p[2]));
							} else {
								pparaObjs[i].setValue(new StringConstant(p[2]));
							}
						}

					}
					if (p.length > 3)
						pparaObjs[i].setComments(p[3]);
				}
			}
		}
		ws.setPathParams(pparaObjs);
		ws.setAuthenticationType(rs.getInt("AuthenticationType"));
		String auths = rs.getString("Authentication");
		HTTPHeader[] authH = null;
		if (auths != null) {
			String[] paras = auths.split("\r\n");
			if (paras != null && paras.length > 0) {
				authH = new HTTPHeader[paras.length];
				for (int i = 0; i < paras.length; i++) {
					String[] p = paras[i].split(":");
					authH[i] = new HTTPHeader();
					if (p.length > 0)
						authH[i].setKey(p[0]);
					if (p.length > 1)
						authH[i].setValue(p[1]);
				}
			}
		}
		ws.setAuthentication(authH);
		String headers = rs.getString("HTTPHeaders");
		HTTPHeader[] heads = null;
		if (headers != null) {
			String[] paras = headers.split("\r\n");
			if (paras != null && paras.length > 0) {
				heads = new HTTPHeader[paras.length];
				for (int i = 0; i < paras.length; i++) {
					String[] p = paras[i].split(":");
					heads[i] = new HTTPHeader();
					if (p.length > 0)
						heads[i].setKey(p[0]);
					if (p.length > 1)
						heads[i].setValue(p[1]);
				}
			}
		}
		ws.setHeaders(heads);
		String formparas = rs.getString("FormParameters");
		Parameter[] fparaObjs = null;
		if (formparas != null) {
			String[] paras = formparas.split("&");
			if (paras != null && paras.length > 0) {
				fparaObjs = new Parameter[paras.length];
				for (int i = 0; i < paras.length; i++) {
					String[] p = paras[i].split(":");
					fparaObjs[i] = new Parameter();
					if (p.length > 0)
						fparaObjs[i].setName(p[0]);
					if (p.length > 1) {
						fparaObjs[i].setDatatype(p[1]);
						if (p.length > 2) {
							if (p[1].equals("int") || p[1].equals("Integer")) {
								fparaObjs[i].setValue(new IntegerConstant(p[2]));
							} else if (p[1].equals("boolean")) {
								fparaObjs[i].setValue(new BooleanConstant(p[2]));
							} else if (p[1].toLowerCase().equals("double") || p[1].toLowerCase().equals("float")) {
								fparaObjs[i].setValue(new DoubleConstant(p[2]));
							} else if (p[1].equals("file")) {
								fparaObjs[i].setValue(new FileConstant());
							} else {
								fparaObjs[i].setValue(new StringConstant(p[2]));
							}
						}
					}
					if (p.length > 3)
						fparaObjs[i].setComments(p[3]);
				}
			}
		}
		ws.setFormParams(fparaObjs);
		ws.setCreateDateTime(rs.getTimestamp("CreateDatetime").getTime());
		ws.setLastupdate(rs.getTimestamp("Lastupdate").getTime());
		ws.setSecurityAccessKey(rs.getString("SecurityAccessKey"));
		ws.setPrice(rs.getDouble("Price"));
		ws.setStatus(rs.getInt("Status"));
		ws.setParent(rs.getString("Fk_Parent"));
		ws.setOwner(rs.getString("Fk_Owner"));
		ws.setReturnType(rs.getInt("ReturnType"));
		ws.setReturnTypeDescription(rs.getString("ReturnTypeDescription"));
		return ws;
	}

	public boolean existsWebAppServiceName(String name, String fk_Owner) throws SQLException {
		
		String sql = "select count(*) from am_web_app_service where WebAppServiceName=? and Fk_Owner=?";
		List<Integer> counts = jdbcTemplate.query(sql, new String[] { name, fk_Owner }, new RowMapper<Integer>() {
			public Integer mapRow(ResultSet rs, int rowNum) throws SQLException {
				int count = rs.getInt(1);
				return new Integer(count);
			}
		});
		
		return counts.get(0).intValue() > 0 ? true : false;
	}

	/**
	 * Query a record object from repository through its unique primary key.
	 * 
	 * @date 2016-12-01
	 * @param primaryKey
	 *            its unique primary key
	 * @return a record object
	 * @throws Exception
	 */
	public WebAppService query(String primaryKey) throws Exception {
		
		String sql = "select Pk_WebAppService,WebAppServiceName,Keywords,AccessType,Comments,"
				+ "IsRESTfulRequest,HTTPMethod,Host,URL,PathParameters,AuthenticationType,Authentication,"
				+ "HTTPHeaders,FormParameters,CreateDatetime,Lastupdate,Fk_Parent,Fk_Owner,SecurityAccessKey,Price,Status,ReturnType,ReturnTypeDescription "
				+ "from am_web_app_service where Pk_WebAppService=? limit 1";
		List<WebAppService> lst = jdbcTemplate.query(sql, new String[] { primaryKey }, new RowMapper<WebAppService>() {
			public WebAppService mapRow(ResultSet rs, int rowNum) throws SQLException {
				return getWebAppServiceFromResultSet(rs);
			}
		});
		
		if (lst.size() > 0) {
			return lst.get(0);
		} else {
			return null;
		}
	}

	/**
	 * Query an web application service object list from repository through
	 * their organization owner object primary key <tt>fk_Owner</tt>.
	 * 
	 * @param fk_Owner
	 *            owner object primary key <tt>fk_Owner</tt>
	 * @date created on 2016-12-01
	 * @return web service list
	 * @throws Exception
	 */
	public List<WebAppService> queryByOwner(String fk_Owner) throws Exception {
		
		String sql = "select Pk_WebAppService,WebAppServiceName,Keywords,AccessType,Comments,"
				+ "IsRESTfulRequest,HTTPMethod,Host,URL,PathParameters,AuthenticationType,Authentication,"
				+ "HTTPHeaders,FormParameters,CreateDatetime,Lastupdate,Fk_Parent,Fk_Owner,SecurityAccessKey,Price,Status,ReturnType,ReturnTypeDescription "
				+ "from am_web_app_service where Fk_Owner=?";
		List<WebAppService> lst = jdbcTemplate.query(sql, new String[] { fk_Owner }, new RowMapper<WebAppService>() {
			public WebAppService mapRow(ResultSet rs, int rowNum) throws SQLException {
				return getWebAppServiceFromResultSet(rs);
			}
		});
		
		return lst;
	}

	public List<WebAppService> queryByParent(String fk_Parent) throws Exception {
		
		String sql = "select Pk_WebAppService,WebAppServiceName,Keywords,AccessType,Comments,"
				+ "IsRESTfulRequest,HTTPMethod,Host,URL,PathParameters,AuthenticationType,Authentication,"
				+ "HTTPHeaders,FormParameters,CreateDatetime,Lastupdate,Fk_Parent,Fk_Owner,SecurityAccessKey,Price,Status,ReturnType,ReturnTypeDescription "
				+ "from am_web_app_service where Fk_Parent=?";
		List<WebAppService> lst = jdbcTemplate.query(sql, new String[] { fk_Parent }, new RowMapper<WebAppService>() {
			public WebAppService mapRow(ResultSet rs, int rowNum) throws SQLException {
				return getWebAppServiceFromResultSet(rs);
			}
		});
		
		return lst;
	}

	/**
	 * @author Dahai Cao created on 2018-06-21 21:12
	 * @param primaryKey
	 * @param name
	 * @param lastupdate
	 * @throws SQLException
	 */
	public void updateNameByPk(String primaryKey, String name, long lastupdate) throws SQLException {
		
		String sql = "update am_web_app_service " +
				"set WebAppServiceName=?,Lastupdate=? where Pk_WebAppService=?";
		jdbcTemplate.update(sql, new PreparedStatementSetter() {
			@Override
			public void setValues(PreparedStatement stmt) throws SQLException {
				stmt.setString(1, name);
				stmt.setTimestamp(2, new Timestamp(lastupdate));
				stmt.setString(3, primaryKey);
			}
		});
		
	}

	/**
	 * @author Dahai Cao created on 2018-06-21 21:48
	 * @param id
	 * @param status
	 * @param lastupdate
	 * @throws SQLException
	 */
	public void updateStatus(final String id, final int status, final long lastupdate) throws SQLException {
		String sql = "update am_web_app_service set status=?,Lastupdate=? where Pk_WebAppService=?";
		jdbcTemplate.update(sql, new PreparedStatementSetter() {
			@Override
			public void setValues(PreparedStatement stmt) throws SQLException {
				stmt.setInt(1, status);
				stmt.setTimestamp(2, new Timestamp(lastupdate));
				stmt.setString(3, id);
			}
		});
	}

	/**
	 * Delete an web application service object from repository.
	 * 
	 * @date 2016-12-01
	 * @param pk_webAppService
	 * @throws SQLException
	 */
	public void delete(String pk_webAppService) throws SQLException {
		String sql = "delete from am_web_app_service where Pk_WebAppService=?";
		jdbcTemplate.update(sql, new Object[] { pk_webAppService });
		
	}

	/**
	 * @param
	 * @return
	 * @throws SQLException
	 */
	public int queryWebAppServiceCounting(int status) throws SQLException {
		
		if (status == 99) {
			String sql = "select count(*) from am_web_app_service where Status not in (0,3,4)";
			List<Integer> counts = jdbcTemplate.query(sql, new RowMapper<Integer>() {
				public Integer mapRow(ResultSet rs, int rowNum) throws SQLException {
					int count = rs.getInt(1);
					return new Integer(count);
				}
			});
			
			return ((Integer) counts.get(0)).intValue();
		} else { // status is 1 or 2
			String sql = "select count(*) from am_web_app_service where Status = ?";
			List<Integer> counts = jdbcTemplate.query(sql, new RowMapper<Integer>() {
				public Integer mapRow(ResultSet rs, int rowNum) throws SQLException {
					int count = rs.getInt(1);
					return new Integer(count);
				}
			}, status);
			
			return ((Integer) counts.get(0)).intValue();
		}
	}

	/***
	 * 
	 * @param status
	 * @param firstrow
	 * @param pagesize
	 * @return
	 */
	public List<WebAppService> queryWebAppServiceWas(int status, int firstrow, int pagesize) {
		if (status == 99) {
			String sql = "select * from am_web_app_service where Status not in (0,3,4) limit ?,? ";
			List<WebAppService> lst = jdbcTemplate.query(sql, new Object[] { firstrow, pagesize },
					new RowMapper<WebAppService>() {
						public WebAppService mapRow(ResultSet rs, int rowNum) throws SQLException {
							return getWebAppServiceFromResultSet(rs);
						}
					});

			return lst;
		} else { // status is 1 or 2
			String sql = "select * from am_web_app_service where status = ? limit ?,? ";
			List<WebAppService> lst = jdbcTemplate.query(sql, new Object[] { status, firstrow, pagesize },
					new RowMapper<WebAppService>() {
						public WebAppService mapRow(ResultSet rs, int rowNum) throws SQLException {
							return getWebAppServiceFromResultSet(rs);
						}
					});
			
			return lst;
		}
	}

	/**
	 * 
	 * @param condition
	 * @return
	 */
	public int queryWebAppServiceCounting(String condition, int status) {
		if (status == 99) {
			String sql = "select count(*) from am_web_app_service where (WebAppServiceName like ? or Keywords like ? or "
					+ "Comments like ? or HTTPMethod like ? or URL like ? or Host like ?) and Status not in (0,3,4)";
			String c = "%" + StringEscapeUtils.escapeSql(condition) + "%";
			List<Integer> counts = jdbcTemplate.query(sql, new Object[]{c, c, c, c, c, c}, new RowMapper<Integer>() {
				public Integer mapRow(ResultSet rs, int rowNum) throws SQLException {
					int count = rs.getInt(1);
					return new Integer(count);
				}
			});
			return counts.get(0).intValue();
		} else {
			String sql = "select count(*) from am_web_app_service where (WebAppServiceName like ? or Keywords like ? or "
					+ "Comments like ? or HTTPMethod like ? or URL like ? or Host like ?) and Status = ?";
			String c = "%" + StringEscapeUtils.escapeSql(condition) + "%";
			List<Integer> counts = jdbcTemplate.query(sql, new Object[]{c, c, c, c, c, c, status}, new RowMapper<Integer>() {
				public Integer mapRow(ResultSet rs, int rowNum) throws SQLException {
					int count = rs.getInt(1);
					return new Integer(count);
				}
			});
			return counts.get(0).intValue();
		}
	}

	/**
	 * 
	 * @param condition
	 * @param firstrow
	 * @param pagesize
	 * @return
	 */
	public List<WebAppService> queryWebAppServiceWas(String condition, int status, int firstrow, int pagesize) {
		if (status == 99) {
			String sql = "select * from am_web_app_service where (WebAppServiceName like ? or Keywords like ? or "
					+ "Comments like ? or HTTPMethod like ? or URL like ? or Host like ?) and Status  not in (0,3,4) limit ?, ?";
			String c = "%" + StringEscapeUtils.escapeSql(condition) + "%";
			List<WebAppService> lst = jdbcTemplate.query(sql, new Object[]{c, c, c, c, c, c, firstrow, pagesize},
					new RowMapper<WebAppService>() {
						public WebAppService mapRow(ResultSet rs, int rowNum) throws SQLException {
							return getWebAppServiceFromResultSet(rs);
						}
					});
			return lst;
		} else {
			String sql = "select * from am_web_app_service where (WebAppServiceName like ? or Keywords like ? or "
					+ "Comments like ? or HTTPMethod like ? or URL like ? or Host like ?) and Status = ? limit ?, ?";
			String c = "%" + StringEscapeUtils.escapeSql(condition) + "%";
			List<WebAppService> lst = jdbcTemplate.query(sql, new Object[]{c, c, c, c, c, c, status, firstrow, pagesize},
					new RowMapper<WebAppService>() {
						public WebAppService mapRow(ResultSet rs, int rowNum) throws SQLException {
							return getWebAppServiceFromResultSet(rs);
						}
					});
			return lst;
		}

	}
}
