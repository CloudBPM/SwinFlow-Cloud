/**
 * 
 */
package com.cloudibpm.core.util;

import java.util.Random;

/**
 * @author Dahai CAO
 * 
 */
public class PassGenerator {

	private final static PassGenerator instance = new PassGenerator();

	public static PassGenerator getInstance() {
		return instance;
	}

	private PassGenerator() {
	}

	/**
	 * Generate new password according to workflow preferences setting.
	 * 
	 * @param len
	 *            the length of password.
	 * @return
	 */
	public String getPassword(int len) {
		StringBuffer pass = new StringBuffer();
		Random rdNum = new Random(); // 创建随机对象
		int[] rds = new int[3]; // 取得随机数数组
		for (int i = 0; i < len; i++) {
			rds[0] = Math.abs(rdNum.nextInt(10)) + 48; // 产生48到57的随机数(0-9的键位值)
			rds[1] = Math.abs(rdNum.nextInt(26)) + 97; // 产生97到122的随机数(a-z的键位值)
			rds[2] = Math.abs(rdNum.nextInt(26)) + 65; // 产生65到90的随机数(A-Z的键位值)
			int j = Math.abs(rdNum.nextInt(3));
			// 再在这三个数中随机取一个字符。
			char ch = (char) rds[j];
			pass.append(ch);
		}
		return pass.toString();
	}
}
