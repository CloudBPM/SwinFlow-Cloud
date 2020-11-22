package com.cloudibpm.eso.release.form;

import com.cloudibpm.core.release.form.ReleasedForm;
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
public class ReleasedFormEso {

	private final JdbcTemplate jdbcTemplate;

	@Autowired
	public ReleasedFormEso(JdbcTemplate jdbcTemplate) {
		this.jdbcTemplate = jdbcTemplate;
	}

	public List<ReleasedForm> queryAllOfOwner(String fk_owner) throws Exception {
		
		String sql = "Select Pk_Form,FormCode,FormName,Description,Keywords,Author,CreateDatetime,"
				+ "Lastupdate,Status,Version,Releaser,ReleaseStatement,ReleaseDate,Deprecated,TrialPeriod,"
				+ "PurchasePrice,UsagePrice,Fk_Parent,Fk_Owner,FormContent,AuthorId,ReleaserId " +
				"from fm_rl_form where Fk_Owner=?";
		List<ReleasedForm> procList = jdbcTemplate.query(sql, new Object[] { fk_owner }, new RowMapper<ReleasedForm>() {
			public ReleasedForm mapRow(ResultSet rs, int rowNum) throws SQLException {
				return getFormFromResultSet(new ReleasedForm(), rs);
			}
		});
		
		return procList;
	}

	public ReleasedForm queryRlFormByPk(String pk_form) throws Exception {
		
		String sql = "Select Pk_Form,FormCode,FormName,Description,Keywords,Author,CreateDatetime,"
				+ "Lastupdate,Status,Version,Releaser,ReleaseStatement,ReleaseDate,Deprecated,TrialPeriod,"
				+ "PurchasePrice,UsagePrice,Fk_Parent,Fk_Owner,FormContent,AuthorId,ReleaserId " +
				"from fm_rl_form where Pk_Form=?";
		List<ReleasedForm> procList = jdbcTemplate.query(sql, new Object[] { pk_form }, new RowMapper<ReleasedForm>() {
			public ReleasedForm mapRow(ResultSet rs, int rowNum) throws SQLException {
				return getFormFromResultSet(new ReleasedForm(), rs);
			}
		});
		
		if (!procList.isEmpty()) {
			return procList.get(0);
		} else {
			return null;
		}
	}

	public ReleasedForm queryFormByPk(String pk_form) throws Exception {
		
		String sql = "Select Pk_Form,FormCode,FormName,Description,Keywords,Author,CreateDatetime,"
				+ "Lastupdate,Status,PurchasePrice,UsagePrice,Fk_Parent,Fk_Owner,FormContent,AuthorId " +
				"from fm_form where Pk_Form=?";
		List<ReleasedForm> procList = jdbcTemplate.query(sql, new Object[] { pk_form }, new RowMapper<ReleasedForm>() {
			public ReleasedForm mapRow(ResultSet rs, int rowNum) throws SQLException {
				ReleasedForm form = new ReleasedForm();
				form.setId(rs.getString("Pk_Form"));
				form.setCode(rs.getString("FormCode"));
				form.setName(rs.getString("FormName"));
				form.setDescription(rs.getString("Description"));
				form.setKeywords(rs.getString("Keywords"));
				form.setAuthor(rs.getString("Author"));
				form.setCreateDatetime(rs.getTimestamp("CreateDatetime").getTime());
				form.setLastupdate(rs.getTimestamp("Lastupdate").getTime());
				form.setStatus(rs.getInt("Status"));
				form.setPurchasePrice(rs.getDouble("PurchasePrice"));
				form.setUsagePrice(rs.getDouble("UsagePrice"));
				form.setParent(rs.getString("Fk_Parent"));
				form.setOwner(rs.getString("Fk_Owner"));
				form.setFormContent(rs.getString("FormContent"));
				form.setAuthorId(rs.getString("AuthorId"));
				return form;
			}
		});
		
		if (!procList.isEmpty()) {
			return procList.get(0);
		} else {
			return null;
		}
	}

