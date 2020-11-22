package com.cloudibpm.core.util;

public interface MillisecondConstant {
	/**
	 * Half-second is 500 milliseconds;
	 */
	int HALFSECOND = 500;
	/**
	 * One second is 1000 milliseconds;
	 */
	int SECOND = 1000;
	/**
	 * One minute is 1000 * 60 milliseconds;
	 */
	int MINUTE = 60000;
	/**
	 * One hour is 1000 * 60 * 60 milliseconds;
	 */
	int HOUR = 3600000;
	/**
	 * One day is 1000 * 60 * 60 * 24 milliseconds.
	 */
	int DAY = 86400000;
	/**
	 * One day is 1000 * 60 * 60 * 24 * 7 milliseconds;
	 */
	int WEEK = 604800000;
	/**
	 * One year is 1000 * 60 * 60 * 24 * 365 milliseconds;
	 */
	long YEAR = 31536000000L;
}
