/**
 *
 */
package com.cloudibpm.eso.om.organization;

import com.cloudibpm.core.organization.Position;
import com.cloudibpm.core.solr.ProcessServiceSolrUtils;
import com.cloudibpm.core.user.Staff;
import com.cloudibpm.core.user.User;
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
 * @author TKuser
 *
 */
@Repository
public class WfPositionEso {

    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public WfPositionEso(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    /**
     *
     * @param primaryKey
     * @return
     * @throws Exception
     */
    public Position queryByPK(String primaryKey) throws Exception {

        String sql = "select * from om_position where Pk_Position=?";
        List<Position> lst = jdbcTemplate.query(sql, new Object[]{primaryKey}, new RowMapper<Position>() {
            public Position mapRow(ResultSet rs, int rowNum) throws SQLException {
                return getResultSet(new Position(), rs);
            }
        });

        if (!lst.isEmpty()) {
            return lst.get(0);
        }
        return null;
    }

    private Position getResultSet(Position ro, ResultSet rs) throws SQLException {
        ro.setId(rs.getString("Pk_Position"));
        ro.setSerialNumber(rs.getString("SerialNumber"));
        ro.setName(rs.getString("NameLocal"));
        ro.setAbbrName(rs.getString("AbbrLocal"));
        ro.setStatus(rs.getInt("Status"));
        ro.setRank(rs.getInt("Rank"));
        ro.setCreateDate(rs.getTimestamp("CreateDate").getTime());
        ro.setLastupdate(rs.getTimestamp("Lastupdate").getTime());
        ro.setX0(rs.getDouble("X0"));
        ro.setY0(rs.getDouble("Y0"));
        ro.setX1(rs.getDouble("X1"));
        ro.setY1(rs.getDouble("Y1"));
        ro.setParent(rs.getString("Fk_Parent"));
        ro.setCurrOwner(rs.getString("Fk_CurrOwner"));
        ro.setOwner(rs.getString("Fk_Owner"));
        ro.setCategoryId(rs.getString("Fk_Category"));
        ro.setOfficeCalendarID(rs.getString("Fk_OfficeCalendar"));
        return ro;
    }

    /**
     *
     * @return
     * @throws Exception
     */
    public List<Position> queryAll(String fk_currowner) throws Exception {

        String sql = "select * from om_position where Fk_CurrOwner=?";
        List<Position> lst = jdbcTemplate.query(sql, new Object[]{fk_currowner}, new RowMapper<Position>() {
            public Position mapRow(ResultSet rs, int rowNum) throws SQLException {
                return getResultSet(new Position(), rs);
            }
        });

        return lst;
    }

    public List<Position> queryPositionByStaffId(String id) {
        String sql = "Select * from om_job_assignment ,om_position " +
                "where om_job_assignment.Fk_PositionRole = om_position.Pk_Position and om_job_assignment.Fk_Staff = ?";
        List<Position> lst = jdbcTemplate.query(sql, new Object[]{id}, new RowMapper<Position>() {
            public Position mapRow(ResultSet rs, int rowNum) throws SQLException {
                return getResultSet(new Position(), rs);
            }
        });
        return lst;
    }

    public List<Staff> queryStaffByPositionId(String id) {
        String sql = "Select om_staff.Pk_Staff,om_staff.StaffCode," +
                "om_userprofile.LastName,om_userprofile.FirstName,om_userprofile.Pk_User  " +
                "from om_job_assignment,om_staff,om_userprofile " +
                "where om_job_assignment.Fk_Staff = om_staff.Pk_Staff and " +
                "om_userprofile.Pk_User = om_staff.Fk_User and " +
                "om_job_assignment.Fk_PositionRole = ?";
        List<Staff> lst = jdbcTemplate.query(sql, new Object[]{id}, new RowMapper<Staff>() {
            public Staff mapRow(ResultSet rs, int rowNum) throws SQLException {
                return getResultSet(new Staff(), new User(), rs);
            }
        });
        return lst;
    }

    private Staff getResultSet(Staff staff, User user, ResultSet rs) throws SQLException {
        staff.setId(rs.getString("Pk_Staff"));
        staff.setStaffCode(rs.getString("StaffCode"));
        staff.setUser(user);
        user.setId(rs.getString("Pk_User"));
        try {
            long l = ProcessServiceSolrUtils.searchCount(user.getId());
            user.setNation(String.valueOf(l));
        } catch (Exception e) {
            e.printStackTrace();
        }
        user.setSurname(rs.getString("LastName"));
        user.setGivenname(rs.getString("FirstName"));
        return staff;
    }


    /**
     *
     * @return
     * @throws Exception
     */
    public List<Position> queryNamesByFk(String fk_currowner) throws Exception {

        String sql = "select Pk_Position,SerialNumber,NameLocal from om_position where Fk_CurrOwner=?";
        List<Position> lst = jdbcTemplate.query(sql, new Object[]{fk_currowner}, new RowMapper<Position>() {
            public Position mapRow(ResultSet rs, int rowNum) throws SQLException {
                Position ro = new Position();
                ro.setId(rs.getString("Pk_Position"));
                ro.setSerialNumber(rs.getString("SerialNumber"));
                ro.setName(rs.getString("NameLocal"));
                return ro;
            }
        });

        return lst;
    }

    public Position queryNameByPK(String primaryKey) throws Exception {

        String sql = "select Pk_Position,SerialNumber,NameLocal from om_position where Pk_Position=? limit 1";
        List<Position> list = jdbcTemplate.query(sql, new String[]{primaryKey}, new RowMapper<Position>() {
            public Position mapRow(ResultSet rs, int rowNum) throws SQLException {
                Position ro = new Position();
                ro.setId(rs.getString("Pk_Position"));
                ro.setSerialNumber(rs.getString("SerialNumber"));
                ro.setName(rs.getString("NameLocal"));
                return ro;
            }
        });

        if (list.isEmpty()) {
            return null;
        } else { // list contains exactly 1 element
            return list.get(0);
        }
    }

//	/**
//	 *
//	 * @throws SQLException
//	 */
//	public void update(final Position depart) throws SQLException {
//
//		String sql = "update om_position set SerialNumber=?,NameLocal=?,AbbrLocal=?,Status=?,Rank=?,CreateDate=?,Lastupdate=?,"
//				+ "X0=?,Y0=?,X1=?,Y1=?,Fk_Parent=?,Fk_CurrOwner=?,Fk_Owner=?,Fk_Category=? where Pk_Position=?";
//		jdbcTemplate.update(sql, new PreparedStatementSetter() {
//			@Override
//			public void setValues(PreparedStatement stmt) throws SQLException {
//				stmt.setString(1, depart.getSerialNumber());
//				stmt.setString(2, StringEscapeUtils.escapeSql(depart.getName()));
//				stmt.setString(3, StringEscapeUtils.escapeSql(depart.getAbbrName()));
//				stmt.setInt(4, depart.getStatus());
//				stmt.setInt(5, depart.getRank());
//				stmt.setTimestamp(6, new Timestamp(depart.getCreateDate()));
//				stmt.setTimestamp(7, new Timestamp(depart.getLastupdate()));
//				stmt.setDouble(8, depart.getX0());
//				stmt.setDouble(9, depart.getY0());
//				stmt.setDouble(10, depart.getX1());
//				stmt.setDouble(11, depart.getY1());
//				if (depart.getParent() != null)
//					stmt.setString(12, depart.getParent());
//				else
//					stmt.setString(12, null);
//				stmt.setString(13, depart.getCurrOwner());
//				stmt.setString(14, depart.getOwner());
//				stmt.setString(15, depart.getCategoryId());
//				stmt.setString(16, depart.getId());
//			}
//		});
//
//	}

    /**
     *
     * @throws SQLException
     */
    public void insert(final Position depart) throws SQLException {
        String sql = "insert into om_position(Pk_Position,SerialNumber,NameLocal,AbbrLocal,Status,Rank,CreateDate,Lastupdate,"
                + "X0,Y0,X1,Y1,Fk_Parent,Fk_CurrOwner,Fk_Owner,Fk_Category,Fk_OfficeCalendar)values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
        jdbcTemplate.update(sql, new PreparedStatementSetter() {
            @Override
            public void setValues(PreparedStatement stmt) throws SQLException {
                stmt.setString(1, depart.getId());
                stmt.setString(2, depart.getSerialNumber());
                stmt.setString(3, StringEscapeUtils.escapeSql(depart.getName()));
                stmt.setString(4, StringEscapeUtils.escapeSql(depart.getAbbrName()));
                stmt.setInt(5, depart.getStatus());
                stmt.setInt(6, depart.getRank());
                stmt.setTimestamp(7, new Timestamp(depart.getCreateDate()));
                stmt.setTimestamp(8, new Timestamp(depart.getLastupdate()));
                stmt.setDouble(9, depart.getX0());
                stmt.setDouble(10, depart.getY0());
                stmt.setDouble(11, depart.getX1());
                stmt.setDouble(12, depart.getY1());
                if (depart.getParent() != null)
                    stmt.setString(13, depart.getParent());
                else
                    stmt.setString(13, null);
                stmt.setString(14, depart.getCurrOwner());
                stmt.setString(15, depart.getOwner());
                stmt.setString(16, depart.getCategoryId());
                stmt.setString(17, depart.getOfficeCalendarID());
            }
        });

    }

    /**
     *
     * @throws SQLException
     */
    public void deleteAll(String fk_currOwner) throws SQLException {

        String sql = "delete from om_position where Fk_CurrOwner=?";
        jdbcTemplate.update(sql, new Object[]{fk_currOwner});

    }
}
