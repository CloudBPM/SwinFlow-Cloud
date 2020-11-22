package com.cloudibpm.eso.buildtime.wfprocess;

import com.cloudibpm.core.buildtime.release.wfprocess.ReleasedWfProcess;
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
import java.util.Date;
import java.util.List;

/**
 * This class optimized released process read/write performance from/into
 * business repository. It changed task storage from DB table to JSON.
 * 
 * @author Dahai Cao created 20170808
 */
@Repository
public class ReleasedWfProcessEso {

	private final JdbcTemplate jdbcTemplate;

	@Autowired
	public ReleasedWfProcessEso(JdbcTemplate jdbcTemplate) {
		this.jdbcTemplate = jdbcTemplate;
	}

	public ReleasedWfProcess getProcessFromResultSet(ReleasedWfProcess proc, ResultSet rs) throws SQLException {
		proc.setId(rs.getString("Pk_WfProcess"));
		proc.setCode(rs.getString("ProcessCode"));
		proc.setName(rs.getString("ProcessName"));
		proc.setAccessLevel(rs.getInt("AccessLevel"));
		proc.setProcessType(rs.getInt("ProcessType"));
		proc.setWorkflowType(rs.getInt("WorkflowType"));
		proc.setDescription(rs.getString("Description"));
		proc.setKeywords(rs.getString("Keywords"));
		proc.setAuthor(rs.getString("Author"));
		proc.setLastupdate(rs.getTimestamp("Lastupdate").getTime());
		proc.setStatus(rs.getInt("Status"));
		proc.setVersion(rs.getString("Version"));
		proc.setReleaser(rs.getString("Releaser"));
		proc.setReleaseStatement(rs.getString("ReleaseStatement"));
		proc.setReleaseDate(rs.getTimestamp("ReleaseDate").getTime());
		proc.setDeprecated(rs.getInt("Deprecated"));
		proc.setPurchasePrice(rs.getDouble("PurchasePrice"));
		proc.setUsagePrice(rs.getDouble("UsagePrice"));
		proc.setTrialPeriod(rs.getInt("TrialPeriod"));
		proc.setParent(rs.getString("Fk_Parent"));
		proc.setOwner(rs.getString("Fk_Owner"));
		proc.setAuthorId(rs.getString("AuthorId"));
		proc.setReleaserId(rs.getString("ReleaserId"));
		proc.setProcessContent(rs.getString("ProcessContent"));
		return proc;
	}

	/**
	 * Returns all the displayed business processes from repository. The
	 * displayed business process means that these are displayed in process
	 * explorer.
	 * 
	 * @param fk_parent
	 * @param fk_owner
	 * @return
	 * @throws Exception
	 */
	public List<ReleasedWfProcess> queryAll(String fk_parent, String fk_owner) throws Exception {
		
		String sql = "Select Pk_WfProcess,ProcessCode,ProcessName,ProcessType,WorkflowType,AccessLevel,Description,Keywords,"
				+ "Author,Lastupdate,Status,Version,Releaser,ReleaseStatement,ReleaseDate,Deprecated,"
				+ "TrialPeriod,PurchasePrice,UsagePrice,Fk_Parent," +
				"Fk_Owner,ProcessContent,AuthorId,ReleaserId from pm_rl_wfprocess where Fk_Parent=? and Fk_Owner=?";
		List<ReleasedWfProcess> procList = jdbcTemplate.query(sql, new Object[] { fk_parent, fk_owner },
				new RowMapper<ReleasedWfProcess>() {
					public ReleasedWfProcess mapRow(ResultSet rs, int rowNum) throws SQLException {
						return getProcessFromResultSet(new ReleasedWfProcess(), rs);
					}
				});
		
		return procList;
	}