	public ReleasedForm getFormFromResultSet(ReleasedForm form, ResultSet rs) throws SQLException {
		form.setId(rs.getString("Pk_Form"));
		form.setCode(rs.getString("FormCode"));
		form.setName(rs.getString("FormName"));
		form.setDescription(rs.getString("Description"));
		form.setKeywords(rs.getString("Keywords"));
		form.setAuthor(rs.getString("Author"));
		form.setCreateDatetime(rs.getTimestamp("CreateDatetime").getTime());
		form.setLastupdate(rs.getTimestamp("Lastupdate").getTime());
		form.setStatus(rs.getInt("Status"));
		form.setVersion(rs.getString("Version"));
		form.setReleaser(rs.getString("Releaser"));
		form.setReleaserId(rs.getString("ReleaserId"));
		form.setReleaseStatement(rs.getString("ReleaseStatement"));
		form.setReleaseDate(rs.getTimestamp("ReleaseDate").getTime());
		form.setDeprecated(rs.getInt("Deprecated"));
		form.setTrialPeriod(rs.getInt("TrialPeriod"));
		form.setPurchasePrice(rs.getDouble("PurchasePrice"));
		form.setUsagePrice(rs.getDouble("UsagePrice"));
		form.setParent(rs.getString("Fk_Parent"));
		form.setOwner(rs.getString("Fk_Owner"));
		form.setFormContent(rs.getString("FormContent"));
		form.setAuthorId(rs.getString("AuthorId"));
		return form;
	}

	/**
	 * Insert a new form definition into repository. This method will insert or
	 * update values into all fields of fm_form.
	 * 
	 * @param f
	 *            ReleasedForm
	 * @throws SQLException
	 */
	public void insert(final ReleasedForm f) throws SQLException {
		
		String sql = "insert into fm_rl_form "
				+ "(Pk_Form,FormCode,FormName,Description,Keywords,Author,CreateDatetime,Lastupdate,Status,"
				+ "Version,Releaser,ReleaseStatement,ReleaseDate,Deprecated,TrialPeriod,"
				+ "PurchasePrice,UsagePrice,Fk_Parent,Fk_Owner,FormContent,AuthorId,ReleaserId) " +
				"values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
		jdbcTemplate.update(sql, new PreparedStatementSetter() {
			@Override
			public void setValues(PreparedStatement stmt) throws SQLException {
				stmt.setString(1, f.getId());
				stmt.setString(2, f.getCode());
				stmt.setString(3, StringEscapeUtils.escapeSql(f.getName()));
				stmt.setString(4, StringEscapeUtils.escapeSql(f.getDescription()));
				stmt.setString(5, f.getKeywords());
				stmt.setString(6, f.getAuthor());
				stmt.setTimestamp(7, new Timestamp(f.getCreateDatetime()));
				stmt.setTimestamp(8, new Timestamp(f.getLastupdate()));
				stmt.setInt(9, f.getStatus());
				stmt.setString(10, StringEscapeUtils.escapeSql(f.getVersion()));
				stmt.setString(11, StringEscapeUtils.escapeSql(f.getReleaser()));
				stmt.setString(12, StringEscapeUtils.escapeSql(f.getReleaseStatement()));
				stmt.setTimestamp(13, new Timestamp(f.getReleaseDate()));
				stmt.setInt(14, f.getDeprecated());
				stmt.setInt(15, f.getTrialPeriod());
				stmt.setDouble(16, f.getPurchasePrice());
				stmt.setDouble(17, f.getUsagePrice());
				stmt.setString(18, f.getParent());
				stmt.setString(19, f.getOwner());
				stmt.setString(20, f.getFormContent());
				stmt.setString(21, f.getAuthorId());
				stmt.setString(22, f.getReleaserId());
			}
		});
		
	}

