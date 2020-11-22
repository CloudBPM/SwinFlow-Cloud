/**
 * 
 */
package com.cloudibpm.eso.am.template;

import com.cloudibpm.core.template.SMSTemplate;
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
 * 
 * @author Dahai Cao last updated on 2018-06-21
 *
 */
@Repository
public class SMSTemplateEso {

	private final JdbcTemplate jdbcTemplate;

	@Autowired
	public SMSTemplateEso(JdbcTemplate jdbcTemplate) {
		this.jdbcTemplate = jdbcTemplate;
	}


	/**
	 * Create a new template
	 * 
	 * @param template
	 */
	public void insert(final SMSTemplate template) {
		
		String sql = "insert into am_sms_template (Pk_SMSTemplate, TemplateName, CreateDateTime, "
				+ "Lastupdate, Fk_Parent, Fk_Owner) values (?,?,?,?,?,?)";
		jdbcTemplate.update(sql, new PreparedStatementSetter() {
			@Override
			public void setValues(PreparedStatement stmt) throws SQLException {
				stmt.setString(1, template.getId());
				stmt.setString(2, StringEscapeUtils.escapeSql(template.getName()));
				stmt.setTimestamp(3, new Timestamp(template.getCreateDateTime()));
				stmt.setTimestamp(4, new Timestamp(template.getLastupdate()));
				stmt.setString(5, template.getParent());
				stmt.setString(6, template.getOwner());
			}
		});
		
	}

	public boolean existsTemplateName(String name, String fk_Owner) throws SQLException {
		
		String sql = "select count(*) from am_sms_template where TemplateName=? and Fk_Owner=?";
		List<Integer> counts = jdbcTemplate.query(sql, new String[] { name, fk_Owner }, new RowMapper<Integer>() {
			public Integer mapRow(ResultSet rs, int rowNum) throws SQLException {
				int count = rs.getInt(1);
				return new Integer(count);
			}
		});
		
		return counts.get(0).intValue() > 0 ? true : false;
	}

	public List<SMSTemplate> queryTemplatesByStatus(String fk_Owner, int status) throws Exception {
		
		String sql = "select * from am_sms_template where Fk_Owner=? and Status=?";
		List<SMSTemplate> lst = jdbcTemplate.query(sql, new Object[] { fk_Owner, status },
				new RowMapper<SMSTemplate>() {
					public SMSTemplate mapRow(ResultSet rs, int rowNum) throws SQLException {
						return getSMSTemplateFromResultSet(rs, new SMSTemplate());
					}
				});
		
		return lst;
	}

	public List<SMSTemplate> queryAll(String fk_Owner) throws Exception {
		
		String sql = "select * from am_sms_template where Fk_Owner=?";
		List<SMSTemplate> lst = jdbcTemplate.query(sql, new Object[] { fk_Owner }, new RowMapper<SMSTemplate>() {
			public SMSTemplate mapRow(ResultSet rs, int rowNum) throws SQLException {
				return getSMSTemplateFromResultSet(rs, new SMSTemplate());
			}
		});
		
		return lst;
	}

	public SMSTemplate queryByPK(String primaryKey) throws SQLException {
		
		String sql = "select * from am_sms_template where Pk_SMSTemplate=? limit 1";
		SMSTemplate ro = jdbcTemplate.queryForObject(sql, new String[] { primaryKey }, new RowMapper<SMSTemplate>() {
			public SMSTemplate mapRow(ResultSet rs, int rowNum) throws SQLException {
				return getSMSTemplateFromResultSet(rs, new SMSTemplate());
			}
		});
		
		return ro;
	}

	public void updateStatus(final String tid, final int status, final long lastupdate) throws SQLException {
		
		String sql = "";
		if (status == 1) {
			sql = "update am_sms_template set Status=?,OnlineDateTime=? where Pk_SMSTemplate=?";
		} else {
			sql = "update am_sms_template set Status=?,OfflineDateTime=? where Pk_SMSTemplate=?";
		}
		jdbcTemplate.update(sql, new PreparedStatementSetter() {
			@Override
			public void setValues(PreparedStatement stmt) throws SQLException {
				stmt.setInt(1, status);
				stmt.setTimestamp(2, new Timestamp(lastupdate));
				stmt.setString(3, tid);
			}
		});
		
	};

	private SMSTemplate getSMSTemplateFromResultSet(ResultSet rs, SMSTemplate templ) throws SQLException {
		templ.setId(rs.getString("Pk_SMSTemplate"));
		templ.setName(rs.getString("TemplateName"));
		templ.setSmsContent(rs.getString("SMSContent"));
		templ.setStatus(rs.getInt("Status"));
		templ.setCreateDateTime(rs.getTimestamp("CreateDatetime").getTime());
		templ.setLastupdate(rs.getTimestamp("Lastupdate").getTime());
		Timestamp olts = rs.getTimestamp("OnlineDateTime");
		if (olts != null)
			templ.setOnlineDateTime(olts.getTime());
		Timestamp ofts = rs.getTimestamp("OfflineDateTime");
		if (ofts != null)
			templ.setOfflineDateTime(ofts.getTime());
		templ.setParent(rs.getString("Fk_Parent"));
		templ.setOwner(rs.getString("Fk_Owner"));
		return templ;
	}

	public void update(final SMSTemplate template) throws SQLException {
		
		String sql = "update am_sms_template set TemplateName=?, SMSContent=?,Lastupdate=? where Pk_SMSTemplate=?";
		jdbcTemplate.update(sql, new PreparedStatementSetter() {
			@Override
			public void setValues(PreparedStatement stmt) throws SQLException {
				stmt.setString(1, StringEscapeUtils.escapeSql(template.getName()));
				stmt.setString(2, template.getSmsContent());
				stmt.setTimestamp(3, new Timestamp(template.getLastupdate()));
				stmt.setString(4, template.getId());
			}
		});
		
	}

	public void updateName(final String id, final String newname, final long lastupdate) throws SQLException {
		
		String sql = "update am_sms_template set TemplateName=?, Lastupdate=? where Pk_SMSTemplate=?";
		jdbcTemplate.update(sql, new PreparedStatementSetter() {
			@Override
			public void setValues(PreparedStatement stmt) throws SQLException {
				stmt.setString(1, StringEscapeUtils.escapeSql(newname));
				stmt.setTimestamp(2, new Timestamp(lastupdate));
				stmt.setString(3, id);
			}
		});
		
	}

	public void delete(String primaryKey) throws SQLException {
		
		String sql = "delete from am_sms_template where Pk_SMSTemplate=?";
		jdbcTemplate.update(sql, new Object[] { primaryKey });
		
	}
}