	/**
	 * This method is used get a process release candidate for preparing
	 * release. It gets data from b_wfprocess.
	 * 
	 * @param primaryKey
	 * @return
	 * @throws Exception
	 */
	public ReleasedWfProcess queryByPKForRelease(String primaryKey) throws Exception {
		
		String sql = "select Pk_WfProcess,ProcessCode,ProcessName,ProcessType,WorkflowType,"
				+ "AccessLevel,Description,Keywords,Author,Lastupdate,Status,"
				+ "PurchasePrice,UsagePrice,Fk_Parent,Fk_Owner,ProcessContent,AuthorId "
				+ "from pm_bt_wfprocess where Pk_WfProcess=?";
		List<ReleasedWfProcess> procList = jdbcTemplate.query(sql, new RowMapper<ReleasedWfProcess>() {
			public ReleasedWfProcess mapRow(ResultSet rs, int rowNum) throws SQLException {
				ReleasedWfProcess proc = new ReleasedWfProcess();
				proc.setId(rs.getString("Pk_WfProcess"));
				proc.setCode(rs.getString("ProcessCode"));
				proc.setName(rs.getString("ProcessName"));
				proc.setAccessLevel(rs.getInt("AccessLevel"));
				proc.setProcessType(rs.getInt("ProcessType"));
				proc.setWorkflowType(rs.getInt("WorkflowType"));
				proc.setDescription(rs.getString("Description"));
				proc.setKeywords(rs.getString("Keywords"));
				proc.setAuthor(rs.getString("Author"));
				proc.setLastupdate(rs.getTimestamp("Lastupdate").getTime());
				proc.setStatus(rs.getInt("Status"));
				proc.setPurchasePrice(rs.getDouble("PurchasePrice"));
				proc.setUsagePrice(rs.getDouble("UsagePrice"));
				proc.setParent(rs.getString("Fk_Parent"));
				proc.setOwner(rs.getString("Fk_Owner"));
				proc.setProcessContent(rs.getString("ProcessContent"));
				proc.setAuthorId(rs.getString("AuthorId"));
				return proc;
			}
		}, primaryKey);
		
		if (!procList.isEmpty()) {
			return procList.get(0);
		} else
			return null;
	}

	/**
	 * Insert a new business process definition into repository. This method
	 * will insert or update values into all fields of B_WfProcess.
	 * 
	 * @param rp
	 *            ReleasedWfProcess
	 * @throws SQLException
	 */
	public void insert(final ReleasedWfProcess rp) throws SQLException {
		
		String sql = "insert into pm_rl_wfprocess "
				+ "(Pk_WfProcess,ProcessCode,ProcessName,ProcessType,WorkflowType,AccessLevel,Description,Keywords,"
				+ "Author,Lastupdate,Status,Version,Releaser,ReleaseStatement,ReleaseDate,Deprecated,"
				+ "TrialPeriod,PurchasePrice,UsagePrice,Fk_Parent,Fk_Owner,ProcessContent,AuthorId,ReleaserId) "
				+ "values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
		jdbcTemplate.update(sql, new PreparedStatementSetter() {
			@Override
			public void setValues(PreparedStatement stmt) throws SQLException {
				stmt.setString(1, rp.getId());
				stmt.setString(2, rp.getCode());
				stmt.setString(3, StringEscapeUtils.escapeSql(rp.getName()));
				stmt.setInt(4, rp.getProcessType());
				stmt.setInt(5, rp.getWorkflowType());
				stmt.setInt(6, rp.getAccessLevel());
				stmt.setString(7, rp.getDescription());
				stmt.setString(8, StringEscapeUtils.escapeSql(rp.getKeywords()));
				stmt.setString(9, rp.getAuthor());
				stmt.setTimestamp(10, new Timestamp(rp.getLastupdate()));
				stmt.setInt(11, rp.getStatus());
				stmt.setString(12, StringEscapeUtils.escapeSql(rp.getVersion()));
				stmt.setString(13, StringEscapeUtils.escapeSql(rp.getReleaser()));
				stmt.setString(14, StringEscapeUtils.escapeSql(rp.getReleaseStatement()));
				stmt.setTimestamp(15, new Timestamp(rp.getReleaseDate()));
				stmt.setInt(16, rp.getDeprecated());
				stmt.setInt(17, rp.getTrialPeriod());
				stmt.setDouble(18, rp.getPurchasePrice());
				stmt.setDouble(19, rp.getUsagePrice());
				stmt.setString(20, rp.getParent());
				stmt.setString(21, rp.getOwner());
				stmt.setString(22, rp.getProcessContent());
				stmt.setString(23, rp.getAuthorId());
				stmt.setString(24, rp.getReleaserId());
			}
		});
		
	}

	public void delete(String primaryKey) throws SQLException {
		
		String sql = "delete from pm_rl_wfprocess where Pk_WfProcess=?";
		jdbcTemplate.update(sql, new Object[] { primaryKey });
		
	}

