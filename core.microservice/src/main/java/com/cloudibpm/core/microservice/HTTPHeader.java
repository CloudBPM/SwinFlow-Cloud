/**
 * 
 */
package com.cloudibpm.core.microservice;

import java.io.Serializable;

/**
 * @author dev
 *
 */
public class HTTPHeader implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 4900966770591746750L;
	private String key = null;
	private String value = null;

	/**
	 * 
	 */
	public HTTPHeader() {
	}

	public HTTPHeader(String key, String value) {
		this.setKey(key);
		this.setValue(value);
	}

	/**
	 * @return the key
	 */
	public String getKey() {
		return key;
	}

	/**
	 * @param key
	 *            the key to set
	 */
	public void setKey(String key) {
		this.key = key;
	}

	/**
	 * @return the value
	 */
	public String getValue() {
		return value;
	}

	/**
	 * @param value
	 *            the value to set
	 */
	public void setValue(String value) {
		this.value = value;
	}

	public String toString() {
		return key + ":" + value;
	}

}