	/**
	 * Update a released form definition into repository. This method will
	 * insert or update values into all fields of fm_form.
	 * 
	 * @param f
	 *            ReleasedForm
	 * @throws SQLException
	 */
	public void update(final ReleasedForm f) throws SQLException {
		
		String sql = "update fm_rl_form set Version=?,Releaser=?,ReleaserId=?,ReleaseStatement=?,"
				+ "TrialPeriod=?,PurchasePrice=?,UsagePrice=? where Pk_Form=?";
		jdbcTemplate.update(sql, new PreparedStatementSetter() {
			@Override
			public void setValues(PreparedStatement stmt) throws SQLException {
				stmt.setString(1, StringEscapeUtils.escapeSql(f.getVersion()));
				stmt.setString(2, StringEscapeUtils.escapeSql(f.getReleaser()));
				stmt.setString(3, f.getReleaserId());
				stmt.setString(4, StringEscapeUtils.escapeSql(f.getReleaseStatement()));
				stmt.setInt(5, f.getTrialPeriod());
				stmt.setDouble(6, f.getPurchasePrice());
				stmt.setDouble(7, f.getUsagePrice());
				stmt.setString(8, f.getId());
			}
		});
		
	}

	/**
	 * @author Dahai Cao created at 22:39 on 2018-10-10
	 * @param pk_form
	 * @param formname
	 * @param formcontent
	 * @param lastupdate
	 * @throws SQLException
	 */
	public void updateFormName(final String pk_form, final String formname, final String formcontent, long lastupdate)
			throws SQLException {
		
		String sql = "update fm_rl_form set FormName=?, FormContent=?, Lastupdate=? where Pk_Form=?";
		jdbcTemplate.update(sql, new PreparedStatementSetter() {
			@Override
			public void setValues(PreparedStatement stmt) throws SQLException {
				stmt.setString(1, formname);
				stmt.setString(2, formcontent);
				stmt.setTimestamp(3, new Timestamp(lastupdate));
				stmt.setString(4, pk_form);
			}
		});
		
	}

	public void update(final String id, final int d) throws SQLException {
		
		String sql = "update fm_rl_form set Deprecated=? where Pk_Form=?";
		jdbcTemplate.update(sql, new PreparedStatementSetter() {
			@Override
			public void setValues(PreparedStatement stmt) throws SQLException {
				stmt.setInt(1, d);
				stmt.setString(2, id);
			}
		});
		
	}

	public List<ReleasedForm> queryAll(String fk_parent, String fk_owner) throws Exception {
		
		String sql = "Select Pk_Form,FormCode,FormName,Description,Keywords,Author,CreateDatetime,Lastupdate,Status,"
				+ "Version,Releaser,ReleaseStatement,ReleaseDate,Deprecated,TrialPeriod,"
				+ "PurchasePrice,UsagePrice,Fk_Parent,Fk_Owner,FormContent,AuthorId,ReleaserId " +
				"from fm_rl_form where Fk_Parent=? and Fk_Owner=?";
		List<ReleasedForm> procList = jdbcTemplate.query(sql, new Object[] { fk_parent, fk_owner },
				new RowMapper<ReleasedForm>() {
					public ReleasedForm mapRow(ResultSet rs, int rowNum) throws SQLException {
						return getFormFromResultSet(new ReleasedForm(), rs);
					}
				});
		
		return procList;
	}

	public void delete(String primaryKey) throws SQLException {
		
		String sql = "delete from fm_rl_form where Pk_Form=?";
		jdbcTemplate.update(sql, new Object[] { primaryKey });
		
	}