	/**
	 * update a released business process definition into repository.
	 * 
	 * @param rp
	 *            ReleasedWfProcess
	 * @throws SQLException
	 */
	public void update(final ReleasedWfProcess rp) throws SQLException {
		
		String sql = "update pm_rl_wfprocess set Version=?,Releaser=?,ReleaserId=?, ReleaseStatement=?,"
				+ "TrialPeriod=?,PurchasePrice=?,UsagePrice=? where Pk_WfProcess=?";
		jdbcTemplate.update(sql, new PreparedStatementSetter() {
			@Override
			public void setValues(PreparedStatement stmt) throws SQLException {
				stmt.setString(1, StringEscapeUtils.escapeSql(rp.getVersion()));
				stmt.setString(2, StringEscapeUtils.escapeSql(rp.getReleaser()));
				stmt.setString(3, rp.getReleaserId());
				stmt.setString(4, StringEscapeUtils.escapeSql(rp.getReleaseStatement()));
				stmt.setInt(5, rp.getTrialPeriod());
				stmt.setDouble(6, rp.getPurchasePrice());
				stmt.setDouble(7, rp.getUsagePrice());
				stmt.setString(8, rp.getId());
			}
		});
		
	}

	/**
	 * Updates the Deprecated flag to indicate a released business process
	 * status in process supermarket.
	 * 
	 * @param id
	 *            String
	 * @param d
	 *            int
	 * @throws SQLException
	 */
	public void update(final String id, final int d) throws SQLException {
		
		String sql = "update pm_rl_wfprocess set Deprecated=? where Pk_WfProcess=?";
		jdbcTemplate.update(sql, new PreparedStatementSetter() {
			@Override
			public void setValues(PreparedStatement stmt) throws SQLException {
				stmt.setInt(1, d);
				stmt.setString(2, id);
			}
		});
		
	}

	/**
	 * Returns a released business processes from repository by specified
	 * <code>primary key</code>.
	 * 
	 * @param fk_parent
	 * @param fk_owner
	 * @return
	 * @throws Exception
	 */
	public ReleasedWfProcess queryReleasedProcess(String primaryKey) throws Exception {
		
		String sql = "Select Pk_WfProcess,ProcessCode,ProcessName,ProcessType,WorkflowType,AccessLevel,Description,Keywords,"
				+ "Author,Lastupdate,Status,Version,Releaser,ReleaseStatement,ReleaseDate,Deprecated,"
				+ "TrialPeriod,PurchasePrice,UsagePrice,Fk_Parent,Fk_Owner,ProcessContent,AuthorId,ReleaserId "
				+ "from pm_rl_wfprocess where Pk_WfProcess=?";
		List<ReleasedWfProcess> procList = jdbcTemplate.query(sql, new RowMapper<ReleasedWfProcess>() {
			public ReleasedWfProcess mapRow(ResultSet rs, int rowNum) throws SQLException {
				return getProcessFromResultSet(new ReleasedWfProcess(), rs);
			}
		}, primaryKey);
		
		if (!procList.isEmpty())
			return procList.get(0);
		else
			return null;
	}

	public void updateParent(final String pk, final String fk_parent, final String content, final Date lastupdate)
			throws Exception {
		
		String sql = "update pm_rl_wfprocess set Fk_Parent=?,ProcessContent=?, Lastupdate=? where Pk_WfProcess=?";
		jdbcTemplate.update(sql, new PreparedStatementSetter() {
			@Override
			public void setValues(PreparedStatement stmt) throws SQLException {
				stmt.setString(1, fk_parent);
				stmt.setString(2, content);
				stmt.setTimestamp(3, new Timestamp(lastupdate.getTime()));
				stmt.setString(4, pk);
			}
		});
		

	}

