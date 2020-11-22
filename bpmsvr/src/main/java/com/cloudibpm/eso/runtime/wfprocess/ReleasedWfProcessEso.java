package com.cloudibpm.eso.runtime.wfprocess;

import com.cloudibpm.core.repository.ExecuteSQLObject;
import com.cloudibpm.core.runtime.wfprocess.WfProcessInstance;
import org.apache.log4j.Logger;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

/**
 * This class optimized released process read/write performance from/into
 * business repository. It changed task storage from DB table to JSON.
 *
 * @author Dahai Cao created 20170808
 */
public class ReleasedWfProcessEso extends ExecuteSQLObject {

    public ReleasedWfProcessEso() {
        super();
        logger = Logger.getLogger(ReleasedWfProcessEso.class.getName());
    }

    public WfProcessInstance getProcessFromResultSet(WfProcessInstance proc, ResultSet rs) throws SQLException {
        proc.setId(rs.getString("Pk_WfProcess"));
        proc.setCode(rs.getString("ProcessCode"));
        proc.setName(rs.getString("ProcessName"));
        proc.setAccessLevel(rs.getInt("AccessLevel"));
        proc.setProcessType(rs.getInt("ProcessType"));
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
        proc.setProcessContent(rs.getString("ProcessContent"));
        return proc;
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
    public WfProcessInstance queryReleasedProcess(String primaryKey) throws Exception {
        spendtime = System.currentTimeMillis();
        String sql = "Select Pk_WfProcess,ProcessCode,ProcessName,ProcessType,AccessLevel,Description,Keywords,"
                + "Author,Lastupdate,Status,Version,Releaser,ReleaseStatement,ReleaseDate,Deprecated,"
                + "TrialPeriod,PurchasePrice,UsagePrice,Fk_Parent,Fk_Owner,ProcessContent "
                + "from pm_rl_wfprocess where Pk_WfProcess=?";
        List<WfProcessInstance> procList = jdbcTemplate.query(sql, new String[]{primaryKey},
                new RowMapper<WfProcessInstance>() {
            public WfProcessInstance mapRow(ResultSet rs, int rowNum) throws SQLException {
                return getProcessFromResultSet(new WfProcessInstance(), rs);
            }
        });
        logger.info((System.currentTimeMillis() - spendtime) + "ms");
        if (!procList.isEmpty())
            return procList.get(0);
        else
            return null;
    }

}
