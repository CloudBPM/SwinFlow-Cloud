/**
 * 
 */
package com.cloudibpm.core.microservice;

import java.io.Serializable;
import java.util.Random;

import org.apache.http.auth.AuthScope;
import org.apache.http.auth.UsernamePasswordCredentials;
import org.apache.http.client.CredentialsProvider;
import org.apache.http.impl.auth.DigestScheme;
import org.apache.http.impl.client.BasicCredentialsProvider;

import com.cloudibpm.core.appservice.WebAppService;

/**
 * @author Dahai Cao created at 11:44 on 2018-07-26
 *
 */
public class HTTPAuthentication implements Serializable {

	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = -590744458307191489L;

	/**
	 * 
	 * @param ras
	 * @return
	 */
	public static CredentialsProvider createBasicAuthentication(WebAppService ras) {
		HTTPHeader[] headers = ras.getAuthentication();
		String username = "";
		String password = "";
		if (headers != null && headers.length > 0) {
			for (HTTPHeader header : headers) {
				if (header.getKey().equals("username")) {
					username = header.getValue();
				} else if (header.getKey().equals("password")) {
					password = header.getValue();
				}
			}
		}
		UsernamePasswordCredentials credentials = new UsernamePasswordCredentials(username, password);
		CredentialsProvider provider = new BasicCredentialsProvider();
		// Create the authentication scope
		// AuthScope scope = new AuthScope("www.verisign.com", 443,
		// "realm"),
		// AuthScope scope = new AuthScope("localhost", 8080,
		// AuthScope.ANY_REALM);
		AuthScope scope = new AuthScope(AuthScope.ANY_HOST, AuthScope.ANY_PORT, AuthScope.ANY_REALM);
		provider.setCredentials(scope, credentials);
		return provider;
	}

	/**
	 * 
	 * @param realm
	 * @return
	 */
	public static DigestScheme createDigestAuthentication(String realm) {
		DigestScheme digestAuth = new DigestScheme();
		digestAuth.overrideParamter("algorithm", "MD5");
		if (realm != null && !realm.equals("")) {
			digestAuth.overrideParamter("realm", realm);
		} else
			digestAuth.overrideParamter("realm", AuthScope.ANY_HOST);
		digestAuth.overrideParamter("nonce", Long.toString(new Random().nextLong(), 36));
		digestAuth.overrideParamter("qop", "auth");
		digestAuth.overrideParamter("nc", "0");
		digestAuth.overrideParamter("cnonce", DigestScheme.createCnonce());
		return digestAuth;
	}

}