	/**
	 * @author xq00008
	 * @param condition
	 * @return
	 * @throws SQLException
	 */
	public int queryWfProcessCounting(int deprecated) throws SQLException {
		
		if (deprecated == 99) {
			String sql = "select count(*) from pm_rl_wfprocess where Deprecated not in (1,3,4)";
			List<Integer> counts = jdbcTemplate.query(sql, new RowMapper<Integer>() {
				public Integer mapRow(ResultSet rs, int rowNum) throws SQLException {
					int count = rs.getInt(1);
					return new Integer(count);
				}
			});
			
			return ((Integer) counts.get(0)).intValue();
		} else {
			String sql = "select count(*) from pm_rl_wfprocess where Deprecated= ?";
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
	 * @param condition
	 * @return
	 */
	public int queryWfProcessProCounting(String condition) throws SQLException {
		
		String sql = "select count(*) from pm_rl_wfprocess "
				+ "where (ProcessName like ? or Author like ? or Description like ? or "
				+ "Keywords like ? or Version like ? or Version like ? or "
				+ "Releaser like ? or ReleaseStatement like ?) and Deprecated not in (1,3,4)";
		String c = "%" + StringEscapeUtils.escapeSql(condition) + "%";
		List<Integer> counts = jdbcTemplate.query(sql, new Object[] { c, c, c, c, c, c, c, c },
				new RowMapper<Integer>() {
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
	public List<ReleasedWfProcess> queryWfProcessPro(String condition, int firstrow, int pagesize) {
		
		String sql = "select * from pm_rl_wfprocess where "
				+ "(ProcessName like ? or Author like ? or Description like ? or "
				+ "Keywords like ? or Version like ? or Version like ? or "
				+ "Releaser like ? or ReleaseStatement like ?) and Deprecated not in (1,3,4) limit ?,?";
		String c = "%" + StringEscapeUtils.escapeSql(condition) + "%";
		List<ReleasedWfProcess> lst = jdbcTemplate.query(sql,
				new Object[] { c, c, c, c, c, c, c, c, firstrow, pagesize }, new RowMapper<ReleasedWfProcess>() {
					public ReleasedWfProcess mapRow(ResultSet rs, int rowNum) throws SQLException {
						return getResultSet(new ReleasedWfProcess(), rs);
					}
				});
		
		return lst;
	}

	/**
	 * 
	 * @param firstrow
	 * @param pagesize
	 * @return
	 */

	public List<ReleasedWfProcess> queryWfProcessPro(int deprecated, int firstrow, int pagesize) {
		
		if (deprecated == 99) { 
			String sql = "select * from pm_rl_wfprocess where Deprecated not in (1,3,4) limit ?,? ";
			List<ReleasedWfProcess> lst = jdbcTemplate.query(sql, new Object[] { firstrow, pagesize },
					new RowMapper<ReleasedWfProcess>() {
						public ReleasedWfProcess mapRow(ResultSet rs, int rowNum) throws SQLException {
							return getResultSet(new ReleasedWfProcess(), rs);
						}
					});
			
			return lst;
		} else {
			String sql = "select * from pm_rl_wfprocess where Deprecated = ? limit ?,? ";
			List<ReleasedWfProcess> lst = jdbcTemplate.query(sql, new Object[] { deprecated, firstrow, pagesize },
					new RowMapper<ReleasedWfProcess>() {
						public ReleasedWfProcess mapRow(ResultSet rs, int rowNum) throws SQLException {
							return getResultSet(new ReleasedWfProcess(), rs);
						}
					});
			
			return lst;
		}
	}

	private ReleasedWfProcess getResultSet(ReleasedWfProcess rlWfPro, ResultSet rs) throws SQLException {
		rlWfPro.setId(rs.getString("Pk_WfProcess"));
		rlWfPro.setCode(rs.getString("ProcessCode"));
		rlWfPro.setName(rs.getString("ProcessName"));
		rlWfPro.setProcessType(rs.getInt("ProcessType"));
		rlWfPro.setWorkflowType(rs.getInt("WorkflowType"));
		rlWfPro.setAccessLevel(rs.getInt("AccessLevel"));
		rlWfPro.setDescription(rs.getString("Description"));
		rlWfPro.setKeywords(rs.getString("Keywords"));
		rlWfPro.setAuthor(rs.getString("Author"));
		rlWfPro.setStatus(rs.getInt("Status"));
		rlWfPro.setVersion(rs.getString("Version"));
		rlWfPro.setReleaser(rs.getString("Releaser"));
		rlWfPro.setReleaseStatement(rs.getString("ReleaseStatement"));
		rlWfPro.setReleaseDate(rs.getTimestamp("ReleaseDate").getTime());
		rlWfPro.setDeprecated(rs.getInt("Deprecated"));
		rlWfPro.setTrialPeriod(rs.getInt("TrialPeriod"));
		rlWfPro.setPurchasePrice(rs.getInt("PurchasePrice"));
		rlWfPro.setUsagePrice(rs.getInt("UsagePrice"));
		rlWfPro.setProcessContent(rs.getString("ProcessContent"));
		rlWfPro.setParent(rs.getString("Fk_Parent"));
		rlWfPro.setOwner(rs.getString("Fk_Owner"));
		rlWfPro.setLastupdate(rs.getTimestamp("Lastupdate").getTime());
		rlWfPro.setAuthorId(rs.getString("AuthorId"));
		rlWfPro.setReleaserId(rs.getString("ReleaserId"));
		return rlWfPro;
	}

	/**
	 * 
	 * @param id
	 * @param status
	 * @param date
	 */
	public void updateDeprecated(final String primaryKey, final int deprecated, final long date) {
		
		String sql = "update pm_rl_wfprocess set Deprecated=?, Lastupdate=? where Pk_WfProcess= ?";
		jdbcTemplate.update(sql, new PreparedStatementSetter() {
			@Override
			public void setValues(PreparedStatement stmt) throws SQLException {
				stmt.setInt(1, deprecated);
				stmt.setTimestamp(2, new Timestamp(date));
				stmt.setString(3, primaryKey);
			}
		});
		
	}

}
