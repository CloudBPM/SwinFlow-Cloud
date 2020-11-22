/**
 * 
 */
package com.cloudibpm.eso.buildtime.wfprocess;

import com.cloudibpm.core.buildtime.wfprocess.WfProcess;
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
 * This class optimized process read/write performance from/into business
 * repository. It changed task storage from DB table to JSON.
 * 
 * @author Dahai Cao created 20170808
 */
@Repository
public class BuildtimeWfProcessEso {
	private final JdbcTemplate jdbcTemplate;

	@Autowired
	public BuildtimeWfProcessEso(JdbcTemplate jdbcTemplate) {
		this.jdbcTemplate = jdbcTemplate;
	}

	public List<String> queryAllOfOwner(String fk_owner) throws Exception {
		
		String sql = "Select ProcessContent from pm_bt_wfprocess where Fk_Owner=?";
		List<String> procList = jdbcTemplate.query(sql, new Object[] { fk_owner }, new RowMapper<String>() {
			public String mapRow(ResultSet rs, int rowNum) throws SQLException {
				return rs.getString("ProcessContent");
			}
		});
		
		return procList;
	}

	/**
	 * Returns all the displayed business processes from repository. The
	 * displayed business process means that these are displayed in process
	 * explorer.<br>
	 * This method is used to contruct process tree view.
	 * 
	 * @param fk_parent
	 * @param fk_owner
	 * @return
	 * @throws Exception
	 */
	public List<WfProcess> queryAll(String fk_parent, String fk_owner) throws Exception {
		
		String sql = "Select Pk_WfProcess,ProcessCode,ProcessName,ProcessType,WorkflowType,"
				+ "AccessLevel,Author,Lastupdate,Status,Fk_Parent,Fk_Owner,AuthorId "
				+ "from pm_bt_wfprocess where Fk_Parent=? and Fk_Owner=?";
		List<WfProcess> procList = jdbcTemplate.query(sql, new Object[] { fk_parent, fk_owner },
				new RowMapper<WfProcess>() {
					public WfProcess mapRow(ResultSet rs, int rowNum) throws SQLException {
						WfProcess proc = new WfProcess();
						proc.setId(rs.getString("Pk_WfProcess"));
						proc.setCode(rs.getString("ProcessCode"));
						proc.setName(rs.getString("ProcessName"));
						proc.setProcessType(rs.getInt("ProcessType"));
						proc.setWorkflowType(rs.getInt("WorkflowType"));
						proc.setAccessLevel(rs.getInt("AccessLevel"));
						proc.setAuthor(rs.getString("Author"));
						proc.setLastupdate(rs.getTimestamp("Lastupdate").getTime());
						proc.setStatus(rs.getInt("Status"));
						proc.setParent(rs.getString("Fk_Parent"));
						proc.setOwner(rs.getString("Fk_Owner"));
						proc.setAuthorId(rs.getString("AuthorId"));
						return proc;
					}
				});
		
		return procList;
	}

	public WfProcess queryByPK(String primaryKey) throws Exception {
		
		String sql = "Select Pk_WfProcess,ProcessCode,ProcessName,ProcessType,WorkflowType,"
				+ "AccessLevel,Author,Lastupdate,Status,Fk_Parent,Fk_Owner,ProcessContent,AuthorId "
				+ "from pm_bt_wfprocess where Pk_WfProcess=?";
		List<WfProcess> procList = jdbcTemplate.query(sql, new RowMapper<WfProcess>() {
			public WfProcess mapRow(ResultSet rs, int rowNum) throws SQLException {
				WfProcess proc = new WfProcess();
				proc.setId(rs.getString("Pk_WfProcess"));
				proc.setCode(rs.getString("ProcessCode"));
				proc.setName(rs.getString("ProcessName"));
				proc.setProcessType(rs.getInt("ProcessType"));
				proc.setWorkflowType(rs.getInt("WorkflowType"));
				proc.setAccessLevel(rs.getInt("AccessLevel"));
				proc.setAuthor(rs.getString("Author"));
				proc.setLastupdate(rs.getTimestamp("Lastupdate").getTime());
				proc.setStatus(rs.getInt("Status"));
				proc.setParent(rs.getString("Fk_Parent"));
				proc.setOwner(rs.getString("Fk_Owner"));
				proc.setProcessContent(rs.getString("ProcessContent"));
				proc.setAuthorId(rs.getString("AuthorId"));
				return proc;
			}
		}, primaryKey);
		
		if (!procList.isEmpty())
			return procList.get(0);
		else
			return null;
	}

