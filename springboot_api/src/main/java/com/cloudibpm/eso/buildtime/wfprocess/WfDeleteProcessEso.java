/**
 * 
 */
package com.cloudibpm.eso.buildtime.wfprocess;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

/**
 * @author dcao
 * 
 */
@Repository
public class WfDeleteProcessEso {

	private final JdbcTemplate jdbcTemplate;

	@Autowired
	public WfDeleteProcessEso(JdbcTemplate jdbcTemplate) {
		this.jdbcTemplate = jdbcTemplate;
	}

	/**
	 * <pre>
	 * -- --------------------------------------------------------------------------------
	 * -- Routine DDL
	 * -- Note: comments before and after the routine body will not be stored by the server
	 * -- --------------------------------------------------------------------------------
	 * DELIMITER $$
	 * 
	 * CREATE DEFINER=`root`@`localhost` PROCEDURE `B_DeleteProcess`(IN procID CHAR(10))
	 * BEGIN
	 * declare v char(10);
	 * set v=procID;
	 * delete from B_WfStartPoint where Fk_Owner=v;
	 * delete from B_WfEndPoint where Fk_Owner=v;
	 * delete from B_WfManualTask where Fk_Owner=v;
	 * delete from B_WfManualTaskParticipant where Fk_Owner=v;
	 * delete from B_WfAssignTask where fk_owner=v;
	 * delete from B_WfInvokeTask where Fk_Owner=v;
	 * delete from B_WfParallelPoint where Fk_Owner=v;
	 * delete from B_WfSubProcessPoint where Fk_Owner=v;
	 * delete from B_WfWaitTask where Fk_Owner=v;
	 * delete from B_WfTransition where Fk_Owner=v;
	 * delete from B_WfAssignment where fk_owner=v;
	 * delete from B_WfTextInput where Fk_Owner=v;
	 * delete from B_WfOptionInput where Fk_Owner=v;
	 * delete from B_WfCurrencyInput where Fk_Owner=v;
	 * delete from B_WfDateInput where Fk_Owner=v;
	 * delete from B_WfDoubleinput where Fk_Owner=v;
	 * delete from B_WfIntegerInput where Fk_Owner=v;
	 * delete from B_WfTimeInput where Fk_Owner=v;
	 * END
	 * 
	 * </pre>
	 * 
	 * @param processId
	 */
//	public void deleteProcess(String processId) {
//		spendtime = System.currentTimeMillis();
//		TransactionStatus status = transactionManager
//				.getTransaction(transactionDefinition);
//		try {
//			String psql = "{call B_DeleteProcess(?)}";
//			jdbcTemplate.update(psql, new Object[] { processId });
//		} catch (DataAccessException e) {
//			transactionManager.rollback(status);
//			throw e;
//		}
//		transactionManager.commit(status);
//		logger.info((System.currentTimeMillis() - spendtime) + "ms");
//	}
	public void deleteProcess(String processId) {
		String psql = "{call B_DeleteProcess(?)}";
		jdbcTemplate.update(psql, new Object[] { processId });
	}
}
