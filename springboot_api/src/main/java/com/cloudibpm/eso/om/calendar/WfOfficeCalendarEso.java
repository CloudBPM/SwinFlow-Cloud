/**
 * 
 */
package com.cloudibpm.eso.om.calendar;

/**
 * @author Dahai CAO
 * @date 2008-11-09
 * @version 1.0.0
 */
public class WfOfficeCalendarEso  {

//	/**
//	 * constructor
//	 */
//	public WfOfficeCalendarEso() {
//		super();
//		logger = Logger.getLogger(WfOfficeCalendarEso.class.getName());
//	}
//
//	public void insert(final RecordObject ro) throws SQLException {
//		spendtime = System.currentTimeMillis();
//		String sql = "insert into wfofficecalendar (Pk_WfOfficeCalendar,calendarname,beginyear,"
//				+ "beginmonth,beginday,endyear,endmonth,endday,type,isDefault,Fk_Parent,Fk_Owner)values (?,?,?,?,?,?,?,?,?,?,?,?)";
//		jdbcTemplate.update(sql, new PreparedStatementSetter() {
//			@Override
//			public void setValues(PreparedStatement stmt) throws SQLException {
//				WfOfficeCalendarRo calendarRO = (WfOfficeCalendarRo) ro;
//				stmt.setString(1, calendarRO.getPrimaryKey());
//				stmt.setString(2, calendarRO.getCalendarName());
//				stmt.setInt(3, calendarRO.getBeginYear());
//				stmt.setInt(4, calendarRO.getBeginMonth());
//				stmt.setInt(5, calendarRO.getBeginDay());
//				stmt.setInt(6, calendarRO.getEndYear());
//				stmt.setInt(7, calendarRO.getEndMonth());
//				stmt.setInt(8, calendarRO.getEndDay());
//				stmt.setInt(9, calendarRO.getType());
//				if (calendarRO.isDefault()) {
//					stmt.setString(10, "Y");
//				} else {
//					stmt.setString(10, "N");
//				}
//				stmt.setString(11, calendarRO.getFk_Parent());
//				stmt.setString(12, calendarRO.getFk_WfOwner());
//			}
//		});
//		logger.info((System.currentTimeMillis() - spendtime) + "ms");
//	}
//
//	public void update(final RecordObject ro) throws SQLException {
//		spendtime = System.currentTimeMillis();
//		String sql = "update wfofficecalendar set calendarname=?,beginyear=?,beginmonth=?,"
//				+ "beginday=?,endyear=?,endmonth=?,endday=?,type=?,isDefault=? where Pk_WfOfficeCalendar=?";
//		jdbcTemplate.update(sql, new PreparedStatementSetter() {
//			@Override
//			public void setValues(PreparedStatement stmt) throws SQLException {
//				WfOfficeCalendarRo calendarRO = (WfOfficeCalendarRo) ro;
//				stmt.setString(1, calendarRO.getCalendarName());
//				stmt.setInt(2, calendarRO.getBeginYear());
//				stmt.setInt(3, calendarRO.getBeginMonth());
//				stmt.setInt(4, calendarRO.getBeginDay());
//				stmt.setInt(5, calendarRO.getEndYear());
//				stmt.setInt(6, calendarRO.getEndMonth());
//				stmt.setInt(7, calendarRO.getEndDay());
//				stmt.setInt(8, calendarRO.getType());
//				if (calendarRO.isDefault()) {
//					stmt.setString(9, "Y");
//				} else {
//					stmt.setString(9, "N");
//				}
//				stmt.setString(10, calendarRO.getPrimaryKey());
//			}
//		});
//		logger.info((System.currentTimeMillis() - spendtime) + "ms");
//	}
//
//	/**
//	 * 
//	 * @param fk_parent
//	 * @param fk_owner
//	 * @return
//	 * @throws Exception
//	 */
//	public List<RecordObject> queryAll(String fk_parent, String fk_owner)
//			throws Exception {
//		spendtime = System.currentTimeMillis();
//		String sql = "select Pk_WfOfficeCalendar, calendarname, beginyear, beginmonth, "
//				+ "beginday, endyear, endmonth, endday, type, isDefault, Fk_Parent, "
//				+ "Fk_Owner from wfofficecalendar where Fk_Parent=? and Fk_Owner=?";
//		List lst = jdbcTemplate.query(sql,
//				new String[] { fk_parent, fk_owner }, new RowMapper() {
//					public Object mapRow(ResultSet rs, int rowNum)
//							throws SQLException {
//						try {
//							return new WfOfficeCalendarMapper()
//									.getRecordObject(rs);
//						} catch (Exception e) {
//							logger.error("query all wait tasks exception", e);
//						}
//						return new Object();
//					}
//				});
//		logger.info((System.currentTimeMillis() - spendtime) + "ms");
//		return lst;
//	}
//
//	/**
//	 * Delete all office calendars of one owner, e.g.,organization.
//	 * 
//	 * @date 2008-11-9 上午11:17:39
//	 * @param fk_owner
//	 * @throws SQLException
//	 */
//	public void deleteAll(String fk_owner) throws SQLException {
//		spendtime = System.currentTimeMillis();
//		String sql = "delete from wfofficecalendar where Fk_Owner=?";
//		jdbcTemplate.update(sql, new String[] { fk_owner });
//		logger.info((System.currentTimeMillis() - spendtime) + "ms");
//	}
//
//	/**
//	 * Delete one office calendar of one owner, e.g.,organization.
//	 * 
//	 * @date 2008-11-9 上午11:17:39
//	 * @param fk_owner
//	 * @throws SQLException
//	 */
//	public void delete(String pk_calendar) throws SQLException {
//		spendtime = System.currentTimeMillis();
//		String sql = "delete from wfofficecalendar where Pk_WfOfficeCalendar=?";
//		jdbcTemplate.update(sql, new String[] { pk_calendar });
//		logger.info((System.currentTimeMillis() - spendtime) + "ms");
//	}
}