/**
 * 
 */
package com.cloudibpm.runtime.engine.transaction;


/**
 * <pre>
 * Chinese Note:
 * 工作流中的事务类似于数据中的事务概念，数据库中一些操作的集合通常是一个独立单元，而事务就是构成单一逻辑工作单位的操作集合。
 * 已提交事务是指成功执行完毕的事务，未能成功完成的事务称为中止事务，对中止事务造成的变更需要进行撤销处理，称为事务回滚。
 * 事务具有ACID4个特性。
 * 1．原子性（Atomicity）
 * 事务中的全部操作在数据库中是不可分割的，要么全部完成，要么均不执行。
 * 2．一致性（Consistency）
 * 几个并行执行的事务，其执行结果必须与按某一顺序串行执行的结果相一致。
 * 3．隔离性（Isolation）
 * 事务的执行不受其他事务的干扰，事务执行的中间结果对其他事务必须是透明的。
 * 4．持久性（Durability）
 * 对于任意已提交事务，系统必须保证该事务对数据库的改变不被丢失，即使数据库出现故障。
 * </pre>
 * 
 * @author dcao
 * 
 */
public interface Transaction extends java.io.Serializable {
	/**
	 * A transaction is associated with the target object but its current status
	 * cannot be determined.
	 */
	public static final int UNKNOWN = -1;
//	/**
//	 * A transaction is associated with the target object and it is in the
//	 * creating state.
//	 */
//	public static final int CREATING = 0;
	/**
	 * A transaction is associated with the target object and it is in the
	 * created state.
	 */
	public static final int CREATED = 1;
//	/**
//	 * A transaction is associated with the target object and it is in the
//	 * process of preparing.
//	 */
//	public static final int PREPARING = 2;
	/**
	 * A transaction is associated with the target object and it has been
	 * prepared.
	 */
	public static final int PREPARED = 3;
//	/**
//	 * A transaction is associated with the target object and it is in the
//	 * active state.
//	 */
//	public static final int ACTIVE = 4;
//	/**
//	 * A transaction is associated with the target object and it is in the
//	 * process of rolling back.
//	 */
//	public static final int ROLLINGBACK = 5;
	/**
	 * A transaction is associated with the target object and the outcome has
	 * been determined to be rolled back.
	 */
	public static final int ROLLEDBACK = 6;
//	/**
//	 * A transaction is associated with the target object and it is in the
//	 * process of committing.
//	 */
//	public static final int COMMITTING = 7;
	/**
	 * A transaction is associated with the target object and it has been
	 * committed.
	 */
	public static final int COMMITTED = 8;

	/**
	 * Create a new transaction and associate it with the current thread.
	 */
	public void begin() throws Exception;

	/**
	 * Complete the transaction;
	 */
	public void commit() throws Exception;

	/**
	 * Roll back the transaction.
	 */
	public void rollback() throws Exception;

	/**
	 * Obtain the status of the transaction associated with the current thread.
	 * 
	 * @return the status
	 */
	public int getStatus();

	/**
	 * Sets the status of the transaction associated with the current thread.
	 * 
	 * @param status
	 */
	public void setStatus(int status);
}
