package com.cloudibpm.eso.runtime.microservice;

import com.cloudibpm.core.appservice.WebAppService;
import com.cloudibpm.core.data.*;
import com.cloudibpm.core.data.variable.Parameter;
import com.cloudibpm.core.microservice.HTTPHeader;
import com.cloudibpm.core.repository.ExecuteSQLObject;
import org.apache.log4j.Logger;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

public class MicroServiceEso extends ExecuteSQLObject {

	public MicroServiceEso() {
		super();
		logger = Logger.getLogger(MicroServiceEso.class.getName());
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
		spendtime = System.currentTimeMillis();
		String sql = "select * from am_web_app_service where Pk_WebAppService=? limit 1";
		List<WebAppService> lst = jdbcTemplate.query(sql, new String[] { primaryKey }, new RowMapper<WebAppService>() {
			public WebAppService mapRow(ResultSet rs, int rowNum) throws SQLException {
				return getWebAppServiceFromResultSet(rs);
			}
		});
		logger.info((System.currentTimeMillis() - spendtime) + "ms");
		if (lst.size() > 0) {
			return lst.get(0);
		} else {
			return null;
		}
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

}