	/**
	 * This method is used to get process content which is based on JSON format.
	 * 
	 * @param primaryKey
	 * @return
	 * @throws Exception
	 */
	public String queryProcessContentByPK(String primaryKey) throws Exception {
		
		String sql = "select ProcessContent from pm_bt_wfprocess where Pk_WfProcess=?";
		List<String> procList = jdbcTemplate.query(sql, new RowMapper<String>() {
			public String mapRow(ResultSet rs, int rowNum) throws SQLException {
				return rs.getString("ProcessContent");
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
	 * @param process
	 *            WfProcess
	 * @throws SQLException
	 */
	public void insert(final WfProcess process) throws SQLException {
		
		String sql = "insert into pm_bt_wfprocess "
				+ "(Pk_WfProcess,ProcessCode,ProcessName,ProcessType,WorkflowType,AccessLevel,Description,Keywords,"
				+ "Author,Lastupdate,Status,PurchasePrice,UsagePrice,Fk_Parent,Fk_Owner,ProcessContent,AuthorId) "
				+ "values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
		jdbcTemplate.update(sql, new PreparedStatementSetter() {
			@Override
			public void setValues(PreparedStatement stmt) throws SQLException {
				stmt.setString(1, process.getId());
				stmt.setString(2, process.getCode());
				stmt.setString(3, StringEscapeUtils.escapeSql(process.getName()));
				stmt.setInt(4, process.getProcessType());
				stmt.setInt(5, process.getWorkflowType());
				stmt.setInt(6, process.getAccessLevel());
				stmt.setString(7, process.getDescription());
				stmt.setString(8, process.getKeywords());
				stmt.setString(9, process.getAuthor());
				stmt.setTimestamp(10, new Timestamp(process.getLastupdate()));
				stmt.setInt(11, process.getStatus());
				stmt.setDouble(12, process.getPurchasePrice());
				stmt.setDouble(13, process.getUsagePrice());
				stmt.setString(14, process.getParent());
				stmt.setString(15, process.getOwner());
				stmt.setString(16, process.getProcessContent());
				stmt.setString(17, process.getAuthorId());
			}
		});
		
	}

	public void update(final WfProcess process) throws SQLException {
		
		String sql = "update pm_bt_wfprocess "
				+ "set ProcessCode=?,ProcessName=?,ProcessType=?,WorkflowType=?,AccessLevel=?,Description=?,Keywords=?,"
				+ "Author=?,Lastupdate=?,Status=?,PurchasePrice=?,UsagePrice=?,Fk_Parent=?,Fk_Owner=?,ProcessContent=?,AuthorId=? "
				+ "where Pk_WfProcess=?";
		jdbcTemplate.update(sql, new PreparedStatementSetter() {
			@Override
			public void setValues(PreparedStatement stmt) throws SQLException {
				stmt.setString(1, process.getCode());
				stmt.setString(2, StringEscapeUtils.escapeSql(process.getName()));
				stmt.setInt(3, process.getProcessType());
				stmt.setInt(4, process.getWorkflowType());
				stmt.setInt(5, process.getAccessLevel());
				stmt.setString(6, process.getDescription());
				stmt.setString(7, process.getKeywords());
				stmt.setString(8, process.getAuthor());
				stmt.setTimestamp(9, new Timestamp(process.getLastupdate()));
				stmt.setInt(10, process.getStatus());
				stmt.setDouble(11, process.getPurchasePrice());
				stmt.setDouble(12, process.getUsagePrice());
				stmt.setString(13, process.getParent());
				stmt.setString(14, process.getOwner());
				stmt.setString(15, process.getProcessContent());
				stmt.setString(16, process.getAuthorId());
				stmt.setString(17, process.getId());
			}
		});
		
	}

	public void updateName(final String id, final String name, final String content, final long lastupdate) throws SQLException {
		
		String sql = "update pm_bt_wfprocess set ProcessName=?,ProcessContent=?,Lastupdate=? where Pk_WfProcess=?";
		jdbcTemplate.update(sql, new PreparedStatementSetter() {
			@Override
			public void setValues(PreparedStatement stmt) throws SQLException {
				stmt.setString(1, StringEscapeUtils.escapeSql(name));
				stmt.setString(2, content);
				stmt.setTimestamp(3, new Timestamp(lastupdate));
				stmt.setString(4, id);
			}
		});
		
	}

	public void updateParent(final String pk, final String fk_parent, final String content, final Date lastupdate)
			throws Exception {
		
		String sql = "update pm_bt_wfprocess set Fk_Parent=?,ProcessContent=?,Lastupdate=? where Pk_WfProcess=?";
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

	public void delete(String primaryKey) throws SQLException {
		
		String sql = "delete from pm_bt_wfprocess where Pk_WfProcess=?";
		jdbcTemplate.update(sql, new Object[] { primaryKey });
		
	}

}