	/**
	 * 
	 * @return
	 */
	public int queryRlFormCounting(int deprecated) throws SQLException {
		
		if (deprecated == 99) {
			String sql = "select count(*) from fm_rl_form where Deprecated not in (1,3,4)";
			List<Integer> counts = jdbcTemplate.query(sql, new RowMapper<Integer>() {
				public Integer mapRow(ResultSet rs, int rowNum) throws SQLException {
					int count = rs.getInt(1);
					return new Integer(count);
				}
			});
			
			return ((Integer) counts.get(0)).intValue();
		} else {

			String sql = "select count(*) from fm_rl_form where Deprecated = ?";
			List<Integer> counts = jdbcTemplate.query(sql, new RowMapper<Integer>() {
				public Integer mapRow(ResultSet rs, int rowNum) throws SQLException {
					int count = rs.getInt(1);
					return new Integer(count);
				}
			}, deprecated);
			
			return ((Integer) counts.get(0)).intValue();
		}
	}

	/**
	 * 
	 * @param firstrow
	 * @param pagesize
	 * @return
	 */

	public List<ReleasedForm> queryRlForm(int deprecated, int firstrow, int pagesize) {
		
		if (deprecated == 99) {
			String sql = "select * from fm_rl_form where Deprecated not in (1,3,4) limit ?,?";
			List<ReleasedForm> lst = jdbcTemplate.query(sql, new Object[] { firstrow, pagesize },
					new RowMapper<ReleasedForm>() {
						public ReleasedForm mapRow(ResultSet rs, int rowNum) throws SQLException {
							return getFormFromResultSet(new ReleasedForm(), rs);
						}
					});
			
			return lst;
		} else {
			String sql = "select * from fm_rl_form where Deprecated = ? limit ?,?";
			List<ReleasedForm> lst = jdbcTemplate.query(sql, new Object[] { deprecated, firstrow, pagesize },
					new RowMapper<ReleasedForm>() {
						public ReleasedForm mapRow(ResultSet rs, int rowNum) throws SQLException {
							return getFormFromResultSet(new ReleasedForm(), rs);
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

	public int queryRlFormCounting(String condition) {
		
		String sql = "select count(*) from fm_rl_form where (FormName like ? or Keywords like ? or Description like ? or "
				+ "Author like ? or Version like ? or Releaser like ? or ReleaseStatement like ?) and Deprecated not in (1,3,4)";
		String c = "%" + StringEscapeUtils.escapeSql(condition) + "%";
		List<Integer> counts = jdbcTemplate.query(sql, new Object[] { c, c, c, c, c, c, c }, new RowMapper<Integer>() {
			public Integer mapRow(ResultSet rs, int rowNum) throws SQLException {
				int count = rs.getInt(1);
				return new Integer(count);
			}
		});
		
		return ((Integer) counts.get(0)).intValue();
	}

	/**
	 * 
	 * @param condition
	 * @param pageindex
	 * @param pagesize
	 * @return
	 */
	public List<ReleasedForm> queryRlForm(String condition, int firstrow, int pagesize) {
		
		String sql = "select * from fm_rl_form where (FormName like ? or Keywords like ? or Description like ? or "
				+ "Author like ? or Version like ? or Releaser like ? or ReleaseStatement like ?) and Deprecated not in (1,3,4) limit ?,?";
		String c = "%" + StringEscapeUtils.escapeSql(condition) + "%";
		List<ReleasedForm> lst = jdbcTemplate.query(sql, new Object[] { c, c, c, c, c, c, c, firstrow, pagesize },
				new RowMapper<ReleasedForm>() {
					public ReleasedForm mapRow(ResultSet rs, int rowNum) throws SQLException {
						return getFormFromResultSet(new ReleasedForm(), rs);
					}
				});
		
		return lst;
	}

	public void updateStatus(String fid, int deprecated, long lastupdate) {
		
		String sql = "update fm_rl_form set deprecated = ?, Lastupdate = ? where Pk_Form = ?";
		jdbcTemplate.update(sql, new PreparedStatementSetter() {
			@Override
			public void setValues(PreparedStatement stmt) throws SQLException {
				stmt.setInt(1, deprecated);
				stmt.setTimestamp(2, new Timestamp(lastupdate));
				stmt.setString(3, fid);
			}
		});
		

	}
}
