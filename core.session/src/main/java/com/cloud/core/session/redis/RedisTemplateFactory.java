package com.cloud.core.session.redis;

import org.springframework.data.redis.core.RedisTemplate;

public class RedisTemplateFactory {
	
	private static RedisTemplate<String, Object> redisTemplate = DBDataSourceFactory.getRedisTemplate();

	public static RedisTemplate<String, Object> getRedisTemplate() {
		return redisTemplate;
	}
}
