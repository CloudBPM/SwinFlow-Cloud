package com.cloudibpm.eso.am.appservice;

import com.cloudibpm.core.appservice.AndroidAppPlugin;
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
public class AndroidAppPluginEso {

    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public AndroidAppPluginEso(JdbcTemplate jdbcTemplate,
                               NamedParameterJdbcTemplate namedParameterJdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public void insert(final AndroidAppPlugin plugin) throws Exception {
        String sql = "insert into am_android_app_micro_service "
                + "(Pk_AndroidAppMsPlugin,AppMsPluginName,CreateDatetime,Lastupdate,Fk_Parent,Fk_Owner,Alias) "
                + "values (?,?,?,?,?,?,?)";
        jdbcTemplate.update(sql, new PreparedStatementSetter() {
            @Override
            public void setValues(PreparedStatement stmt) throws SQLException {
                stmt.setString(1, plugin.getId());
                stmt.setString(2, plugin.getName());
                stmt.setTimestamp(3, new Timestamp(plugin.getCreateDateTime()));
                stmt.setTimestamp(4, new Timestamp(plugin.getLastupdate()));
                stmt.setString(5, plugin.getParent());
                stmt.setString(6, plugin.getOwner());
                stmt.setString(7, plugin.getAlias());
            }
        });
    }

    public void update(final AndroidAppPlugin plugin) throws Exception {
        String sql = "update am_android_app_micro_service "
                + "set AppMsPluginName=?,VersionName=?,VersionCode=?,ApkFileName=?," +
                "Keywords=?,Lastupdate=?,LastupdateInfo=?,AccessType=?,Comments=?," +
                "Fk_Deveopler=?,SecurityAccessKey=?,Price=?,UsagePrice=?,Fk_Parent=? where Pk_AndroidAppMsPlugin=?";
        jdbcTemplate.update(sql, new PreparedStatementSetter() {
            @Override
            public void setValues(PreparedStatement stmt) throws SQLException {
                stmt.setString(1, plugin.getName());
                stmt.setString(2, plugin.getVersionName());
                stmt.setInt(3, plugin.getVersionCode());
                stmt.setString(4, plugin.getApkFileName());
                stmt.setString(5, plugin.getKeywords());
                stmt.setTimestamp(6, new Timestamp(plugin.getLastupdate()));
                stmt.setString(7, plugin.getLastupdateInfo());
                stmt.setInt(8, plugin.getAccessType());
                stmt.setString(9, plugin.getComments());
                stmt.setString(10, plugin.getDeveoplerId());
                stmt.setString(11, plugin.getSecurityAccessKey());
                stmt.setDouble(12, plugin.getPrice());
                stmt.setDouble(13, plugin.getUsagePrice());
                stmt.setString(14, plugin.getParent());
                stmt.setString(15, plugin.getId());
            }
        });
    }


    public AndroidAppPlugin query(String primarykey) throws Exception {
        String sql = "select * from am_android_app_micro_service where Pk_AndroidAppMsPlugin=? limit 1";
        List<AndroidAppPlugin> lst = jdbcTemplate.query(sql, new String[]{primarykey},
                new RowMapper<AndroidAppPlugin>() {
            public AndroidAppPlugin mapRow(ResultSet rs, int rowNum) throws SQLException {
                return getAppPluginFromResultSet(rs);
            }
        });
        if (lst.size() > 0) {
            return lst.get(0);
        } else {
            return null;
        }
    }

    public List<AndroidAppPlugin> queryByParent(String fk_Parent) throws Exception {
        String sql = "select * from am_android_app_micro_service where Fk_Parent = ? ";
        List<AndroidAppPlugin> lst = jdbcTemplate.query(sql, new String[]{fk_Parent},
                new RowMapper<AndroidAppPlugin>() {
            public AndroidAppPlugin mapRow(ResultSet rs, int rowNum) throws SQLException {
                return getAppPluginFromResultSet(rs);
            }
        });
        return lst;
    }

    private AndroidAppPlugin getAppPluginFromResultSet(ResultSet rs) throws SQLException {
        AndroidAppPlugin plugin = new AndroidAppPlugin();
        plugin.setId(rs.getString("Pk_AndroidAppMsPlugin"));
        plugin.setName(rs.getString("AppMsPluginName"));
        plugin.setVersionName(rs.getString("VersionName"));
        plugin.setVersionCode(rs.getInt("VersionCode"));
        plugin.setApkFileName(rs.getString("ApkFileName"));
        plugin.setAlias(rs.getString("Alias"));
        plugin.setCreateDateTime(rs.getTimestamp("CreateDatetime").getTime());
        plugin.setLastupdate(rs.getTimestamp("Lastupdate").getTime());
        plugin.setLastupdateInfo(rs.getString("LastupdateInfo"));
        plugin.setKeywords(rs.getString("Keywords"));
        plugin.setAccessType(rs.getInt("AccessType"));
        plugin.setComments(rs.getString("Comments"));
        plugin.setDeveoplerId(rs.getString("Fk_Deveopler"));
        plugin.setSecurityAccessKey(rs.getString("SecurityAccessKey"));
        plugin.setPrice(rs.getDouble("Price"));
        plugin.setUsagePrice(rs.getDouble("UsagePrice"));
        plugin.setStatus(rs.getInt("Status"));
        Timestamp e = rs.getTimestamp("OnlineDateTime");
        if (e != null)
            plugin.setOnlineDateTime(e.getTime());
        Timestamp f = rs.getTimestamp("OfflineDateTime");
        if (f != null)
            plugin.setOfflineDateTime(f.getTime());
        plugin.setParent(rs.getString("Fk_Parent"));
        plugin.setCurrOwner(rs.getString("Fk_CurrOwner"));
        plugin.setOwner(rs.getString("Fk_Owner"));
        return plugin;
    }

    /**
     * @param id
     * @param status
     * @param lastupdate
     * @throws SQLException
     * @author Dahai Cao created on 2018-12-12 21:48
     */
    public void updateStatus(final String id, final int status, final long lastupdate) throws SQLException {
        String sql = "update am_android_app_micro_service set status=?,Lastupdate=? where Pk_AndroidAppMsPlugin=?";
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
     * 根据手机 APP Plugin的状态查询新闻数量
     *
     * @param appStatus
     * @return long
     */
    public long countByAndroidAppMSPluginsbyStatus(int appStatus) {
        if (appStatus == 99) {
            String sql = "select count(*) from am_android_app_micro_service where Status not in (0,3,4)";
            List<Integer> counts = jdbcTemplate.query(sql, new RowMapper<Integer>() {
                public Integer mapRow(ResultSet rs, int rowNum) throws SQLException {
                    int count = rs.getInt(1);
                    return new Integer(count);
                }
            });
            return counts.get(0).intValue();
        } else { // status is 1 or 2
            String sql = "select count(*) from am_android_app_micro_service where Status = ?";
            List<Integer> counts = jdbcTemplate.query(sql, new RowMapper<Integer>() {
                public Integer mapRow(ResultSet rs, int rowNum) throws SQLException {
                    int count = rs.getInt(1);
                    return new Integer(count);
                }
            }, appStatus);
            return counts.get(0).intValue();
        }
    }

    public List<AndroidAppPlugin> queryAndroidAppMSPluginsbyStatus(int status, int firstrow, int pagesize) {
        if (status == 99) {
            String sql = "select * from am_android_app_micro_service where Status not in (0,3,4) limit ?,? ";
            List<AndroidAppPlugin> lst = jdbcTemplate.query(sql, new Object[]{firstrow, pagesize},
                    new RowMapper<AndroidAppPlugin>() {
                        public AndroidAppPlugin mapRow(ResultSet rs, int rowNum) throws SQLException {
                            return getAppPluginFromResultSet(rs);
                        }
                    });

            return lst;
        } else { // status is 1 or 2
            String sql = "select * from am_android_app_micro_service where status = ? limit ?,? ";
            List<AndroidAppPlugin> lst = jdbcTemplate.query(sql, new Object[]{status, firstrow, pagesize},
                    new RowMapper<AndroidAppPlugin>() {
                        public AndroidAppPlugin mapRow(ResultSet rs, int rowNum) throws SQLException {
                            return getAppPluginFromResultSet(rs);
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
    public int queryAndroidAppMSPluginsCounting(String condition, int status) {
        if (status == 99) {
            String sql = "select count(*) from am_android_app_micro_service where (ApkFileName like ? or AppMsPluginName like ? or Keywords like ? or "
                    + "Comments like ? or VersionName like ?) and Status not in (0,3,4)";
            String c = "%" + StringEscapeUtils.escapeSql(condition) + "%";
            List<Integer> counts = jdbcTemplate.query(sql, new Object[]{c, c, c, c, c}, new RowMapper<Integer>() {
                public Integer mapRow(ResultSet rs, int rowNum) throws SQLException {
                    int count = rs.getInt(1);
                    return new Integer(count);
                }
            });
            return counts.get(0).intValue();
        } else {
            String sql = "select count(*) from am_android_app_micro_service where (ApkFileName like ? or AppMsPluginName like ? or Keywords like ? or "
                    + "Comments like ? or VersionName like ?) and Status = ?";
            String c = "%" + StringEscapeUtils.escapeSql(condition) + "%";
            List<Integer> counts = jdbcTemplate.query(sql, new Object[]{c, c, c, c, c, status}, new RowMapper<Integer>() {
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
     * @return List<AndroidAppPlugin>
     */
    public List<AndroidAppPlugin> queryAndroidAppMSPlugins(String condition, int status, int firstrow, int pagesize) {
        if (status == 99) {
            String sql = "select * from am_android_app_micro_service where (ApkFileName like ? or AppMsPluginName like ? or Keywords like ? or "
                    + "Comments like ? or VersionName like ?) and Status  not in (0,3,4) limit ?, ?";
            String c = "%" + StringEscapeUtils.escapeSql(condition) + "%";
            List<AndroidAppPlugin> lst = jdbcTemplate.query(sql, new Object[]{c, c, c, c, c, firstrow, pagesize},
                    new RowMapper<AndroidAppPlugin>() {
                        public AndroidAppPlugin mapRow(ResultSet rs, int rowNum) throws SQLException {
                            return getAppPluginFromResultSet(rs);
                        }
                    });
            return lst;
        } else {
            String sql = "select * from am_android_app_micro_service where (ApkFileName like ? or AppMsPluginName like ? or Keywords like ? or "
                    + "Comments like ? or VersionName like ?) and Status = ? limit ?, ?";
            String c = "%" + StringEscapeUtils.escapeSql(condition) + "%";
            List<AndroidAppPlugin> lst = jdbcTemplate.query(sql, new Object[]{c, c, c, c, c, status, firstrow, pagesize},
                    new RowMapper<AndroidAppPlugin>() {
                        public AndroidAppPlugin mapRow(ResultSet rs, int rowNum) throws SQLException {
                            return getAppPluginFromResultSet(rs);
                        }
                    });
            return lst;
        }

    }

}
