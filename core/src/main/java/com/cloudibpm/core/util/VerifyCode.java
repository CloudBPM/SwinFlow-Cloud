package com.cloudibpm.core.util;

import java.util.Random;

public class VerifyCode {
	
	private final static VerifyCode instance = new VerifyCode();
	
	public static VerifyCode getInstance() {
		return instance;
	}
	
	private VerifyCode() {
	}
	
	
	/**
	 * 生成n位随机验证码
	 * 
	 * @param n
	 * @return
	 */
	public static String getVerifyCode(int n) {
		StringBuilder code = new StringBuilder();
		Random ran = new Random();
		for (int i = 0; i < n; i++) {
			code.append(Integer.valueOf(ran.nextInt(10)).toString());
		}
		return code.toString();
	}
}
