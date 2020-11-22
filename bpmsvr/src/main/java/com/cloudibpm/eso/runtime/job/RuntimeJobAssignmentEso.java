package com.cloudibpm.eso.runtime.job;

import com.cloudibpm.core.repository.ExecuteSQLObject;
import org.apache.log4j.Logger;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

public class RuntimeJobAssignmentEso extends ExecuteSQLObject {

    public RuntimeJobAssignmentEso() {
        super();
        logger = Logger.getLogger(RuntimeJobAssignmentEso.class.getName());
    }

    public String[] getAssignedStaffs(final String fk_position) throws SQLException {
        spendtime = System.currentTimeMillis();
        String sql = "select om_job_assignment.Fk_Staff, om_staff.Fk_User, " +
                "om_userprofile.LastName, om_userprofile.FirstName, om_userprofile.UsedName, om_userprofile.Mobile " +
                "from om_job_assignment, om_staff, om_userprofile where om_job_assignment.Fk_PositionRole=? and " +
                "om_job_assignment.Fk_Staff = om_staff.Pk_Staff and om_staff.Fk_User = om_userprofile.Pk_User";
        List<String> staffs = jdbcTemplate.query(sql, new String[]{fk_position}, new RowMapper<String>() {
            public String mapRow(ResultSet rs, int rowNum) throws SQLException {
                String stf = rs.getString(1);
                String uid = rs.getString(2);
                String uname1 = rs.getString(3);
                String uname2 = rs.getString(4);
                String uname3 = rs.getString(5);
                String mb4 = rs.getString(6);
                return stf + "#" + uid + "#" + uname1 + "#" + uname2 + "#" + uname3 + "#" + mb4;
            }
        });
        logger.info((System.currentTimeMillis() - spendtime) + "ms");
        return staffs.toArray(new String[staffs.size()]);
    }
}
