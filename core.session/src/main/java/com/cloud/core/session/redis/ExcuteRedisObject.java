package com.cloud.core.session.redis;

import org.apache.log4j.Logger;
import org.springframework.data.redis.core.RedisTemplate;

public abstract class ExcuteRedisObject {
	protected static Logger logger = Logger.getLogger(ExcuteRedisObject.class.getName());
	protected long spendtime = 0;
	protected RedisTemplate<String, Object> redisTemplate = RedisTemplateFactory.getRedisTemplate();
}
