package com.cloudibpm.core.microservice;

public interface AuthenticationType {
	/**
	 * No any authentication
	 */
	int NO_AUTH = 0;
	/**
	 * Basic authentication as HTTP supported. Please refer to RFC2617 on W3C
	 */
	int BASIC_AUTH = 1;
	/**
	 * Digest authentication as HTTP supported. Please refer to RFC2617 on W3C
	 */
	int DIGEST_AUTH = 2;
	/**
	 * NTLM authentication as HTTP/1.1 supported. Please refer to RFC2617 on W3C
	 */
	int NTLM_AUTH = 3;
}
