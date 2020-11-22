/**
 * 
 */
package com.cloudibpm.eso.om.calendar;

/**
 * @author Dahai CAO
 * 
 */
public class WfOfficeHoursEso {

//	/**
//	 * constructor
//	 */
//	public WfOfficeHoursEso() {
//		super();
//		logger = Logger.getLogger(WfOfficeHoursEso.class.getName());
//	}
//
//	/**
//	 * Insert one office hours record.
//	 * 
//	 * @date 2008-11-8 下午11:26:20
//	 * @param ro
//	 * @throws Exception
//	 */
//	public void insert(final RecordObject ro) throws Exception {
//		spendtime = System.currentTimeMillis();
//		String sql = "insert into wfofficehours (begintime,begintimestring,endtime,endtimestring,Fk_Owner)values (?,?,?,?,?)";
//		jdbcTemplate.update(sql, new PreparedStatementSetter() {
//			@Override
//			public void setValues(PreparedStatement stmt) throws SQLException {
//				WfOfficeHoursRo hoursRO = (WfOfficeHoursRo) ro;
//				stmt.setFloat(1, hoursRO.getBeginTime());
//				stmt.setString(2, hoursRO.getBeginTimeString());
//				stmt.setFloat(3, hoursRO.getEndTime());
//				stmt.setString(4, hoursRO.getEndTimeString());
//				stmt.setString(5, hoursRO.getFk_WfOfficeDay());
//			}
//		});
//		logger.info((System.currentTimeMillis() - spendtime) + "ms");
//	}
//
//	/**
//	 * Delete all office hours record in one office day.
//	 * 
//	 * @date 2008-11-8 下午11:26:47
//	 * @param fk_officeday
//	 * @throws SQLException
//	 */
//	public void delete(String fk_Owner) throws SQLException {
//		spendtime = System.currentTimeMillis();
//		String sql = "delete from wfofficehours where Fk_Owner=?";
//		jdbcTemplate.update(sql, new String[] { fk_Owner });
//		logger.info((System.currentTimeMillis() - spendtime) + "ms");
//	}
//
//	/**
//	 * Query all office hours record in one office day.
//	 * 
//	 * @date 2008-11-8 下午11:36:04
//	 * @param fk_owner
//	 * @return
//	 * @throws Exception
//	 */
//	public List<RecordObject> queryAll(String fk_owner) throws Exception {
//		spendtime = System.currentTimeMillis();
//		String sql = "select begintime,begintimestring,endtime,endtimestring,Fk_Owner from wfofficehours where Fk_Owner=?";
//		List lst = jdbcTemplate.query(sql, new String[] { fk_owner },
//				new RowMapper() {
//					public Object mapRow(ResultSet rs, int rowNum)
//							throws SQLException {
//						WfOfficeHoursRo hoursRO = new WfOfficeHoursRo();
//						hoursRO.setBeginTime(rs.getFloat(1));
//						hoursRO.setBeginTimeString(rs.getString(2));
//						hoursRO.setEndTime(rs.getFloat(3));
//						hoursRO.setEndTimeString(rs.getString(4));
//						hoursRO.setFk_WfOfficeDay(rs.getString(5));
//						return hoursRO;
//					}
//				});
//		logger.info((System.currentTimeMillis() - spendtime) + "ms");
//		return lst;
//	}
}
