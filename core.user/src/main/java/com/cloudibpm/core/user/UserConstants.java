package com.cloudibpm.core.user;

public interface UserConstants extends java.io.Serializable {
	/**
	 * workflow administrator primary key.
	 */
	public final String ADMINISTRATOR_ID = "0000000009";
	/**
	 * All users group db primary key.
	 */
	public final String ALL_USER_GROUP_ID = "000020000A";
	/**
	 * Y Flag is used as used field or canceled field.
	 */
	public final String FLAG_Y = "Y";
	/**
	 * N Flag is used as used field or canceled field.
	 */
	public final String FLAG_N = "N";
	/**
	 * the sex of workflow user.
	 */
	public final static int MALE = 0;
	/**
	 * the sex of workflow user.
	 */
	public final static int FEMALE = 1;
}
