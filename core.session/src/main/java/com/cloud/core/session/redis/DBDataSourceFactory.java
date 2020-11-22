	package com.cloud.core.session.redis;

import org.springframework.context.ApplicationContext;
import org.springframework.data.redis.core.RedisTemplate;

/**
 * CSC database data source factory.
 */
public class DBDataSourceFactory {

	private static RedisTemplate<String, Object> redisTemplate= initRedisTemplate();
	
	public final static RedisTemplate<String, Object> getRedisTemplate() {
		return redisTemplate;
	}
	
	private static RedisTemplate<String, Object> initRedisTemplate() {
		ApplicationContext ctx = ApplicationContextFactory.getApplicationContext();
		return (RedisTemplate<String, Object>) ctx.getBean("redisTemplate");
	}

}
