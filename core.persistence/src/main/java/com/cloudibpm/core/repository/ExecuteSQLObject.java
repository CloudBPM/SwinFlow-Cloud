package com.cloudibpm.core.repository;

import org.apache.log4j.BasicConfigurator;
import org.apache.log4j.Logger;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import org.springframework.transaction.TransactionDefinition;
import org.springframework.transaction.support.DefaultTransactionDefinition;

/**
 * 该类是执行SQL语句的抽象类，该类的设计初衷是设计一个专门执行SQL语句的层，<br>
 * 在该层之中，不存在任何业务逻辑，只有数据库的数据的Insert,Query,Update,Delete操作，<br>
 * 因此该层的方法基本上都是以Insert，Query，Update，Delete来命名，而且每个方法执行一次数据库<br>
 * 的访问，访问数据库之后就释放并回收数据库连接。所有的业务逻辑都是在该层的上一层的业务逻辑对象来<br>
 * 实现和组合。 <br>
 * 在这一层上体现存储在RDBMS上，其实对于其他类型的数据存储也是适用的。只要给出符合条件的RO即可。
 * 
 * @author CAO Dahai
 * @version 2.0.0
 * @date 2005-10-10
 */
public abstract class ExecuteSQLObject {

	protected static Logger logger = Logger.getLogger(ExecuteSQLObject.class
			.getName());
	protected long spendtime = 0;
	protected JdbcTemplate jdbcTemplate = DBJdbcTemplateFactory
			.getJdbcTemplate();
	protected DataSourceTransactionManager transactionManager = TransactionManagerFactory
			.getTansactionManager();
	protected DefaultTransactionDefinition transactionDefinition;

	public ExecuteSQLObject() {
		BasicConfigurator.configure();
		transactionDefinition = new DefaultTransactionDefinition();
		transactionDefinition
				.setPropagationBehavior(TransactionDefinition.PROPAGATION_REQUIRED);
	}
}