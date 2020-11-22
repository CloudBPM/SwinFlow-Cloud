package com.cloudibpm.core.util.encode;

import java.util.Base64;

public class Base64Util {
	public static String encodeUrl(String url) {
		// encode data on your side using BASE64
		byte[] bytesEncoded = Base64.getUrlEncoder().encode(url.getBytes());
		return new String(bytesEncoded);
	}

	public static String decodeUrl(String url) {
		// Decode data on other side, by processing encoded data
		byte[] bytesDecoded = Base64.getUrlDecoder().decode(url.getBytes());
		return new String(bytesDecoded);
	}

	public static String encode(String str) {
		byte[] bytesEncoded = Base64.getEncoder().encode(str.getBytes());
		return new String(bytesEncoded);
	}

	public static String decode(String str) {
		byte[] bytesDecoded = Base64.getDecoder().decode(str.getBytes());
		return new String(bytesDecoded);
	}
}
