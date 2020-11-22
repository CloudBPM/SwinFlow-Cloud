package com.cloudibpm.core.repository;

import javax.sql.DataSource;

import org.springframework.context.ApplicationContext;
import org.springframework.data.mongodb.core.MongoTemplate;

/**
 * CSC database data source factory.
 */
public class DBDataSourceFactory {

	private static DataSource ds = initDataSource();
	private static MongoTemplate nosqlds = initNoSqlDataSource();

	/**
	 * Returns the single instance of CSC database data source.
	 * 
	 * @return The single instance of CSC database data source
	 */
	public final static DataSource getDataSource() {
		return ds;
	}

	/**
	 * Initializes the single instance of CSC database data source.
	 */
	private static DataSource initDataSource() {
		ApplicationContext ctx = ApplicationContextFactory.getApplicationContext();
		return (DataSource) ctx.getBean("RepositoryDBDataSource");
	}

	public final static MongoTemplate getNoSqlDataSource() {
		return nosqlds;
	}

	private static MongoTemplate initNoSqlDataSource() {
		ApplicationContext ctx = ApplicationContextFactory.getApplicationContext();
		return (MongoTemplate) ctx.getBean("mongoTemplate");
	}
}
