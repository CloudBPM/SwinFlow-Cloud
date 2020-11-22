package com.cloudibpm.blo.runtime.id;

import com.cloudibpm.runtime.cache.EntityIdCache;

import javax.transaction.Transactional;

public class RuntimeIDGenerator {

	private static RuntimeIDGenerator instance = null;
	private final EntityIdCache idCache = new EntityIdCache();
	private final EntityIdCache codeCache = new EntityIdCache();

	private RuntimeIDGenerator() {
	}

	public static RuntimeIDGenerator getInstance() {
		if (instance == null) {
			instance = new RuntimeIDGenerator();
		}
		return instance;
	}

	@Transactional
	public EntityIdCache getCodeCache() {
		return codeCache;
	}

	@Transactional
	public EntityIdCache getIdCache() {
		return idCache;
	}

//	@Transactional
	public String getNewRID() throws Exception {
		long l = IdWorker.getInstance().nextId();
		return "A" + l;
//		return idCache.fetchId();
	}

	@Transactional
	public String getNewWfCode() throws Exception {
		return codeCache.fetchId();
	}

//	@Transactional
	public String getNewRunTimeID() throws Exception {
		long l = IdWorker.getInstance().nextId();
		return "A" + l;
//		return IDGeneratorEso.getInstance().generateRuntimeId();
	}

}
