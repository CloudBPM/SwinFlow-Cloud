/**
 * 
 */
package com.cloudibpm.eso.om.calendar;

/**
 * 
 * 
 */
public class WfOfficeDayEso {

//	/**
//	 * constructor
//	 */
//	public WfOfficeDayEso() {
//		super();
//		logger = Logger.getLogger(WfOfficeDayEso.class.getName());
//	}
//
//	/**
//	 * Insert one office day into repository.
//	 * 
//	 * @date 2008-11-8 下午11:44:58
//	 * @param ro
//	 * @throws Exception
//	 */
//	public void insert(final RecordObject ro) throws Exception {
//		spendtime = System.currentTimeMillis();
//		String sql = "insert into wfofficeday (Pk_WfOfficeDay,OfficeDay,milestone,Fk_Owner)values (?,?,?,?)";
//		jdbcTemplate.update(sql, new PreparedStatementSetter() {
//			@Override
//			public void setValues(PreparedStatement stmt) throws SQLException {
//				WfOfficeDayRo dayRo = (WfOfficeDayRo) ro;
//				stmt.setString(1, dayRo.getPrimaryKey());
//				stmt.setString(2, dayRo.getOfficeDay());
//				if (dayRo.isMilestone()) {
//					stmt.setString(3, "Y");
//				} else {
//					stmt.setString(3, "N");
//				}
//				stmt.setString(4, dayRo.getFk_WfOwner());
//			}
//		});
//		logger.info((System.currentTimeMillis() - spendtime) + "ms");
//	}
//
//	/**
//	 * 
//	 * @param ro
//	 * @throws SQLException
//	 */
//	public void update(final RecordObject ro) throws SQLException {
//		spendtime = System.currentTimeMillis();
//		String sql = "update wfofficeday set OfficeDay=?,milestone=?,Fk_Owner=? from WfOfficeDay where Pk_WfOfficeDay=?";
//		jdbcTemplate.update(sql, new PreparedStatementSetter() {
//			@Override
//			public void setValues(PreparedStatement stmt) throws SQLException {
//				WfOfficeDayRo dayRo = (WfOfficeDayRo) ro;
//				stmt.setString(1, dayRo.getOfficeDay());
//				if (dayRo.isMilestone()) {
//					stmt.setString(2, "Y");
//				} else {
//					stmt.setString(2, "N");
//				}
//				stmt.setString(3, dayRo.getFk_WfOwner());
//				stmt.setString(4, dayRo.getPrimaryKey());
//			}
//		});
//		logger.info((System.currentTimeMillis() - spendtime) + "ms");
//	}
//
//	/**
//	 * Query all office days according to primary key of owner.
//	 * 
//	 * @date 2008-11-17 上午12:12:45
//	 * @param fk_owner
//	 * @return
//	 * @throws Exception
//	 */
//	public List<RecordObject> queryAll() throws Exception {
//		spendtime = System.currentTimeMillis();
//		String sql = "select Pk_WfOfficeDay, OfficeDay, milestone, Fk_Owner from wfofficeday";
//		List lst = jdbcTemplate.query(sql, new RowMapper() {
//			public Object mapRow(ResultSet rs, int rowNum) throws SQLException {
//				try {
//					return new WfOfficeDayMapper().getRecordObject(rs);
//				} catch (Exception e) {
//					logger.error("query all office days exception", e);
//				}
//				return new Object();
//			}
//		});
//		logger.info((System.currentTimeMillis() - spendtime) + "ms");
//		return lst;
//	}
//
//	/**
//	 * Query all office days according to primary key of owner.
//	 * 
//	 * @date 2008-11-17 上午12:12:45
//	 * @param fk_owner
//	 * @return
//	 * @throws Exception
//	 */
//	public List<RecordObject> queryAll(String fk_owner) throws Exception {
//		spendtime = System.currentTimeMillis();
//		String sql = "select Pk_WfOfficeDay, OfficeDay, milestone, Fk_Owner from wfofficeday where Fk_Owner=?";
//		List lst = jdbcTemplate.query(sql, new String[] { fk_owner },
//				new RowMapper() {
//					public Object mapRow(ResultSet rs, int rowNum)
//							throws SQLException {
//						try {
//							return new WfOfficeDayMapper().getRecordObject(rs);
//						} catch (Exception e) {
//							logger.error("query all office days exception", e);
//						}
//						return new Object();
//					}
//				});
//		logger.info((System.currentTimeMillis() - spendtime) + "ms");
//		return lst;
//	}
//
//	/**
//	 * Delete one office day in one office calendar.
//	 * 
//	 * @date 2008-11-9 上午10:25:31
//	 * @param dayPK
//	 * @throws SQLException
//	 */
//	public void delete(String dayPK) throws SQLException {
//		spendtime = System.currentTimeMillis();
//		String sql = "delete from wfofficeday where Pk_WfOfficeDay=?";
//		jdbcTemplate.update(sql, new String[] { dayPK });
//		logger.info((System.currentTimeMillis() - spendtime) + "ms");
//	}

}
