package com.cloudibpm.core.util;

import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

import org.apache.log4j.Logger;

/**
 * <p>
 * Workflow Project System Configuration.
 * </p>
 * 
 * @Copyright (c) 2006 - 2008
 * @Company: AdaptiveFlo Corp.
 * @author CAO Dahai
 * @version 2.0.0, 16/08/2008
 */

public class SystemConfig {

	static Logger logger = Logger.getLogger(SystemConfig.class.getName());
	static Properties props = System.getProperties();

	static {
		try {
			// ClassLoader.getSystemResourceAsStream("/sysconfig.properties");
			InputStream ins = SystemConfig.class
					.getResourceAsStream("/sysconfig.properties");
			props.load(ins);
			logger.info("System configruration loaded.");
		} catch (Exception e) {
			logger.error("System Configuration Error->", e);
		}
	}

	/**
	 * Returns value of properties with the specified <code>key</code> in system
	 * configuration file.
	 * 
	 * @param key
	 * @return
	 */
	public static String getProp(String key) {
		return System.getProperty(key);
	}

	/**
	 * Sets value of properties with the specified <code>key</code> in system
	 * configuration file.
	 * 
	 * @param key
	 * @param value
	 * @throws IOException
	 */
	public static void setProp(String key, String value) throws Exception {
		System.setProperty(key, value);
		FileOutputStream fos = new FileOutputStream((new SystemConfig())
				.getClass().getResource("/").getPath()
				+ "sysconfig.properties");
		props.store(fos, value);
		fos.close();
	}

	/**
	 * Returns number value of properties with the specified <code>key</code> in
	 * system configuration file.
	 * 
	 * @param key
	 * @return
	 */
	public static int getNumberProp(String key) {
		return Integer.valueOf(System.getProperty(key));
	}
}
